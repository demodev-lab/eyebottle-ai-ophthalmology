// 근시케어 차트 계산 관련 유틸리티 함수

import { differenceInYears, differenceInDays, parseISO } from 'date-fns';
import { MyoCareVisit, RiskLevel, UserSettings, ProgressionRate } from '@/types/database';

// 연간 진행 속도 계산
export const calculateProgressionRate = (
  visits: MyoCareVisit[],
  settings: UserSettings
): ProgressionRate => {
  // 최소 2개 이상의 방문 기록이 필요
  if (visits.length < 2) {
    return { riskLevel: RiskLevel.NORMAL };
  }

  // 방문 날짜순으로 정렬 (오래된 것부터)
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
  );

  const firstVisit = sortedVisits[0];
  const lastVisit = sortedVisits[sortedVisits.length - 1];

  // 시간 차이 계산 (년 단위)
  const daysDiff = differenceInDays(parseISO(lastVisit.visit_date), parseISO(firstVisit.visit_date));
  
  // 최소 90일 이상의 간격이 있어야 의미있는 계산
  if (daysDiff < 90) {
    return { riskLevel: RiskLevel.NORMAL };
  }

  const yearsDiffExact = daysDiff / 365.25;

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

  // 위험도 계산 - AL을 주요 기준으로 사용
  let riskLevel = RiskLevel.NORMAL;
  
  // AL 기준 위험도 (우선 평가)
  const maxALProgression = Math.max(
    al_od || 0,
    al_os || 0
  );
  
  if (maxALProgression >= settings.thresholds.al.red) {
    riskLevel = RiskLevel.RED;
  } else if (maxALProgression >= settings.thresholds.al.yellow) {
    riskLevel = RiskLevel.YELLOW;
  }

  // SE 기준 위험도 (AL 데이터가 없는 경우만 사용)
  if (al_od === undefined && al_os === undefined) {
    const maxSEProgression = Math.max(
      Math.abs(se_od || 0),
      Math.abs(se_os || 0)
    );
    
    if (maxSEProgression >= settings.thresholds.se.red) {
      riskLevel = RiskLevel.RED;
    } else if (maxSEProgression >= settings.thresholds.se.yellow) {
      riskLevel = RiskLevel.YELLOW;
    }
  }

  return {
    se_od,
    se_os,
    al_od,
    al_os,
    riskLevel,
  };
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
  return daysSinceLastVisit(lastVisitDate) <= 180;
};

// 최근 등록 환자 여부 (30일 이내)
export const isRecentPatient = (createdDate: string): boolean => {
  return differenceInDays(new Date(), parseISO(createdDate)) <= 30;
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
      return '#ef4444'; // red-500
    case RiskLevel.YELLOW:
      return '#eab308'; // yellow-500
    default:
      return '#22c55e'; // green-500
  }
};

// 위험도별 배경색 반환
export const getRiskBgColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.RED:
      return '#fee2e2'; // red-100
    case RiskLevel.YELLOW:
      return '#fef3c7'; // yellow-100
    default:
      return '#dcfce7'; // green-100
  }
};

// 위험도 텍스트
export const getRiskText = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.RED:
      return '고위험';
    case RiskLevel.YELLOW:
      return '중위험';
    default:
      return '정상';
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