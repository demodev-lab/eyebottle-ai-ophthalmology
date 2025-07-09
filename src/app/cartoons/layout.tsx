"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FilmIcon, Settings } from "lucide-react";
import { checkAdminAuth } from "@/lib/cartoon-storage";

export default function CartoonsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const isAdminPage = pathname.includes("/admin");
  
  useEffect(() => {
    setIsAdminAuth(checkAdminAuth());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* 헤더 */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            {/* 로고 */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* 홈 버튼 */}
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden sm:inline text-base font-medium">홈</span>
                </Link>
                
                <div className="h-4 w-px bg-slate-300" />
                
                {/* 로고 */}
                <Link href="/cartoons" className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FilmIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight">안과 만화</span>
                    <span className="text-xs sm:text-sm text-slate-500">Eye Care Comics</span>
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-200 ml-3">Beta</span>
                </Link>
              </div>
            </div>
            
            {/* 관리자 메뉴 */}
            {isAdminAuth && !isAdminPage && (
              <Link
                href="/cartoons/admin"
                className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">관리자</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-600">
            <p>© 2025 아이보틀. 안과 만화는 의학적 조언을 대체할 수 없습니다.</p>
            <p className="mt-1">정확한 진단과 치료는 전문의와 상담하세요.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}