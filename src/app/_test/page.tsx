// Shadcn/ui 컴포넌트 테스트 페이지 - 기존 홈페이지 디자인과 조화롭게 구성
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from "@/components/ui/card"
import { FilmIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* 헤더 */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
              Shadcn/ui 테스트 페이지
            </h1>
            <Button variant="eyebottle" size="lg">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Shadcn/ui</span> × 아이보틀
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            기존 디자인과 완벽하게 조화되는 새로운 컴포넌트들
          </p>
        </div>

        {/* 버튼 테스트 섹션 */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">버튼 컴포넌트</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="default">기본 버튼</Button>
            <Button variant="eyebottle" size="lg">아이보틀 그라데이션</Button>
            <Button variant="glass" size="lg">글래스모피즘</Button>
            <Button variant="outline">아웃라인</Button>
            <Button variant="secondary">보조</Button>
          </div>
        </section>

        {/* 카드 테스트 섹션 */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">카드 컴포넌트</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 기존 스타일 글래스 카드 */}
            <GlassCard className="p-8 lg:p-10 text-center">
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FilmIcon className="w-8 h-8 lg:w-10 lg:h-10 text-pink-600" />
              </div>
              <h4 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">글래스모피즘 카드</h4>
              <p className="text-base lg:text-lg text-slate-600 mb-6 leading-relaxed">
                기존 아이보틀 디자인과 동일한 스타일
              </p>
              <Button variant="eyebottle" size="sm">
                자세히 보기
              </Button>
            </GlassCard>

            {/* 표준 Shadcn 카드 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>표준 Shadcn 카드</CardTitle>
                <CardDescription>
                  기본 Shadcn/ui 스타일
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  새로운 기능 개발 시 사용할 수 있는 표준 카드입니다.
                </p>
                <Button variant="outline" className="w-full">
                  표준 버튼
                </Button>
              </CardContent>
            </Card>

            {/* 혼합 스타일 카드 */}
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800">혼합 스타일</CardTitle>
                <CardDescription className="text-slate-600">
                  Shadcn + 아이보틀 스타일 믹스
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  두 스타일의 장점을 모두 활용한 카드입니다.
                </p>
                <div className="space-y-2">
                  <Button variant="eyebottle" size="sm" className="w-full">
                    아이보틀 스타일
                  </Button>
                  <Button variant="glass" size="sm" className="w-full">
                    글래스 스타일
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 결과 요약 */}
        <section className="text-center">
          <GlassCard className="p-8 lg:p-10 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
              ✅ 호환성 테스트 완료
            </h3>
            <p className="text-lg text-slate-600 mb-8">
              Shadcn/ui 컴포넌트들이 기존 아이보틀 디자인과 완벽하게 조화롭게 작동합니다!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="eyebottle" size="lg">
                메인 홈페이지로
              </Button>
              <Button variant="glass" size="lg">
                개발 계속하기
              </Button>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  )
} 