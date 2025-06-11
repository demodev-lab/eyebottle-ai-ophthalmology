# CHANGELOG

## [2024-01-XX] - Vercel 배포 최적화

### 🔧 Fixed
- **라우팅 충돌 해결**: `src/app/test/` 폴더를 `src/app/_test/`로 변경
  - Next.js App Router에서 발생하던 빌드 오류 해결
  - 테스트 페이지가 프로덕션 라우팅에서 제외됨

### ✨ Benefits
- **배포 안정성 향상**: Vercel 자동 배포 시 빌드 오류 제거
- **개발 효율성**: 테스트 컴포넌트는 유지하면서 프로덕션에서는 제외
- **SEO 최적화**: 불필요한 테스트 페이지가 검색엔진에 노출되지 않음
- **보안 강화**: 내부 테스트 페이지가 외부 접근으로부터 보호됨

### 📁 File Changes
- `src/app/test/` → `src/app/_test/`
- Shadcn/ui 테스트 컴포넌트는 개발 환경에서 계속 접근 가능

### 🚀 Deployment
- GitHub 푸시 시 Vercel 자동 배포 활성화
- Next.js 15.3.3 + TypeScript + Tailwind CSS 스택 유지

---

// ... existing code ... 