// 날짜 관련 유틸리티 함수
// 반복되는 날짜 관련 로직을 추상화합니다.

/**
 * 현재 날짜를 반환합니다.
 * @returns 현재 날짜 객체
 */
export const getCurrentDate = (): Date => new Date();

/**
 * 날짜를 ISO 문자열로 변환합니다.
 * @param date - 변환할 날짜 (기본값: 현재 날짜)
 * @returns ISO 형식 날짜 문자열
 */
export const getISODateString = (date: Date = getCurrentDate()): string => {
  return date.toISOString();
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환합니다.
 * @param date - 변환할 날짜 (기본값: 현재 날짜)
 * @returns YYYY-MM-DD 형식 문자열
 */
export const formatDateToYYYYMMDD = (date: Date = getCurrentDate()): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 한국어 형식으로 날짜를 포맷합니다.
 * @param dateString - ISO 날짜 문자열
 * @param includeTime - 시간 포함 여부
 * @returns 포맷된 날짜 문자열
 */
export const formatDateToKorean = (dateString: string, includeTime = false): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
  
  return date.toLocaleDateString('ko-KR', options);
};

/**
 * 두 날짜 사이의 일수를 계산합니다.
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜
 * @returns 일수 차이 (절대값)
 */
export const getDaysBetween = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 날짜에서 특정 일수를 더하거나 뺍니다.
 * @param date - 기준 날짜
 * @param days - 더하거나 뺄 일수 (음수면 빼기)
 * @returns 계산된 날짜
 */
export const addDays = (date: Date | string, days: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * 날짜가 오늘로부터 며칠 전인지 계산합니다.
 * @param date - 확인할 날짜
 * @returns 오늘로부터의 일수 (과거면 양수)
 */
export const getDaysAgo = (date: Date | string): number => {
  return getDaysBetween(date, getCurrentDate());
};

/**
 * 날짜가 특정 일수 이내인지 확인합니다.
 * @param date - 확인할 날짜
 * @param days - 기준 일수
 * @returns 기준 일수 이내 여부
 */
export const isWithinDays = (date: Date | string, days: number): boolean => {
  return getDaysAgo(date) <= days;
};