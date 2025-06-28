// LocalStorage 헬퍼 함수들
// 반복되는 LocalStorage 패턴을 추상화하여 코드 중복을 줄입니다.

/**
 * LocalStorage에서 데이터를 가져옵니다.
 * @param key - LocalStorage 키
 * @param defaultValue - 데이터가 없을 때 반환할 기본값
 * @returns 파싱된 데이터 또는 기본값
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * LocalStorage에 데이터를 저장합니다.
 * @param key - LocalStorage 키
 * @param value - 저장할 데이터
 */
export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

/**
 * LocalStorage에서 특정 키를 제거합니다.
 * @param key - 제거할 LocalStorage 키
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * LocalStorage에 키가 존재하는지 확인합니다.
 * @param key - 확인할 LocalStorage 키
 * @returns 키 존재 여부
 */
export function existsInStorage(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage (${key}):`, error);
    return false;
  }
}

/**
 * 배열 데이터를 업데이트합니다. (추가/수정/삭제 작업에 유용)
 * @param key - LocalStorage 키
 * @param updater - 배열을 업데이트하는 함수
 * @param defaultValue - 기본 배열 값
 */
export function updateArrayInStorage<T>(
  key: string,
  updater: (current: T[]) => T[],
  defaultValue: T[] = []
): void {
  const current = getFromStorage(key, defaultValue);
  const updated = updater(current);
  setToStorage(key, updated);
}

/**
 * 객체 데이터를 부분적으로 업데이트합니다.
 * @param key - LocalStorage 키
 * @param updates - 업데이트할 필드들
 * @param defaultValue - 기본 객체 값
 */
export function updateObjectInStorage<T extends Record<string, any>>(
  key: string,
  updates: Partial<T>,
  defaultValue: T
): void {
  const current = getFromStorage(key, defaultValue);
  const updated = { ...current, ...updates };
  setToStorage(key, updated);
}