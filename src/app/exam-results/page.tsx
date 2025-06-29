'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, FileText, Printer, Eye, Heart, Activity, Play } from 'lucide-react'
import { QuickNavMenu } from '@/components/common/quick-nav-menu'
import { pdf } from '@react-pdf/renderer'
import { DiabeticReportPDF, HypertensionReportPDF, ComprehensiveReportPDF } from '@/components/pdf/exam-pdf'

// 검진 타입 정의
type ExamType = 'diabetic' | 'hypertension' | 'comprehensive' | null

// 공통 환자 정보 타입
interface PatientInfo {
  name: string
  birthDate: string
  examDate: string
  doctorName: string
}

// 각 검진별 데이터 타입
interface DiabeticData extends PatientInfo {
  summary: {
    stage: string
    followUp: string
  }
  vision: {
    od: { naked: string; corrected: string }
    os: { naked: string; corrected: string }
  }
  iop: {
    od: string
    os: string
  }
  fundus: {
    od: { stage: string; additional: string }
    os: { stage: string; additional: string }
  }
}

interface HypertensionData extends PatientInfo {
  summary: {
    stage: string
    bloodPressureTarget: string
    followUp: string
  }
  fundus: {
    od: { stage: string; additional: string }
    os: { stage: string; additional: string }
  }
  vision: {
    od: { naked: string; corrected: string }
    os: { naked: string; corrected: string }
  }
  iop: {
    od: string
    os: string
  }
}

interface ComprehensiveData extends PatientInfo {
  summary: {
    riskLevel: string
    mainFindings: string
    followUp: string
    comprehensiveFinding: string  // 종합소견 추가
  }
  vision: {
    od: { naked: string; corrected: string }
    os: { naked: string; corrected: string }
  }
  iop: {
    od: string
    os: string
  }
  basicExam: {
    refraction: string
    externalEye: string
    lens: string
    fundus: string
  }
  detailedExam: {
    topography: string
    oct: string
    visualField: string
    sono: string  // 안구초음파로 변경
  }
}

