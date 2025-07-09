"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  XMarkIcon
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { QuickNavMenu } from "@/components/common/quick-nav-menu";
import { updates, categoryStyles } from "@/data/updates";
import { useClientOnly } from "@/hooks/useClientOnly";
import dynamic from "next/dynamic";

// 동적 임포트로 클라이언트 전용 컴포넌트 로드
const LoginModal = dynamic(() => import("@/components/common/login-modal"), {
  ssr: false,
});

// 데모 영상 데이터 타입
interface DemoVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // 메일 팝업 상태 관리 추가
  const [isMailPopupOpen, setIsMailPopupOpen] = useState(false);
  const [mailForm, setMailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // 업데이트 모달 상태 관리
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  // 로그인 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // 클라이언트 전용 렌더링 체크
  const isClient = useClientOnly();

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUpdateModalOpen(false);
        setIsVideoModalOpen(false);
        setIsLoginModalOpen(false);
        setIsMailPopupOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // 데모 영상 리스트
  const demoVideos: DemoVideo[] = [
    {
      id: "exam-results",
      title: "검진결과 작성 - 사용법 가이드",
      description: "당뇨망막병증, 고혈압망막병증, 종합검진 결과서를 쉽고 빠르게 작성하는 방법을 알아보세요.",
      url: "https://youtu.be/viqOYiEOBNI?si=DCX41YBhlBs2GKgB",
      thumbnail: "https://picsum.photos/480/270?random=1",
      duration: "5:32",
      category: "검진결과"
    },
    {
      id: "myocare-chart",
      title: "근시케어 차트 - 데이터 분석",
      description: "환자별 근시 진행도 분석과 위험도 예측 기능을 소개합니다.",
      url: "https://youtu.be/pgTEwTZTKlk?si=vHAW42IClD6Q2Nvx",
      thumbnail: "https://picsum.photos/480/270?random=2",
      duration: "3:45",
      category: "근시케어"
    },
    {
      id: "ai-chatbot",
      title: "AI 챗봇 Eye Bottle (개발 중)",
      description: "수술확인서와 진단서를 AI로 자동 작성하는 혁신적인 기능입니다.",
      url: "#",
      thumbnail: "https://picsum.photos/480/270?random=3",
      duration: "개발 중",
      category: "AI 챗봇"
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* 메일 팝업 모달 */}
      {isMailPopupOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="w-5 h-5 text-rose-600" />
                </div>
                <span>이메일 문의</span>
              </h2>
              <button
                onClick={closeMailPopup}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            {/* 모달 내용 */}
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                아이보틀 관련 문의사항이나 제안이 있으시면 언제든지 연락해 주세요.
              </p>
              
              {/* 메일 폼 */}
              <form className="space-y-4">
                {/* 이름 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={mailForm.name}
                    onChange={handleInputChange}
                    placeholder="홍길동"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm"
                  />
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    value={mailForm.email}
                    onChange={handleInputChange}
                    placeholder="doctor@hospital.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm"
                  />
                </div>

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">제목 *</label>
                  <input
                    type="text"
                    name="subject"
                    value={mailForm.subject}
                    onChange={handleInputChange}
                    placeholder="문의 제목을 입력해 주세요"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm"
                  />
                </div>

                {/* 메시지 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">메시지 *</label>
                  <textarea
                    name="message"
                    value={mailForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="문의 내용을 자세히 적어주세요..."
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none text-sm"
                  />
                </div>
              </form>
            </div>
            
            {/* 모달 푸터 */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeMailPopup}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-100 transition-all duration-200 text-sm"
                >
                  취소
                </button>
                <button
                  onClick={handleSendMail}
                  data-send-button
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:from-rose-600 hover:to-pink-600 flex items-center justify-center space-x-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>메일 전송</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 업데이트 모달 */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-start justify-center pt-8 sm:pt-16 lg:pt-20 p-2 sm:p-3 lg:p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl h-[calc(100vh-64px)] sm:h-[calc(100vh-96px)] lg:max-h-[85vh] shadow-2xl flex flex-col">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600" />
                </div>
                <span>최신 업데이트</span>
              </h2>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1 sm:p-1.5 lg:p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-600" />
              </button>
            </div>
            
            {/* 업데이트 리스트 - 스크롤 가능한 영역 */}
            <div className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {updates.map((update, index) => {
                const categoryStyle = categoryStyles[update.category];
                return (
                  <div 
                    key={update.id}
                    className={`rounded-xl p-3 sm:p-4 lg:p-6 transition-all duration-300 ${
                      index === 0 
                        ? 'border-2 border-blue-200 bg-blue-50/30' 
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* 버전 헤더 */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-2 lg:space-x-3">
                        <span className="text-lg sm:text-xl lg:text-2xl">{categoryStyle.icon}</span>
                        <div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-800">
                            {update.version}
                            {index === 0 && (
                              <span className="ml-1 sm:ml-1 lg:ml-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-1.5 sm:px-1.5 lg:px-2 py-0.5 sm:py-0.5 lg:py-1 rounded-full">
                                최신
                              </span>
                            )}
                          </h3>
                          <p className="text-xs sm:text-xs lg:text-sm text-slate-500 mt-0.5 sm:mt-1">{update.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full ${categoryStyle.bgColor} ${categoryStyle.textColor} border ${categoryStyle.borderColor}`}>
                        {categoryStyle.label}
                      </span>
                    </div>

                    {/* 업데이트 내용 */}
                    <div className="ml-6 sm:ml-8 lg:ml-11">
                      <h4 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">{update.title}</h4>
                      <p className="text-xs sm:text-xs lg:text-sm text-slate-600 mb-2 sm:mb-3">{update.description}</p>
                      
                      {/* 주요 변경사항 */}
                      {update.highlights && update.highlights.length > 0 && (
                        <ul className="space-y-0.5 sm:space-y-1">
                          {update.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-xs sm:text-xs lg:text-sm text-slate-600 flex items-start">
                              <span className="text-slate-400 mr-2">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 모달 푸터 - GitHub 배너 */}
            <div className="p-2 sm:p-4 lg:p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex-shrink-0">
              <p className="text-xs sm:text-xs lg:text-sm text-slate-600 text-center">
                더 자세한 변경사항은 <a href="https://github.com/Eyebottle/eyebottle-ai-ophthalmology" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">GitHub</a>에서 확인하세요
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 데모 영상 모달 */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
                <div className="relative">
                  <PlayIcon className="w-8 h-8 text-red-500" />
                  <div className="absolute inset-0 bg-red-500/20 rounded-full transform scale-110"></div>
                </div>
                <span>데모 영상 리스트</span>
              </h2>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            
            {/* 영상 리스트 */}
            <div className="p-6 space-y-4">
              {demoVideos.map((video) => (
                <div 
                  key={video.id}
                  className={`group rounded-xl border-2 p-4 transition-all duration-300 ${
                    video.url === "#" 
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60" 
                      : "border-slate-200 hover:border-red-300 hover:bg-red-50/30 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (video.url !== "#") {
                      window.open(video.url, '_blank');
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* 썸네일 */}
                    <div className="relative flex-shrink-0">
                      <div className="w-full md:w-48 h-28 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl overflow-hidden">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        {video.url !== "#" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-500 hover:bg-red-600 transition-colors rounded-full p-3 group-hover:scale-110 transform duration-300">
                              <PlayIcon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* 재생 시간 */}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
                    {/* 영상 정보 */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-bold ${video.url === "#" ? "text-slate-500" : "text-slate-800 group-hover:text-red-600"}`}>
                          {video.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          video.category === "검진결과" ? "bg-red-100 text-red-700" :
                          video.category === "근시케어" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {video.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        {video.description}
                      </p>
                      {video.url === "#" ? (
                        <span className="text-sm font-medium text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                          곧 공개됩니다! 📅
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          지금 시청하기 ▶️
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 모달 푸터 */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <p className="text-sm text-slate-600 text-center">
                💡 더 많은 기능의 데모 영상이 곧 추가됩니다! 기대해 주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 네비게이션 */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src="/assets/logos/eyebottle-logo.png"
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
              <button onClick={() => setIsUpdateModalOpen(true)} className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">업데이트</button>
              <a href="#footer-nav" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">소개</a>
              <a href="#footer-nav" className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors">문의</a>
              
              {/* 로그인 버튼 */}
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                로그인
              </button>
              
              {/* 주요 기능 네비게이션 메뉴 */}
              <QuickNavMenu />
            </nav>
            {/* Mobile menu - QuickNavMenu만 표시 */}
            <div className="lg:hidden">
              <QuickNavMenu />
            </div>
          </div>
        </div>

      </header>

      {/* 메인 히어로 섹션 */}
      <main className="container mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 mb-32">
          {/* 좌측: 메인 콘텐츠 */}
          <div className="flex-1 text-center lg:text-left mx-auto lg:mx-0">
            {/* 메인 로고 */}
            <div className="flex justify-center lg:justify-start mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
                <Image
                  src="/assets/logos/eyebottle-logo.png"
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

            <div className="flex justify-center lg:justify-start">
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-5 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700 ring-1 ring-red-600/20"
              >
                <span className="flex items-center space-x-3">
                  <div className="relative">
                    <PlayIcon className="w-6 h-6" />
                    <div className="absolute inset-0 bg-white/20 rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                  </div>
                  <span>데모 영상 보기</span>
                </span>
              </button>
            </div>
          </div>

          {/* 우측: 공지사항 */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800">공지사항</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline transition-colors">더보기</button>
              </div>
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <p className="text-base font-semibold text-slate-800 mb-2 leading-relaxed">🎨 안과만화 & 📖 환자 안내자료 출시!</p>
                  <p className="text-sm text-slate-600 mb-1">4컷/8컷 만화와 수술 안내 PDF 제공</p>
                  <p className="text-sm text-slate-500 font-medium">2025.07.04</p>
                </div>
                <div className="border-b border-slate-100 pb-5">
                  <p className="text-base font-semibold text-slate-800 mb-2 leading-relaxed">🎉 근시케어차트 기능 완성</p>
                  <p className="text-sm text-slate-600 mb-1">근시 진행 추적 및 위험도 관리 시스템</p>
                  <p className="text-sm text-slate-500 font-medium">2025.06.28</p>
                </div>
                <div className="pb-2">
                  <p className="text-base font-semibold text-slate-800 mb-2 leading-relaxed">✨ 검진결과 작성 시스템</p>
                  <p className="text-sm text-slate-600 mb-1">당뇨/고혈압/눈종합검진 실시간 작성</p>
                  <p className="text-sm text-slate-500 font-medium">2025.06.16</p>
                </div>
              </div>
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
            <Link href="/cartoons" className="block rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 h-full">
              <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl shadow-inner-sm">
                  <FilmIcon className="h-8 w-8 text-violet-600" />
                </div>
                <div className="flex items-center gap-x-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-800">안과 만화</h3>
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 px-2.5 py-1 rounded-full">NEW!</span>
                </div>
                <p className="text-slate-500 leading-relaxed">눈 건강 정보를 재미있게!</p>
                <div className="mt-4 text-sm font-medium text-purple-600">
                  <p>• 4컷/8컷 만화 보기</p>
                  <p>• PDF 다운로드 & 인쇄</p>
                </div>
              </div>
            </Link>

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

            {/* 근시케어 차트 */}
            <Link href="/myocare/dashboard" className="block rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 h-full">
              <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-blue-100 to-sky-200 rounded-2xl shadow-inner-sm">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center gap-x-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-800">근시케어 차트</h3>
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-2.5 py-1 rounded-full">Beta</span>
                </div>
                <p className="text-slate-500 leading-relaxed">MyoCare Chart</p>
                <div className="mt-4 text-sm font-medium text-sky-600">
                  <p>• 환자별 진행도 시각화</p>
                  <p>• 위험도 자동 분석</p>
                </div>
              </div>
            </Link>

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
            <Link href="/patient-guides" className="block rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 h-full">
              <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 mb-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-inner-sm">
                  <BookOpenIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center gap-x-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-800">환자 안내자료</h3>
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 px-2.5 py-1 rounded-full">NEW!</span>
                </div>
                <p className="text-slate-500 leading-relaxed">수술 전후 안내자료</p>
                <div className="mt-4 text-sm font-medium text-emerald-600">
                  <p>• 안과 관련 안내자료</p>
                  <p>• PDF 다운로드 제공</p>
                </div>
              </div>
            </Link>

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
            <div 
              onClick={() => setIsUpdateModalOpen(true)}
              className="h-full flex flex-col group hover:bg-slate-50/80 p-8 lg:p-10 rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
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
            <div 
              onClick={openMailPopup}
              className="h-full flex flex-col group hover:bg-slate-50/80 p-8 lg:p-10 rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <EnvelopeIcon className="w-8 h-8 lg:w-10 lg:h-10 text-sky-600" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">Contact</h3>
              <p className="text-base lg:text-lg text-slate-600">이메일 문의</p>
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

      {/* 로그인 모달 */}
      {isClient && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}

    </div>
  );
}
