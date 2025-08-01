'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DemoVideoButton } from '@/components/common/demo-video-button';
import { QuickNavMenu } from '@/components/common/quick-nav-menu';
import { User, Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '대시보드', href: '/myocare/dashboard' },
  { name: '환자관리', href: '/myocare/patients' },
  { name: '설정', href: '/myocare/settings' },
];

export function MyoCareHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 로고 */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* 홈 버튼 */}
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline text-base font-medium">홈</span>
              </Link>
              
              <ChevronRight className="h-4 w-4 text-slate-400" />
              
              {/* 로고 */}
              <Link href="/myocare" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative overflow-hidden rounded-xl">
                  <Image
                    src="/assets/logos/eyebottle-logo.png"
                    alt="Eyebottle Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight">근시케어 차트</span>
                  <span className="text-xs sm:text-sm text-slate-500">MyoCare Chart</span>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-200 ml-3">Beta</span>
              </Link>
            </div>

            {/* 메인 네비게이션 */}
            <nav className="hidden lg:flex space-x-2 ml-8">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 우측 버튼 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <QuickNavMenu />
            <div className="hidden sm:block">
              <DemoVideoButton url="https://youtu.be/pgTEwTZTKlk?si=vHAW42IClD6Q2Nvx" />
            </div>
            
            <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 h-9 w-9 sm:h-11 sm:w-11">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}