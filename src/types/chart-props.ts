// 차트 컴포넌트 관련 타입 정의

import { RiskLevel } from './database';

// 차트 데이터 포인트 타입
export interface ChartDataPoint {
  date: string;
  age?: number;
  od?: number | null;
  os?: number | null;
  od_se?: number | null;
  os_se?: number | null;
  od_al?: number | null;
  os_al?: number | null;
  odRisk?: RiskLevel;
  osRisk?: RiskLevel;
  new_prescription?: boolean;
  treatment?: string;
}

// Recharts CustomDot 컴포넌트 Props
export interface CustomDotProps {
  cx: number;
  cy: number;
  payload: ChartDataPoint;
  dataKey: string;
}

// Recharts Tooltip Props
export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    payload: ChartDataPoint;
  }>;
  label?: string | number;
}

// Recharts Tick Props
export interface AxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string | number;
  };
}

// 치료 구간 타입
export interface TreatmentArea {
  x1: number;
  x2: number;
  fill: string;
  opacity: number;
  key: string;
  treatment?: string;
  isCurrent?: boolean;
}