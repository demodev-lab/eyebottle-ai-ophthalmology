// 데이터베이스 스키마 기반 타입 정의
// 향후 Supabase 연동 시에도 재사용 가능한 구조

// 사용자 (의료진) 타입
export interface User {
  id: string; // UUID
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// 환자 정보 타입
export interface Patient {
  id: string; // UUID
  user_id: string; // User.id 참조
  name: string;
  birth_date: string; // YYYY-MM-DD
  chart_number?: string; // 선택적
  treatment_method?: TreatmentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// 검사 기록 타입
export interface MyoCareVisit {
  id: string; // UUID
  patient_id: string; // Patient.id 참조
  visit_date: string; // YYYY-MM-DD
  
  // 우안 (OD) 데이터
  od_sphere?: number;
  od_cylinder?: number;
  od_se?: number; // Spherical Equivalent (자동 계산)
  od_axial_length?: number;
  
  // 좌안 (OS) 데이터
  os_sphere?: number;
  os_cylinder?: number;
  os_se?: number; // Spherical Equivalent (자동 계산)
  os_axial_length?: number;
  
  // 안경 처방 여부 (양안 공통)
  new_prescription?: boolean;
  
  treatment_method?: TreatmentMethod;
  notes?: string;
  created_by: string; // User.id 참조
  created_at: string;
  updated_at: string;
}

// 사용자 설정 타입
export interface UserSettings {
  id: string; // UUID
  user_id: string; // User.id 참조
  
  // 진행 임계값 설정
  thresholds: {
    se: {
      yellow: number; // 기본값: 0.75 D/yr
      red: number;    // 기본값: 1.50 D/yr
    };
    al: {
      yellow: number; // 기본값: 0.30 mm/yr
      red: number;    // 기본값: 0.60 mm/yr
    };
  };
  
  // 치료방법별 색상 설정
  treatmentColors: {
    [key in TreatmentMethod]: string; // HEX 색상 코드
  };
  
  // EMR 템플릿
  emrTemplate: string;
  emrTemplateVariables?: string[]; // 선택된 EMR 템플릿 변수 목록
  customComment?: string; // 사용자 경과 문구
  
  created_at: string;
  updated_at: string;
}

// 치료방법 열거형
export enum TreatmentMethod {
  ATROPINE_0_042 = 'atropine_0.042',
  ATROPINE_0_05 = 'atropine_0.05',
  ATROPINE_0_063 = 'atropine_0.063',
  ATROPINE_0_125 = 'atropine_0.125',
  DREAM_LENS = 'dream_lens',
  MYOSIGHT = 'myosight',
  DIMS_GLASSES = 'dims_glasses',
  COMBINED = 'combined',
}

// 치료방법 표시 텍스트
export const TREATMENT_METHOD_LABELS: Record<TreatmentMethod, string> = {
  [TreatmentMethod.ATROPINE_0_042]: '아트로핀 0.042%',
  [TreatmentMethod.ATROPINE_0_05]: '아트로핀 0.05%',
  [TreatmentMethod.ATROPINE_0_063]: '아트로핀 0.063%',
  [TreatmentMethod.ATROPINE_0_125]: '아트로핀 0.125%',
  [TreatmentMethod.DREAM_LENS]: '드림렌즈',
  [TreatmentMethod.MYOSIGHT]: '마이사이트',
  [TreatmentMethod.DIMS_GLASSES]: 'DIMS안경',
  [TreatmentMethod.COMBINED]: '병행치료',
};

// 위험도 레벨
export enum RiskLevel {
  NORMAL = 'normal',
  YELLOW = 'yellow',
  RED = 'red',
}

// 통계 데이터 타입
export interface DashboardStats {
  totalPatients: number;
  highRiskPatients: number;
  mediumRiskPatients: number;
  activePatients: number;
  recentPatients: number;
  treatmentDistribution: Record<TreatmentMethod, number>;
}

// 차트 데이터 포인트
export interface ChartDataPoint {
  date: string;
  od_se?: number;
  os_se?: number;
  od_al?: number;
  os_al?: number;
  treatment_method?: TreatmentMethod;
}

// 진행 속도 계산 결과
export interface ProgressionRate {
  se_od?: number; // D/yr
  se_os?: number; // D/yr
  al_od?: number; // mm/yr
  al_os?: number; // mm/yr
  riskLevel: RiskLevel;
}

// LocalStorage 키 상수
export const STORAGE_KEYS = {
  CURRENT_USER: 'myocare_currentUser',
  USERS: 'myocare_users',
  PATIENTS: 'myocare_patients',
  VISITS: 'myocare_visits',
  USER_SETTINGS: 'myocare_user_settings',
} as const;

// 기본 설정값
export const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  thresholds: {
    se: {
      yellow: 0.75,
      red: 1.50,
    },
    al: {
      yellow: 0.30,
      red: 0.60,
    },
  },
  treatmentColors: {
    [TreatmentMethod.ATROPINE_0_042]: '#e3f2fd',
    [TreatmentMethod.ATROPINE_0_05]: '#bbdefb',
    [TreatmentMethod.ATROPINE_0_063]: '#90caf9',
    [TreatmentMethod.ATROPINE_0_125]: '#64b5f6',
    [TreatmentMethod.DREAM_LENS]: '#e1bee7',
    [TreatmentMethod.MYOSIGHT]: '#ffccbc',
    [TreatmentMethod.DIMS_GLASSES]: '#c8e6c9',
    [TreatmentMethod.COMBINED]: '#b2dfdb',
  },
  emrTemplate: `환자명: [환자명]
치료방법: [치료방법]

검사일: [검사일]
우안 S.E.: [SE_OD] D
좌안 S.E.: [SE_OS] D
우안 안축장: [AL_OD] mm
좌안 안축장: [AL_OS] mm

연간 진행속도:
우안 S.E.: [SE_PROGRESS_OD] D/yr
좌안 S.E.: [SE_PROGRESS_OS] D/yr`,
  emrTemplateVariables: [
    '[치료방법]',
    '[구면상당치]',
    '[안축장]',
    '[SE 진행속도]',
    '[AL 진행속도]',
    '[안경처방]',
    '[사용자 경과 문구]',
  ],
  customComment: '4개월 뒤 경과관찰, AL, 안경시력, 교정 후 진료',
};