// 날짜 관련 상수
export const DATE_CONSTANTS = {
  MIN_EXAM_INTERVAL_DAYS: 30,      // 최소 검사 간격 (진행률 계산을 위한 최소 일수)
  ACTIVE_PATIENT_DAYS: 180,        // 활성 환자 기준
  RECENT_PATIENT_DAYS: 30,         // 최근 환자 기준
  DAYS_IN_YEAR: 365.25,           // 연간 일수 (윤년 고려)
  WEEK_DAYS: 7,                   // 주간 일수
} as const;

// 차트 관련 상수
export const CHART_CONSTANTS = {
  HEIGHT: 400,
  MARGINS: { top: 5, right: 30, left: 20, bottom: 5 },
  TICK_PADDING: 10,
  LEGEND_ICON_SIZE: 14,
} as const;

// 위험도 색상 상수
export const RISK_COLORS = {
  RED: '#ef4444',        // red-500
  YELLOW: '#eab308',     // yellow-500
  GREEN: '#22c55e',      // green-500
  RED_BG: '#fee2e2',     // red-100
  YELLOW_BG: '#fef3c7',  // yellow-100
  GREEN_BG: '#dcfce7',   // green-100
} as const;

// 위험도 텍스트
export const RISK_TEXT = {
  RED: '고위험',
  YELLOW: '중위험',
  GREEN: '정상',
} as const;

// 치료방법별 색상 (차트 배경용)
export const TREATMENT_COLORS: Record<string, string> = {
  'atropine_0.042': 'rgba(33, 150, 243, 0.3)',    // #2196f3 with 30% opacity
  'atropine_0.05': 'rgba(25, 118, 210, 0.3)',     // #1976d2 with 30% opacity
  'atropine_0.063': 'rgba(21, 101, 192, 0.3)',    // #1565c0 with 30% opacity
  'atropine_0.125': 'rgba(13, 71, 161, 0.3)',     // #0d47a1 with 30% opacity
  'dream_lens': 'rgba(233, 30, 99, 0.3)',         // #e91e63 with 30% opacity
  'myosight': 'rgba(194, 24, 91, 0.3)',           // #c2185b with 30% opacity
  'dims_glasses': 'rgba(76, 175, 80, 0.3)',       // #4caf50 with 30% opacity
  'combined': 'rgba(255, 152, 0, 0.3)',           // #ff9800 with 30% opacity
};

// 치료방법별 진한 색상 (범례용)
export const TREATMENT_COLORS_SOLID: Record<string, string> = {
  'atropine_0.042': '#2196f3',
  'atropine_0.05': '#1976d2',
  'atropine_0.063': '#1565c0',
  'atropine_0.125': '#0d47a1',
  'dream_lens': '#e91e63',
  'myosight': '#c2185b',
  'dims_glasses': '#4caf50',
  'combined': '#ff9800',
};

// 진행률 계산 관련 상수
export const PROGRESSION_CONSTANTS = {
  MAX_VISITS_FOR_CALCULATION: 10,  // 최대 검사 횟수
  MIN_VISITS_FOR_PROGRESSION: 2,   // 진행률 계산을 위한 최소 검사 횟수
  HIGH_RELIABILITY_DAYS: 90,       // 높은 신뢰도 기준 (일)
  MEDIUM_RELIABILITY_DAYS: 60,     // 중간 신뢰도 기준 (일)
} as const;

// 차트 Y축 범위 상수
export const CHART_Y_RANGES = {
  SE: { min: -20, max: 5 },
  AL: { min: 20, max: 30 },
} as const;

// 인쇄 관련 상수
export const PRINT_CONSTANTS = {
  DELAY_BEFORE_PRINT: 500,    // 인쇄 전 대기 시간 (ms)
  DELAY_AFTER_PRINT: 1000,    // 인쇄 후 대기 시간 (ms)
} as const;