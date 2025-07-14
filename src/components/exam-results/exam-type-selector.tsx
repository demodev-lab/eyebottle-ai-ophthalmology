'use client'

import { Eye, Heart, Activity } from 'lucide-react'
import { ExamType } from '@/types/exam-results'

interface ExamTypeSelectorProps {
  onSelectType: (type: ExamType) => void
}

export function ExamTypeSelector({ onSelectType }: ExamTypeSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto print-hide">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        검진 결과 작성
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 당뇨망막병증 */}
        <button
          onClick={() => onSelectType('diabetic')}
          className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Eye className="w-12 h-12 text-red-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">당뇨망막병증 검진</h3>
            <p className="text-gray-600 text-sm">
              DM 환자의 망막병증 단계 평가 및 추적 검사 결과서
            </p>
          </div>
        </button>

        {/* 고혈압망막병증 */}
        <button
          onClick={() => onSelectType('hypertension')}
          className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Heart className="w-12 h-12 text-yellow-700 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">고혈압망막병증 검진</h3>
            <p className="text-gray-600 text-sm">
              HTN 환자의 망막 혈관 변화 평가 결과서
            </p>
          </div>
        </button>

        {/* 눈종합검진 */}
        <button
          onClick={() => onSelectType('comprehensive')}
          className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Activity className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">눈종합검진</h3>
            <p className="text-gray-600 text-sm">
              시력, 안압, 안저 등 종합적인 눈 건강 검사 결과서 (2페이지)
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}