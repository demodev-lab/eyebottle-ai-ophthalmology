// 환자 안내자료 타입 정의

// 메인 안내자료 타입
export interface PatientGuide {
  // 기본 정보
  id: string; // UUID v4 (Supabase 호환)
  title: string;
  description: string;
  
  // 분류 체계
  primaryCategory: GuideCategory; // 용도별 (상위)
  secondaryCategories: string[]; // 질환별 (하위, 복수 선택 가능)
  tags: string[]; // 검색용 태그
  
  // 파일 정보
  contentType: ContentType; // 콘텐츠 타입
  files: GuideFile[]; // 여러 파일 지원
  
  // YouTube 링크 (contentType이 'video'인 경우)
  youtubeUrl?: string;
  
  // 메타데이터
  viewCount: number;
  downloadCount: number;
  isPublished: boolean; // 공개/비공개
  order: number; // 정렬 순서
  
  // 타임스탬프 (ISO 문자열로 저장)
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // 관리자 식별용
  
  // Supabase 마이그레이션 대비
  version?: number; // 버전 관리
  previousVersionId?: string; // 이전 버전 참조
}

// 파일 정보 타입
export interface GuideFile {
  id: string;
  type: FileType;
  name: string;
  url: string; // 로컬: /guides/filename, Supabase: https://...
  size?: number; // bytes
  mimeType?: string;
  thumbnailUrl?: string; // PDF 첫 페이지 썸네일
  uploadedAt?: string;
}

// 카테고리 정의 (용도별 - 상위 분류)
export enum GuideCategory {
  PRE_SURGERY = 'pre_surgery', // 수술 전 안내
  POST_SURGERY = 'post_surgery', // 수술 후 관리
  MEDICATION = 'medication', // 약물 사용법
  DISEASE_INFO = 'disease_info', // 질환 정보
  LIFESTYLE = 'lifestyle', // 생활 습관
  EXAMINATION = 'examination' // 검사 안내
}

// 카테고리 한글 레이블
export const GuideCategoryLabels: Record<GuideCategory, string> = {
  [GuideCategory.PRE_SURGERY]: '수술 전 안내',
  [GuideCategory.POST_SURGERY]: '수술 후 관리',
  [GuideCategory.MEDICATION]: '약물 사용법',
  [GuideCategory.DISEASE_INFO]: '질환 정보',
  [GuideCategory.LIFESTYLE]: '생활 습관',
  [GuideCategory.EXAMINATION]: '검사 안내',
};

// 질환별 세부 카테고리 (하위 분류)
export const DiseaseCategories = {
  CATARACT: '백내장',
  GLAUCOMA: '녹내장',
  RETINA: '망막질환',
  CORNEA: '각막질환',
  REFRACTIVE: '굴절이상',
  PEDIATRIC: '소아안과',
  DRY_EYE: '안구건조증',
  PRESBYOPIA: '노안',
  DIABETIC_RETINOPATHY: '당뇨망막병증',
  MACULAR_DEGENERATION: '황반변성',
} as const;

// 콘텐츠 타입
export enum ContentType {
  PDF = 'pdf',
  VIDEO = 'video',
  MIXED = 'mixed', // PDF + 비디오 혼합
}

// 파일 타입
export enum FileType {
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
}

// LocalStorage 키 구조 (Supabase 테이블명과 동일하게)
export const GUIDE_STORAGE_KEYS = {
  GUIDES: 'patient_guides',
  ADMIN_AUTH: 'patient_guides_admin',
  VIEW_STATS: 'patient_guides_stats',
  UPLOAD_QUEUE: 'patient_guides_upload_queue',
} as const;

// 검색 필터 옵션
export interface GuideSearchFilter {
  query?: string;
  primaryCategory?: GuideCategory;
  secondaryCategories?: string[];
  tags?: string[];
  contentType?: ContentType;
  isPublished?: boolean;
}

// 정렬 옵션
export enum GuideSortOption {
  LATEST = 'latest',
  OLDEST = 'oldest',
  MOST_VIEWED = 'most_viewed',
  MOST_DOWNLOADED = 'most_downloaded',
  ALPHABETICAL = 'alphabetical',
  CUSTOM_ORDER = 'custom_order',
}

// 관리자 인증 정보
export interface AdminAuth {
  isAuthenticated: boolean;
  authenticatedAt?: string;
  expiresAt?: string;
}

// 통계 정보
export interface GuideStats {
  totalGuides: number;
  totalViews: number;
  totalDownloads: number;
  categoryStats: Record<GuideCategory, number>;
  popularGuides: string[]; // Guide IDs
}

// 업로드 상태
export interface UploadStatus {
  id: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

// 폼 데이터 (생성/수정 시 사용)
export interface GuideFormData {
  title: string;
  description: string;
  primaryCategory: GuideCategory | '';
  secondaryCategories: string[];
  tags: string[];
  contentType: ContentType;
  youtubeUrl?: string;
  isPublished: boolean;
  order?: number;
}

// 파일 업로드 응답
export interface FileUploadResponse {
  success: boolean;
  file?: GuideFile;
  error?: string;
}

// 관리자 액션 타입
export type AdminAction = 'create' | 'update' | 'delete' | 'publish' | 'unpublish';

// 기본 태그 목록
export const DEFAULT_GUIDE_TAGS = [
  '필독',
  '중요',
  '신규',
  '업데이트',
  '동영상포함',
  '다운로드가능',
  '인쇄용',
];