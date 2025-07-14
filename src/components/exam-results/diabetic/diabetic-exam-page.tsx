'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { DiabeticData } from '@/types/exam-results'
import { PatientInfoForm } from '../common/patient-info-form'
import { VisionTestForm } from '../common/vision-test-form'
import { IopTestForm } from '../common/iop-test-form'
import { DiabeticFundusForm } from './diabetic-fundus-form'
import { DiabeticPreview } from './diabetic-preview'
import { getDiabeticRetinopathyInfo, getDiabeticRetinopathyPlan } from '@/lib/exam-results-utils'
import { pdf } from '@react-pdf/renderer'
import { DiabeticReportPDF } from '@/components/pdf/exam-pdf'

interface DiabeticExamPageProps {
  onBack: () => void
}

export function DiabeticExamPage({ onBack }: DiabeticExamPageProps) {
  const today = new Date().toISOString().split('T')[0]
  
  const [diabeticData, setDiabeticData] = useState<DiabeticData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '',
    summary: {
      stage: '',
      followUp: ''
    },
    vision: {
      od: { naked: '', corrected: '' },
      os: { naked: '', corrected: '' }
    },
    iop: {
      od: '',
      os: ''
    },
    fundus: {
      od: { stage: '', additional: '' },
      os: { stage: '', additional: '' }
    }
  })

  // 자동 입력 처리
  const handleAutoFill = useCallback(() => {
    const info = getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage)
    setDiabeticData(prev => ({
      ...prev,
      summary: {
        stage: info.message,
        followUp: info.followUp
      }
    }))
  }, [diabeticData.fundus.od.stage, diabeticData.fundus.os.stage])

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    const blob = await pdf(<DiabeticReportPDF data={diabeticData} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `당뇨망막병증_검진결과_${diabeticData.name}_${diabeticData.examDate}.pdf`
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
        <h2 className="text-2xl font-bold text-center flex-1">당뇨망막병증 검진 결과 입력</h2>
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
            name={diabeticData.name}
            birthDate={diabeticData.birthDate}
            examDate={diabeticData.examDate}
            doctorName={diabeticData.doctorName}
            onNameChange={(value) => setDiabeticData(prev => ({ ...prev, name: value }))}
            onBirthDateChange={(value) => setDiabeticData(prev => ({ ...prev, birthDate: value }))}
            onExamDateChange={(value) => setDiabeticData(prev => ({ ...prev, examDate: value }))}
            onDoctorNameChange={(value) => setDiabeticData(prev => ({ ...prev, doctorName: value }))}
          />

          <VisionTestForm
            vision={diabeticData.vision}
            onVisionChange={(vision) => setDiabeticData(prev => ({ ...prev, vision }))}
          />

          <IopTestForm
            iop={diabeticData.iop}
            onIopChange={(iop) => setDiabeticData(prev => ({ ...prev, iop }))}
          />

          <DiabeticFundusForm
            fundus={diabeticData.fundus}
            onFundusChange={(fundus) => setDiabeticData(prev => ({ ...prev, fundus }))}
            onAutoFill={handleAutoFill}
          />
        </div>

        {/* 우측: 실시간 미리보기 (3/5) */}
        <div className="lg:col-span-3">
          <DiabeticPreview data={diabeticData} />
        </div>
      </div>
    </div>
  )
}