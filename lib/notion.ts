// Notion 클라이언트를 초기화하고 설정하는 코드입니다.
import { Client } from '@notionhq/client';

// .env 파일에 저장된 노션 API 키를 사용하여 클라이언트를 초기화합니다.
// 이 키는 서버에서만 사용되므로 클라이언트에 노출되지 않습니다.
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
}); 