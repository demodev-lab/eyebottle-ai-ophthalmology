// 근시케어 차트 계산 관련 유틸리티 함수

import { differenceInYears, differenceInDays, parseISO } from 'date-fns';
import { MyoCareVisit, RiskLevel, UserSettings, ProgressionRate } from '@/types/database';
import { DATE_CONSTANTS, RISK_COLORS, RISK_TEXT, PROGRESSION_CONSTANTS } from '@/constants';

// 연간 진행 속도 계산
export const calculateProgressionRate = (
  visits: MyoCareVisit[],
  settings: UserSettings
): ProgressionRate => {
  console.log('[MyoCare] 진행률 계산 시작:', {
    visitsCount: visits.length,
    visits: visits.map(v => ({
      date: v.visit_date,
      od_se: v.od_se,
      os_se: v.os_se,
      od_al: v.od_axial_length,
      os_al: v.os_axial_length
    }))
  });

  // 최소 2개 이상의 방문 기록이 필요
  if (visits.length < 2) {
    console.log('[MyoCare] 방문 기록 부족으로 계산 불가');
    return { riskLevel: RiskLevel.NORMAL };
  }

  // 방문 날짜순으로 정렬 (오래된 것부터)
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
  );

  const firstVisit = sortedVisits[0];
  const lastVisit = sortedVisits[sortedVisits.length - 1];

  console.log('[MyoCare] 첫 방문과 마지막 방문:', {
    first: {
      date: firstVisit.visit_date,
      od_se: firstVisit.od_se,
      os_se: firstVisit.os_se,
      od_sphere: firstVisit.od_sphere,
      od_cylinder: firstVisit.od_cylinder
    },
    last: {
      date: lastVisit.visit_date,
      od_se: lastVisit.od_se,
      os_se: lastVisit.os_se,
      od_sphere: lastVisit.od_sphere,
      od_cylinder: lastVisit.od_cylinder
    }
  });

  // 시간 차이 계산 (년 단위)
  const daysDiff = differenceInDays(parseISO(lastVisit.visit_date), parseISO(firstVisit.visit_date));
  
  // 최소 검사 간격 이상이 있어야 의미있는 계산
  if (daysDiff < DATE_CONSTANTS.MIN_EXAM_INTERVAL_DAYS) {
    console.log('[MyoCare] 검사 간격이 너무 짧음:', daysDiff, '일');
    return { riskLevel: RiskLevel.NORMAL };
  }

  // 신뢰도 계산
  let reliability: 'high' | 'medium' | 'low';
  if (daysDiff >= PROGRESSION_CONSTANTS.HIGH_RELIABILITY_DAYS) {
    reliability = 'high';
  } else if (daysDiff >= PROGRESSION_CONSTANTS.MEDIUM_RELIABILITY_DAYS) {
    reliability = 'medium';
  } else {
    reliability = 'low';
  }

  const yearsDiffExact = daysDiff / DATE_CONSTANTS.DAYS_IN_YEAR;

  // SE 진행 속도 계산 (D/yr)
  // 근시는 음수값이므로, 진행 시 더 음수가 됨 (예: -1 → -2)
  // 진행률은 음수로 표시 (예: -1D/yr), 위험도 판정시에만 절대값 사용
  let se_od: number | undefined;
  let se_os: number | undefined;
  
  if (firstVisit.od_se !== undefined && lastVisit.od_se !== undefined) {
    se_od = (lastVisit.od_se - firstVisit.od_se) / yearsDiffExact;
  }
  
  if (firstVisit.os_se !== undefined && lastVisit.os_se !== undefined) {
    se_os = (lastVisit.os_se - firstVisit.os_se) / yearsDiffExact;
  }

  // AL 진행 속도 계산 (mm/yr)
  let al_od: number | undefined;
  let al_os: number | undefined;
  
  if (firstVisit.od_axial_length !== undefined && lastVisit.od_axial_length !== undefined) {
    al_od = (lastVisit.od_axial_length - firstVisit.od_axial_length) / yearsDiffExact;
  }
  
  if (firstVisit.os_axial_length !== undefined && lastVisit.os_axial_length !== undefined) {
    al_os = (lastVisit.os_axial_length - firstVisit.os_axial_length) / yearsDiffExact;
  }

  // 위험도 계산 - AL 진행도만 사용
  let riskLevel = RiskLevel.NORMAL;
  
  // AL 데이터가 있는 경우만 평가
  if (al_od !== undefined || al_os !== undefined) {
    // undefined가 아닌 값들 중에서 최대값 선택
    const alProgressions = [];
    if (al_od !== undefined) alProgressions.push(al_od);
    if (al_os !== undefined) alProgressions.push(al_os);
    
    const maxALProgression = Math.max(...alProgressions);
    
    if (maxALProgression >= settings.thresholds.al.red) {
      riskLevel = RiskLevel.RED;
    } else if (maxALProgression >= settings.thresholds.al.yellow) {
      riskLevel = RiskLevel.YELLOW;
    }
  }

  const result = {
    se_od,
    se_os,
    al_od,
    al_os,
    riskLevel,
    reliability,
  };

  console.log('[MyoCare] 진행률 계산 결과:', {
    se_od: se_od?.toFixed(2),
    se_os: se_os?.toFixed(2),
    al_od: al_od?.toFixed(2),
    al_os: al_os?.toFixed(2),
    riskLevel: getRiskText(riskLevel),
    yearsDiff: yearsDiffExact.toFixed(2),
    daysDiff: daysDiff,
    reliability: reliability
  });

  return result;
};