export default function ExamResultsPage() {
  const [selectedType, setSelectedType] = useState<ExamType>(null)
  
  // 오늘 날짜 자동 설정
  const today = new Date().toISOString().split('T')[0]
  
  // 당뇨망막병증 단계별 멘트 및 추적 간격 설정
  const getDiabeticRetinopathyInfo = (odStage: string, osStage: string) => {
    const stages = ['정상', '경증 비증식 당뇨망막병증', '중등도 비증식 당뇨망막병증', '중증 비증식 당뇨망막병증', '증식 당뇨망막병증']
    const odIndex = stages.indexOf(odStage)
    const osIndex = stages.indexOf(osStage)
    const maxIndex = Math.max(odIndex, osIndex) // 더 심한 단계 선택
    const maxStage = stages[maxIndex]
    
    const stageInfo = {
      '정상': {
        message: '정상 소견 — 당뇨망막병증의 징후가 관찰되지 않습니다.',
        followUp: '6개월'
      },
      '경증 비증식 당뇨망막병증': {
        message: '경증 비증식 당뇨망막병증 — 시력에 큰 영향 없는 초기 단계입니다.',
        followUp: '6개월'
      },
      '중등도 비증식 당뇨망막병증': {
        message: '중등도 비증식 당뇨망막병증 — 진행을 늦추기 위한 적극적인 혈당 관리가 필요합니다.',
        followUp: '2~3개월'
      },
      '중증 비증식 당뇨망막병증': {
        message: '중증 비증식 당뇨망막병증 — 증식 단계로의 진행 위험이 높아 면밀한 추적 관찰과 치료가 필요합니다.',
        followUp: '담당의사 권고에 따라'
      },
      '증식 당뇨망막병증': {
        message: '증식 당뇨망막병증 — 신생혈관으로 인한 심각한 시력 손상 위험이 있어 즉시 치료가 필요합니다.',
        followUp: '담당의사 권고에 따라'
      }
    }
    
    return stageInfo[maxStage as keyof typeof stageInfo] || stageInfo['정상']
  }
  
  // 당뇨망막병증 단계별 통합 해석 & 향후 계획
  const getDiabeticRetinopathyPlan = (odStage: string, osStage: string) => {
    const stages = ['정상', '경증 비증식 당뇨망막병증', '중등도 비증식 당뇨망막병증', '중증 비증식 당뇨망막병증', '증식 당뇨망막병증']
    const odIndex = stages.indexOf(odStage)
    const osIndex = stages.indexOf(osStage)
    const maxIndex = Math.max(odIndex, osIndex)
    const maxStage = stages[maxIndex]
    
    const planInfo = {
      '정상': '현재 당뇨망막병증의 징후가 없어 양호한 상태입니다. **정기적인 혈당 관리와 연 1-2회 안저 검사**로 조기 발견에 힘쓰시기 바랍니다.',
      '경증 비증식 당뇨망막병증': '현재 검사 결과는 초기 단계이며 시력과 일상생활에는 영향이 없습니다. **혈당 관리와 정기 검진**을 꾸준히 이어가시면 됩니다.',
      '중등도 비증식 당뇨망막병증': '진행 속도를 늦추기 위해 **엄격한 혈당·혈압 조절**이 필요합니다. 정기적인 안과 추적 검사를 통해 상태 변화를 면밀히 관찰하겠습니다.',
      '중증 비증식 당뇨망막병증': '증식 단계로의 진행 위험이 높은 상태입니다. **레이저 치료나 안내 주사 등의 적극적인 치료**를 고려해야 하며, 담당의와 상의하여 치료 계획을 수립하겠습니다.',
      '증식 당뇨망막병증': '신생혈관으로 인한 심각한 합병증 위험이 있어 **즉시 레이저 치료나 유리체 절제술 등의 수술적 치료**가 필요합니다. 시력 보존을 위해 신속한 치료를 진행하겠습니다.'
    }
    
    return planInfo[maxStage as keyof typeof planInfo] || planInfo['정상']
  }

  // 고혈압망막병증 단계별 요약 정보 & 추적 간격
  const getHypertensionRetinopathyInfo = (odStage: string, osStage: string) => {
    const stages = ['정상', '1기 고혈압망막병증', '2기 고혈압망막병증', '3기 고혈압망막병증', '4기 고혈압망막병증']
    const odIndex = stages.indexOf(odStage)
    const osIndex = stages.indexOf(osStage)
    const maxIndex = Math.max(odIndex, osIndex) // 더 심한 단계 선택
    const maxStage = stages[maxIndex]
    
    const stageInfo = {
      '정상': {
        message: '정상 소견 — 고혈압성 망막 변화가 관찰되지 않습니다.',
        followUp: '12개월',
        bloodPressureTarget: '130/80'
      },
      '1기 고혈압망막병증': {
        message: '경미한 동맥 협착 — 시력에 영향 없는 초기 변화입니다.',
        followUp: '6개월',
        bloodPressureTarget: '130/80'
      },
      '2기 고혈압망막병증': {
        message: '동맥 경화 진행 — 혈압 조절로 진행을 늦출 수 있습니다.',
        followUp: '3개월',
        bloodPressureTarget: '125/75'
      },
      '3기 고혈압망막병증': {
        message: '출혈·면화반 관찰 — 적극적인 혈압 관리가 필요합니다.',
        followUp: '1~2개월',
        bloodPressureTarget: '120/70'
      },
      '4기 고혈압망막병증': {
        message: '시신경 부종 동반 — 즉시 혈압 조절과 치료가 필요합니다.',
        followUp: '담당의사 권고에 따라',
        bloodPressureTarget: '120/70'
      }
    }
    
    return stageInfo[maxStage as keyof typeof stageInfo] || stageInfo['정상']
  }

  // 고혈압망막병증 단계별 안저 소견
  const getHypertensionFundusFindings = (odStage: string, osStage: string) => {
    const stages = ['정상', '1기 고혈압망막병증', '2기 고혈압망막병증', '3기 고혈압망막병증', '4기 고혈압망막병증']
    const odIndex = stages.indexOf(odStage)
    const osIndex = stages.indexOf(osStage)
    const maxIndex = Math.max(odIndex, osIndex)
    const maxStage = stages[maxIndex]
    
    const findingsInfo = {
      '정상': '망막 혈관과 시신경에 특이 소견이 없습니다.',
      '1기 고혈압망막병증': '경미한 동맥 협착이 관찰되나 출혈이나 부종은 없습니다.',
      '2기 고혈압망막병증': '동맥 경화와 정맥 압박이 관찰되나 출혈은 없습니다.',
      '3기 고혈압망막병증': '출혈, 면화반이 관찰되어 적극적인 관리가 필요합니다.',
      '4기 고혈압망막병증': '시신경 부종이 동반되어 즉시 치료가 필요한 상태입니다.'
    }
    
    return findingsInfo[maxStage as keyof typeof findingsInfo] || findingsInfo['정상']
  }

  // 고혈압망막병증 단계별 통합 해석 & 향후 계획  
  const getHypertensionRetinopathyPlan = (odStage: string, osStage: string) => {
    const stages = ['정상', '1기 고혈압망막병증', '2기 고혈압망막병증', '3기 고혈압망막병증', '4기 고혈압망막병증']
    const odIndex = stages.indexOf(odStage)
    const osIndex = stages.indexOf(osStage)
    const maxIndex = Math.max(odIndex, osIndex)
    const maxStage = stages[maxIndex]
    
    const planInfo = {
      '정상': '현재 고혈압성 망막 변화가 없어 양호한 상태입니다. **정기적인 혈압 관리와 연 1회 안저 검사**로 조기 발견에 힘쓰시기 바랍니다.',
      '1기 고혈압망막병증': '현재 검사 결과는 초기 단계이며 시력과 일상생활에는 영향이 없습니다. **꾸준한 혈압 관리와 정기 검진**을 이어가시면 됩니다.',
      '2기 고혈압망막병증': '동맥 경화가 진행되고 있어 **엄격한 혈압 조절**이 필요합니다. 정기적인 안과 검진을 통해 진행 속도를 늦추겠습니다.',
      '3기 고혈압망막병증': '망막 출혈과 허혈 소견이 있어 **적극적인 혈압 조절과 약물 치료**가 필요합니다. 시력 저하 방지를 위해 면밀한 추적 관찰하겠습니다.',
      '4기 고혈압망막병증': '시신경 부종으로 인한 심각한 시력 손상 위험이 있어 **즉시 입원 치료나 응급 혈압 조절**이 필요합니다. 신속한 치료를 진행하겠습니다.'
    }
    
    return planInfo[maxStage as keyof typeof planInfo] || planInfo['정상']
  }
  
  // 각 검진별 초기 데이터
  const [diabeticData, setDiabeticData] = useState<DiabeticData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '이동은',
    summary: {
      stage: '경증 비증식 당뇨망막병증',
      followUp: '6개월'
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
      od: { stage: '경증 비증식 당뇨망막병증', additional: '—' },
      os: { stage: '경증 비증식 당뇨망막병증', additional: '—' }
    }
  })

  const [hypertensionData, setHypertensionData] = useState<HypertensionData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '이동은',
    summary: {
      stage: '1기 고혈압망막병증',
      bloodPressureTarget: '130/80',
      followUp: '6개월'
    },
    fundus: {
      od: { stage: '1기 고혈압망막병증', additional: '—' },
      os: { stage: '1기 고혈압망막병증', additional: '—' }
    },
    vision: {
      od: { naked: '', corrected: '' },
      os: { naked: '', corrected: '' }
    },
    iop: {
      od: '',
      os: ''
    }
  })

  // 눈종합검진 위험도별 자동 멘트 시스템
  const getComprehensiveRiskInfo = (riskLevel: string) => {
    const riskInfo = {
      '정상': {
        summary: '전반적 상태 양호 — 특이 소견 없이 건강한 눈 상태입니다',
        mainFindings: '특이 소견 없음',
        followUp: '12개월',
        comprehensiveFinding: '정기적인 검진을 통해 건강한 눈 상태를 유지하시기 바랍니다.'
      },
      '경미한': {
        summary: '경미한 이상 — 일상생활에 지장 없는 가벼운 문제가 관찰됩니다',
        mainFindings: '경미한 이상 소견',
        followUp: '6개월',
        comprehensiveFinding: '경미한 이상이 있으나 일상생활에는 지장이 없습니다. 정기적인 추적 관찰이 필요합니다.'
      },
      '중등도': {
        summary: '중등도 이상 — 정기적인 관찰과 관리가 필요한 상태입니다',
        mainFindings: '중등도 이상 소견',
        followUp: '3개월',
        comprehensiveFinding: '적극적인 관리와 치료가 필요한 상태입니다. 담당의와 상의하여 치료 계획을 수립하시기 바랍니다.'
      },
      '심각한': {
        summary: '심각한 이상 — 즉시 치료가 필요한 문제가 발견되었습니다',
        mainFindings: '심각한 이상 소견',
        followUp: '즉시 재검 필요',
        comprehensiveFinding: '심각한 문제가 발견되어 즉각적인 치료가 필요합니다. 조속히 정밀 검사 및 치료를 시작하시기 바랍니다.'
      }
    }
    
    return riskInfo[riskLevel as keyof typeof riskInfo] || riskInfo['정상']
  }

  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '이동은',
    summary: {
      riskLevel: '정상',
      mainFindings: '특이 소견 없음',
      followUp: '12개월',
      comprehensiveFinding: '정기적인 검진을 통해 건강한 눈 상태를 유지하시기 바랍니다.'
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
      refraction: '정상',
      externalEye: '정상',
      lens: '투명',
      fundus: '정상'
    },
    detailedExam: {
      topography: '정상',
      oct: '정상',
      visualField: '정상',
      sono: '정상'
    }
  })

  // 직접입력 모드 상태 관리
  const [directInputMode, setDirectInputMode] = useState({
    refraction: false,
    externalEye: false,
    lens: false,
    fundus: false,
    topography: false,
    oct: false,
    visualField: false,
    sono: false
  })

  // 고혈압망막병증 양안 단계 변경 시 자동 요약 업데이트
  useEffect(() => {
    const hypertensionInfo = getHypertensionRetinopathyInfo(hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage)
    setHypertensionData(prevData => ({
      ...prevData,
      summary: {
        ...prevData.summary,
        stage: hypertensionInfo.message.split(' — ')[0], // "경미한 동맥 협착" 부분만 추출
        bloodPressureTarget: hypertensionInfo.bloodPressureTarget,
        followUp: hypertensionInfo.followUp
      }
    }))
  }, [hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage])

  // 눈종합검진 위험도 변경 시 자동 멘트 업데이트
  useEffect(() => {
    const riskInfo = getComprehensiveRiskInfo(comprehensiveData.summary.riskLevel)
    setComprehensiveData(prevData => ({
      ...prevData,
      summary: {
        ...prevData.summary,
        mainFindings: riskInfo.mainFindings,
        followUp: riskInfo.followUp,
        comprehensiveFinding: riskInfo.comprehensiveFinding
      }
    }))
  }, [comprehensiveData.summary.riskLevel])

  // PDF 다운로드 함수
  const handleDownloadPDF = async () => {
    try {
      let pdfComponent;
      let filename;
      
      switch (selectedType) {
        case 'diabetic':
          pdfComponent = <DiabeticReportPDF data={diabeticData} />;
          filename = `당뇨망막병증_검진결과_${diabeticData.name}_${diabeticData.examDate}.pdf`;
          break;
        case 'hypertension':
          pdfComponent = <HypertensionReportPDF data={hypertensionData} />;
          filename = `고혈압망막병증_검진결과_${hypertensionData.name}_${hypertensionData.examDate}.pdf`;
          break;
        case 'comprehensive':
          pdfComponent = <ComprehensiveReportPDF data={comprehensiveData} />;
          filename = `눈종합검사_결과_${comprehensiveData.name}_${comprehensiveData.examDate}.pdf`;
          break;
        default:
          return;
      }

      // PDF 생성 및 다운로드
      const blob = await pdf(pdfComponent).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF 다운로드 중 오류 발생:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }

  // 테스트용 전역 함수 노출
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testPDF = handleDownloadPDF;
    }
  }, [handleDownloadPDF]);

  // 기존 브라우저 인쇄 함수 (백업용)
  const handlePrint = () => {
    // 현재 선택된 템플릿에 따라 프린트할 컨텐츠의 ID를 결정
    const previewId = `${selectedType}-preview`;
    const previewElement = document.getElementById(previewId);

    if (previewElement) {
      // 1. 숨겨진 iframe 생성
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (iframeDoc) {
        // 2. 현재 문서의 스타일을 iframe으로 복사
        const links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
          if (links[i].rel === 'stylesheet') {
            const newLink = links[i].cloneNode(true);
            iframeDoc.head.appendChild(newLink);
          }
        }
        
        // Tailwind CSS 스타일시트 직접 추가
        // Next.js 개발 환경에서는 스타일이 동적으로 주입되므로, 정적 링크가 없을 수 있음
        const styleSheets = document.styleSheets;
        let tailwindStyles = '';
        for (let i = 0; i < styleSheets.length; i++) {
          try {
            const rules = styleSheets[i].cssRules;
            if (rules) {
              for (let j = 0; j < rules.length; j++) {
                tailwindStyles += rules[j].cssText;
              }
            }
          } catch (e) {
            console.warn('Cannot access stylesheet:', e);
          }
        }
        const styleEl = document.createElement('style');
        styleEl.textContent = tailwindStyles;
        iframeDoc.head.appendChild(styleEl);


        // 3. 프린트할 컨텐츠를 iframe의 body에 복사
        iframeDoc.body.innerHTML = previewElement.innerHTML;

        // 4. iframe 컨텐츠가 로드된 후 프린트 실행
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // 5. 프린트 후 iframe 제거
          document.body.removeChild(iframe);
        }, 500); // 스타일이 적용될 시간을 줍니다.
      }
    }
  };

  const renderTemplateSelector = () => (
    <div className="max-w-6xl mx-auto print-hide">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        검진 결과 작성
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 당뇨망막병증 */}
        <button
          onClick={() => setSelectedType('diabetic')}
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
          onClick={() => setSelectedType('hypertension')}
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
          onClick={() => setSelectedType('comprehensive')}
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

  const renderDiabeticForm = () => (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">당뇨망막병증 검진 결과 입력</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 좌측: 입력 폼 (2/5) */}
        <div className="lg:col-span-2 space-y-6 print-hide">
      
      {/* 환자 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">환자 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">환자명</label>
            <input
              type="text"
              value={diabeticData.name}
              onChange={(e) => setDiabeticData({...diabeticData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">생년월일</label>
            <input
              type="date"
              value={diabeticData.birthDate}
              onChange={(e) => setDiabeticData({...diabeticData, birthDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">검사일</label>
            <input
              type="date"
              value={diabeticData.examDate}
              onChange={(e) => setDiabeticData({...diabeticData, examDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">판독의</label>
            <input
              type="text"
              value={diabeticData.doctorName}
              onChange={(e) => setDiabeticData({...diabeticData, doctorName: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 시력 & 안압 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">시력 & 안압</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 시력 */}
          <div>
            <h4 className="font-medium mb-2">시력</h4>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">나안</th>
                  <th className="border p-2">교정</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">우안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={diabeticData.vision.od.naked}
                      onChange={(e) => setDiabeticData({
                        ...diabeticData,
                        vision: {
                          ...diabeticData.vision,
                          od: { ...diabeticData.vision.od, naked: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.6"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={diabeticData.vision.od.corrected}
                      onChange={(e) => setDiabeticData({
                        ...diabeticData,
                        vision: {
                          ...diabeticData.vision,
                          od: { ...diabeticData.vision.od, corrected: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="1.0"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">좌안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={diabeticData.vision.os.naked}
                      onChange={(e) => setDiabeticData({
                        ...diabeticData,
                        vision: {
                          ...diabeticData.vision,
                          os: { ...diabeticData.vision.os, naked: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.5"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={diabeticData.vision.os.corrected}
                      onChange={(e) => setDiabeticData({
                        ...diabeticData,
                        vision: {
                          ...diabeticData.vision,
                          os: { ...diabeticData.vision.os, corrected: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.9"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 안압 */}
          <div>
            <h4 className="font-medium mb-2">안압 (mmHg)</h4>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">우안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={diabeticData.iop.od}
                      onChange={(e) => setDiabeticData({
                        ...diabeticData,
                        iop: { ...diabeticData.iop, od: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="17"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">좌안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={diabeticData.iop.os}
                      onChange={(e) => setDiabeticData({
                        ...diabeticData,
                        iop: { ...diabeticData.iop, os: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="18"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 안저 검사 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">안저 검사</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">우안 단계</label>
            <select
              value={diabeticData.fundus.od.stage}
              onChange={(e) => setDiabeticData({
                ...diabeticData,
                fundus: {
                  ...diabeticData.fundus,
                  od: { ...diabeticData.fundus.od, stage: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="정상">정상</option>
              <option value="경증 비증식 당뇨망막병증">경증 비증식 당뇨망막병증</option>
              <option value="중등도 비증식 당뇨망막병증">중등도 비증식 당뇨망막병증</option>
              <option value="중증 비증식 당뇨망막병증">중증 비증식 당뇨망막병증</option>
              <option value="증식 당뇨망막병증">증식 당뇨망막병증</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">좌안 단계</label>
            <select
              value={diabeticData.fundus.os.stage}
              onChange={(e) => setDiabeticData({
                ...diabeticData,
                fundus: {
                  ...diabeticData.fundus,
                  os: { ...diabeticData.fundus.os, stage: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="정상">정상</option>
              <option value="경증 비증식 당뇨망막병증">경증 비증식 당뇨망막병증</option>
              <option value="중등도 비증식 당뇨망막병증">중등도 비증식 당뇨망막병증</option>
              <option value="중증 비증식 당뇨망막병증">중증 비증식 당뇨망막병증</option>
              <option value="증식 당뇨망막병증">증식 당뇨망막병증</option>
            </select>
          </div>
        </div>
      </div>
        </div>
        
        {/* 우측: 실시간 미리보기 (3/5) */}
        <div className="lg:col-span-3">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4 print-hide">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                실시간 미리보기
              </h3>
              <div className="text-sm text-gray-600 mb-4">
                입력하는 내용이 실시간으로 반영됩니다
              </div>
              <button
                onClick={handlePrint}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                인쇄/PDF
              </button>
            </div>
            
            {/* 미리보기 내용 */}
            <div className="border border-gray-300 rounded-lg bg-white overflow-hidden print-hide" style={{transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: 'auto'}}>
              {renderDiabeticPreview()}
            </div>
            
            {/* 인쇄 전용 내용 (화면에서는 숨김) */}
            <div className="hidden print:block">
              {renderDiabeticPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderHypertensionForm = () => (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">고혈압망막병증 검진 결과 입력</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 좌측: 입력 폼 (2/5) */}
        <div className="lg:col-span-2 space-y-6 print-hide">
      
      {/* 환자 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">환자 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">환자명</label>
            <input
              type="text"
              value={hypertensionData.name}
              onChange={(e) => setHypertensionData({...hypertensionData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">생년월일</label>
            <input
              type="date"
              value={hypertensionData.birthDate}
              onChange={(e) => setHypertensionData({...hypertensionData, birthDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">검사일</label>
            <input
              type="date"
              value={hypertensionData.examDate}
              onChange={(e) => setHypertensionData({...hypertensionData, examDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">판독의</label>
            <input
              type="text"
              value={hypertensionData.doctorName}
              onChange={(e) => setHypertensionData({...hypertensionData, doctorName: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 안저 검사 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">안저 검사</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">우안 단계</label>
            <select
              value={hypertensionData.fundus.od.stage}
              onChange={(e) => setHypertensionData({
                ...hypertensionData,
                fundus: {
                  ...hypertensionData.fundus,
                  od: { ...hypertensionData.fundus.od, stage: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="정상">정상</option>
              <option value="1기 고혈압망막병증">1기 고혈압망막병증</option>
              <option value="2기 고혈압망막병증">2기 고혈압망막병증</option>
              <option value="3기 고혈압망막병증">3기 고혈압망막병증</option>
              <option value="4기 고혈압망막병증">4기 고혈압망막병증</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">좌안 단계</label>
            <select
              value={hypertensionData.fundus.os.stage}
              onChange={(e) => setHypertensionData({
                ...hypertensionData,
                fundus: {
                  ...hypertensionData.fundus,
                  os: { ...hypertensionData.fundus.os, stage: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="정상">정상</option>
              <option value="1기 고혈압망막병증">1기 고혈압망막병증</option>
              <option value="2기 고혈압망막병증">2기 고혈압망막병증</option>
              <option value="3기 고혈압망막병증">3기 고혈압망막병증</option>
              <option value="4기 고혈압망막병증">4기 고혈압망막병증</option>
            </select>
          </div>
        </div>
      </div>

      {/* 시력 & 안압 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">시력 & 안압</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 시력 */}
          <div>
            <h4 className="font-medium mb-2">시력</h4>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">나안</th>
                  <th className="border p-2">교정</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">우안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={hypertensionData.vision.od.naked}
                      onChange={(e) => setHypertensionData({
                        ...hypertensionData,
                        vision: {
                          ...hypertensionData.vision,
                          od: { ...hypertensionData.vision.od, naked: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.7"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={hypertensionData.vision.od.corrected}
                      onChange={(e) => setHypertensionData({
                        ...hypertensionData,
                        vision: {
                          ...hypertensionData.vision,
                          od: { ...hypertensionData.vision.od, corrected: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="1.0"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">좌안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={hypertensionData.vision.os.naked}
                      onChange={(e) => setHypertensionData({
                        ...hypertensionData,
                        vision: {
                          ...hypertensionData.vision,
                          os: { ...hypertensionData.vision.os, naked: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.6"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={hypertensionData.vision.os.corrected}
                      onChange={(e) => setHypertensionData({
                        ...hypertensionData,
                        vision: {
                          ...hypertensionData.vision,
                          os: { ...hypertensionData.vision.os, corrected: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.9"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 안압 */}
          <div>
            <h4 className="font-medium mb-2">안압 (mmHg)</h4>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">우안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={hypertensionData.iop.od}
                      onChange={(e) => setHypertensionData({
                        ...hypertensionData,
                        iop: { ...hypertensionData.iop, od: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="15"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">좌안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={hypertensionData.iop.os}
                      onChange={(e) => setHypertensionData({
                        ...hypertensionData,
                        iop: { ...hypertensionData.iop, os: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="16"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </div>
        
        {/* 우측: 실시간 미리보기 (3/5) */}
        <div className="lg:col-span-3">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4 print-hide">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                실시간 미리보기
              </h3>
              <div className="text-sm text-gray-600 mb-4">
                입력하는 내용이 실시간으로 반영됩니다
              </div>
              <button
                onClick={handlePrint}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                인쇄/PDF
              </button>
            </div>
            
            {/* 미리보기 내용 */}
            <div className="border border-gray-300 rounded-lg bg-white overflow-hidden print-hide" style={{transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: 'auto'}}>
              {renderHypertensionPreview()}
            </div>
            
            {/* 인쇄 전용 내용 (화면에서는 숨김) */}
            <div className="hidden print:block">
              {renderHypertensionPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderComprehensiveForm = () => (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">눈종합검진 결과 입력</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 좌측: 입력 폼 (2/5) */}
        <div className="lg:col-span-2 space-y-6 print-hide">
      
      {/* 환자 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">환자 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">환자명</label>
            <input
              type="text"
              value={comprehensiveData.name}
              onChange={(e) => setComprehensiveData({...comprehensiveData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">생년월일</label>
            <input
              type="date"
              value={comprehensiveData.birthDate}
              onChange={(e) => setComprehensiveData({...comprehensiveData, birthDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">검사일</label>
            <input
              type="date"
              value={comprehensiveData.examDate}
              onChange={(e) => setComprehensiveData({...comprehensiveData, examDate: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">판독의</label>
            <input
              type="text"
              value={comprehensiveData.doctorName}
              onChange={(e) => setComprehensiveData({...comprehensiveData, doctorName: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 요약 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">검진 요약</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">위험도</label>
            <select
              value={comprehensiveData.summary.riskLevel}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                summary: { ...comprehensiveData.summary, riskLevel: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="정상">정상</option>
              <option value="경미한">경미한</option>
              <option value="중등도">중등도</option>
              <option value="심각한">심각한</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">주요 소견</label>
            <input
              type="text"
              value={comprehensiveData.summary.mainFindings}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                summary: { ...comprehensiveData.summary, mainFindings: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="자동으로 채워지며, 직접 수정도 가능합니다"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">종합 소견</label>
            <textarea
              value={comprehensiveData.summary.comprehensiveFinding}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                summary: { ...comprehensiveData.summary, comprehensiveFinding: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="자동으로 채워지며, 직접 수정도 가능합니다"
            />
          </div>
        </div>
      </div>

      {/* 시력 & 안압 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">시력 & 안압</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 시력 */}
          <div>
            <h4 className="font-medium mb-2">시력</h4>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">나안</th>
                  <th className="border p-2">교정</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">우안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={comprehensiveData.vision.od.naked}
                      onChange={(e) => setComprehensiveData({
                        ...comprehensiveData,
                        vision: {
                          ...comprehensiveData.vision,
                          od: { ...comprehensiveData.vision.od, naked: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.8"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={comprehensiveData.vision.od.corrected}
                      onChange={(e) => setComprehensiveData({
                        ...comprehensiveData,
                        vision: {
                          ...comprehensiveData.vision,
                          od: { ...comprehensiveData.vision.od, corrected: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="1.0"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">좌안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={comprehensiveData.vision.os.naked}
                      onChange={(e) => setComprehensiveData({
                        ...comprehensiveData,
                        vision: {
                          ...comprehensiveData.vision,
                          os: { ...comprehensiveData.vision.os, naked: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.7"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={comprehensiveData.vision.os.corrected}
                      onChange={(e) => setComprehensiveData({
                        ...comprehensiveData,
                        vision: {
                          ...comprehensiveData.vision,
                          os: { ...comprehensiveData.vision.os, corrected: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="0.9"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 안압 */}
          <div>
            <h4 className="font-medium mb-2">안압 (mmHg)</h4>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">우안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={comprehensiveData.iop.od}
                      onChange={(e) => setComprehensiveData({
                        ...comprehensiveData,
                        iop: { ...comprehensiveData.iop, od: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="16"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">좌안</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={comprehensiveData.iop.os}
                      onChange={(e) => setComprehensiveData({
                        ...comprehensiveData,
                        iop: { ...comprehensiveData.iop, os: e.target.value }
                      })}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="17"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 기본 검사 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">기본 검사</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">굴절</label>
            {directInputMode.refraction ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.basicExam.refraction}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    basicExam: { ...comprehensiveData.basicExam, refraction: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, refraction: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, refraction: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.basicExam.refraction}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, refraction: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, refraction: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, refraction: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="경도 근시">경도 근시</option>
                <option value="중등도 근시">중등도 근시</option>
                <option value="고도 근시">고도 근시</option>
                <option value="경도 원시">경도 원시</option>
                <option value="규칙 난시">규칙 난시</option>
                <option value="불규칙 난시">불규칙 난시</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">외안부</label>
            {directInputMode.externalEye ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.basicExam.externalEye}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    basicExam: { ...comprehensiveData.basicExam, externalEye: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, externalEye: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, externalEye: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.basicExam.externalEye}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, externalEye: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, externalEye: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, externalEye: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="결막 충혈">결막 충혈</option>
                <option value="안검염">안검염</option>
                <option value="다래끼">다래끼</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">수정체</label>
            {directInputMode.lens ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.basicExam.lens}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    basicExam: { ...comprehensiveData.basicExam, lens: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, lens: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, lens: '투명' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.basicExam.lens}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, lens: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, lens: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, lens: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="투명">투명</option>
                <option value="경미한 혼탁">경미한 혼탁</option>
                <option value="백내장 의심">백내장 의심</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">안저</label>
            {directInputMode.fundus ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.basicExam.fundus}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    basicExam: { ...comprehensiveData.basicExam, fundus: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, fundus: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, fundus: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.basicExam.fundus}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, fundus: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, fundus: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      basicExam: { ...comprehensiveData.basicExam, fundus: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="망막변성">망막변성</option>
                <option value="시신경 창백">시신경 창백</option>
                <option value="출혈">출혈</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 정밀 검사 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">정밀 검사</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">각막지형도 검사</label>
            {directInputMode.topography ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.detailedExam.topography}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    detailedExam: { ...comprehensiveData.detailedExam, topography: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, topography: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, topography: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.detailedExam.topography}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, topography: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, topography: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, topography: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">망막단층촬영</label>
            {directInputMode.oct ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.detailedExam.oct}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    detailedExam: { ...comprehensiveData.detailedExam, oct: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, oct: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, oct: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.detailedExam.oct}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, oct: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, oct: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, oct: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">시야검사</label>
            {directInputMode.visualField ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.detailedExam.visualField}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    detailedExam: { ...comprehensiveData.detailedExam, visualField: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, visualField: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, visualField: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.detailedExam.visualField}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, visualField: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, visualField: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, visualField: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">초음파 검사</label>
            {directInputMode.sono ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprehensiveData.detailedExam.sono}
                  onChange={(e) => setComprehensiveData({
                    ...comprehensiveData,
                    detailedExam: { ...comprehensiveData.detailedExam, sono: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="직접 입력하세요"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDirectInputMode({ ...directInputMode, sono: false })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, sono: '정상' }
                    })
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
              </div>
            ) : (
              <select
                value={comprehensiveData.detailedExam.sono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '직접입력') {
                    setDirectInputMode({ ...directInputMode, sono: true })
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, sono: '' }
                    });
                  } else {
                    setComprehensiveData({
                      ...comprehensiveData,
                      detailedExam: { ...comprehensiveData.detailedExam, sono: value }
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="정상">정상</option>
                <option value="직접입력">직접입력...</option>
              </select>
            )}
          </div>
        </div>
      </div>
        </div>
        
        {/* 우측: 실시간 미리보기 (3/5) */}
        <div className="lg:col-span-3 sticky top-8 h-fit">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              실시간 미리보기
            </h3>
            <div className="text-sm text-gray-600 mb-4">
              입력하는 내용이 실시간으로 반영됩니다
            </div>
            <button
              onClick={handlePrint}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              인쇄/PDF
            </button>
          </div>
          
          {/* 미리보기 내용 */}
          <div className="border border-gray-300 rounded-lg bg-white overflow-y-auto max-h-[calc(100vh-200px)] print-hide" style={{transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', height: 'auto'}}>
            {renderComprehensivePreview()}
          </div>
          
          {/* 인쇄 전용 내용 (화면에서는 숨김) */}
          <div className="hidden print:block">
            {renderComprehensivePreview()}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDiabeticPreview = () => (
    <div id="diabetic-preview" className="bg-white p-8 space-y-6">
      {/* 인쇄용 스타일 */}
      <style jsx global>{`
        @media print {
          @page { 
            size: A4; 
            margin: 8mm;
          }
          
          /* 기본 설정 */
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-family: Arial, Verdana, sans-serif !important;
          }
          
          /* 인쇄 시 숨길 요소들 */
          .print-hide { display: none !important; }
          
          /* 인쇄 시 보여야 할 요소들 강제 표시 */
          #diabetic-preview .max-w-\\[18cm\\],
          #hypertension-preview .max-w-\\[18cm\\],
          #comprehensive-preview .max-w-\\[18cm\\] {
            display: block !important;
            visibility: visible !important;
          }
          
          /* 미리보기 영역 최적화 */
          .print-content { 
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* 각 검진서 전용 최적화 */
          #diabetic-preview,
          #hypertension-preview,
          #comprehensive-preview {
            padding: 0 !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
          }
          
          /* max-w-[18cm] 컨테이너 확실히 표시 */
          .max-w-\\[18cm\\] {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
            max-width: 100% !important;
          }
          
          /* 인쇄용 폰트 크기 정의 - pt 단위 사용 */
          h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 8pt !important;
            display: block !important;
            visibility: visible !important;
          }
          
          h2 {
            font-size: 18pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 6pt !important;
            display: block !important;
            visibility: visible !important;
          }
          
          h3 {
            font-size: 14pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 4pt !important;
          }
          
          p, span, div {
            font-size: 12pt !important;
            line-height: 1.5 !important;
            color: #000 !important;
          }
          
          /* 텍스트 크기 클래스 재정의 */
          .text-5xl { font-size: 24pt !important; }
          .text-4xl { font-size: 20pt !important; }
          .text-3xl { font-size: 18pt !important; }
          .text-2xl { font-size: 16pt !important; }
          .text-xl { font-size: 14pt !important; }
          .text-lg { font-size: 12pt !important; }
          .text-base { font-size: 11pt !important; }
          .text-sm { font-size: 10pt !important; }
          .text-xs { font-size: 9pt !important; }
          
          /* 헤더 가시성 확보 */
          header {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 2pt !important;
            padding: 12pt !important;
            padding-top: 14pt !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
            background-color: #f0f8ff !important;
            border: 1pt solid #ddd !important;
          }
          
          /* 모든 헤더의 h1 강제 표시 */
          header h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 8pt !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
          }
          
          /* 색상 최적화 - 인쇄용 */
          .bg-gradient-to-r,
          .from-blue-50,
          .to-indigo-50,
          .from-green-50,
          .to-emerald-50,
          .from-yellow-50,
          .to-amber-50,
          .from-red-50,
          .to-rose-50,
          .from-cyan-50,
          .to-teal-50 {
            background-color: #f5f5f5 !important;
            background-image: none !important;
          }
          
          /* 경계선 색상 최적화 */
          .border-blue-200 { border-color: #666 !important; }
          .border-green-500 { border-color: #333 !important; }
          .border-yellow-500 { border-color: #333 !important; }
          .border-red-500 { border-color: #333 !important; }
          .border-cyan-500 { border-color: #333 !important; }
          
          /* 텍스트 색상 최적화 */
          .text-gray-600, .text-gray-500 { color: #333 !important; }
          .text-gray-700, .text-gray-800 { color: #000 !important; }
          .text-green-700 { color: #006400 !important; }
          .text-yellow-700 { color: #8B8000 !important; }
          .text-orange-700 { color: #8B4500 !important; }
          .text-red-700 { color: #8B0000 !important; }
          .text-cyan-600 { color: #006064 !important; }
          
          /* 테이블 스타일 */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 8pt 0 !important;
          }
          
          th, td {
            border: 1pt solid #333 !important;
            padding: 6pt !important;
            font-size: 11pt !important;
          }
          
          thead {
            background-color: #e0e0e0 !important;
          }
          
          /* 레이아웃 단순화 */
          .grid {
            display: block !important;
          }
          
          .grid > div {
            margin-bottom: 12pt !important;
          }
          
          /* 불릿 포인트 */
          .bullet-point::before {
            content: "•";
            color: #000 !important;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
          
          /* 리스트 스타일 */
          ul, ol {
            margin-left: 20pt !important;
          }
          
          li {
            font-size: 12pt !important;
            line-height: 1.6 !important;
            margin-bottom: 4pt !important;
          }
          
          /* 검사 결과 박스 스타일 */
          .bg-gray-50 {
            background-color: #f5f5f5 !important;
            border: 1pt solid #333 !important;
            padding: 8pt !important;
            margin-bottom: 8pt !important;
          }
          
          /* 페이지 브레이크 관리 */
          section {
            page-break-inside: avoid !important;
          }
          
          footer {
            page-break-inside: avoid !important;
            margin-top: 16pt !important;
            padding-top: 8pt !important;
            border-top: 2pt solid #333 !important;
          }
          
          /* 이미지 최적화 */
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* SVG 아이콘 스타일 */
          svg {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            width: 24pt !important;
            height: 24pt !important;
          }
          
          /* 한 페이지 인쇄를 위한 공간 최적화 */
          .mb-8 { margin-bottom: 8pt !important; }
          .mb-6 { margin-bottom: 6pt !important; }
          .mb-4 { margin-bottom: 4pt !important; }
          
          .p-6 { padding: 6pt !important; }
          .p-5 { padding: 4pt !important; }
          .p-4 { padding: 4pt !important; }
          .p-3 { padding: 3pt !important; }
          
          /* 시력/안압 한 줄 배치 */
          .grid-cols-2 {
            display: flex !important;
            gap: 12pt !important;
          }
          
          .grid-cols-2 > div {
            flex: 1 !important;
          }
          
          /* 당뇨병 검진 특별 조정 - 증식 단계도 한 페이지에 */
          #diabetic-preview header {
            margin-bottom: 2pt !important;
            padding: 3pt !important;
          }
          
          #diabetic-preview section {
            margin-bottom: 3pt !important;
          }
          
          #diabetic-preview .text-xl {
            font-size: 10pt !important;
          }
          
          #diabetic-preview .text-lg {
            font-size: 9pt !important;
          }
          
          #diabetic-preview .text-base {
            font-size: 9pt !important;
          }
          
          #diabetic-preview footer {
            margin-top: 4pt !important;
            padding-top: 3pt !important;
          }
          
          /* 제목 섹션 높이 줄이기 */
          #diabetic-preview h1 {
            font-size: 16pt !important;
            margin-bottom: 2pt !important;
          }
          
          #diabetic-preview h2 {
            font-size: 12pt !important;
            margin-bottom: 2pt !important;
          }
          
          #diabetic-preview h3 {
            font-size: 11pt !important;
            margin-bottom: 2pt !important;
          }
          
          #diabetic-preview .text-5xl {
            font-size: 16pt !important;
          }
          
          #diabetic-preview .text-3xl {
            font-size: 12pt !important;
          }
          
          #diabetic-preview .text-2xl {
            font-size: 11pt !important;
          }
          
          /* 테이블 간격 줄이기 */
          #diabetic-preview table td,
          #diabetic-preview table th {
            padding: 3pt !important;
          }
          
          /* 리스트 간격 줄이기 */
          #diabetic-preview li {
            margin-bottom: 1pt !important;
            line-height: 1.3 !important;
          }
          
          /* 카드 패딩 줄이기 */
          #diabetic-preview .p-6 {
            padding: 3pt !important;
          }
          
          #diabetic-preview .p-5 {
            padding: 2pt !important;
          }
          
          #diabetic-preview .p-4 {
            padding: 2pt !important;
          }
          
          #diabetic-preview .p-3 {
            padding: 2pt !important;
          }
          
          /* 박스 간격 줄이기 */
          #diabetic-preview .mb-8 {
            margin-bottom: 4pt !important;
          }
          
          #diabetic-preview .mb-6 {
            margin-bottom: 3pt !important;
          }
          
          #diabetic-preview .mb-4 {
            margin-bottom: 2pt !important;
          }
          
          /* 시력/안압 테이블 높이 최소화 */
          #diabetic-preview .grid-cols-2 {
            gap: 6pt !important;
          }
          
          /* 안저검사 결과 공간 최소화 */
          #diabetic-preview .space-y-4 {
            gap: 2pt !important;
          }
          
          /* rounded 요소들 패딩 최소화 */
          #diabetic-preview .rounded-lg {
            padding: 2pt !important;
          }
          
          /* 로고 크기 축소 */
          #diabetic-preview img {
            width: 36pt !important;
            height: 36pt !important;
          }
          
          /* border 두께 최소화 */
          #diabetic-preview .border-b-2 {
            border-bottom-width: 1pt !important;
          }
          
          #diabetic-preview .border-t-2 {
            border-top-width: 1pt !important;
          }
          
          /* 아이콘 크기 최소화 */
          #diabetic-preview svg {
            width: 16pt !important;
            height: 16pt !important;
          }
          
          /* 라인 높이 더 줄이기 */
          #diabetic-preview p,
          #diabetic-preview div {
            line-height: 1.2 !important;
          }
          
          /* 기본 컨테이너 패딩도 줄이기 */
          #diabetic-preview .bg-white {
            padding: 6pt !important;
          }
          
          /* 색상 박스들 높이 최소화 */
          #diabetic-preview .bg-gray-50,
          #diabetic-preview .bg-blue-50,
          #diabetic-preview .bg-gradient-to-r {
            padding: 2pt 4pt !important;
          }
          
          /* 특정 섹션 간 여백 완전 제거 */
          /* 환자 정보 섹션(2번째) 위 여백 제거 */
          #diabetic-preview section:nth-child(3) {
            margin-bottom: 0pt !important;
          }
          
          /* 시력/안압 섹션(3번째) 위 여백 제거 */
          #diabetic-preview section:nth-child(4) {
            margin-top: 0pt !important;
            margin-bottom: 2pt !important;
          }
          
          /* 안저검사 섹션(4번째) 위 여백 제거 */
          #diabetic-preview section:nth-child(5) {
            margin-top: 0pt !important;
          }
          
          /* ULTRA 최적화 - 증식을 위한 극단적 조치 */
          @page {
            margin: 5mm !important;
          }
          
          #diabetic-preview {
            font-size: 8pt !important;
          }
          
          #diabetic-preview * {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          #diabetic-preview header {
            padding: 2pt !important;
            margin-bottom: 2pt !important;
          }
          
          #diabetic-preview section {
            margin-bottom: 2pt !important;
            padding: 2pt !important;
          }
          
          #diabetic-preview h1 {
            font-size: 14pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          #diabetic-preview h2 {
            font-size: 10pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          #diabetic-preview h3 {
            font-size: 9pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          #diabetic-preview p,
          #diabetic-preview span,
          #diabetic-preview div,
          #diabetic-preview td,
          #diabetic-preview th {
            font-size: 8pt !important;
            line-height: 1.1 !important;
            margin: 0 !important;
            padding: 1pt !important;
          }
          
          #diabetic-preview .mb-8,
          #diabetic-preview .mb-6,
          #diabetic-preview .mb-4,
          #diabetic-preview .mb-3,
          #diabetic-preview .mb-2,
          #diabetic-preview .mb-1 {
            margin-bottom: 0 !important;
          }
          
          #diabetic-preview table {
            border-collapse: collapse !important;
            margin: 0 !important;
          }
          
          #diabetic-preview .grid-cols-2 {
            display: flex !important;
            gap: 4pt !important;
          }
          
          #diabetic-preview footer {
            margin-top: 2pt !important;
            padding: 2pt !important;
          }
          
          #diabetic-preview img {
            width: 24pt !important;
            height: 24pt !important;
          }
          
          #diabetic-preview .border-b-2,
          #diabetic-preview .border-t-2 {
            border-width: 0.5pt !important;
          }
          
          #diabetic-preview .rounded-lg,
          #diabetic-preview .rounded-xl {
            border-radius: 0 !important;
          }
        }
      `}</style>
      
      <div className="max-w-[18cm] mx-auto bg-white">
        {/* Header with gradient background */}
        <header className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6 rounded-t-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-1">당뇨망막병증 검진 결과</h1>
              <p className="text-xl text-gray-600">검사일: {diabeticData.examDate}</p>
            </div>
            <div className="text-right">
              {/* 불필요한 텍스트 제거 */}
            </div>
          </div>
        </header>

        {/* Executive Summary with visual enhancement */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">검진 결과 요약</h2>
                <ul className="space-y-2 text-xl">
                  <li className="flex items-start">
                    <span className="bullet-point text-green-600 mr-2 mt-0.5 pl-4"></span>
                    <span><span className="font-semibold text-gray-700">{getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).message}</span></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bullet-point text-blue-600 mr-2 mt-0.5 pl-4"></span>
                    <span>혈당·혈압·지질을 꾸준히 관리하시면 진행을 늦출 수 있습니다</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bullet-point text-orange-600 mr-2 mt-0.5 pl-4"></span>
                    <span><strong className="text-orange-700">{getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).followUp} 후</strong> 안저 검사를 통해 변화 여부를 다시 확인하세요</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Info Card */}
        <section className="mb-1">
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">환자명</span>
                <span className="text-xl font-bold text-gray-800">{diabeticData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">생년월일</span>
                <span className="text-xl font-bold text-gray-800">{diabeticData.birthDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">검사일</span>
                <span className="text-xl font-bold text-gray-800">{diabeticData.examDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">담당의</span>
                <span className="text-xl font-bold text-gray-800">{diabeticData.doctorName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & IOP with Icons */}
        <section className="mb-1">
          <div className="grid grid-cols-2 gap-2">
            {/* Vision Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
              <div className="flex items-center mb-1">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">시력 검사</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-xl text-gray-600">구분</th>
                    <th className="pb-2 text-center text-xl text-gray-600">나안</th>
                    <th className="pb-2 text-center text-xl text-gray-600">교정</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-xl font-medium text-gray-700">우안</td>
                    <td className="py-2 text-xl text-center">{diabeticData.vision.od.naked}</td>
                    <td className="py-2 text-xl text-center font-bold text-blue-600">{diabeticData.vision.od.corrected}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-xl font-medium text-gray-700">좌안</td>
                    <td className="py-2 text-xl text-center">{diabeticData.vision.os.naked}</td>
                    <td className="py-2 text-xl text-center font-bold text-blue-600">{diabeticData.vision.os.corrected}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* IOP Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">안압 검사</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-xl text-gray-600">구분</th>
                    <th className="pb-2 text-center text-xl text-gray-600">측정값</th>
                    <th className="pb-2 text-center text-xl text-gray-600">정상범위</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-xl font-medium text-gray-700">우안</td>
                    <td className="py-2 text-xl text-center font-bold text-green-600">{diabeticData.iop.od} mmHg</td>
                    <td className="py-2 text-xl text-center text-gray-500" rowSpan={2}>10-21 mmHg</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-xl font-medium text-gray-700">좌안</td>
                    <td className="py-2 text-xl text-center font-bold text-green-600">{diabeticData.iop.os} mmHg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Fundus Exam with Stage Visualization */}
        <section className="mb-2">
          <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
            <div className="flex items-center mb-1">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800">안저 검사 결과</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl font-medium text-gray-700 mr-3">우안</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xl font-semibold">
                    {diabeticData.fundus.od.stage}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl font-medium text-gray-700 mr-3">좌안</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xl font-semibold">
                    {diabeticData.fundus.os.stage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations & Plan Combined */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              권고사항 및 향후 계획
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">필수 관리사항</h4>
                <ol className="space-y-2 text-xl">
                  <li className="flex items-start">
                    <span className="font-bold text-orange-600 mr-2">1.</span>
                    <span>혈당·혈압·지질을 목표 범위로 관리</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-orange-600 mr-2">2.</span>
                    <span>{getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).followUp} 후 안저 검사 예약</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-orange-600 mr-2">3.</span>
                    <span>시력 저하·비문증·광시증 시 즉시 내원</span>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">종합 소견</h4>
                <p className="text-xl text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{__html: getDiabeticRetinopathyPlan(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-700">$1</strong>')}}></p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with unified logo */}
        <footer className="mt-auto pt-6 border-t-2 border-gray-200">
          <div className="flex justify-between items-end">
            <div className="flex items-center space-x-3">
              <Image src="/lee_eye_symbol.png" alt="이안과의원" width={48} height={48} className="object-contain" />
              <div>
                <div className="font-bold text-xl text-gray-800">이안과의원</div>
                <div className="text-lg text-gray-600">부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
                <div className="text-lg text-gray-600">Tel. 051-866-7592~4</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg text-gray-500 mb-1">발행일: {diabeticData.examDate}</div>
              <div className="text-xl font-semibold text-gray-700">{diabeticData.doctorName}</div>
              <div className="mt-2 pt-1 border-t border-gray-400 w-24 ml-auto"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )

  const renderHypertensionPreview = () => (
    <div id="hypertension-preview" className="bg-white p-8 space-y-6">
      {/* 인쇄용 스타일 */}
      <style jsx global>{`
        @media print {
          @page { 
            size: A4; 
            margin: 8mm;
          }
          
          /* 기본 설정 */
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-family: Arial, Verdana, sans-serif !important;
          }
          
          /* 인쇄 시 숨길 요소들 */
          .print-hide { display: none !important; }
          
          /* 인쇄 시 보여야 할 요소들 강제 표시 */
          #diabetic-preview .max-w-\\[18cm\\],
          #hypertension-preview .max-w-\\[18cm\\],
          #comprehensive-preview .max-w-\\[18cm\\] {
            display: block !important;
            visibility: visible !important;
          }
          
          /* 미리보기 영역 최적화 */
          .print-content { 
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* 고혈압망막병증 전용 최적화 */
          #hypertension-preview {
            padding: 0 !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
          }
          
          /* 인쇄용 폰트 크기 정의 - pt 단위 사용 */
          h1, #hypertension-preview h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 8pt !important;
            display: block !important;
            visibility: visible !important;
          }
          
          h2, #hypertension-preview h2 {
            font-size: 18pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 6pt !important;
            display: block !important;
            visibility: visible !important;
          }
          
          h3, #hypertension-preview h3 {
            font-size: 14pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 4pt !important;
          }
          
          p, span, div,
          #hypertension-preview p, 
          #hypertension-preview span, 
          #hypertension-preview div {
            font-size: 12pt !important;
            line-height: 1.5 !important;
            color: #000 !important;
          }
          
          /* 텍스트 크기 클래스 재정의 */
          .text-5xl, #hypertension-preview .text-5xl { font-size: 24pt !important; }
          .text-4xl, #hypertension-preview .text-4xl { font-size: 20pt !important; }
          .text-3xl, #hypertension-preview .text-3xl { font-size: 18pt !important; }
          .text-2xl, #hypertension-preview .text-2xl { font-size: 16pt !important; }
          .text-xl, #hypertension-preview .text-xl { font-size: 14pt !important; }
          .text-lg, #hypertension-preview .text-lg { font-size: 12pt !important; }
          .text-base, #hypertension-preview .text-base { font-size: 11pt !important; }
          .text-sm, #hypertension-preview .text-sm { font-size: 10pt !important; }
          .text-xs, #hypertension-preview .text-xs { font-size: 9pt !important; }
          
          /* 헤더 가시성 확보 */
          header, #hypertension-preview header {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 2pt !important;
            padding: 12pt !important;
            padding-top: 14pt !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
            background-color: #fffaf0 !important;
            border: 1pt solid #ddd !important;
          }
          
          /* 제목 강제 표시 - ULTRA FIX */
          #hypertension-preview header h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 8pt !important;
            margin-top: 4pt !important;
            padding-top: 4pt !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
            overflow: visible !important;
          }
          
          /* 고혈압 헤더 전체 조정 */
          #hypertension-preview .max-w-\\[18cm\\] {
            padding-top: 8pt !important;
          }
          
          #hypertension-preview header:first-child {
            margin-top: 4pt !important;
          }
          
          /* 고혈압 제목 컨테이너 */
          #hypertension-preview header > div {
            padding-top: 4pt !important;
          }
          
          /* 색상 최적화 - 인쇄용 */
          #hypertension-preview .bg-gradient-to-r,
          #hypertension-preview .from-yellow-50,
          #hypertension-preview .to-amber-50,
          #hypertension-preview .from-green-50,
          #hypertension-preview .to-emerald-50 {
            background-color: #f5f5f5 !important;
            background-image: none !important;
          }
          
          /* 경계선 색상 최적화 */
          #hypertension-preview .border-yellow-200 { border-color: #666 !important; }
          #hypertension-preview .border-yellow-500 { border-color: #333 !important; }
          #hypertension-preview .border-green-500 { border-color: #333 !important; }
          
          /* 텍스트 색상 최적화 */
          #hypertension-preview .text-gray-600, 
          #hypertension-preview .text-gray-500 { color: #333 !important; }
          #hypertension-preview .text-gray-700, 
          #hypertension-preview .text-gray-800 { color: #000 !important; }
          #hypertension-preview .text-yellow-700 { color: #8B8000 !important; }
          #hypertension-preview .text-green-700 { color: #006400 !important; }
          #hypertension-preview .text-orange-700 { color: #8B4500 !important; }
          #hypertension-preview .text-red-700 { color: #8B0000 !important; }
          
          /* 테이블 스타일 */
          #hypertension-preview table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 8pt 0 !important;
          }
          
          #hypertension-preview th, 
          #hypertension-preview td {
            border: 1pt solid #333 !important;
            padding: 6pt !important;
            font-size: 11pt !important;
          }
          
          #hypertension-preview thead {
            background-color: #e0e0e0 !important;
          }
          
          /* 레이아웃 단순화 */
          #hypertension-preview .grid {
            display: block !important;
          }
          
          #hypertension-preview .grid > div {
            margin-bottom: 12pt !important;
          }
          
          /* 불릿 포인트 */
          #hypertension-preview .bullet-point::before {
            content: "•";
            color: #000 !important;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
          
          /* 리스트 스타일 */
          #hypertension-preview ul, 
          #hypertension-preview ol {
            margin-left: 20pt !important;
          }
          
          #hypertension-preview li {
            font-size: 12pt !important;
            line-height: 1.6 !important;
            margin-bottom: 4pt !important;
          }
          
          /* 검사 결과 박스 스타일 */
          #hypertension-preview .bg-gray-50 {
            background-color: #f5f5f5 !important;
            border: 1pt solid #333 !important;
            padding: 8pt !important;
            margin-bottom: 8pt !important;
          }
          
          /* 페이지 브레이크 관리 */
          #hypertension-preview section {
            page-break-inside: avoid !important;
          }
          
          #hypertension-preview footer {
            page-break-inside: avoid !important;
            margin-top: 16pt !important;
            padding-top: 8pt !important;
            border-top: 2pt solid #333 !important;
          }
          
          /* 이미지 최적화 */
          #hypertension-preview img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* SVG 아이콘 스타일 */
          #hypertension-preview svg {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            width: 24pt !important;
            height: 24pt !important;
          }
          
          #hypertension-preview .p-4 {
            padding: 6px !important;
          }
          
          #hypertension-preview table {
            margin-bottom: 6px !important;
          }
          
          #hypertension-preview .space-y-1 > li {
            margin-bottom: 1px !important;
          }
          
          #hypertension-preview .text-2xl {
            font-size: 16px !important;
          }
          
          #hypertension-preview .text-base {
            font-size: 12px !important;
          }
          
          #hypertension-preview .text-sm {
            font-size: 9px !important;
          }
          
          #hypertension-preview .text-xs {
            font-size: 8px !important;
          }
          
          /* 브라우저 기본 헤더/푸터 제거 시도 */
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          
          /* 인쇄 시 브라우저 헤더/푸터 숨기기 */
          .print-header, .print-footer { display: none !important; }
          
          /* 한 페이지 인쇄를 위한 공간 최적화 */
          .mb-8 { margin-bottom: 8pt !important; }
          .mb-6 { margin-bottom: 6pt !important; }
          .mb-4 { margin-bottom: 4pt !important; }
          
          .p-6 { padding: 6pt !important; }
          .p-5 { padding: 4pt !important; }
          .p-4 { padding: 4pt !important; }
          .p-3 { padding: 3pt !important; }
          
          /* 시력/안압 한 줄 배치 */
          .grid-cols-2 {
            display: flex !important;
            gap: 12pt !important;
          }
          
          .grid-cols-2 > div {
            flex: 1 !important;
          }
        }
      `}</style>
      
      <div className="max-w-[18cm] mx-auto bg-white">
        {/* Header with gradient background */}
        <header className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200 p-6 rounded-t-xl mb-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-1">고혈압망막병증 검진 결과</h1>
              <p className="text-xl text-gray-600">검사일: {hypertensionData.examDate}</p>
            </div>
            <div className="text-right">
              {/* 불필요한 텍스트 제거 */}
            </div>
          </div>
        </header>

        {/* Executive Summary with visual enhancement */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">검진 결과 요약</h2>
                <ul className="space-y-2 text-xl">
                  <li className="flex items-start">
                    <span className="bullet-point text-green-600 mr-2 mt-0.5 pl-4"></span>
                    <span><span className="font-semibold text-gray-700">{getHypertensionRetinopathyInfo(hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage).message}</span></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bullet-point text-blue-600 mr-2 mt-0.5 pl-4"></span>
                    <span>혈압을 <strong className="text-blue-700">{hypertensionData.summary.bloodPressureTarget} mmHg</strong> 미만으로 유지하시면 진행을 늦출 수 있습니다</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bullet-point text-orange-600 mr-2 mt-0.5 pl-4"></span>
                    <span><strong className="text-orange-700">{hypertensionData.summary.followUp} 후</strong> 안저 검사로 변화 여부를 다시 확인하세요</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Info Card */}
        <section className="mb-8">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">환자명</span>
                <span className="text-xl font-bold text-gray-800">{hypertensionData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">생년월일</span>
                <span className="text-xl font-bold text-gray-800">{hypertensionData.birthDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">검사일</span>
                <span className="text-xl font-bold text-gray-800">{hypertensionData.examDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">담당의</span>
                <span className="text-xl font-bold text-gray-800">{hypertensionData.doctorName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fundus Result with Stage Visualization */}
        <section className="mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800">안저 검사 결과</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-700 mr-3">우안</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xl font-semibold">
                    {hypertensionData.fundus.od.stage}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-700 mr-3">좌안</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xl font-semibold">
                    {hypertensionData.fundus.os.stage}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-xl text-gray-700">
                <span className="font-medium">소견:</span> {getHypertensionFundusFindings(hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage)}
              </p>
            </div>
          </div>
        </section>

        {/* Vision & IOP with Icons */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">시력 검사</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-xl text-gray-600">구분</th>
                    <th className="pb-2 text-center text-xl text-gray-600">나안</th>
                    <th className="pb-2 text-center text-xl text-gray-600">교정</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-xl font-medium text-gray-700">우안</td>
                    <td className="py-2 text-xl text-center">{hypertensionData.vision.od.naked}</td>
                    <td className="py-2 text-xl text-center font-bold text-blue-600">{hypertensionData.vision.od.corrected}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-xl font-medium text-gray-700">좌안</td>
                    <td className="py-2 text-xl text-center">{hypertensionData.vision.os.naked}</td>
                    <td className="py-2 text-xl text-center font-bold text-blue-600">{hypertensionData.vision.os.corrected}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* IOP Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">안압 검사</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-xl text-gray-600">구분</th>
                    <th className="pb-2 text-center text-xl text-gray-600">측정값</th>
                    <th className="pb-2 text-center text-xl text-gray-600">정상범위</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-xl font-medium text-gray-700">우안</td>
                    <td className="py-2 text-xl text-center font-bold text-green-600">{hypertensionData.iop.od} mmHg</td>
                    <td className="py-2 text-xl text-center text-gray-500" rowSpan={2}>10-21 mmHg</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-xl font-medium text-gray-700">좌안</td>
                    <td className="py-2 text-xl text-center font-bold text-green-600">{hypertensionData.iop.os} mmHg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">3. 권고 사항</h2>
          <ol className="list-decimal pl-6 space-y-1 text-xl">
            <li>혈압을 꾸준히 관리해 <strong>{hypertensionData.summary.bloodPressureTarget}&nbsp;mmHg</strong> 미만을 유지하세요.</li>
            <li>{hypertensionData.summary.followUp} 후 안저 검사를 예약해 변화 여부를 확인하세요.</li>
            <li>시력 변화·점이나 번쩍임이 느껴지면 바로 내원하세요.</li>
          </ol>
        </section>

        {/* Integrated Plan */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">4. 통합 해석 &amp; 향후 계획</h2>
          <p className="pl-4 text-xl" dangerouslySetInnerHTML={{__html: getHypertensionRetinopathyPlan(hypertensionData.fundus.od.stage, hypertensionData.fundus.os.stage)}}></p>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-6 border-t-2 border-gray-200">
          <div className="flex justify-between items-end">
            <div className="flex items-center space-x-3">
              <Image src="/lee_eye_symbol.png" alt="이안과의원" width={48} height={48} className="object-contain" />
              <div>
                <div className="font-bold text-xl text-gray-800">이안과의원</div>
                <div className="text-lg text-gray-600">부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
                <div className="text-lg text-gray-600">Tel. 051-866-7592~4</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base text-gray-500 mb-1">발행일: {hypertensionData.examDate}</div>
              <div className="text-lg font-semibold text-gray-700">{hypertensionData.doctorName}</div>
              <div className="mt-2 pt-1 border-t border-gray-400 w-24 ml-auto"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )

  const renderComprehensivePreview = () => (
    <div id="comprehensive-preview" className="bg-white p-8 space-y-6">
      {/* 인쇄용 스타일 */}
      <style jsx global>{`
        @media print {
          @page { 
            size: A4; 
            margin: 8mm;
          }
          
          /* 기본 설정 */
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-family: Arial, Verdana, sans-serif !important;
          }
          
          /* 인쇄 시 숨길 요소들 */
          .print-hide { display: none !important; }
          
          /* 인쇄 시 보여야 할 요소들 강제 표시 */
          #diabetic-preview .max-w-\\[18cm\\],
          #hypertension-preview .max-w-\\[18cm\\],
          #comprehensive-preview .max-w-\\[18cm\\] {
            display: block !important;
            visibility: visible !important;
          }
          
          /* 미리보기 영역 최적화 */
          .print-content { 
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* 눈종합검진 전용 최적화 */
          #comprehensive-preview {
            padding: 0 !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
          }
          
          /* 인쇄용 폰트 크기 정의 - pt 단위 사용 */
          h1, #comprehensive-preview h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 8pt !important;
            display: block !important;
            visibility: visible !important;
          }
          
          h2, #comprehensive-preview h2 {
            font-size: 18pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 6pt !important;
            display: block !important;
            visibility: visible !important;
          }
          
          h3, #comprehensive-preview h3 {
            font-size: 14pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 4pt !important;
          }
          
          p, span, div,
          #comprehensive-preview p, 
          #comprehensive-preview span, 
          #comprehensive-preview div {
            font-size: 12pt !important;
            line-height: 1.5 !important;
            color: #000 !important;
          }
          
          /* 텍스트 크기 클래스 재정의 */
          .text-5xl, #comprehensive-preview .text-5xl { font-size: 24pt !important; }
          .text-4xl, #comprehensive-preview .text-4xl { font-size: 20pt !important; }
          .text-3xl, #comprehensive-preview .text-3xl { font-size: 18pt !important; }
          .text-2xl, #comprehensive-preview .text-2xl { font-size: 16pt !important; }
          .text-xl, #comprehensive-preview .text-xl { font-size: 14pt !important; }
          .text-lg, #comprehensive-preview .text-lg { font-size: 12pt !important; }
          .text-base, #comprehensive-preview .text-base { font-size: 11pt !important; }
          .text-sm, #comprehensive-preview .text-sm { font-size: 10pt !important; }
          .text-xs, #comprehensive-preview .text-xs { font-size: 9pt !important; }
          
          /* 헤더 가시성 확보 */
          header, #comprehensive-preview header {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 2pt !important;
            padding: 12pt !important;
            padding-top: 14pt !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
            background-color: #f0ffff !important;
            border: 1pt solid #ddd !important;
          }
          
          /* 제목 강제 표시 */
          #comprehensive-preview header h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            color: #000 !important;
            margin-bottom: 8pt !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            opacity: 1 !important;
          }
          
          /* 색상 최적화 - 인쇄용 */
          #comprehensive-preview .bg-gradient-to-r,
          #comprehensive-preview .from-teal-50,
          #comprehensive-preview .to-cyan-50,
          #comprehensive-preview .from-blue-50,
          #comprehensive-preview .to-indigo-50,
          #comprehensive-preview .from-green-50,
          #comprehensive-preview .to-emerald-50,
          #comprehensive-preview .from-yellow-50,
          #comprehensive-preview .to-amber-50,
          #comprehensive-preview .from-red-50,
          #comprehensive-preview .to-rose-50 {
            background-color: #f5f5f5 !important;
            background-image: none !important;
          }
          
          /* 경계선 색상 최적화 */
          #comprehensive-preview .border-teal-200 { border-color: #666 !important; }
          #comprehensive-preview .border-teal-500 { border-color: #333 !important; }
          #comprehensive-preview .border-blue-500 { border-color: #333 !important; }
          #comprehensive-preview .border-green-500 { border-color: #333 !important; }
          #comprehensive-preview .border-yellow-500 { border-color: #333 !important; }
          #comprehensive-preview .border-orange-500 { border-color: #333 !important; }
          #comprehensive-preview .border-red-500 { border-color: #333 !important; }
          #comprehensive-preview .border-cyan-500 { border-color: #333 !important; }
          
          /* 텍스트 색상 최적화 */
          #comprehensive-preview .text-gray-600, 
          #comprehensive-preview .text-gray-500 { color: #333 !important; }
          #comprehensive-preview .text-gray-700, 
          #comprehensive-preview .text-gray-800 { color: #000 !important; }
          #comprehensive-preview .text-teal-700 { color: #006064 !important; }
          #comprehensive-preview .text-green-700 { color: #006400 !important; }
          #comprehensive-preview .text-yellow-700 { color: #8B8000 !important; }
          #comprehensive-preview .text-orange-700 { color: #8B4500 !important; }
          #comprehensive-preview .text-red-700 { color: #8B0000 !important; }
          #comprehensive-preview .text-cyan-600 { color: #006064 !important; }
          
          /* 테이블 스타일 */
          #comprehensive-preview table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 8pt 0 !important;
          }
          
          #comprehensive-preview th, 
          #comprehensive-preview td {
            border: 1pt solid #333 !important;
            padding: 6pt !important;
            font-size: 11pt !important;
          }
          
          #comprehensive-preview thead {
            background-color: #e0e0e0 !important;
          }
          
          /* 레이아웃 단순화 */
          #comprehensive-preview .grid {
            display: block !important;
          }
          
          #comprehensive-preview .grid > div {
            margin-bottom: 12pt !important;
          }
          
          /* 불릿 포인트 */
          #comprehensive-preview .bullet-point::before {
            content: "•";
            color: #000 !important;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
          
          /* 리스트 스타일 */
          #comprehensive-preview ul, 
          #comprehensive-preview ol {
            margin-left: 20pt !important;
          }
          
          #comprehensive-preview li {
            font-size: 12pt !important;
            line-height: 1.6 !important;
            margin-bottom: 4pt !important;
          }
          
          /* 검사 결과 박스 스타일 */
          #comprehensive-preview .bg-gray-50 {
            background-color: #f5f5f5 !important;
            border: 1pt solid #333 !important;
            padding: 8pt !important;
            margin-bottom: 8pt !important;
          }
          
          /* 페이지 브레이크 관리 */
          #comprehensive-preview section {
            page-break-inside: avoid !important;
          }
          
          /* 2페이지 분할 */
          #comprehensive-preview .page-2 {
            page-break-before: always !important;
          }
          
          #comprehensive-preview footer {
            page-break-inside: avoid !important;
            margin-top: 16pt !important;
            padding-top: 8pt !important;
            border-top: 2pt solid #333 !important;
          }
          
          /* 이미지 최적화 */
          #comprehensive-preview img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* SVG 아이콘 스타일 */
          #comprehensive-preview svg {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            width: 24pt !important;
            height: 24pt !important;
          }
          
          /* 한 페이지 인쇄를 위한 공간 최적화 */
          .mb-8 { margin-bottom: 8pt !important; }
          .mb-6 { margin-bottom: 6pt !important; }
          .mb-4 { margin-bottom: 4pt !important; }
          
          .p-6 { padding: 6pt !important; }
          .p-5 { padding: 4pt !important; }
          .p-4 { padding: 4pt !important; }
          .p-3 { padding: 3pt !important; }
          
          /* 시력/안압 한 줄 배치 */
          .grid-cols-2 {
            display: flex !important;
            gap: 12pt !important;
          }
          
          .grid-cols-2 > div {
            flex: 1 !important;
          }
        }
      `}</style>
        
      <div className="max-w-[18cm] mx-auto bg-white">
        {/* Header with gradient background */}
        <header className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b-2 border-teal-200 p-6 rounded-t-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-1">눈 종합검사 결과</h1>
              <p className="text-xl text-gray-600">검사일: {comprehensiveData.examDate}</p>
            </div>
            <div className="text-right">
              {/* 불필요한 텍스트 제거 */}
            </div>
          </div>
        </header>

        {/* Executive Summary with visual enhancement */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 rounded-r-lg p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">검진 결과 요약</h2>
                <ul className="space-y-2 text-xl">
                  <li className="flex items-start">
                    <span className="bullet-point text-teal-600 mr-2 mt-0.5 pl-4"></span>
                    <span><span className="font-semibold text-gray-700">{comprehensiveData.summary.riskLevel} - {getComprehensiveRiskInfo(comprehensiveData.summary.riskLevel).summary.split(' — ')[1]}</span></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bullet-point text-blue-600 mr-2 mt-0.5 pl-4"></span>
                    <span>주요 이상: {comprehensiveData.summary.mainFindings}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bullet-point text-orange-600 mr-2 mt-0.5 pl-4"></span>
                    <span>종합 소견: <strong className="text-orange-700">{comprehensiveData.summary.comprehensiveFinding}</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Info Card */}
        <section className="mb-8">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">환자명</span>
                <span className="text-xl font-bold text-gray-800">{comprehensiveData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">생년월일</span>
                <span className="text-xl font-bold text-gray-800">{comprehensiveData.birthDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">검사일</span>
                <span className="text-xl font-bold text-gray-800">{comprehensiveData.examDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl text-gray-600 font-medium">담당의</span>
                <span className="text-xl font-bold text-gray-800">{comprehensiveData.doctorName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & IOP with Icons */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">시력 검사</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-xl text-gray-600">구분</th>
                    <th className="pb-2 text-center text-xl text-gray-600">나안</th>
                    <th className="pb-2 text-center text-xl text-gray-600">교정</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-xl font-medium text-gray-700">우안</td>
                    <td className="py-2 text-xl text-center">{comprehensiveData.vision.od.naked}</td>
                    <td className="py-2 text-xl text-center font-bold text-blue-600">{comprehensiveData.vision.od.corrected}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-xl font-medium text-gray-700">좌안</td>
                    <td className="py-2 text-xl text-center">{comprehensiveData.vision.os.naked}</td>
                    <td className="py-2 text-xl text-center font-bold text-blue-600">{comprehensiveData.vision.os.corrected}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* IOP Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">안압 검사</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-xl text-gray-600">구분</th>
                    <th className="pb-2 text-center text-xl text-gray-600">측정값</th>
                    <th className="pb-2 text-center text-xl text-gray-600">정상범위</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-xl font-medium text-gray-700">우안</td>
                    <td className="py-2 text-xl text-center font-bold text-green-600">{comprehensiveData.iop.od} mmHg</td>
                    <td className="py-2 text-xl text-center text-gray-500" rowSpan={2}>10-21 mmHg</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-xl font-medium text-gray-700">좌안</td>
                    <td className="py-2 text-xl text-center font-bold text-green-600">{comprehensiveData.iop.os} mmHg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Basic & Detailed Exams with Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Exam Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">기본 검사</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">굴절검사</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.basicExam.refraction}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">외안부</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.basicExam.externalEye}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">수정체</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.basicExam.lens}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">안저</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.basicExam.fundus}</span>
                </div>
              </div>
            </div>

            {/* Detailed Exam Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800">정밀 검사</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">각막지형도</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.detailedExam.topography}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">망막단층촬영</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.detailedExam.oct}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">시야검사</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.detailedExam.visualField}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xl font-medium text-gray-700">초음파</span>
                  <span className="text-xl text-gray-600">{comprehensiveData.detailedExam.sono}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations & Plan Combined */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-6 border border-cyan-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              권고사항 및 향후 계획
            </h3>
            <div className="bg-white/50 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">위험도 평가: <span className="text-cyan-700">{comprehensiveData.summary.riskLevel}</span></h4>
              <ol className="space-y-2 text-lg">
                {comprehensiveData.summary.riskLevel === '정상' && (
                  <>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">1.</span>
                      <span>정기적인 눈 건강 검진을 유지하세요</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">2.</span>
                      <span>{comprehensiveData.summary.followUp} 후 간단한 시력·안압·안저 검사 권장</span>
                    </li>
                  </>
                )}
                {comprehensiveData.summary.riskLevel === '경미한' && (
                  <>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">1.</span>
                      <span>경미한 이상에 대한 주기적인 모니터링이 필요합니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">2.</span>
                      <span>{comprehensiveData.summary.followUp} 후 정밀 검사 권장</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">3.</span>
                      <span>증상 변화 시 즉시 내원하세요</span>
                    </li>
                  </>
                )}
                {comprehensiveData.summary.riskLevel === '중등도' && (
                  <>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">1.</span>
                      <span>적극적인 치료 계획 수립이 필요합니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">2.</span>
                      <span>{comprehensiveData.summary.followUp} 후 반드시 재검하세요</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">3.</span>
                      <span>전문의와 상의하여 치료 방향을 결정하세요</span>
                    </li>
                  </>
                )}
                {comprehensiveData.summary.riskLevel === '심각한' && (
                  <>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">1.</span>
                      <span>즉각적인 치료가 필요한 상태입니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">2.</span>
                      <span>{comprehensiveData.summary.followUp}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-cyan-600 mr-2">3.</span>
                      <span>가능한 빠른 시일 내에 정밀 검사 및 치료를 시작하세요</span>
                    </li>
                  </>
                )}
              </ol>
            </div>
          </div>
        </section>

        {/* Footer with unified logo */}
        <footer className="mt-auto pt-6 border-t-2 border-gray-200">
          <div className="flex justify-between items-end">
            <div className="flex items-center space-x-3">
              <Image src="/lee_eye_symbol.png" alt="이안과의원" width={48} height={48} className="object-contain" />
              <div>
                <div className="font-bold text-xl text-gray-800">이안과의원</div>
                <div className="text-lg text-gray-600">부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
                <div className="text-lg text-gray-600">Tel. 051-866-7592~4</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl text-gray-500 mb-1">발행일: {comprehensiveData.examDate}</div>
              <div className="text-2xl font-semibold text-gray-700">{comprehensiveData.doctorName}</div>
              <div className="mt-2 pt-1 border-t border-gray-400 w-24 ml-auto"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 고정 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-sm print-hide">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">홈으로</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              {/* 주요 기능 네비게이션 메뉴 */}
              <QuickNavMenu />
              
              {/* 데모영상 버튼 */}
              <a
                href="https://youtu.be/viqOYiEOBNI?si=DCX41YBhlBs2GKgB"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="relative mr-2">
                  <Play className="w-5 h-5 fill-current" />
                  <div className="absolute inset-0 bg-white/20 rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                </div>
                <span className="font-medium">데모영상</span>
              </a>
              
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">다른 검진 선택</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 pt-8">
        {!selectedType && renderTemplateSelector()}
        
        {selectedType === 'diabetic' && renderDiabeticForm()}
        {selectedType === 'hypertension' && renderHypertensionForm()}
        {selectedType === 'comprehensive' && renderComprehensiveForm()}
      </main>
    </div>
  )}
