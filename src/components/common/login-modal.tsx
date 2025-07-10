'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    console.log('로그인 시도');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-start justify-center p-2 sm:p-4 pt-4 sm:pt-8 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl my-auto min-h-0 max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
        {/* 모달 헤더 - 고정 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">로그인</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* 모달 바디 - 스크롤 가능 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <p className="text-sm text-slate-500 font-medium text-center mb-4 sm:mb-6">
            아이보틀 계정으로 시작하세요
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* 이메일 입력 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                이메일
              </label>
              <input 
                type="email" 
                placeholder="doctor@hospital.com"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                비밀번호
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            {/* 로그인 옵션 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/20" 
                />
                <span className="ml-2 text-sm text-slate-600">로그인 상태 유지</span>
              </label>
              <button 
                type="button" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700"
            >
              로그인
            </button>

            {/* 구분선 */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">또는</span>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                계정이 없으신가요?{' '}
                <button 
                  type="button" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  회원가입
                </button>
              </p>
            </div>

            {/* 소셜 로그인 */}
            <div className="pt-1 sm:pt-2">
              <button 
                type="button"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 sm:py-3 rounded-xl font-medium border border-slate-200 transition-all duration-200 flex items-center justify-center space-x-2"
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
  );
}