# Supabase MCP 사용 가이드

## 개요

Supabase MCP(Model Context Protocol)는 AI 도구와 Supabase를 연결하는 표준 프로토콜입니다. 이를 통해 Claude Code와 같은 AI 어시스턴트가 사용자를 대신하여 Supabase 프로젝트와 상호작용하고 쿼리를 실행할 수 있습니다.

## 설치 방법

### 1단계: 개인 액세스 토큰(PAT) 생성

1. [Supabase 설정](https://supabase.com/dashboard/account/tokens)으로 이동
2. 개인 액세스 토큰 생성 (예: "Claude Code MCP Server")
3. 토큰을 안전하게 보관

### 2단계: Claude Code에서 설정

#### 옵션 1: 프로젝트 수준 설정 (.mcp.json)

프로젝트 루트에 `.mcp.json` 파일 생성:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=<프로젝트-참조>"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<개인-액세스-토큰>"
      }
    }
  }
}
```

#### 옵션 2: 로컬 설정 (CLI 명령)

```bash
claude mcp add supabase -s local -e SUPABASE_ACCESS_TOKEN=your_token_here -- npx -y @supabase/mcp-server-supabase@latest
```

## 사용 가능한 도구

### 계정 관리
- `mcp__supabase__list_projects` - 모든 Supabase 프로젝트 목록 조회
- `mcp__supabase__get_project` - 프로젝트 세부 정보 조회
- `mcp__supabase__create_project` - 새 Supabase 프로젝트 생성
- `mcp__supabase__pause_project` - 프로젝트 일시 중지
- `mcp__supabase__restore_project` - 프로젝트 복원
- `mcp__supabase__list_organizations` - 사용자 조직 목록 조회
- `mcp__supabase__get_organization` - 조직 세부 정보 조회

### 데이터베이스 관리
- `mcp__supabase__list_tables` - 스키마의 테이블 목록 조회
- `mcp__supabase__list_extensions` - 데이터베이스 확장 목록 조회
- `mcp__supabase__list_migrations` - 데이터베이스 마이그레이션 목록 조회
- `mcp__supabase__apply_migration` - SQL 마이그레이션 적용 (스키마 변경)
- `mcp__supabase__execute_sql` - 데이터베이스 쿼리 실행 (스키마 수정 제외)

### 문서 검색
- `mcp__supabase__search_docs` - Supabase 공식 문서 검색

### 디버깅 도구
- `mcp__supabase__get_logs` - 서비스 유형별 로그 조회
- `mcp__supabase__get_advisors` - 보안/성능 권고사항 확인

### 개발 도구
- `mcp__supabase__get_project_url` - 프로젝트 API URL 조회
- `mcp__supabase__get_anon_key` - 익명 API 키 조회
- `mcp__supabase__generate_typescript_types` - 데이터베이스 스키마에서 TypeScript 타입 생성

### Edge Functions
- `mcp__supabase__list_edge_functions` - 프로젝트의 Edge Functions 목록 조회
- `mcp__supabase__deploy_edge_function` - 새 함수 배포 또는 기존 함수 업데이트

### 브랜치 관리 (실험적)
- `mcp__supabase__create_branch` - 개발 브랜치 생성
- `mcp__supabase__list_branches` - 개발 브랜치 목록 조회
- `mcp__supabase__delete_branch` - 브랜치 삭제
- `mcp__supabase__merge_branch` - 브랜치를 프로덕션에 병합
- `mcp__supabase__reset_branch` - 브랜치 마이그레이션 재설정
- `mcp__supabase__rebase_branch` - 마이그레이션 드리프트 처리

### 스토리지 관리
- `mcp__supabase__list_storage_buckets` - 스토리지 버킷 목록 조회
- `mcp__supabase__get_storage_config` - 스토리지 설정 조회
- `mcp__supabase__update_storage_config` - 스토리지 설정 업데이트

## 사용 예시

### 프로젝트 목록 조회
```
Claude: Supabase 프로젝트 목록을 보여주세요.
```

### 테이블 생성
```
Claude: users 테이블을 생성해주세요. id (uuid), name (text), email (text), created_at (timestamp) 컬럼을 포함해주세요.
```

### TypeScript 타입 생성
```
Claude: 현재 데이터베이스 스키마에서 TypeScript 타입을 생성해주세요.
```

### 로그 확인
```
Claude: 최근 API 로그를 보여주세요.
```

### Edge Function 배포
```
Claude: hello-world라는 Edge Function을 만들어 "Hello from Supabase Edge!"를 반환하도록 해주세요.
```

## 보안 고려사항

1. **읽기 전용 모드**: 기본적으로 `--read-only` 옵션을 사용하여 데이터베이스에 대한 의도하지 않은 변경을 방지합니다.
2. **프로젝트 범위**: `--project-ref` 옵션으로 특정 프로젝트로 액세스를 제한할 수 있습니다.
3. **토큰 보안**: 개인 액세스 토큰을 절대 코드나 버전 관리 시스템에 포함시키지 마세요.

## 문제 해결

- **연결 실패**: 토큰이 올바른지, 네트워크 연결이 정상인지 확인하세요.
- **권한 오류**: 토큰에 필요한 권한이 있는지 확인하세요.
- **버그 리포트**: 문제가 발생하면 [GitHub Issues](https://github.com/supabase-community/supabase-mcp/issues/new?template=1.Bug_report.md)에 보고하세요.

## 로컬 Supabase 인스턴스 연결

로컬 Supabase를 사용하는 경우 Postgres MCP 서버를 사용할 수 있습니다:

1. 연결 문자열 확인:
   ```bash
   supabase status
   ```

2. DB URL 복사 후 Postgres MCP 서버 설정:
   ```json
   {
     "mcpServers": {
       "postgres-local": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-postgres"],
         "env": {
           "POSTGRES_CONNECTION_STRING": "<DB-URL>"
         }
       }
     }
   }
   ```

## 에러 핸들링 및 디버깅

### 1. 로그 수준 설정
프로덕션 환경에서는 로그 노이즈를 줄이기 위해 ERROR 수준으로 설정:
```sql
ALTER ROLE postgres SET log_min_messages TO 'ERROR';
```

### 2. API 에러 분석
#### Edge 로그에서 에러 찾기
```sql
select  
  cast(timestamp as datetime) as timestamp,
  status_code,
  event_message,
  path
