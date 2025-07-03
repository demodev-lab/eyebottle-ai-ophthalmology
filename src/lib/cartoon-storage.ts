// 안과 만화 LocalStorage 관리 함수
// 향후 Supabase로 마이그레이션을 위해 추상화된 인터페이스 제공

import { v4 as uuidv4 } from 'uuid';
import {
  Cartoon,
  CartoonComment,
  CartoonFilter,
  CartoonSortOption,
  CARTOON_STORAGE_KEYS,
  CartoonImage,
} from '@/types/cartoon';
import { getFromStorage, setToStorage } from './storage-helpers';

// 만화 CRUD
export const getCartoons = (filter?: CartoonFilter): Cartoon[] => {
  const cartoons = getFromStorage<Cartoon[]>(CARTOON_STORAGE_KEYS.CARTOONS, []);
  
  let filtered = cartoons;
  
  // 게시 상태 필터
  if (filter?.isPublished !== undefined) {
    filtered = filtered.filter(c => c.isPublished === filter.isPublished);
  }
  
  // 태그 필터
  if (filter?.tags && filter.tags.length > 0) {
    filtered = filtered.filter(cartoon => 
      cartoon.tags.some(tag => filter.tags!.includes(tag.id))
    );
  }
  
  // 검색어 필터
  if (filter?.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(cartoon =>
      cartoon.title.toLowerCase().includes(query) ||
      cartoon.description?.toLowerCase().includes(query) ||
      cartoon.tags.some(tag => tag.name.toLowerCase().includes(query))
    );
  }
  
  return filtered;
};

export const getCartoonById = (id: string): Cartoon | null => {
  const cartoons = getCartoons();
  return cartoons.find(c => c.id === id) || null;
};

