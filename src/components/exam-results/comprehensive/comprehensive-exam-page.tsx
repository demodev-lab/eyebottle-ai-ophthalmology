'use client'

import { useState } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { ComprehensiveData } from '@/types/exam-results'
import { PatientInfoForm } from '../common/patient-info-form'
import { VisionTestForm } from '../common/vision-test-form'
import { IopTestForm } from '../common/iop-test-form'
import { pdf } from '@react-pdf/renderer'
import { ComprehensiveReportPDF } from '@/components/pdf/exam-pdf'

interface ComprehensiveExamPageProps {
  onBack: () => void
}

export function ComprehensiveExamPage({ onBack }: ComprehensiveExamPageProps) {
  const today = new Date().toISOString().split('T')[0]
  
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '',
    summary: {
      riskLevel: '',
      mainFindings: '',
      followUp: '',
      comprehensiveFinding: ''
    },
    vision: {
      od: { naked: '', corrected: '' },
      os: { naked: '', corrected: '' }
    },
    iop: {
      od: '',
      os: ''
    },
    basicExam: {
      refraction: '',
      externalEye: '',
      lens: '',
      fundus: ''
    },
    detailedExam: {
      topography: '',
      oct: '',
      visualField: '',
      sono: ''
    }
  })

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    const blob = await pdf(<ComprehensiveReportPDF data={comprehensiveData} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `눈종합검진_결과_${comprehensiveData.name}_${comprehensiveData.examDate}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 인쇄 기능
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 print-hide">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          돌아가기
        </button>
        <h2 className="text-2xl font-bold text-center flex-1">눈종합검진 결과 입력</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            인쇄
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            PDF 다운로드
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 좌측: 입력 폼 (2/5) */}
        <div className="lg:col-span-2 space-y-6 print-hide">
          <PatientInfoForm
            name={comprehensiveData.name}
            birthDate={comprehensiveData.birthDate}
            examDate={comprehensiveData.examDate}
            doctorName={comprehensiveData.doctorName}
            onNameChange={(value) => setComprehensiveData(prev => ({ ...prev, name: value }))}
            onBirthDateChange={(value) => setComprehensiveData(prev => ({ ...prev, birthDate: value }))}
            onExamDateChange={(value) => setComprehensiveData(prev => ({ ...prev, examDate: value }))}
            onDoctorNameChange={(value) => setComprehensiveData(prev => ({ ...prev, doctorName: value }))}
          />

          <VisionTestForm
            vision={comprehensiveData.vision}
            onVisionChange={(vision) => setComprehensiveData(prev => ({ ...prev, vision }))}
          />

          <IopTestForm
            iop={comprehensiveData.iop}
            onIopChange={(iop) => setComprehensiveData(prev => ({ ...prev, iop }))}
          />

          {/* 기본 검사 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">기본 검사</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">굴절 검사</label>
                <textarea
                  value={comprehensiveData.basicExam.refraction}
                  onChange={(e) => setComprehensiveData(prev => ({
                    ...prev,
                    basicExam: { ...prev.basicExam, refraction: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">외안부 검사</label>
                <textarea
                  value={comprehensiveData.basicExam.externalEye}
                  onChange={(e) => setComprehensiveData(prev => ({
                    ...prev,
                    basicExam: { ...prev.basicExam, externalEye: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 정밀 검사 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">정밀 검사</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">각막 지형도</label>
                <textarea
                  value={comprehensiveData.detailedExam.topography}
                  onChange={(e) => setComprehensiveData(prev => ({
                    ...prev,
                    detailedExam: { ...prev.detailedExam, topography: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OCT</label>
                <textarea
                  value={comprehensiveData.detailedExam.oct}
                  onChange={(e) => setComprehensiveData(prev => ({
                    ...prev,
                    detailedExam: { ...prev.detailedExam, oct: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 실시간 미리보기 (3/5) */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4 print-hide">
              <h3 className="text-lg font-semibold">실시간 미리보기</h3>
            </div>
            
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">눈종합검진 결과서</h1>
              </div>
              
              <div className="text-center text-gray-600">
                종합검진 미리보기 구현 예정
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}