from edge_logs
  cross join unnest(metadata) as metadata
  cross join unnest(response) as response
  cross join unnest(request) as request
where status_code >= 400
  and regexp_contains(path, '^/rest/v1/')
order by timestamp desc;
```

#### Postgres 로그에서 에러 추적
```sql
select  
  cast(postgres_logs.timestamp as datetime) as timestamp,
  error_severity,
  user_name,
  query,
  detail,
  sql_state_code
from postgres_logs  
  cross join unnest(metadata) as metadata  
  cross join unnest(metadata.parsed) as parsed
where regexp_contains(parsed.error_severity, 'ERROR|FATAL|PANIC')
  and parsed.user_name = 'authenticator'
order by timestamp desc
limit 100;
```

### 3. Edge Function 에러 모니터링
Sentry 통합 예시:
```typescript
import * as Sentry from 'https://deno.land/x/sentry/index.mjs'

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
})

Sentry.setTag('region', Deno.env.get('SB_REGION'))
Sentry.setTag('execution_id', Deno.env.get('SB_EXECUTION_ID'))

Deno.serve(async (req) => {
  try {
    // 비즈니스 로직
  } catch (e) {
    Sentry.captureException(e)
    return new Response(JSON.stringify({ msg: 'error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

## Row Level Security (RLS) 최적화

### 1. 성능 최적화 기법

#### 인덱스 추가
```sql
-- user_id 컬럼에 인덱스 추가 (100x 성능 향상 가능)
create index userid on test_table using btree (user_id);
```

#### 함수 호출 최적화
```sql
-- ❌ 나쁜 예: 매 행마다 함수 실행
create policy "rls_test_select" on test_table
to authenticated
using ( auth.uid() = user_id );

-- ✅ 좋은 예: SELECT로 감싸서 캐싱
create policy "rls_test_select" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
```

#### Security Definer 함수 활용
```sql
-- RLS 우회를 위한 security definer 함수
CREATE OR REPLACE FUNCTION has_role()
RETURNS boolean as $$
begin
  return exists (
    select 1 from roles_table 
    where auth.uid() = user_id 
    and role = 'good_role'
  );
end;
$$ language plpgsql security definer;

-- 정책에서 사용
create policy "role_based_access" on test_table
to authenticated
using ( has_role() );
```

### 2. RLS 정책 디버깅
```sql
-- PostgREST에서 쿼리 계획 확인 활성화 (개발 환경만)
alter role authenticator set pgrst.db_plan_enabled to true;
NOTIFY pgrst, 'reload config';

-- EXPLAIN ANALYZE로 성능 측정
set session role authenticated;
set request.jwt.claims to '{"role":"authenticated", "sub":"user-uuid"}';
explain analyze SELECT count(*) FROM your_table;
set session role postgres;
```

## 프로덕션 배포 전략

### 1. 브랜치 기반 개발 워크플로우

#### 개발 브랜치 생성
```
Claude: Supabase 개발 브랜치를 생성해주세요.
```
- 프로덕션의 모든 마이그레이션이 복제됨
- 데이터는 포함되지 않음
- 시간당 $0.01344 비용 발생

#### 브랜치에서 작업
```
Claude: develop 브랜치에 새 테이블을 생성하고 마이그레이션을 적용해주세요.
```

#### 프로덕션으로 병합
```
Claude: develop 브랜치를 프로덕션에 병합해주세요.
```
- 증분적으로 마이그레이션 적용
- 에러 발생 시 자동 중단

### 2. 마이그레이션 관리

#### 마이그레이션 생성 및 적용
```sql
-- DDL 작업은 apply_migration 사용
Claude: users 테이블에 profile_image 컬럼을 추가하는 마이그레이션을 생성해주세요.

-- DML 작업은 execute_sql 사용 (읽기 전용 모드에서는 제한됨)
Claude: 특정 조건의 데이터를 조회해주세요.
```

#### 마이그레이션 히스토리 복구
```bash
# 마이그레이션 상태 확인
supabase migration list

# 문제가 있는 마이그레이션 복구
supabase migration repair 20230103054303 --status reverted
```

#### 마이그레이션 스쿼시
```bash
# 여러 마이그레이션을 하나로 통합
supabase migration squash
```

### 3. 롤백 전략

**중요**: 프로덕션에서는 절대 `reset_branch` 사용 금지!

#### 안전한 롤백 방법
```sql
-- 새로운 마이그레이션으로 이전 변경사항 되돌리기
Claude: 이전에 추가한 컬럼을 제거하는 마이그레이션을 생성해주세요.
```

## 모니터링 및 로깅

### 1. 실시간 로그 확인
```
Claude: 최근 1분간의 API 로그를 보여주세요.
Claude: Postgres 에러 로그를 확인해주세요.
Claude: Edge Function 실행 로그를 보여주세요.
```

### 2. 보안 및 성능 권고사항
```
Claude: 보안 권고사항을 확인해주세요.
Claude: 성능 개선 권고사항을 보여주세요.
```

### 3. 쿼리 성능 분석
```sql
-- 느린 쿼리 식별
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY mean_time DESC
LIMIT 10;
```

## 트랜잭션 및 재시도 로직

### 1. 트랜잭션 모드 연결
Supavisor를 통한 연결 풀링 (포트 6543):
```
postgres://[DB-USER].[PROJECT REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 2. 재시도 로직 구현
```typescript
async function retryableQuery(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      // 지수 백오프
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

## 장기 유지보수 베스트 프랙티스

### 1. 스키마 버전 관리
- 모든 스키마 변경은 마이그레이션으로 추적
- 의미 있는 마이그레이션 이름 사용
- 데이터 마이그레이션과 스키마 마이그레이션 분리

### 2. 환경 분리
```json
// 개발 환경 (.mcp.local.json)
{
  "mcpServers": {
    "supabase-dev": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=dev-project-ref"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<dev-token>"
      }
    }
  }
}
```

### 3. 정기적인 유지보수
- 주기적으로 `supabase db lint` 실행
- 미사용 인덱스 정리
- WAL 크기 모니터링
- 정기적인 VACUUM 작업

### 4. 문서화
- 각 테이블과 컬럼에 COMMENT 추가
- RLS 정책에 대한 설명 포함
- 복잡한 쿼리나 함수에 주석 추가

```sql
COMMENT ON TABLE users IS '사용자 정보 테이블';
COMMENT ON COLUMN users.email IS '사용자 이메일 (유니크)';
COMMENT ON POLICY "users_self_access" ON users IS '사용자는 자신의 정보만 조회 가능';
```

### 5. 타입 안전성
```
Claude: TypeScript 타입을 생성해주세요.
```
생성된 타입을 프로젝트에 통합하여 타입 안전성 확보

## 추가 리소스

- [Supabase MCP GitHub 저장소](https://github.com/supabase-community/supabase-mcp)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase RLS 성능 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase 마이그레이션 가이드](https://supabase.com/docs/guides/cli/managing-environments)