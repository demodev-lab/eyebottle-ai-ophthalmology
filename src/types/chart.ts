// 차트 관련 타입 정의

import { TreatmentMethod, RiskLevel } from './database';

// Recharts용 차트 데이터 포인트
export interface ChartData {
  date: string;
  timestamp: number; // 정렬용
  od_se?: number;
  os_se?: number;
  od_al?: number;
  os_al?: number;
  treatment?: TreatmentMethod;
  treatmentLabel?: string;
}

// 차트 축 타입
export type ChartAxisType = 'se' | 'al';

// 차트 설정
export interface ChartConfig {
  type: ChartAxisType;
  showOD: boolean;
  showOS: boolean;
  timeRange?: 'all' | '1y' | '2y' | '3y';
}

// 진행 그래프 데이터
export interface ProgressChartData {
  chartData: ChartData[];
  progressionRate: {
    od?: number; // D/yr or mm/yr
    os?: number;
  };
  riskLevel: RiskLevel;
  latestVisit?: {
    date: string;
    od_value?: number;
    os_value?: number;
  };
}

// 대시보드 차트 설정
export interface DashboardChartConfig {
  width?: number;
  height?: number;
  showLegend?: boolean;
  colors?: {
    od: string;
    os: string;
  };
}

// 치료방법 분포 차트 데이터
export interface TreatmentDistributionData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}