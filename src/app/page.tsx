"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  FilmIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon,
  SparklesIcon,
  EnvelopeIcon,
  BookOpenIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  UserCircleIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* 헤더 네비게이션 */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src="/eyebottle-logo.png"
                  alt="아이보틀 로고"
                  width={44}
                  height={44}
                  className="rounded-xl shadow-sm"
                />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">아이보틀</h1>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-200">Beta</span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">주요 기능</a>
              <a href="#footer-nav" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">업데이트</a>
              <a href="#footer-nav" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">소개</a>
              <a href="#footer-nav" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">문의</a>
            </nav>
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-blue-600"
                aria-label="메뉴 열기"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-7 w-7" />
                ) : (
                  <Bars3Icon className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg absolute top-full left-0 w-full border-b border-slate-200/60 shadow-md">
            <nav className="container mx-auto px-6 lg:px-8 py-4 flex flex-col space-y-4">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 text-center rounded-lg hover:bg-slate-100">주요 기능</a>
              <a href="#footer-nav" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 text-center rounded-lg hover:bg-slate-100">업데이트</a>
              <a href="#footer-nav" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 text-center rounded-lg hover:bg-slate-100">소개</a>
              <a href="#footer-nav" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 text-center rounded-lg hover:bg-slate-100">문의</a>
            </nav>
          </div>
        )}
      </header>

      {/* 메인 히어로 섹션 */}
      <main className="container mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col xl:flex-row items-start justify-between gap-8 xl:gap-12 mb-32">
          {/* 좌측: 메인 콘텐츠 */}
          <div className="flex-1 text-center xl:text-left xl:max-w-2xl mx-auto xl:mx-0">
            {/* 메인 로고 */}
            <div className="flex justify-center xl:justify-start mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
                <Image
                  src="/eyebottle-logo.png"
                  alt="아이보틀 로고"
                  width={120}
                  height={120}
                  className="relative rounded-2xl shadow-lg ring-1 ring-slate-200/50"
                />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              반복 진료 작업,<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI로 3배 빠르게!</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-12 leading-relaxed font-light">
              문서작업·데이터 시각화를 한 곳에서
            </p>

            <div className="flex justify-center xl:justify-start">
              <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-indigo-700 ring-1 ring-blue-600/20">
                <span className="flex items-center space-x-2">
                  <span>데모 영상 보기</span>
                </span>
              </button>
            </div>
          </div>

          {/* 중앙: 공지사항 */}
          <div className="w-full xl:w-[380px] flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800">공지사항</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline transition-colors">더보기</button>
              </div>
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <p className="text-base font-semibold text-slate-800 mb-2 leading-relaxed">베타 테스트 참가자 모집 중</p>
                  <p className="text-sm text-slate-500 font-medium">2023.05.01</p>
                </div>
                <div className="border-b border-slate-100 pb-5">
                  <p className="text-base font-semibold text-slate-800 mb-2 leading-relaxed">아이보틀 v1.2 업데이트 안내</p>
                  <p className="text-sm text-slate-500 font-medium">2023.04.15</p>
                </div>
                <div className="pb-2">
                  <p className="text-base font-semibold text-slate-800 mb-2 leading-relaxed">학회 AI 윤리 가이드라인 발표</p>
                  <p className="text-sm text-slate-500 font-medium">2023.04.01</p>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 로그인 */}
          <div className="w-full xl:w-[340px] flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2">로그인</h3>
                <p className="text-sm text-slate-500 font-medium">아이보틀 계정으로 시작하세요</p>
              </div>
              
              <form className="space-y-6">
                {/* 이메일 입력 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">이메일</label>
                  <input 
                    type="email" 
                    placeholder="doctor@hospital.com"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* 비밀번호 입력 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">비밀번호</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* 로그인 옵션 */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/20" />
                    <span className="ml-2 text-sm text-slate-600 font-medium">로그인 상태 유지</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    비밀번호 찾기
                  </button>
                </div>

                {/* 로그인 버튼 */}
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700"
                >
                  로그인
                </button>

                {/* 구분선 */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/90 text-slate-500 font-medium">또는</span>
                  </div>
                </div>

                {/* 회원가입 링크 */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 font-medium">
                    계정이 없으신가요?{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                      회원가입
                    </button>
                  </p>
                </div>

                {/* 소셜 로그인 (추후 기능) */}
                <div className="pt-4">
                  <button 
                    type="button"
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-medium border border-slate-200 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google로 계속하기</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 주요 기능 섹션 */}
        <section id="features" className="py-24 lg:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">아이보틀 주요 기능</h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              안과 진료실에서 실제로 필요한 기능들을 AI로 자동화했습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
            {/* 안과 만화 */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl shadow-inner-sm">
                <FilmIcon className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">안과 만화</h3>
              <p className="text-slate-500 leading-relaxed">3컷 만화 업로드-PDF 다운로드</p>
              <div className="mt-4 text-sm font-medium text-purple-600">
                <p>• 4컷 만화 인쇄&다운로드</p>
                <p>• NotebookLM 팟캐스트 연동</p>
              </div>
            </div>

            {/* 챗봇 Eye Bottle */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-rose-100 to-pink-200 rounded-2xl shadow-inner-sm">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">챗봇 Eye Bottle</h3>
              <p className="text-slate-500 leading-relaxed">수술확인서·진단서 자동 작성</p>
              <div className="mt-4 text-sm font-medium text-pink-600">
                <p>• AI 기반 서류 생성</p>
                <p>• (업데이트 예정)</p>
              </div>
            </div>

            {/* 마이오가드 그래프 */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-blue-100 to-sky-200 rounded-2xl shadow-inner-sm">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">마이오가드 그래프</h3>
              <p className="text-slate-500 leading-relaxed">근시 진행도 차트</p>
              <div className="mt-4 text-sm font-medium text-sky-600">
                <p>• 환자별 진행도 시각화</p>
                <p>• (업데이트 예정)</p>
              </div>
            </div>

            {/* 검진결과 작성 */}
            <Link href="/exam-results" className="block rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 h-full">
              <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-2xl shadow-inner-sm">
                  <DocumentTextIcon className="h-8 w-8 text-teal-600" />
                </div>
                <div className="flex items-center gap-x-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-800">검진결과 작성</h3>
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 px-2.5 py-1 rounded-full">NEW!</span>
                </div>
                <p className="text-slate-500 leading-relaxed">당뇨&고혈압망막 병증, 눈종합검진</p>
                <div className="mt-4 text-sm font-medium text-cyan-600">
                  <p>• 작성 및 인쇄</p>
                  <p>• 실시간 미리보기</p>
                </div>
              </div>
            </Link>

            {/* 진료녹음 메모 */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl shadow-inner-sm">
                <MicrophoneIcon className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">진료녹음 메모</h3>
              <p className="text-slate-500 leading-relaxed">간편 사용 녹화 제공</p>
              <div className="mt-4 text-sm font-medium text-orange-600">
                <p>• 자동 녹음 & STT 전사</p>
                <p>• 클라우드 저장&정리</p>
              </div>
            </div>

            {/* 환자 안내자료 */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-inner-sm">
                <BookOpenIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">환자 안내자료</h3>
              <p className="text-slate-500 leading-relaxed">수술 전후 안내자료</p>
              <div className="mt-4 text-sm font-medium text-emerald-600">
                <p>• 안과 관련 안내자료</p>
                <p>• PDF 다운로드 제공</p>
              </div>
            </div>

            {/* 문진 도우미 */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-2xl shadow-inner-sm">
                <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">문진 도우미</h3>
              <p className="text-slate-500 leading-relaxed">증상별 검사 안내</p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                <p>• 플로차트/챗봇 형태</p>
                <p>• 비용 & 특수 안내사항</p>
              </div>
            </div>

            {/* 진료 도우미 */}
            <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-red-100 to-rose-200 rounded-2xl shadow-inner-sm">
                <HeartIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">진료 도우미</h3>
              <p className="text-slate-500 leading-relaxed">보험 절차 안내</p>
              <div className="mt-4 text-sm font-medium text-rose-600">
                <p>• 산정특례 & 보험코드</p>
                <p>• 주사 트래커 & DB</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 메뉴 섹션 */}
      <footer id="footer-nav" className="bg-white/95 backdrop-blur-lg border-t border-slate-200/60 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center items-stretch">

            {/* 업데이트 노트 */}
            <div className="h-full flex flex-col group hover:bg-slate-50/80 p-8 lg:p-10 rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-8 h-8 lg:w-10 lg:h-10 text-amber-600" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">업데이트 노트</h3>
              <p className="text-base lg:text-lg text-slate-600">새 기능·버그 수정 기록</p>
            </div>

            {/* 소개 */}
            <Link href="/about" className="h-full flex flex-col group hover:bg-slate-50/80 p-8 lg:p-10 rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105 block">
              <div className="bg-gradient-to-br from-slate-500/10 to-gray-500/10 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UserCircleIcon className="w-8 h-8 lg:w-10 lg:h-10 text-slate-600" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">About Me</h3>
              <p className="text-base lg:text-lg text-slate-600">의사 경력·철학 소개</p>
            </Link>

            {/* 문의 */}
            <div className="h-full flex flex-col group hover:bg-slate-50/80 p-8 lg:p-10 rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <EnvelopeIcon className="w-8 h-8 lg:w-10 lg:h-10 text-sky-600" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">Contact</h3>
              <p className="text-base lg:text-lg text-slate-600">이메일·SNS 문의</p>
            </div>
          </div>

          {/* 저작권 정보 */}
          <div className="border-t border-slate-200/60 mt-16 pt-12 text-center">
            <p className="text-base lg:text-lg text-slate-500 font-medium">
              &copy; 2025 아이보틀(Eyebottle).<br className="sm:hidden" /> 안과 진료의 새로운 경험.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
