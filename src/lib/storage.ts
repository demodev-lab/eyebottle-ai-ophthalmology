// LocalStorage 유틸리티 함수
// 향후 Supabase로 마이그레이션을 위해 추상화된 인터페이스 제공

import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Patient,
  MyoCareVisit,
  UserSettings,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
} from '@/types/database';

// 현재 사용자 관리
export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userId) return null;
  
  const users = getUsers();
  return users.find(u => u.id === userId) || null;
};

export const setCurrentUser = (userId: string) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
};

// 사용자 CRUD
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const createUser = (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

// 환자 CRUD
export const getPatients = (userId?: string): Patient[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  const patients: Patient[] = data ? JSON.parse(data) : [];
  
  // 현재 사용자의 환자만 필터링
  const currentUserId = userId || getCurrentUser()?.id;
  if (!currentUserId) return [];
  
  return patients.filter(p => p.user_id === currentUserId);
};

export const getPatientById = (patientId: string): Patient | null => {
  const patients = getPatients();
  return patients.find(p => p.id === patientId) || null;
};

export const createPatient = (patientData: Omit<Patient, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Patient => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No current user');
  
  const allPatients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  const newPatient: Patient = {
    ...patientData,
    id: uuidv4(),
    user_id: currentUser.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  allPatients.push(newPatient);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(allPatients));
  return newPatient;
};

export const updatePatient = (patientId: string, updates: Partial<Omit<Patient, 'id' | 'user_id' | 'created_at'>>): Patient => {
  const allPatients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  const index = allPatients.findIndex((p: Patient) => p.id === patientId);
  
  if (index === -1) throw new Error('Patient not found');
  
  allPatients[index] = {
    ...allPatients[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(allPatients));
  return allPatients[index];
};

export const deletePatient = (patientId: string): void => {
  const allPatients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  const filtered = allPatients.filter((p: Patient) => p.id !== patientId);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filtered));
  
  // 해당 환자의 방문 기록도 삭제
  const allVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
  const filteredVisits = allVisits.filter((v: MyoCareVisit) => v.patient_id !== patientId);
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(filteredVisits));
};

// 검사 기록 CRUD
export const getVisits = (patientId?: string): MyoCareVisit[] => {
  const data = localStorage.getItem(STORAGE_KEYS.VISITS);
  const visits: MyoCareVisit[] = data ? JSON.parse(data) : [];
  
  // SE 값이 없는 기존 데이터에 대한 재계산
  const calculateSE = (sphere?: number, cylinder?: number): number | undefined => {
    if (sphere === undefined) return undefined;
    return sphere + (cylinder || 0) / 2;
  };
  
  // 데이터 무결성 검증 및 SE 값 재계산
  const validatedVisits = visits.map(visit => {
    const needsUpdate = visit.od_se === undefined && visit.od_sphere !== undefined ||
                       visit.os_se === undefined && visit.os_sphere !== undefined;
    
    if (needsUpdate) {
      console.log('[MyoCare] SE 값 재계산 필요:', visit.id, {
        od_sphere: visit.od_sphere,
        od_cylinder: visit.od_cylinder,
        os_sphere: visit.os_sphere,
        os_cylinder: visit.os_cylinder
      });
      
      return {
        ...visit,
        od_se: visit.od_se ?? calculateSE(visit.od_sphere, visit.od_cylinder),
        os_se: visit.os_se ?? calculateSE(visit.os_sphere, visit.os_cylinder)
      };
    }
    return visit;
  });
  
  // 재계산된 데이터가 있으면 저장
  if (validatedVisits.some((v, i) => v !== visits[i])) {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(validatedVisits));
  }
  
  if (patientId) {
    return validatedVisits
      .filter(v => v.patient_id === patientId)
      .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
  }
  
  // 현재 사용자의 모든 환자의 방문 기록
  const patientIds = getPatients().map(p => p.id);
  return validatedVisits
    .filter(v => patientIds.includes(v.patient_id))
    .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
};

export const getLatestVisit = (patientId: string): MyoCareVisit | null => {
  const visits = getVisits(patientId);
  return visits.length > 0 ? visits[0] : null;
};

export const createVisit = (visitData: Omit<MyoCareVisit, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'od_se' | 'os_se'>): MyoCareVisit => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No current user');
  
  // S.E. 자동 계산
  const calculateSE = (sphere?: number, cylinder?: number): number | undefined => {
    if (sphere === undefined) return undefined;
    return sphere + (cylinder || 0) / 2;
  };
  
  const allVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
  const newVisit: MyoCareVisit = {
    ...visitData,
    id: uuidv4(),
    od_se: calculateSE(visitData.od_sphere, visitData.od_cylinder),
    os_se: calculateSE(visitData.os_sphere, visitData.os_cylinder),
    created_by: currentUser.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  allVisits.push(newVisit);
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(allVisits));
  return newVisit;
};

export const updateVisit = (visitId: string, updates: Partial<Omit<MyoCareVisit, 'id' | 'patient_id' | 'created_by' | 'created_at'>>): MyoCareVisit => {
  const allVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
  const index = allVisits.findIndex((v: MyoCareVisit) => v.id === visitId);
  
  if (index === -1) throw new Error('Visit not found');
  
  // S.E. 재계산
  const calculateSE = (sphere?: number, cylinder?: number): number | undefined => {
    if (sphere === undefined) return undefined;
    return sphere + (cylinder || 0) / 2;
  };
  
  const updatedData = {
    ...updates,
    od_se: updates.od_sphere !== undefined ? calculateSE(updates.od_sphere, updates.od_cylinder || allVisits[index].od_cylinder) : allVisits[index].od_se,
    os_se: updates.os_sphere !== undefined ? calculateSE(updates.os_sphere, updates.os_cylinder || allVisits[index].os_cylinder) : allVisits[index].os_se,
  };
  
  allVisits[index] = {
    ...allVisits[index],
    ...updatedData,
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(allVisits));
  return allVisits[index];
};

export const deleteVisit = (visitId: string): void => {
  const allVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
  const filtered = allVisits.filter((v: MyoCareVisit) => v.id !== visitId);
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(filtered));
};

// 사용자 설정 관리
export const getUserSettings = (userId?: string): UserSettings => {
  const currentUserId = userId || getCurrentUser()?.id;
  if (!currentUserId) throw new Error('No current user');
  
  const key = `${STORAGE_KEYS.USER_SETTINGS}_${currentUserId}`;
  const data = localStorage.getItem(key);
  
  if (data) {
    return JSON.parse(data);
  }
  
  // 기본 설정 생성
  const newSettings: UserSettings = {
    ...DEFAULT_SETTINGS,
    id: uuidv4(),
    user_id: currentUserId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(key, JSON.stringify(newSettings));
  return newSettings;
};

export const updateUserSettings = (updates: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at'>>): UserSettings => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No current user');
  
  const key = `${STORAGE_KEYS.USER_SETTINGS}_${currentUser.id}`;
  const currentSettings = getUserSettings();
  
  const updatedSettings: UserSettings = {
    ...currentSettings,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(key, JSON.stringify(updatedSettings));
  return updatedSettings;
};

// 데모 사용자 생성 (개발용)
export const createDemoUser = (): User => {
  const demoUser = createUser({
    email: 'demo@myocare.com',
    name: '데모 의사',
  });
  
  setCurrentUser(demoUser.id);
  return demoUser;
};

// 데이터 초기화 (개발용)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // 사용자별 설정도 삭제
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEYS.USER_SETTINGS)) {
      localStorage.removeItem(key);
    }
  });
};