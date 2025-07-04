// 환자 안내자료 LocalStorage 관리 함수

import { v4 as uuidv4 } from 'uuid';
import {
  PatientGuide,
  GuideSearchFilter,
  GuideSortOption,
  AdminAuth,
  GuideStats,
  GUIDE_STORAGE_KEYS,
  GuideCategory,
  ContentType,
} from '@/types/patient-guide';
import { getFromStorage, setToStorage } from './storage-helpers';

// 관리자 비밀번호 (하드코딩)
const ADMIN_PASSWORD = 'eyebottle2024!';

// ===== 안내자료 CRUD 작업 =====

// 모든 안내자료 가져오기 (필터 적용)
export const getGuides = (filter?: GuideSearchFilter): PatientGuide[] => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  
  let filtered = guides;
  
  // 공개 여부 필터
  if (filter?.isPublished !== undefined) {
    filtered = filtered.filter(g => g.isPublished === filter.isPublished);
  }
  
  // 검색어 필터
  if (filter?.query) {
    const query = filter.query.toLowerCase();
    filtered = filtered.filter(guide =>
      guide.title.toLowerCase().includes(query) ||
      guide.description.toLowerCase().includes(query) ||
      guide.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // 카테고리 필터
  if (filter?.primaryCategory) {
    filtered = filtered.filter(g => g.primaryCategory === filter.primaryCategory);
  }
  
  // 질환별 필터
  if (filter?.secondaryCategories && filter.secondaryCategories.length > 0) {
    filtered = filtered.filter(guide =>
      guide.secondaryCategories.some(cat =>
        filter.secondaryCategories!.includes(cat)
      )
    );
  }
  
  // 태그 필터
  if (filter?.tags && filter.tags.length > 0) {
    filtered = filtered.filter(guide =>
      guide.tags.some(tag => filter.tags!.includes(tag))
    );
  }
  
  // 콘텐츠 타입 필터
  if (filter?.contentType) {
    filtered = filtered.filter(g => g.contentType === filter.contentType);
  }
  
  return filtered;
};

// ID로 안내자료 가져오기
export const getGuideById = (id: string): PatientGuide | null => {
  const guides = getGuides();
  return guides.find(g => g.id === id) || null;
};

// 안내자료 생성
export const createGuide = (guide: Omit<PatientGuide, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>): PatientGuide => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  
  const newGuide: PatientGuide = {
    ...guide,
    id: uuidv4(),
    viewCount: 0,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  guides.push(newGuide);
  setToStorage(GUIDE_STORAGE_KEYS.GUIDES, guides);
  
  // 통계 업데이트
  updateStats();
  
  return newGuide;
};

// 안내자료 수정
export const updateGuide = (id: string, updates: Partial<PatientGuide>): PatientGuide | null => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  const index = guides.findIndex(g => g.id === id);
  
  if (index === -1) return null;
  
  guides[index] = {
    ...guides[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  setToStorage(GUIDE_STORAGE_KEYS.GUIDES, guides);
  updateStats();
  
  return guides[index];
};

// 안내자료 삭제
export const deleteGuide = (id: string): boolean => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  const filtered = guides.filter(g => g.id !== id);
  
  if (filtered.length === guides.length) return false;
  
  setToStorage(GUIDE_STORAGE_KEYS.GUIDES, filtered);
  updateStats();
  
  return true;
};

// ===== 조회수/다운로드 관리 =====

// 조회수 증가
export const incrementViewCount = (id: string): void => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  const index = guides.findIndex(g => g.id === id);
  
  if (index !== -1) {
    guides[index].viewCount++;
    setToStorage(GUIDE_STORAGE_KEYS.GUIDES, guides);
    updateStats();
  }
};

// 다운로드 수 증가
export const incrementDownloadCount = (id: string): void => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  const index = guides.findIndex(g => g.id === id);
  
  if (index !== -1) {
    guides[index].downloadCount++;
    setToStorage(GUIDE_STORAGE_KEYS.GUIDES, guides);
    updateStats();
  }
};

// ===== 정렬 =====

export const sortGuides = (guides: PatientGuide[], sortOption: GuideSortOption): PatientGuide[] => {
  const sorted = [...guides];
  
  switch (sortOption) {
    case GuideSortOption.LATEST:
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    case GuideSortOption.OLDEST:
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    
    case GuideSortOption.MOST_VIEWED:
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    
    case GuideSortOption.MOST_DOWNLOADED:
      return sorted.sort((a, b) => b.downloadCount - a.downloadCount);
    
    case GuideSortOption.ALPHABETICAL:
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    
    case GuideSortOption.CUSTOM_ORDER:
      return sorted.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    default:
      return sorted;
  }
};

// ===== 관리자 인증 =====

// 관리자 로그인
export const adminLogin = (password: string): boolean => {
  if (password !== ADMIN_PASSWORD) return false;
  
  const auth: AdminAuth = {
    isAuthenticated: true,
    authenticatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24시간
  };
  
  setToStorage(GUIDE_STORAGE_KEYS.ADMIN_AUTH, auth);
  return true;
};

// 관리자 로그아웃
export const adminLogout = (): void => {
  setToStorage(GUIDE_STORAGE_KEYS.ADMIN_AUTH, { isAuthenticated: false });
};

