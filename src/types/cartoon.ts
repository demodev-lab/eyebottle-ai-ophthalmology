// 안과 만화 게시판 타입 정의

// 만화 태그 카테고리
export enum CartoonTagCategory {
  SPECIALTY = 'specialty',   // 전문분야 (녹내장, 백내장, 소아, 망막 등)
  CONDITION = 'condition',   // 증상 (시력저하, 충혈, 건조증 등)
}

// 전문분야 태그
export enum SpecialtyTag {
  GLAUCOMA = '녹내장',
  CATARACT = '백내장',
  PEDIATRIC = '소아안과',
  RETINA = '망막',
  CORNEA = '각막',
  PRESBYOPIA = '노안',
  MYOPIA = '근시',
  STRABISMUS = '사시',
}

// 증상 태그
export enum ConditionTag {
  BLURRED_VISION = '시력저하',
  RED_EYE = '충혈',
  DRY_EYE = '건조증',
  FLOATERS = '비문증',
  EYE_PAIN = '안구통증',
  TEARING = '눈물흘림',
  LIGHT_SENSITIVITY = '눈부심',
  ITCHING = '가려움',
}

// 만화 태그 타입
export interface CartoonTag {
  id: string;
  name: string;
  category: CartoonTagCategory;
}

// 만화 이미지 타입
export interface CartoonImage {
  id: string;
  url: string;           // public 폴더 내 경로 or base64
  order: number;         // 표시 순서
  width?: number;
  height?: number;
}

// 만화 타입
export interface Cartoon {
  id: string;
  title: string;
  description?: string;
  tags: CartoonTag[];
  images: CartoonImage[];
  thumbnail?: string;         // 썸네일 이미지 URL
  viewCount: number;         // 조회수
  downloadCount: number;     // 다운로드 횟수
  printCount: number;        // 인쇄 횟수
  isPublished: boolean;      // 게시 여부
  isAdminOnly?: boolean;     // 관리자만 볼 수 있는지
  created_at: string;
  updated_at: string;
}

// 댓글 타입
export interface CartoonComment {
  id: string;
  cartoon_id: string;
  user_id?: string;          // 추후 로그인 시스템 연동
  nickname: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 태그 필터 타입
export interface CartoonFilter {
  tags?: string[];           // 태그 ID 배열
  searchQuery?: string;      // 제목 검색
  isPublished?: boolean;
}

// 정렬 옵션
export enum CartoonSortOption {
  LATEST = 'latest',         // 최신순
  POPULAR = 'popular',       // 인기순 (조회수)
  DOWNLOAD = 'download',     // 다운로드순
}

// LocalStorage 키
export const CARTOON_STORAGE_KEYS = {
  CARTOONS: 'eyebottle_cartoons',
  COMMENTS: 'eyebottle_cartoon_comments',
  ADMIN_AUTH: 'eyebottle_cartoon_admin_auth',
} as const;

// 기본 태그 목록
export const DEFAULT_TAGS: CartoonTag[] = [
  // 전문분야
  { id: 'tag_glaucoma', name: SpecialtyTag.GLAUCOMA, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_cataract', name: SpecialtyTag.CATARACT, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_pediatric', name: SpecialtyTag.PEDIATRIC, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_retina', name: SpecialtyTag.RETINA, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_cornea', name: SpecialtyTag.CORNEA, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_presbyopia', name: SpecialtyTag.PRESBYOPIA, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_myopia', name: SpecialtyTag.MYOPIA, category: CartoonTagCategory.SPECIALTY },
  { id: 'tag_strabismus', name: SpecialtyTag.STRABISMUS, category: CartoonTagCategory.SPECIALTY },
  
  // 증상
  { id: 'tag_blurred', name: ConditionTag.BLURRED_VISION, category: CartoonTagCategory.CONDITION },
  { id: 'tag_red', name: ConditionTag.RED_EYE, category: CartoonTagCategory.CONDITION },
  { id: 'tag_dry', name: ConditionTag.DRY_EYE, category: CartoonTagCategory.CONDITION },
  { id: 'tag_floaters', name: ConditionTag.FLOATERS, category: CartoonTagCategory.CONDITION },
  { id: 'tag_pain', name: ConditionTag.EYE_PAIN, category: CartoonTagCategory.CONDITION },
  { id: 'tag_tearing', name: ConditionTag.TEARING, category: CartoonTagCategory.CONDITION },
  { id: 'tag_light', name: ConditionTag.LIGHT_SENSITIVITY, category: CartoonTagCategory.CONDITION },
  { id: 'tag_itching', name: ConditionTag.ITCHING, category: CartoonTagCategory.CONDITION },
];

// PDF 레이아웃 옵션
export interface PDFLayoutOption {
  id: string;
  name: string;
  rows: number;
  cols: number;
  pageSize: 'A4' | 'Letter';
}

export const PDF_LAYOUT_OPTIONS: PDFLayoutOption[] = [
  { id: 'layout_2x2', name: '2x2 레이아웃', rows: 2, cols: 2, pageSize: 'A4' },
  { id: 'layout_2x4', name: '2x4 레이아웃', rows: 4, cols: 2, pageSize: 'A4' },
  { id: 'layout_1x1', name: '전체 페이지', rows: 1, cols: 1, pageSize: 'A4' },
];