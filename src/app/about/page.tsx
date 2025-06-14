"use client";

import Image from "next/image";
import { Eye, Users, Calendar, Award, ChevronRight, Mail, Building, GraduationCap, Users2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Image
                src="/eyebottle-logo.png"
                alt="아이보틀 로고"
                width={120}
                height={120}
                className="mx-auto rounded-2xl shadow-lg ring-1 ring-slate-200/50"
              />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
              이동은 안과 전문의
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 font-light">
              눈을 넘어 마음까지 치료하는 의사가 되겠습니다
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg lg:text-xl text-slate-700 leading-relaxed">
              안녕하세요! 원장 이동은입니다. 환자분들의 눈 건강을 위해 최선을 다하고 있으며, 
              최신 의료 기술과 따뜻한 마음으로 진료하고 있습니다. 여러분의 밝은 내일을 위해 
              함께하겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">1000+</h3>
              <p className="text-lg text-slate-600">수술 건수</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">10+</h3>
              <p className="text-lg text-slate-600">년 경력</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">5000+</h3>
              <p className="text-lg text-slate-600">치료 증례</p>
            </div>
          </div>
        </div>
      </section>

      {/* 전문 진료 분야 Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12">
            전문 진료 분야
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "백내장", description: "선명한 시야를 되찾아드립니다" },
              { title: "녹내장", description: "조기 진단과 체계적인 관리" },
              { title: "소아안과", description: "아이들의 눈 건강을 지켜드립니다" },
              { title: "드림렌즈", description: "수술 없이 시력을 교정합니다" },
              { title: "마이오사이트", description: "근시 진행을 효과적으로 억제" },
              { title: "콘택트렌즈", description: "맞춤형 렌즈 처방 및 관리" }
            ].map((item, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 mb-4">{item.description}</p>
                <a href="#" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                  자세히 보기 <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 정보 Section */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12">
            정보
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* 기본 정보 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">기본 정보</h3>
              </div>
              <div className="space-y-3 text-slate-600">
                <p><span className="font-semibold">성명:</span> 이동은</p>
                <p><span className="font-semibold">전문분야:</span> 백내장, 녹내장, 소아안과</p>
                <p><span className="font-semibold">진료시간:</span> 평일 09:00 - 18:00</p>
              </div>
            </div>

            {/* 경력 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">경력</h3>
              </div>
              <div className="space-y-3 text-slate-600">
                <p>• 부산 혁신안과 원장 (현재)</p>
                <p>• 서울대학교병원 안과 전공의</p>
                <p>• 삼성서울병원 안과 임상강사</p>
              </div>
            </div>

            {/* 학력 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">학력</h3>
              </div>
              <div className="space-y-3 text-slate-600">
                <p>• 서울대학교 의과대학 졸업</p>
                <p>• 서울대학교 의학대학원 석사</p>
                <p>• 서울대학교 의학대학원 박사</p>
              </div>
            </div>

            {/* 소속 및 회원 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <Users2 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">소속 및 회원</h3>
              </div>
              <div className="space-y-3 text-slate-600">
                <p>• 대한안과학회 정회원</p>
                <p>• 한국백내장굴절수술학회 정회원</p>
                <p>• 한국녹내장학회 정회원</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Card */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white text-center">
              <h3 className="text-2xl font-bold mb-2">원장 이동은</h3>
              <p className="text-lg mb-4">부산 혁신안과</p>
              <a href="mailto:lde@eyebottle.kr" className="inline-flex items-center text-white/90 hover:text-white">
                <Mail className="w-5 h-5 mr-2" />
                lde@eyebottle.kr
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}