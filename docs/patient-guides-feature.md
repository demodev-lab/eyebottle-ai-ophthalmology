# 환자 안내자료 기능 (Patient Guides Feature)

## 개요
환자 안내자료 기능은 의료진이 환자에게 제공하는 각종 안내문서, 교육자료, 동영상 등을 체계적으로 관리하고 배포할 수 있는 게시판 시스템입니다.

## 주요 기능

### 1. 공개 페이지 (/patient-guides)
- 환자가 안내자료를 검색하고 열람할 수 있는 페이지
- 카테고리별, 질환별, 태그별 필터링
- 검색 기능
- 조회수/다운로드수 표시
- 테이블 형식의 목록 표시

### 2. 상세 보기 페이지 (/patient-guides/[id])
- 개별 안내자료의 상세 내용 표시
- PDF 파일 다운로드
- YouTube 동영상 임베드
- 인쇄 기능
- 공유 기능
- 조회수 자동 증가

### 3. 관리자 페이지 (/patient-guides/admin)
- 비밀번호 인증 (기본: eyebottle2024!)
- 안내자료 CRUD 작업
- 파일 업로드 (PDF)
- 공개/비공개 설정
- 통계 대시보드

## 기술 스택
- Next.js 15 (App Router)
- TypeScript
- LocalStorage (데이터 저장)
- Tailwind CSS (스타일링)

## 파일 구조
```
src/
├── types/
│   └── patient-guide.ts          # 타입 정의
├── lib/
│   └── patient-guide-storage.ts  # 스토리지 관리 함수
├── app/
│   ├── patient-guides/
│   │   ├── page.tsx             # 목록 페이지
│   │   ├── [id]/
│   │   │   └── page.tsx         # 상세 페이지
│   │   └── admin/
│   │       └── page.tsx         # 관리자 페이지
│   └── api/
│       └── upload/
│           └── route.ts         # 파일 업로드 API
public/
└── guides/                      # 업로드된 파일 저장 경로
    ├── sample_cataract_guide.html
    └── sample_glaucoma_guide.html
```

## 데이터 구조
```typescript
interface PatientGuide {
  id: string;                    // UUID
  title: string;                 // 제목
  description: string;           // 설명
  primaryCategory: string;       // 주 카테고리 (용도별)
  secondaryCategories: string[]; // 부 카테고리 (질환별)
  tags: string[];               // 태그
  contentType: string;          // PDF, VIDEO, MIXED
  files: GuideFile[];           // 첨부 파일
  youtubeUrl?: string;          // YouTube URL
  viewCount: number;            // 조회수
  downloadCount: number;        // 다운로드수
  isPublished: boolean;         // 공개 여부
  order: number;                // 정렬 순서
  createdAt: string;            // 생성일
  updatedAt: string;            // 수정일
}
```

## 사용 방법

### 1. 관리자 로그인
1. `/patient-guides` 페이지에서 "관리자" 버튼 클릭
2. 비밀번호 입력: `eyebottle2025`

### 2. 안내자료 추가
1. 관리자 페이지에서 "새 자료 추가" 버튼 클릭
2. 제목, 설명, 카테고리 입력
3. PDF 파일 업로드 또는 YouTube URL 입력
4. 공개 여부 설정
5. "추가" 버튼 클릭

### 3. 안내자료 수정/삭제
1. 관리자 페이지의 목록에서 수정/삭제 아이콘 클릭
2. 수정 시 기존 정보를 변경 후 저장
3. 삭제 시 확인 후 영구 삭제

## 향후 개선사항
1. Supabase 연동으로 백엔드 데이터베이스 구축
2. 실제 PDF 파일 업로드 및 미리보기
3. 다중 파일 업로드
4. 버전 관리 시스템
5. 카테고리 관리 기능
6. 통계 분석 강화
7. 모바일 최적화

## 주의사항
- 현재 LocalStorage를 사용하므로 브라우저별로 데이터가 독립적으로 저장됨
- 업로드된 파일은 `/public/guides` 디렉토리에 저장됨
- 파일 크기 제한: 10MB
- 지원 파일 형식: PDF

## 문제 해결
- 파일 업로드 실패 시: 파일 크기와 형식 확인
- 관리자 로그인 실패 시: 비밀번호 확인 (eyebottle2025)
- 데이터가 보이지 않을 때: 브라우저 LocalStorage 확인