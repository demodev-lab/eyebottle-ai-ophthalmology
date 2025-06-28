import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Resend 인스턴스 생성 - API 키는 환경변수에서 가져옴
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 데이터 추출
    const { name, email, subject, message } = await request.json();

    // 필수 필드 검증
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 전송
    const data = await resend.emails.send({
      from: 'Eyebottle <onboarding@resend.dev>', // 기본 발신자 (도메인 인증 전까지 사용)
      to: ['lee@eyebottle.kr'], // 수신자 (문의를 받을 이메일)
      subject: `[아이보틀 문의] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            새로운 문의가 도착했습니다
          </h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>보낸 사람:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>이메일:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>제목:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">문의 내용:</h3>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>이 메일은 아이보틀 웹사이트의 문의 폼을 통해 자동으로 전송되었습니다.</p>
            <p>답장은 ${email}로 보내주세요.</p>
          </div>
        </div>
      `,
      // 답장 받을 이메일 설정
      reply_to: email,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('이메일 전송 오류:', error);
    return NextResponse.json(
      { error: '이메일 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}