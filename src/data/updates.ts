// 업데이트 노트 데이터 관리
// 이 파일을 수정하면 자동으로 홈페이지에 반영됩니다.

export interface UpdateItem {
  id: string;
  version: string;
  date: string;
  category: 'new' | 'improved' | 'fixed' | 'security';
  title: string;
  description: string;
  highlights?: string[]; // 주요 변경사항 3개
  image?: string; // 스크린샷 (선택)
}

// 최신 5개의 주요 업데이트만 표시
export const updates: UpdateItem[] = [
  {
    id: 'v1.4.0',
    version: 'v1.4.0',
    date: '2025년 7월 4일',
    category: 'new',
    title: '환자 안내자료 기능 출시',
    description: '수술 전후 안내, 질환 정보, 검사 안내 등 다양한 자료를 체계적으로 관리하고 제공합니다.',
    highlights: [
      '6가지 카테고리별 자료 분류',
      'PDF 다운로드 및 YouTube 동영상 지원',
      '관리자 페이지로 간편한 자료 관리'
    ]
  },
  {
    id: 'v1.3.5',
    version: 'v1.3.5',
    date: '2025년 1월 29일',
    category: 'improved',
    title: '눈종합검진 결과서 용어 개선',
    description: '환자가 이해하기 쉽도록 의학 용어를 한글로 변경했습니다.',
    highlights: [
      'OD/OS → 우안/좌안으로 변경',
      '정밀검사 영어 용어 한글화',
      '입력 폼 라벨도 동일하게 적용'
    ]
  },
  {
    id: 'v1.3.0',
    version: 'v1.3.0',
    date: '2025년 1월 28일',
    category: 'new',
    title: '근시케어 차트 EMR 연동',
    description: 'MyoCare 차트에서 EMR 템플릿 기반 복사 기능을 추가했습니다.',
    highlights: [
      'EMR 템플릿 복사 버튼 추가',
      '안경처방 변수 지원',
      '버튼 UI/UX 대폭 개선'
    ]
  },
  {
    id: 'v1.2.5',
    version: 'v1.2.5',
    date: '2025년 1월 2일',
    category: 'improved',
    title: '눈종합검진 대규모 개선',
    description: '검진결과 작성 시스템의 위험도 평가와 자동화 기능을 크게 개선했습니다.',
    highlights: [
      '위험도 시스템 개편 (4단계)',
      '자동연동 시스템 구현',
      '인쇄 레이아웃 최적화'
    ]
  },
  {
    id: 'v1.2.0',
    version: 'v1.2.0',
    date: '2024년 12월 30일',
    category: 'new',
    title: '퀵 네비게이션 시스템',
    description: '모든 페이지에서 주요 기능에 빠르게 접근할 수 있는 메뉴를 추가했습니다.',
    highlights: [
      '10개 주요 기능 원클릭 접근',
      '현재 페이지 하이라이트',
      'ESC 키로 닫기 지원'
    ]
  },
  {
    id: 'v1.1.0',
    version: 'v1.1.0',
    date: '2024년 12월 15일',
    category: 'new',
    title: '검진결과 작성 시스템 출시',
    description: '당뇨망막병증, 고혈압망막병증, 눈종합검진 결과를 실시간으로 작성할 수 있습니다.',
    highlights: [
      '실시간 미리보기 지원',
      'A4 최적화 인쇄 레이아웃',
      '자동 멘트 시스템'
    ]
  },
  {
    id: 'v1.0.0',
    version: 'v1.0.0',
    date: '2024년 11월 1일',
    category: 'new',
    title: '아이보틀 베타 서비스 오픈',
    description: 'AI 기반 안과 진료 워크플로우 자동화 도구가 베타 서비스를 시작합니다.',
    highlights: [
      '8가지 핵심 AI 도구 제공',
      '글래스모피즘 디자인 적용',
      '완전 반응형 웹 지원'
    ]
  }
];

// 카테고리별 스타일 설정
export const categoryStyles = {
  new: {
    label: 'NEW',
    icon: '🚀',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  improved: {
    label: 'IMPROVED',
    icon: '✨',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  fixed: {
    label: 'FIXED',
    icon: '🛠️',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  security: {
    label: 'SECURITY',
    icon: '🔒',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  }
};