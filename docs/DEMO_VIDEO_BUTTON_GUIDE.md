# 데모영상 버튼 디자인 가이드

## 🎯 목적
모든 기능 페이지에서 일관된 데모영상 버튼 경험 제공

## 🎨 디자인 규칙

### 색상
- **기본**: 빨간색 그라데이션 (`from-red-500 to-red-600`)
- **호버**: 더 진한 빨간색 (`from-red-600 to-red-700`)
- **이유**: YouTube 브랜드 컬러와 일치

### 아이콘
- **아이콘**: Play 아이콘 (Lucide React, filled)
- **크기**: `w-5 h-5` (20px)
- **효과**: 호버 시 흰색 원형 배경 확대 효과

### 위치
- **기본 위치**: 페이지 헤더 우측 상단
- **간격**: 다른 요소와 `space-x-4` (16px) 간격

### 애니메이션
- **기본**: `transition-all duration-300`
- **호버**: `hover:scale-105` (5% 확대)
- **그림자**: `shadow-md` → `hover:shadow-lg`

## 📍 적용 현황

### ✅ 완료
1. **검진결과 작성** (`/exam-results`)
   - 링크: `https://youtu.be/viqOYiEOBNI?si=DCX41YBhlBs2GKgB`
   - 위치: 상단 네비게이션 우측

2. **근시케어 대시보드** (`/myocare/dashboard`)
   - 링크: `https://youtu.be/pgTEwTZTKlk?si=vHAW42IClD6Q2Nvx`
   - 위치: 헤더 우측, 마지막 업데이트 정보 좌측

3. **랜딩 페이지** (`/`)
   - 영상 리스트 모달 방식
   - 검진결과 + 근시케어 영상 포함

### 🔄 예정
4. **환자 관리 페이지** (`/myocare/patients`)
5. **설정 페이지** (`/myocare/settings`)
6. **기타 기능 페이지들**

## 🔧 사용법

### 방법 1: 공통 컴포넌트 사용 (권장)
```tsx
import { DemoVideoButton } from '@/components/common/demo-video-button';

// 기본 사용
<DemoVideoButton url="https://youtu.be/VIDEO_ID" />

// 커스텀 제목
<DemoVideoButton 
  url="https://youtu.be/VIDEO_ID"
  title="사용법 영상"
/>

// 추가 스타일링
<DemoVideoButton 
  url="https://youtu.be/VIDEO_ID"
  className="ml-4"
/>
```

### 방법 2: 직접 구현
```tsx
import { Play } from 'lucide-react';

<a
  href="https://youtu.be/VIDEO_ID"
  target="_blank"
  rel="noopener noreferrer"
  className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
>
  <div className="relative mr-2">
    <Play className="w-5 h-5 fill-current" />
    <div className="absolute inset-0 bg-white/20 rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-300"></div>
  </div>
  <span className="font-medium">데모영상</span>
</a>
```

## 📝 콘텐츠 가이드라인

### 영상 제작
- **길이**: 3-7분 권장
- **형식**: 1080p, 16:9 비율
- **내용**: 핵심 기능 위주로 간결하게

### 썸네일
- **크기**: 480×270 (16:9 비율)
- **품질**: 고해상도, 선명한 이미지
- **텍스트**: 읽기 쉬운 폰트, 적절한 대비

### YouTube 설정
- **제목**: "기능명 - 사용법 가이드"
- **설명**: 상세한 사용법과 링크 포함
- **태그**: 관련 키워드 설정

## 🚀 새 기능 추가 시 체크리스트

1. **영상 제작 및 업로드**
   - [ ] 기능 데모 영상 제작
   - [ ] YouTube 업로드 및 설정
   - [ ] 링크 확인

2. **페이지에 버튼 추가**
   - [ ] 공통 컴포넌트 import
   - [ ] 헤더 우측에 버튼 배치
   - [ ] 반응형 레이아웃 확인

3. **랜딩 페이지 업데이트**
   - [ ] `demoVideos` 배열에 새 영상 추가
   - [ ] 썸네일 이미지 설정
   - [ ] 카테고리 색상 확인

4. **테스트**
   - [ ] 버튼 클릭 동작 확인
   - [ ] 모바일 반응형 확인
   - [ ] 애니메이션 효과 확인

## 🔄 업데이트 히스토리

- **2024-12-27**: 초기 가이드 작성
- **2024-12-27**: 검진결과, 근시케어 차트 적용 완료  
- **2024-12-27**: 공통 컴포넌트 생성
- **2024-12-30**: 퀵 네비게이션 메뉴 통합 완료
- **2024-12-30**: 모든 페이지 적용 및 사용자 경험 최적화

---

## 🧭 퀵 네비게이션 메뉴 통합

### 개요
데모영상 버튼과 함께 퀵 네비게이션 메뉴를 모든 페이지에 통합 적용했습니다.

### 주요 기능
- **햄버거 메뉴**: 우측에서 슬라이드 방식
- **10개 주요 기능**: 홈, 검진결과, 근시케어 등
- **현재 페이지 하이라이트**: 진한 배경색으로 표시
- **상태 구분**: 활성화됨 vs 준비중
- **Beta 배지**: 새로운 기능 표시

### 적용 페이지
1. **랜딩 페이지**: 데스크톱 네비게이션 + 모바일 메뉴
2. **검진결과 페이지**: 상단 네비게이션 우측
3. **근시케어 차트**: 헤더 우측 버튼 영역  
4. **About 페이지**: 우측 상단 코너

### 기술적 특징
- **React Portal**: DOM 최상위 렌더링으로 z-index 문제 해결
- **ESC 키 지원**: 키보드 접근성
- **이벤트 차단**: 클릭 전파 방지
- **스크롤 제어**: 메뉴 열린 동안 배경 스크롤 방지

---

💡 **참고**: 이 가이드는 새로운 기능이 추가될 때마다 업데이트됩니다. 