// 나이 계산
export const calculateAge = (birthDate: string, targetDate?: string): number => {
  const target = targetDate ? parseISO(targetDate) : new Date();
  return differenceInYears(target, parseISO(birthDate));
};

// 최근 방문으로부터 경과 일수
export const daysSinceLastVisit = (lastVisitDate: string): number => {
  return differenceInDays(new Date(), parseISO(lastVisitDate));
};

// 활성 환자 여부 (6개월 이내 방문)
export const isActivePatient = (lastVisitDate: string): boolean => {
  return daysSinceLastVisit(lastVisitDate) <= DATE_CONSTANTS.ACTIVE_PATIENT_DAYS;
};

// 최근 등록 환자 여부 (30일 이내)
export const isRecentPatient = (createdDate: string): boolean => {
  return differenceInDays(new Date(), parseISO(createdDate)) <= DATE_CONSTANTS.RECENT_PATIENT_DAYS;
};

// SE 계산 (Sphere + Cylinder/2)
export const calculateSE = (sphere?: number, cylinder?: number): number | undefined => {
  if (sphere === undefined) return undefined;
  return sphere + (cylinder || 0) / 2;
};

// 위험도별 색상 반환
export const getRiskColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.RED:
      return RISK_COLORS.RED;
    case RiskLevel.YELLOW:
      return RISK_COLORS.YELLOW;
    default:
      return RISK_COLORS.GREEN;
  }
};

// 위험도별 배경색 반환
export const getRiskBgColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.RED:
      return RISK_COLORS.RED_BG;
    case RiskLevel.YELLOW:
      return RISK_COLORS.YELLOW_BG;
    default:
      return RISK_COLORS.GREEN_BG;
  }
};

// 위험도 텍스트
export const getRiskText = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.RED:
      return RISK_TEXT.RED;
    case RiskLevel.YELLOW:
      return RISK_TEXT.YELLOW;
    default:
      return RISK_TEXT.GREEN;
  }
};

// EMR 템플릿 변수 치환
export const replaceEMRVariables = (
  template: string,
  data: {
    patientName?: string;
    treatmentMethod?: string;
    visitDate?: string;
    seOD?: number;
    seOS?: number;
    alOD?: number;
    alOS?: number;
    seProgressOD?: number;
    seProgressOS?: number;
  }
): string => {
  let result = template;
  
  // 변수 매핑
  const replacements: Record<string, string> = {
    '[환자명]': data.patientName || '',
    '[치료방법]': data.treatmentMethod || '',
    '[검사일]': data.visitDate || '',
    '[SE_OD]': data.seOD?.toFixed(2) || 'N/A',
    '[SE_OS]': data.seOS?.toFixed(2) || 'N/A',
    '[AL_OD]': data.alOD?.toFixed(2) || 'N/A',
    '[AL_OS]': data.alOS?.toFixed(2) || 'N/A',
    '[SE_PROGRESS_OD]': data.seProgressOD ? `${data.seProgressOD > 0 ? '+' : ''}${data.seProgressOD.toFixed(2)}` : 'N/A',
    '[SE_PROGRESS_OS]': data.seProgressOS ? `${data.seProgressOS > 0 ? '+' : ''}${data.seProgressOS.toFixed(2)}` : 'N/A',
  };
  
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });
  
  return result;
};