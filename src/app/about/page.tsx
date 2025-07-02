// About 페이지 - 이동은 안과 전문의 소개 및 진료분야, 메일 문의 기능
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRightIcon,
  EnvelopeIcon,
  XMarkIcon,
  HomeIcon
} from "@heroicons/react/24/outline";
import { 
  Eye,
  Droplets,
  Baby,
  Moon,
  Microscope
} from "lucide-react";
import { QuickNavMenu } from '@/components/common/quick-nav-menu';

export default function AboutPage() {
  // 메일 팝업 상태 관리
  const [isMailPopupOpen, setIsMailPopupOpen] = useState(false);
  const [mailForm, setMailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // 슬라이더 상태 관리
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  // 슬라이더 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // 4초마다 전환

    return () => clearInterval(interval);
  }, [totalSlides]);

  // 진료분야 섹션으로 스크롤하는 함수
  const scrollToSpecialties = () => {
    const specialtiesSection = document.getElementById('specialties-section');
    if (specialtiesSection) {
      specialtiesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 메일 팝업 열기
  const openMailPopup = () => {
    setIsMailPopupOpen(true);
  };

  // 메일 팝업 닫기
  const closeMailPopup = () => {
    setIsMailPopupOpen(false);
    setMailForm({ name: '', email: '', subject: '', message: '' });
  };

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMailForm(prev => ({ ...prev, [name]: value }));
  };

  // 메일 전송 처리
  const handleSendMail = async () => {
    const { name, email, subject, message } = mailForm;
    
    // 필수 필드 확인
    if (!name || !email || !subject || !message) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      // 로딩 상태 표시
      const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement;
      if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = '전송 중...';
      }

      // API 호출하여 이메일 전송
      const apiUrl = '/api/send-email';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mailForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '메일 전송 실패');
      }

      // 성공 메시지
      alert('✅ 메일이 성공적으로 전송되었습니다!\n빠른 시일 내에 답변드리겠습니다.');
      
      // 폼 초기화 및 팝업 닫기
      closeMailPopup();
      
    } catch (error) {
      // 에러 처리
      alert('❌ 메일 전송에 실패했습니다.\n잠시 후 다시 시도해주세요.');
      console.error('메일 전송 오류:', error);
      
      // 버튼 복구
      const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement;
      if (sendButton) {
        sendButton.disabled = false;
        sendButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> 메일 전송';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30">
      {/* 고정 홈 버튼 - 항상 표시 */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/90 hover:bg-indigo-600/90 text-white backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-xl border border-white/20"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="font-semibold">홈으로</span>
        </Link>
      </div>
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
        
        {/* 상단 네비게이션 버튼들 - 헤더 내에서만 보임 */}
        <div className="absolute top-6 left-6 z-20">
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-semibold">홈으로</span>
          </Link>
        </div>
        
        {/* 주요 기능 네비게이션 메뉴 */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1">
            <QuickNavMenu />
          </div>
        </div>

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
            <p className="text-xl lg:text-2xl text-blue-50/90 mb-8">백내장, 녹내장, 근시치료, 소아안과 전문</p>
            
            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={openMailPopup}
                className="px-8 py-4 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <EnvelopeIcon className="w-5 h-5" />
                문의 하기
              </button>
              <button 
                onClick={scrollToSpecialties}
                className="px-8 py-4 bg-slate-400 hover:bg-slate-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-5 h-5" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 좌측 - 소개 텍스트 */}
          <div className="w-full lg:col-span-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 mb-6">안녕하세요!</h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              저는 안과 전문의 이동은입니다. <br className="sm:hidden" />
              현재 부산 연산동, 이안과에서 근무하고 있습니다.<br className="sm:hidden" />
              백내장, 녹내장, 소아안과 진료를 전문으로 하고 있습니다.
            </p>
            
            {/* 통계 3개 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-indigo-400 mb-1">1000+</p>
                <p className="text-xs text-slate-500">성공적인 수술</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-indigo-400 mb-1">10+</p>
                <p className="text-xs text-slate-500">진료 경력</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-indigo-400 mb-1">5000+</p>
                <p className="text-xs text-slate-500">만족한 환자</p>
              </div>
            </div>
          </div>
          
          {/* 중앙 - 최신 의료장비 섹션 */}
          <div className="w-full lg:col-span-1">
            <h3 className="text-xl font-bold text-slate-700 mb-6 text-center">최신 의료장비</h3>
            
            {/* 슬라이더 컨테이너 */}
            <div className="relative w-full h-[280px] lg:h-[320px] overflow-hidden rounded-2xl">
              
              {/* 알콘 센츄리온 골드 슬라이드 */}
              <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === 0 ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-full h-full relative group">
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
              </div>
              
              {/* Zeiss Artevo 현미경 슬라이드 */}
              <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === 1 ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-full h-full relative group">
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
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Bottom decoration line */}
            <div className="mt-6 flex items-center justify-center">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <p className="mx-3 text-xs text-slate-400 italic">Premium Medical Equipment</p>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
          </div>

          {/* 우측 - 주요 진료분야 미리보기 */}
          <div className="w-full lg:col-span-1">
            <h3 className="text-xl font-bold text-slate-700 mb-6 text-center">주요 진료분야</h3>
            
            <div className="space-y-3">
              {/* 백내장 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                   onClick={scrollToSpecialties}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-sm">백내장</h4>
                    <p className="text-xs text-slate-500">최신 수술 기법</p>
                  </div>
                </div>
              </div>

              {/* 녹내장 */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                   onClick={scrollToSpecialties}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-sm">녹내장</h4>
                    <p className="text-xs text-slate-500">조기 진단 및 치료</p>
                  </div>
                </div>
              </div>

              {/* 근시치료 */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                   onClick={scrollToSpecialties}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Moon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-sm">근시치료</h4>
                    <p className="text-xs text-slate-500">드림렌즈, 마이오사이트</p>
                  </div>
                </div>
              </div>

              {/* 소아안과 */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                   onClick={scrollToSpecialties}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Baby className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-sm">소아안과</h4>
                    <p className="text-xs text-slate-500">사시, 약시 치료</p>
                  </div>
                </div>
              </div>

              {/* 건조증 */}
              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                   onClick={scrollToSpecialties}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-sm">건조증</h4>
                    <p className="text-xs text-slate-500">맞춤형 치료</p>
                  </div>
                </div>
              </div>

              {/* 기타 전안부질환 */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                   onClick={scrollToSpecialties}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-sm">전안부질환</h4>
                    <p className="text-xs text-slate-500">익상편, 첩모 등</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="mt-6 flex items-center justify-center">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <p className="mx-3 text-xs text-slate-400 italic">Specialty Areas</p>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. "전문 진료 분야" 섹션 - 6개 카드 */}
      <section id="specialties-section" className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-700 text-center mb-12">전문 진료 분야</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 백내장 */}
          <div className="bg-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">백내장</h3>
            <p className="text-slate-600 mb-4">난치성 백내장 포함<br className="sm:hidden" /> 최신 수술 기법 적용</p>
            <button className="text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 녹내장 */}
          <div className="bg-emerald-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">녹내장</h3>
            <p className="text-slate-600 mb-4">조기 진단 및 치료<br className="sm:hidden" /> 정기적인 관리</p>
            <button className="text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 근시치료 */}
          <div className="bg-indigo-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <Moon className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">근시치료</h3>
            <p className="text-slate-600 mb-4">드림렌즈, 마이오사이트<br className="sm:hidden" /> 근시 진행 억제</p>
            <button className="text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 소아안과 */}
          <div className="bg-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <Baby className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">소아안과</h3>
            <p className="text-slate-600 mb-4">소아 사시, 약시<br className="sm:hidden" /> 근시 관리</p>
            <button className="text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 건조증 */}
          <div className="bg-cyan-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">건조증</h3>
            <p className="text-slate-600 mb-4">맞춤형 치료<br className="sm:hidden" /> 지속적인 관리</p>
            <button className="text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              자세히 보기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 기타 전안부질환 */}
          <div className="bg-amber-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <Microscope className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">기타 전안부질환</h3>
            <p className="text-slate-600 mb-4">익상편, 첩모<br className="sm:hidden" /> 각막질환 등</p>
            <button className="text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
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
              <p><span className="font-semibold">전문분야:</span> 백내장, 녹내장, 근시치료, 소아안과, 건조증, 전안부질환</p>
              <p><span className="font-semibold">현재 직위:</span> 이안과 원장</p>
            </div>
          </div>

          {/* 경력 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-4">경력</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <p>• 인제대학교 부산백병원 인턴 수료</p>
              <p>• 인제대학교 부산백병원 전공의 수료</p>
              <p>• 국군함평병원 안과 과장</p>
              <p>• 이안과 원장</p>
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
              <p>• 부산안과학회 정회원</p>
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
          <button 
            onClick={openMailPopup}
            className="text-lg flex items-center justify-center gap-2 hover:underline transition-all duration-300 hover:scale-105 w-full"
          >
            <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
            <span>lee@eyebottle.kr</span>
          </button>
        </div>
      </section>

      {/* 메일 작성 팝업 */}
      {isMailPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-700">문의 메일 작성</h3>
              <button 
                onClick={closeMailPopup}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* 메일 폼 */}
            <div className="space-y-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={mailForm.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="성함을 입력해주세요"
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={mailForm.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="회신받을 이메일 주소"
                />
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">제목 *</label>
                <input
                  type="text"
                  name="subject"
                  value={mailForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="문의 제목"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">내용 *</label>
                <textarea
                  name="message"
                  value={mailForm.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="문의 내용을 상세히 작성해주세요"
                />
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={closeMailPopup}
                className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleSendMail}
                data-send-button
                className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <EnvelopeIcon className="w-4 h-4" />
                메일 전송
              </button>
            </div>

            {/* 안내 텍스트 */}
            <p className="text-xs text-slate-500 mt-4 text-center">
              📧 메일이 바로 전송되며 빠른 시일 내에 답변드립니다
            </p>
          </div>
        </div>
      )}

      {/* 6. 푸터 */}
      <footer className="bg-slate-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 text-center">
          <p>© 2025 이동은 안과 전문의. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}