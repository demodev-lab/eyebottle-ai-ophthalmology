'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { QuickNavMenu } from '@/components/common/quick-nav-menu'
import { ExamTypeSelector } from '@/components/exam-results/exam-type-selector'
import { DiabeticExamPage } from '@/components/exam-results/diabetic/diabetic-exam-page'
import { HypertensionExamPage } from '@/components/exam-results/hypertension/hypertension-exam-page'
import { ComprehensiveExamPage } from '@/components/exam-results/comprehensive/comprehensive-exam-page'
import { ExamType } from '@/types/exam-results'

export default function ExamResultsPage() {
  const [selectedType, setSelectedType] = useState<ExamType>(null)

  const handleBackToHome = () => {
    setSelectedType(null)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <QuickNavMenu />
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        {selectedType === null && (
          <div className="max-w-6xl mx-auto print-hide">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                홈으로 돌아가기
              </Link>
            </div>
            
            <ExamTypeSelector onSelectType={setSelectedType} />
          </div>
        )}

        {selectedType === 'diabetic' && (
          <DiabeticExamPage onBack={handleBackToHome} />
        )}

        {selectedType === 'hypertension' && (
          <HypertensionExamPage onBack={handleBackToHome} />
        )}

        {selectedType === 'comprehensive' && (
          <ComprehensiveExamPage onBack={handleBackToHome} />
        )}
      </div>

      {/* 인쇄용 스타일 */}
      <style jsx global>{`
        @media print {
          /* 인쇄 시 숨길 요소들 */
          .print-hide {
            display: none !important;
          }
          
          /* 인쇄 시 보여야 할 요소들 강제 표시 */
          .print-show {
            display: block !important;
          }
          
          /* 미리보기 영역 최적화 */
          #diabetic-preview,
          #hypertension-preview,
          #comprehensive-preview {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20pt !important;
          }
          
          /* 인쇄용 폰트 크기 정의 - pt 단위 사용 */
          body { font-size: 12pt; }
          h1 { font-size: 18pt; }
          h2 { font-size: 16pt; }
          h3 { font-size: 14pt; }
          
          /* 색상 최적화 - 인쇄용 */
          * {
            color: black !important;
            background: white !important;
          }
          
          /* 한 페이지 인쇄를 위한 공간 최적화 */
          .space-y-6 > * + * { margin-top: 12pt !important; }
          .space-y-4 > * + * { margin-top: 8pt !important; }
          .space-y-3 > * + * { margin-top: 6pt !important; }
          .space-y-2 > * + * { margin-top: 4pt !important; }
        }
      `}</style>
    </>
  )
}