// 관리자 인증 확인
export const isAdminAuthenticated = (): boolean => {
  const auth = getFromStorage<AdminAuth>(GUIDE_STORAGE_KEYS.ADMIN_AUTH, { isAuthenticated: false });
  
  if (!auth.isAuthenticated || !auth.expiresAt) return false;
  
  // 만료 시간 확인
  if (new Date() > new Date(auth.expiresAt)) {
    adminLogout();
    return false;
  }
  
  return true;
};

// ===== 통계 =====

// 통계 업데이트
const updateStats = (): void => {
  const guides = getFromStorage<PatientGuide[]>(GUIDE_STORAGE_KEYS.GUIDES, []);
  
  const stats: GuideStats = {
    totalGuides: guides.length,
    totalViews: guides.reduce((sum, g) => sum + g.viewCount, 0),
    totalDownloads: guides.reduce((sum, g) => sum + g.downloadCount, 0),
    categoryStats: {} as Record<GuideCategory, number>,
    popularGuides: guides
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(g => g.id),
  };
  
  // 카테고리별 통계
  Object.values(GuideCategory).forEach(category => {
    stats.categoryStats[category as GuideCategory] = 
      guides.filter(g => g.primaryCategory === category).length;
  });
  
  setToStorage(GUIDE_STORAGE_KEYS.VIEW_STATS, stats);
};

// 통계 가져오기
export const getStats = (): GuideStats => {
  return getFromStorage<GuideStats>(GUIDE_STORAGE_KEYS.VIEW_STATS, {
    totalGuides: 0,
    totalViews: 0,
    totalDownloads: 0,
    categoryStats: {} as Record<GuideCategory, number>,
    popularGuides: [],
  });
};

// ===== 샘플 데이터 생성 =====

export const createSampleGuides = (): void => {
  const existingGuides = getGuides();
  if (existingGuides.length > 0) return; // 이미 데이터가 있으면 생략
  
  const sampleGuides = [
    {
      title: '백내장 수술 전 안내사항',
      description: '백내장 수술을 앞두신 환자분들을 위한 준비사항과 주의사항을 안내합니다.',
      primaryCategory: GuideCategory.PRE_SURGERY,
      secondaryCategories: ['백내장'],
      tags: ['필독', '수술전', '중요'],
      contentType: ContentType.PDF,
      files: [{
        id: 'file_1',
        type: 'pdf' as const,
        name: '백내장_수술전_안내.pdf',
        url: '/guides/sample_cataract_guide.html',
        size: 2048576, // 2MB
      }],
      isPublished: true,
      order: 1,
    },
    {
      title: '녹내장 안약 사용법',
      description: '녹내장 치료를 위한 안약의 올바른 사용법과 보관 방법을 설명합니다.',
      primaryCategory: GuideCategory.MEDICATION,
      secondaryCategories: ['녹내장'],
      tags: ['안약', '사용법', '동영상포함'],
      contentType: ContentType.VIDEO,
      youtubeUrl: 'https://www.youtube.com/watch?v=example1',
      files: [],
      isPublished: true,
      order: 2,
    },
    {
      title: '라식/라섹 수술 후 관리',
      description: '라식, 라섹 수술 후 빠른 회복을 위한 생활 가이드와 주의사항입니다.',
      primaryCategory: GuideCategory.POST_SURGERY,
      secondaryCategories: ['굴절이상'],
      tags: ['수술후', '관리', '중요'],
      contentType: ContentType.MIXED,
      files: [{
        id: 'file_2',
        type: 'pdf' as const,
        name: '라식라섹_수술후_관리.pdf',
        url: '/guides/sample_cataract_guide.html',
        size: 1536000, // 1.5MB
      }],
      youtubeUrl: 'https://www.youtube.com/watch?v=example2',
      isPublished: true,
      order: 3,
    },
    {
      title: '당뇨망막병증의 이해',
      description: '당뇨병 환자에게 발생할 수 있는 망막 합병증에 대한 상세한 설명입니다.',
      primaryCategory: GuideCategory.DISEASE_INFO,
      secondaryCategories: ['망막질환', '당뇨망막병증'],
      tags: ['질환정보', '당뇨', '망막'],
      contentType: ContentType.PDF,
      files: [{
        id: 'file_3',
        type: 'pdf' as const,
        name: '당뇨망막병증_안내.pdf',
        url: '/guides/sample_glaucoma_guide.html',
        size: 3145728, // 3MB
      }],
      isPublished: true,
      order: 4,
    },
    {
      title: '시력검사 준비사항',
      description: '정확한 시력검사를 위한 준비사항과 검사 과정을 안내합니다.',
      primaryCategory: GuideCategory.EXAMINATION,
      secondaryCategories: [],
      tags: ['검사', '준비사항'],
      contentType: ContentType.PDF,
      files: [{
        id: 'file_4',
        type: 'pdf' as const,
        name: '시력검사_안내.pdf',
        url: '/guides/sample_glaucoma_guide.html',
        size: 1024000, // 1MB
      }],
      isPublished: false, // 비공개 예시
      order: 5,
    },
  ];
  
  sampleGuides.forEach(guide => {
    createGuide(guide as any);
  });
};

// ===== 파일 관리 =====

// 파일 경로 생성 (실제 파일 업로드 시 사용)
export const generateFilePath = (fileName: string): string => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `/guides/${timestamp}_${cleanFileName}`;
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};