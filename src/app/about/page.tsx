"use client";

import Image from "next/image";
import { 
  CalendarIcon,
  EyeIcon,
  SparklesIcon,
  HeartIcon,
  UserGroupIcon,
  ArrowRightIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30">
      {/* 1. 헤더 섹션 (진료 사진 배경) */}
      <section className="relative bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 text-white overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/clinic-me.jpg"
            alt="진료실 배경"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/50 via-indigo-400/30 to-purple-500/40" />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20 lg:py-32 relative z-10">
          <div className="text-center">
            {/* 아이보틀 로고 */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-8 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm p-4">
              <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                <Image
                  src="/eyebottle-logo.png"
                  alt="아이보틀 로고"
                  width={80}
                  height={80}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
            </div>
            
            {/* 제목과 부제 */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">이동은 안과 전문의</h1>
            <p className="text-xl lg:text-2xl text-blue-50/90 mb-8">백내장, 녹내장, 소아안과 전문</p>
            
            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                상담 예약
              </button>
              <button className="px-8 py-4 bg-slate-400 hover:bg-slate-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <EyeIcon className="w-5 h-5" />
                진료 분야
              </button>
            </div>
            
            {/* 인용문 */}
            <p className="text-lg lg:text-xl text-blue-50/80 italic">
              &ldquo;눈을 넘어 마음까지 치료하는 의사가 되겠습니다&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 2. "안녕하세요!" 섹션 */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 mb-6">안녕하세요!</h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              저는 안과 전문의 이동은입니다. 현재 부산 연산동, 이안과에서 근무하고 있습니다.
              백내장, 녹내장, 소아안과 진료를 전문으로 하고 있습니다.
            </p>
            
            {/* 통계 3개 */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-indigo-400 mb-2">1000+</p>
                <p className="text-sm text-slate-500">성공적인 수술</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-indigo-400 mb-2">10+</p>
                <p className="text-sm text-slate-500">진료 경력</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-indigo-400 mb-2">5000+</p>
                <p className="text-sm text-slate-500">만족한 환자</p>
              </div>
            </div>
          </div>
          
          {/* 우측 의료기기 - 최신 의료장비 섹션 */}
          <div>
            <h3 className="text-xl font-bold text-slate-700 mb-6 text-center">최신 의료장비</h3>
            
            {/* 슬라이더 컨테이너 */}
            <div className="relative w-full h-[320px] overflow-hidden rounded-2xl">
              {/* 슬라이더 래퍼 */}
              <div className="flex transition-transform duration-1000 ease-in-out h-full animate-[slide_8s_infinite]">
                
                {/* 알콘 센츄리온 골드 슬라이드 */}
                <div className="min-w-full h-full relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative backdrop-blur-md bg-white/90 border border-white/30 rounded-2xl p-8 h-full flex flex-col items-center justify-center overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />
                    
                    {/* 이미지 컨테이너 - 흰 배경과 자연스럽게 블렌딩 */}
                    <div className="relative z-10 w-full h-[220px] flex items-center justify-center mb-6">
                      <div className="relative w-[200px] h-[200px] rounded-2xl bg-white/80 flex items-center justify-center backdrop-blur-sm shadow-inner">
                        <Image
                          src="/centurion-gold-transparent.png"
                          alt="알콘 센츄리온 골드"
                          width={180}
                          height={180}
                          className="object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <p className="font-bold text-slate-700 text-lg mb-1">Alcon Centurion Gold</p>
                      <p className="text-sm text-slate-600 mb-2">백내장 수술 시스템</p>
                      <p className="text-xs text-slate-500 leading-relaxed">최신 초음파 기술로 안전하고 정밀한 백내장 수술을 제공합니다</p>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                
                {/* Zeiss Artevo 현미경 슬라이드 */}
                <div className="min-w-full h-full relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative backdrop-blur-md bg-white/90 border border-white/30 rounded-2xl p-8 h-full flex flex-col items-center justify-center overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />
                    
                    <div className="relative z-10 w-full h-[220px] flex items-center justify-center mb-6">
                      <div className="relative w-[200px] h-[200px] rounded-2xl bg-white/80 flex items-center justify-center backdrop-blur-sm shadow-inner">
                        <Image
                          src="/artevo-zeiss.png"
                          alt="Zeiss Artevo 현미경"
                          width={180}
                          height={180}
                          className="object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <p className="font-bold text-slate-700 text-lg mb-1">Zeiss Artevo 800</p>
                      <p className="text-sm text-slate-600 mb-2">수술용 현미경</p>
                      <p className="text-xs text-slate-500 leading-relaxed">첨단 광학 기술로 정밀한 수술 시야를 제공하는 프리미엄 현미경</p>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                
              </div>
              
              {/* 슬라이더 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-[indicator1_8s_infinite]"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-[indicator2_8s_infinite]"></div>
              </div>
            </div>
            
            {/* Bottom decoration line */}
            <div className="mt-6 flex items-center justify-center">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <p className="mx-3 text-xs text-slate-400 italic">Premium Medical Equipment</p>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. "전문 진료 분야" 섹션 - 6개 카드 */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 text-center mb-12">전문 진료 분야</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 백내장 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <EyeIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">백내장</h3>
            <p className="text-slate-500 mb-4">난치성 백내장 포함 최신 수술 기법 적용</p>
            <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 녹내장 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <EyeIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">녹내장</h3>
            <p className="text-slate-500 mb-4">조기 진단 및 치료 · 정기적인 관리</p>
            <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 소아안과 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <UserGroupIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">소아안과</h3>
            <p className="text-slate-500 mb-4">소아 사시, 약시, 근시 관리</p>
            <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 드림렌즈 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">드림렌즈</h3>
            <p className="text-slate-500 mb-4">근시 진행 억제 · 안전한 관리</p>
            <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 마이오사이트 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-cyan-50 rounded-xl flex items-center justify-center mb-4">
              <HeartIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">마이오사이트</h3>
            <p className="text-slate-500 mb-4">근시 진행 억제 연구 및 관리</p>
            <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 콘택트렌즈 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
              <EyeIcon className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">콘택트렌즈</h3>
            <p className="text-slate-500 mb-4">맞춤형 처방 · 안전한 관리</p>
            <button className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. 하단 정보 섹션 - 4개 카드 */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 기본 정보 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-4">기본 정보</h3>
            <div className="space-y-2 text-slate-500">
              <p><span className="font-semibold">이름:</span> 이동은</p>
              <p><span className="font-semibold">전문분야:</span> 백내장, 녹내장, 소아안과, 콘택트렌즈</p>
              <p><span className="font-semibold">현재 직위:</span> 이안과 원장</p>
            </div>
          </div>

          {/* 경력 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-4">경력</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <p>• 인제대학교 부산백병원 인턴 수료 (2016-17)</p>
              <p>• 인제대학교 부산백병원 전공의 수료 (2017-19)</p>
              <p>• 국군부산병원 안과 과장 (2019-22)</p>
              <p>• 이안과 원장 (2022-현재)</p>
            </div>
          </div>

          {/* 학력 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-4">학력</h3>
            <div className="space-y-2 text-slate-500">
              <p>• 인제대학교 의과대학 졸업</p>
            </div>
          </div>

          {/* 소속 및 회원 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-4">소속 및 회원</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <p>• 대한안과학회 정회원</p>
              <p>• 한국백내장굴절수술학회 정회원</p>
              <p>• 한국외안부학회 정회원</p>
              <p>• 한국콘택트렌즈학회 정회원</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 연락처 카드 */}
      <section className="max-w-4xl mx-auto px-8 lg:px-16 py-16">
        <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 text-white rounded-3xl p-8 lg:p-12 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-2">이안과</h2>
          <p className="text-xl mb-1">원장 이동은</p>
          <p className="text-lg mb-4">안과 전문의</p>
          <p className="text-lg mb-2">부산 연산동</p>
          <a href="mailto:lee@eyebottle.kr" className="text-lg flex items-center justify-center gap-2 hover:underline">
            <EnvelopeIcon className="w-5 h-5" />
            lee@eyebottle.kr
          </a>
        </div>
      </section>

      {/* 6. 푸터 */}
      <footer className="bg-slate-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 text-center">
          <p>© 2025 이동은 안과 전문의. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}