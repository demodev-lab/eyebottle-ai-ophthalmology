'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { HypertensionData } from '@/types/exam-results'
import { PatientInfoForm } from '../common/patient-info-form'
import { VisionTestForm } from '../common/vision-test-form'
import { IopTestForm } from '../common/iop-test-form'
import { HypertensionFundusForm } from './hypertension-fundus-form'
import { HypertensionPreview } from './hypertension-preview'
import { getHypertensionRetinopathyInfo } from '@/lib/exam-results-utils'
import { pdf } from '@react-pdf/renderer'
import { HypertensionReportPDF } from '@/components/pdf/exam-pdf'

interface HypertensionExamPageProps {
  onBack: () => void
}

export function HypertensionExamPage({ onBack }: HypertensionExamPageProps) {
  const today = new Date().toISOString().split('T')[0]
  
  const [hypertensionData, setHypertensionData] = useState<HypertensionData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '',
    summary: {
      stage: '',
      bloodPressureTarget: '',
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
    const info = getHypertensionRetinopathyInfo(hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage)
    setHypertensionData(prev => ({
      ...prev,
      summary: {
        stage: info.message,
        bloodPressureTarget: info.bloodPressureTarget,
        followUp: info.followUp
      }
    }))
  }, [hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage])

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    const blob = await pdf(<HypertensionReportPDF data={hypertensionData} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `고혈압망막병증_검진결과_${hypertensionData.name}_${hypertensionData.examDate}.pdf`
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
        <h2 className="text-2xl font-bold text-center flex-1">고혈압망막병증 검진 결과 입력</h2>
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
            name={hypertensionData.name}
            birthDate={hypertensionData.birthDate}
            examDate={hypertensionData.examDate}
            doctorName={hypertensionData.doctorName}
            onNameChange={(value) => setHypertensionData(prev => ({ ...prev, name: value }))}
            onBirthDateChange={(value) => setHypertensionData(prev => ({ ...prev, birthDate: value }))}
            onExamDateChange={(value) => setHypertensionData(prev => ({ ...prev, examDate: value }))}
            onDoctorNameChange={(value) => setHypertensionData(prev => ({ ...prev, doctorName: value }))}
          />

          <VisionTestForm
            vision={hypertensionData.vision}
            onVisionChange={(vision) => setHypertensionData(prev => ({ ...prev, vision }))}
          />

          <IopTestForm
            iop={hypertensionData.iop}
            onIopChange={(iop) => setHypertensionData(prev => ({ ...prev, iop }))}
          />

          <HypertensionFundusForm
            fundus={hypertensionData.fundus}
            onFundusChange={(fundus) => setHypertensionData(prev => ({ ...prev, fundus }))}
            onAutoFill={handleAutoFill}
          />
        </div>

        {/* 우측: 실시간 미리보기 (3/5) */}
        <div className="lg:col-span-3">
          <HypertensionPreview data={hypertensionData} />
        </div>
      </div>
    </div>
  )
}