export const createCartoon = (
  cartoonData: Omit<Cartoon, 'id' | 'viewCount' | 'downloadCount' | 'printCount' | 'created_at' | 'updated_at'>
): Cartoon => {
  const cartoons = getFromStorage<Cartoon[]>(CARTOON_STORAGE_KEYS.CARTOONS, []);
  
  const newCartoon: Cartoon = {
    ...cartoonData,
    id: uuidv4(),
    viewCount: 0,
    downloadCount: 0,
    printCount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  cartoons.push(newCartoon);
  setToStorage(CARTOON_STORAGE_KEYS.CARTOONS, cartoons);
  
  return newCartoon;
};

export const updateCartoon = (
  id: string,
  updates: Partial<Omit<Cartoon, 'id' | 'created_at'>>
): Cartoon => {
  const cartoons = getFromStorage<Cartoon[]>(CARTOON_STORAGE_KEYS.CARTOONS, []);
  const index = cartoons.findIndex(c => c.id === id);
  
  if (index === -1) throw new Error('Cartoon not found');
  
  cartoons[index] = {
    ...cartoons[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  setToStorage(CARTOON_STORAGE_KEYS.CARTOONS, cartoons);
  return cartoons[index];
};

export const deleteCartoon = (id: string): void => {
  const cartoons = getFromStorage<Cartoon[]>(CARTOON_STORAGE_KEYS.CARTOONS, []);
  const filtered = cartoons.filter(c => c.id !== id);
  setToStorage(CARTOON_STORAGE_KEYS.CARTOONS, filtered);
  
  // 해당 만화의 댓글도 삭제
  const comments = getFromStorage<CartoonComment[]>(CARTOON_STORAGE_KEYS.COMMENTS, []);
  const filteredComments = comments.filter(c => c.cartoon_id !== id);
  setToStorage(CARTOON_STORAGE_KEYS.COMMENTS, filteredComments);
};

// 조회수, 다운로드수, 인쇄수 증가
export const incrementCartoonCount = (
  id: string, 
  countType: 'viewCount' | 'downloadCount' | 'printCount'
): void => {
  const cartoon = getCartoonById(id);
  if (!cartoon) return;
  
  updateCartoon(id, {
    [countType]: cartoon[countType] + 1,
  });
};

// 만화 정렬
export const sortCartoons = (
  cartoons: Cartoon[], 
  sortBy: CartoonSortOption
): Cartoon[] => {
  const sorted = [...cartoons];
  
  switch (sortBy) {
    case CartoonSortOption.LATEST:
      return sorted.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case CartoonSortOption.POPULAR:
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case CartoonSortOption.DOWNLOAD:
      return sorted.sort((a, b) => b.downloadCount - a.downloadCount);
    default:
      return sorted;
  }
};

// 댓글 CRUD
export const getComments = (cartoonId: string): CartoonComment[] => {
  const comments = getFromStorage<CartoonComment[]>(CARTOON_STORAGE_KEYS.COMMENTS, []);
  return comments
    .filter(c => c.cartoon_id === cartoonId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const createComment = (
  commentData: Omit<CartoonComment, 'id' | 'created_at' | 'updated_at'>
): CartoonComment => {
  const comments = getFromStorage<CartoonComment[]>(CARTOON_STORAGE_KEYS.COMMENTS, []);
  
  const newComment: CartoonComment = {
    ...commentData,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  comments.push(newComment);
  setToStorage(CARTOON_STORAGE_KEYS.COMMENTS, comments);
  
  return newComment;
};

export const deleteComment = (id: string): void => {
  const comments = getFromStorage<CartoonComment[]>(CARTOON_STORAGE_KEYS.COMMENTS, []);
  const filtered = comments.filter(c => c.id !== id);
  setToStorage(CARTOON_STORAGE_KEYS.COMMENTS, filtered);
};

// 관리자 인증
export const checkAdminAuth = (): boolean => {
  // 서버 사이드에서는 false 반환
  if (typeof window === 'undefined') return false;
  
  const authTime = localStorage.getItem(CARTOON_STORAGE_KEYS.ADMIN_AUTH);
  if (!authTime) return false;
  
  // 24시간 유효
  const authDate = new Date(authTime);
  const now = new Date();
  const diffHours = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60);
  
  return diffHours < 24;
};

export const setAdminAuth = (password: string): boolean => {
  // 서버 사이드에서는 false 반환
  if (typeof window === 'undefined') return false;
  
  // 임시 비밀번호 (추후 환경변수로 관리)
  const ADMIN_PASSWORD = 'eyebottle2025';
  
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(CARTOON_STORAGE_KEYS.ADMIN_AUTH, new Date().toISOString());
    return true;
  }
  
  return false;
};

export const clearAdminAuth = (): void => {
  // 서버 사이드에서는 실행하지 않음
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CARTOON_STORAGE_KEYS.ADMIN_AUTH);
};

// 이미지 관리 유틸리티
export const createCartoonImage = (
  file: File,
  order: number
): Promise<CartoonImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const cartoonImage: CartoonImage = {
          id: uuidv4(),
          url: e.target?.result as string, // Base64 데이터
          order,
          width: img.width,
          height: img.height,
        };
        resolve(cartoonImage);
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};

// 썸네일 생성 (첫 번째 이미지 사용)
export const generateThumbnail = (images: CartoonImage[]): string | undefined => {
  if (images.length === 0) return undefined;
  
  const firstImage = images.sort((a, b) => a.order - b.order)[0];
  return firstImage.url;
};

// 샘플 데이터 생성 (개발용)
export const createSampleCartoons = (): void => {
  const sampleCartoons: Omit<Cartoon, 'id' | 'viewCount' | 'downloadCount' | 'printCount' | 'created_at' | 'updated_at'>[] = [
    {
      title: '백내장 수술 전후 주의사항',
      description: '백내장 수술 전후 환자가 알아야 할 중요한 정보를 담은 4컷 만화입니다.',
      tags: [
        { id: 'tag_cataract', name: '백내장', category: 'specialty' as any },
        { id: 'tag_blurred', name: '시력저하', category: 'condition' as any },
      ],
      images: [],
      thumbnail: '/cartoons/sample1_thumb.jpg',
      isPublished: true,
    },
    {
      title: '어린이 근시 예방법',
      description: '스마트폰 사용이 늘어난 어린이들의 근시 예방을 위한 생활 습관을 소개합니다.',
      tags: [
        { id: 'tag_pediatric', name: '소아안과', category: 'specialty' as any },
        { id: 'tag_myopia', name: '근시', category: 'specialty' as any },
      ],
      images: [],
      thumbnail: '/cartoons/sample2_thumb.jpg',
      isPublished: true,
    },
    {
      title: '안구건조증 관리법',
      description: '현대인의 고질병, 안구건조증을 효과적으로 관리하는 방법을 알려드립니다.',
      tags: [
        { id: 'tag_dry', name: '건조증', category: 'condition' as any },
        { id: 'tag_itching', name: '가려움', category: 'condition' as any },
      ],
      images: [],
      thumbnail: '/cartoons/sample3_thumb.jpg',
      isPublished: true,
    },
  ];
  
  // 기존 데이터가 없을 때만 생성
  const existing = getCartoons();
  if (existing.length === 0) {
    sampleCartoons.forEach(cartoon => createCartoon(cartoon));
  }
};

// 데이터 초기화 (개발용)
export const clearCartoonData = (): void => {
  localStorage.removeItem(CARTOON_STORAGE_KEYS.CARTOONS);
  localStorage.removeItem(CARTOON_STORAGE_KEYS.COMMENTS);
  localStorage.removeItem(CARTOON_STORAGE_KEYS.ADMIN_AUTH);
};