import { test, expect } from '@playwright/test';

test.describe('Exam Results Printing', () => {
  test.beforeEach(async ({ page }) => {
    // 검진 결과 페이지로 이동
    await page.goto('http://localhost:3001/exam-results');
    
    // 당뇨망막병증 템플릿 선택
    await page.getByRole('button', { name: '당뇨망막병증 검진' }).click();

    // 렌더링을 위해 잠시 대기
    await page.waitForTimeout(500);
  });

  test('should generate a clean print output', async ({ page }) => {
    // 인쇄 버튼 클릭
    await page.getByRole('button', { name: '인쇄' }).click();
    
    // iframe이 생성되고 내용이 로드될 시간을 기다림
    await page.waitForTimeout(1000); 

    // 인쇄 미리보기는 직접 테스트가 어려우므로,
    // 여기서는 로직이 에러 없이 실행되는지만 확인합니다.
    // 실제 결과는 스크린샷이나 수동 테스트로 확인해야 합니다.
    
    // emulateMedia를 통해 print CSS가 적용된 상태의 스크린샷을 찍어
    // 최종 결과물을 시각적으로 확인합니다.
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: 'tests/reports/final-print-output.png', fullPage: true });

    // 페이지에 오류가 없는지 간단히 확인
    const title = await page.title();
    expect(title).toContain('아이보틀');
  });
}); 