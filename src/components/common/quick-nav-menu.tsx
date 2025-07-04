"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserCircleIcon,
  HomeIcon,
  FilmIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// 메뉴 아이템 타입 정의
interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  status?: 'active' | 'beta' | 'coming-soon';
}

// 주요 기능 메뉴 리스트
const menuItems: MenuItem[] = [
  {
    name: '홈',
    href: '/',
    icon: HomeIcon,
    description: '아이보틀 메인 페이지',
    status: 'active'
  },
  {
    name: '검진결과 작성',
    href: '/exam-results',
    icon: DocumentTextIcon,
    description: '당뇨·고혈압망막병증, 종합검진',
    status: 'active'
  },
  {
    name: '근시케어 차트',
    href: '/myocare/dashboard',
    icon: ChartBarIcon,
    description: '환자별 진행도 시각화',
    status: 'beta'
  },
  {
    name: 'About Me',
    href: '/about',
    icon: UserCircleIcon,
    description: '의사 경력·철학 소개',
    status: 'active'
  },
  {
    name: '안과 만화',
    href: '/cartoons',
    icon: FilmIcon,
    description: '눈 건강 정보를 재미있게!',
    status: 'active'
  },
  {
    name: 'AI 챗봇',
    href: '#',
    icon: ChatBubbleLeftRightIcon,
    description: '수술확인서·진단서 자동 작성',
    status: 'coming-soon'
  },
  {
    name: '진료녹음 메모',
    href: '#',
    icon: MicrophoneIcon,
    description: '간편 사용 녹화 제공',
    status: 'coming-soon'
  },
  {
    name: '환자 안내자료',
    href: '/patient-guides',
    icon: BookOpenIcon,
    description: '수술 전후 안내자료',
    status: 'active'
  },
  {
    name: '문진 도우미',
    href: '#',
    icon: ClipboardDocumentListIcon,
    description: '증상별 검사 안내',
    status: 'coming-soon'
  },
  {
    name: '진료 도우미',
    href: '#',
    icon: HeartIcon,
    description: '보험 절차 안내',
    status: 'coming-soon'
  }
];

export function QuickNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 상태별 배지 스타일
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'beta':
        return (
          <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 rounded-full">
            Beta
          </span>
        );
      case 'coming-soon':
        return (
          <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            준비중
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={toggleMenu}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="주요 기능 메뉴"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* 포털로 렌더링되는 메뉴 */}
      {mounted && isOpen && createPortal(
        <>
          {/* 오버레이 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeMenu();
            }}
          />

          {/* 슬라이드 메뉴 */}
          <div 
            className={cn(
              "fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out border-l border-slate-200",
              "translate-x-0"
            )}
            onClick={(e) => e.stopPropagation()}
          >
        {/* 메뉴 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span>주요 기능</span>
          </h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeMenu();
            }}
            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-white/90 rounded-lg transition-colors"
            aria-label="메뉴 닫기"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isDisabled = item.status === 'coming-soon' || item.href === '#';
              
              if (isDisabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 cursor-not-allowed bg-slate-100/80"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.description}</p>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMenu();
                  }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-800 hover:bg-slate-200/80 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-600 group-hover:text-slate-800"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-blue-100" : "text-slate-600"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 메뉴 푸터 */}
        <div className="border-t border-slate-200 p-4 bg-slate-100/90 backdrop-blur-sm">
          <p className="text-xs text-slate-700 text-center font-medium">
            💡 더 많은 기능이 곧 추가됩니다!
          </p>
        </div>
      </div>
        </>,
        document.body
      )}
    </>
  );
} 