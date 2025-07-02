# Supabase 마이그레이션 고려사항

## 현재 localStorage 기반 시스템의 한계

### 1. 도메인 간 데이터 격리
- **문제**: 개발 서버(localhost)와 프로덕션(도메인)의 localStorage가 분리됨
- **증상**: 같은 데이터가 환경에 따라 다르게 보임
- **해결**: Supabase DB로 중앙화

### 2. 데이터 동기화 문제
- **문제**: 브라우저별로 독립적인 데이터 저장
- **증상**: 다른 기기에서 접근 시 데이터 없음
- **해결**: 클라우드 기반 실시간 동기화

### 3. 데이터 무결성
- **문제**: 클라이언트 측에서만 데이터 검증
- **증상**: 잘못된 데이터 형식이 저장될 수 있음
- **해결**: DB 레벨 제약조건 및 트리거

## 마이그레이션 시 주의사항

### 1. 데이터 마이그레이션
```typescript
// 기존 localStorage 데이터 추출
const migrateData = async () => {
  const patients = JSON.parse(localStorage.getItem('myocare_patients') || '[]');
  const visits = JSON.parse(localStorage.getItem('myocare_visits') || '[]');
  
  // Supabase로 일괄 삽입
  await supabase.from('patients').insert(patients);
  await supabase.from('visits').insert(visits);
};
```

### 2. SE 값 재계산 로직 유지
- 현재 구현된 SE 재계산 로직을 DB 트리거로 구현
- 기존 데이터에 대한 일괄 업데이트 스크립트 필요

### 3. 실시간 동기화 구현
```typescript
// Supabase 실시간 구독
const subscription = supabase
  .from('visits')
  .on('*', (payload) => {
    console.log('Change received!', payload);
    // UI 업데이트
  })
  .subscribe();
```

### 4. 에러 핸들링 강화
- 네트워크 오류 처리
- 권한 오류 처리
- 낙관적 업데이트 패턴 적용

## 현재 구현된 디버깅 기능 활용

### 콘솔 로그 확인 방법
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 '[MyoCare]'로 필터링
3. 다음 로그 확인:
   - `[MyoCare] SE 값 재계산 필요`: SE 값이 누락된 데이터 발견
   - `[MyoCare] 진행률 계산 시작`: 진행률 계산 입력 데이터
   - `[MyoCare] 진행률 계산 결과`: 계산된 진행률 값
   - `[MyoCare Chart] 방문 기록 로드`: 로드된 방문 데이터

### 일반적인 문제 해결
1. **진행률이 '-'로 표시되는 경우**
   - Console에서 SE 값이 undefined인지 확인
   - 방문 기록이 2개 이상인지 확인
   - 검사 간격이 90일 이상인지 확인

2. **데이터가 보이지 않는 경우**
   - localStorage 데이터 확인: `localStorage.getItem('myocare_visits')`
   - 사용자 ID 일치 여부 확인

## Supabase 전환 후 개선사항

1. **데이터 일관성**: 모든 환경에서 동일한 데이터 접근
2. **실시간 협업**: 여러 사용자가 동시에 데이터 업데이트
3. **백업 및 복구**: 자동 백업 및 포인트 인 타임 복구
4. **확장성**: 대용량 데이터 처리 가능
5. **보안**: Row Level Security로 데이터 접근 제어

## 마이그레이션 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] 테이블 스키마 생성
- [ ] RLS 정책 설정
- [ ] 기존 데이터 마이그레이션 스크립트 작성
- [ ] API 연동 코드 작성
- [ ] 실시간 동기화 구현
- [ ] 에러 핸들링 강화
- [ ] 성능 최적화
- [ ] 테스트 및 검증