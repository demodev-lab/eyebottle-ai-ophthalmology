// 베타테스터 신청 데이터를 노션 데이터베이스에 추가하는 서버 액션입니다.
'use server';

import { notion } from '@/lib/notion';
import { revalidatePath } from 'next/cache';

// 노션 데이터베이스에 새로운 베타테스터 정보를 추가하는 함수
export async function addBetaTesterToNotion(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // 이름과 이메일이 비어 있는지 확인합니다.
  if (!name || !email) {
    return { message: '이름과 이메일은 필수입니다.', type: 'error' };
  }

  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const apiKey = process.env.NOTION_API_KEY;

    // === 디버깅: 환경 변수 상태 확인 ===
    console.log('=== 디버깅 정보 ===');
    console.log('NOTION_DATABASE_ID 존재:', !!databaseId);
    console.log('NOTION_API_KEY 존재:', !!apiKey);
    
    if (!databaseId) {
      return { 
        message: '❌ 배포 환경 설정 오류: NOTION_DATABASE_ID가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.', 
        type: 'error' 
      };
    }

    if (!apiKey) {
      return { 
        message: '❌ 배포 환경 설정 오류: NOTION_API_KEY가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.', 
        type: 'error' 
      };
    }

    console.log('환경 변수 모두 로드됨, Notion API 호출 시도...');

    // Notion API를 호출하여 페이지를 생성합니다.
    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        // 중요: Notion DB의 '이름' 컬럼(속성)이 Title 타입이어야 합니다.
        '이름': { 
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        // 중요: Notion DB의 '이메일' 컬럼(속성)이 Email 타입이어야 합니다.
        '이메일': { 
          email: email,
        },
      },
    });

    console.log('✅ Notion API 호출 성공');
    revalidatePath('/'); // 데이터 추가 후 캐시를 갱신합니다.
    return { message: `${name}님의 베타테스터 신청이 접수되었습니다!`, type: 'success' };

  } catch (error) {
    console.error('❌ Notion API 상세 오류:', error);
    
    // 더 구체적인 오류 메시지 제공
    if (error instanceof Error) {
      return { 
        message: `신청 제출 중 오류가 발생했습니다: ${error.message}`, 
        type: 'error' 
      };
    }
    
    return { 
      message: '신청 제출 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 
      type: 'error' 
    };
  }
} 