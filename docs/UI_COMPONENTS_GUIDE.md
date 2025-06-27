# 📦 UI 컴포넌트 종합 가이드

## 🎯 목적
아이보틀 프로젝트의 모든 UI 컴포넌트를 체계적으로 관리하고, 디자인 일관성을 유지하기 위한 종합 가이드

---

## 🧭 공통 컴포넌트 (`src/components/common/`)

### 1. 데모영상 버튼 (`demo-video-button.tsx`)

#### 기본 사용법
```tsx
import { DemoVideoButton } from '@/components/common/demo-video-button';

<DemoVideoButton 
  url="https://youtu.be/VIDEO_ID" 
  title="사용법 영상"
/>
```

#### 디자인 규칙
- **색상**: YouTube 빨간색 그라데이션 (`from-red-500 to-red-600`)
- **아이콘**: Play 아이콘 (Lucide React, filled)
- **애니메이션**: `hover:scale-105` + 그림자 효과

#### 적용 현황
- ✅ 검진결과 페이지 (`/exam-results`)
- ✅ 근시케어 대시보드 (`/myocare/dashboard`)
- ✅ 랜딩 페이지 (영상 리스트 모달)

### 2. 퀵 네비게이션 메뉴 (`quick-nav-menu.tsx`)

#### 기본 사용법
```tsx
import { QuickNavMenu } from '@/components/common/quick-nav-menu';

<QuickNavMenu />
```

#### 주요 특징
- **10개 주요 기능**: 홈, 검진결과, 근시케어 등
- **현재 페이지 하이라이트**: 진한 배경색 표시
- **상태 구분**: 활성화됨(흰 배경) vs 준비중(회색 배경)
- **Beta 배지**: 새로운 기능 표시

#### 기술적 구현
- **React Portal**: DOM 최상위 렌더링
- **z-index**: `z-[9998]` (오버레이), `z-[9999]` (메뉴)
- **ESC 키 지원**: 키보드 접근성
- **스크롤 제어**: 메뉴 열린 동안 배경 스크롤 방지

#### 적용 현황
- ✅ 랜딩 페이지: 데스크톱 네비게이션 + 모바일 메뉴
- ✅ 검진결과 페이지: 상단 네비게이션 우측
- ✅ 근시케어 차트: 헤더 우측 버튼 영역
- ✅ About 페이지: 우측 상단 코너

---

## 🔧 근시케어 컴포넌트 (`src/components/myocare/`)

### 헤더 컴포넌트 (`common/header.tsx`)
- 근시케어 차트 전체 페이지 공통 헤더
- 데모영상 버튼 + 퀵 네비게이션 메뉴 통합
- 마지막 업데이트 시간 표시

### 차트 컴포넌트 (`charts/`)
- 근시 진행도 차트
- 축장 길이 추이 그래프
- 시력 변화 차트

---

## 🎨 UI/UX 디자인 규칙

### 색상 팔레트
```css
/* 기본 색상 */
--primary: Blue (slate-blue-500~600)
--secondary: Red (red-500~600, YouTube 스타일)
--accent: Green (emerald-500~600)
--neutral: Slate (slate-100~900)

/* 상태별 색상 */
--success: emerald-500
--warning: yellow-500  
--error: red-500
--info: blue-500
```

### 그라데이션
```css
/* 데모영상 버튼 */
.demo-button {
  background: linear-gradient(to right, #ef4444, #dc2626);
}

/* 홈페이지 헤더 */
.hero-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 애니메이션
```css
/* 기본 트랜지션 */
.transition-base {
  transition: all 0.3s ease;
}

/* 호버 효과 */
.hover-scale {
  transform: scale(1.05);
}

/* 그림자 효과 */
.shadow-hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
```

---

## 📱 반응형 디자인

### 브레이크포인트
```css
/* Tailwind CSS 기본 */
sm: 640px   /* 모바일 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 화면 */
```

### 공통 패턴
```tsx
// 모바일 우선 디자인
<div className="w-full lg:w-1/2">
  
// 조건부 표시
<span className="hidden md:inline">데스크톱에서만 표시</span>
<br className="sm:hidden" /> {/* 모바일에서만 줄바꿈 */}

// 그리드 반응형
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## 🔧 개발 가이드라인

### 새 컴포넌트 추가 시 체크리스트

1. **컴포넌트 설계**
   - [ ] 재사용 가능한 구조로 설계
   - [ ] TypeScript 타입 정의
   - [ ] Props 인터페이스 명확히 정의

2. **디자인 일관성**
   - [ ] 기존 디자인 시스템 색상 사용
   - [ ] 표준 애니메이션 효과 적용
   - [ ] 반응형 디자인 고려

3. **접근성**
   - [ ] ARIA 라벨 추가
   - [ ] 키보드 네비게이션 지원
   - [ ] 스크린 리더 호환성

4. **성능**
   - [ ] 불필요한 리렌더링 방지
   - [ ] 적절한 메모이제이션
   - [ ] 이벤트 리스너 정리

5. **문서화**
   - [ ] JSDoc 주석 추가
   - [ ] 사용 예시 작성
   - [ ] 이 가이드 업데이트

### 공통 디자인 클래스

```tsx
// 버튼 기본 스타일
const buttonBaseStyles = "inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105";

// 카드 기본 스타일  
const cardBaseStyles = "bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg";

// 그라데이션 배경
const gradientBg = "bg-gradient-to-r from-blue-500 to-purple-600";
```

---

## 🔄 업데이트 히스토리

- **2024-12-30**: 데모영상 버튼 및 퀵 네비게이션 메뉴 통합 완료
- **2024-12-30**: UI 컴포넌트 종합 가이드 문서 생성
- **2024-12-30**: 디자인 시스템 표준화 및 문서화

---

💡 **참고**: 새로운 컴포넌트 추가 시 이 가이드를 업데이트하고, 디자인 일관성을 유지해주세요. 