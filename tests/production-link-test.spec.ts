import { test, expect } from '@playwright/test';

test.describe('Production Site Navigation Test', () => {
  test('should navigate to /exam-results from homepage without errors', async ({ page }) => {
    // 에러를 감지하기 위한 리스너 설정
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', exception => {
      errors.push(exception.message);
    });

    // 1. 메인 페이지로 이동
    await page.goto('https://www.eyebottle.kr/');

    // 2. '검진결과 작성' 링크를 찾아서 클릭
    const link = page.getByRole('link', { name: '검진결과 작성' });
    await link.click();
    
    // 3. 페이지 URL이 변경되었는지 확인
    await expect(page).toHaveURL('https://www.eyebottle.kr/exam-results');

    // 4. 콘솔에 하이드레이션 관련 오류가 없었는지 확인
    const hasHydrationError = errors.some(e => e.includes('hydra') || e.includes('Warning: Expected server HTML to contain a matching'));
    expect(hasHydrationError).toBe(false, `Hydration error detected on console: ${errors.join('\\n')}`);
  });
}); 