// 로거 유틸리티
// 개발/프로덕션 환경에 따라 로깅을 제어합니다.

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 로거 객체
 * 개발 환경에서만 console.log를 출력하고,
 * 에러는 모든 환경에서 출력합니다.
 */
export const logger = {
  /**
   * 일반 로그 (개발 환경에서만 출력)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * 정보 로그 (개발 환경에서만 출력)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * 경고 로그 (개발 환경에서만 출력)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * 에러 로그 (모든 환경에서 출력)
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * 디버그 로그 (개발 환경에서만 출력)
   * 더 상세한 디버깅 정보를 위해 사용
   */
  debug: (label: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${label}:`, data);
    }
  },

  /**
   * 테이블 형태로 데이터 출력 (개발 환경에서만)
   */
  table: (data: unknown) => {
    if (isDevelopment && console.table) {
      console.table(data);
    }
  },

  /**
   * 그룹 로그 시작 (개발 환경에서만)
   */
  group: (label: string) => {
    if (isDevelopment && console.group) {
      console.group(label);
    }
  },

  /**
   * 그룹 로그 종료 (개발 환경에서만)
   */
  groupEnd: () => {
    if (isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  },

  /**
   * 시간 측정 시작 (개발 환경에서만)
   */
  time: (label: string) => {
    if (isDevelopment && console.time) {
      console.time(label);
    }
  },

  /**
   * 시간 측정 종료 (개발 환경에서만)
   */
  timeEnd: (label: string) => {
    if (isDevelopment && console.timeEnd) {
      console.timeEnd(label);
    }
  },
};