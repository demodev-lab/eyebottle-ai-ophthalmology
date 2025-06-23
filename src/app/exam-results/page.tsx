'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, FileText, Printer, Eye, Heart, Activity } from 'lucide-react'

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
    dryEye: string
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

  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveData>({
    name: '',
    birthDate: '',
    examDate: today,
    doctorName: '이동은',
    summary: {
      riskLevel: 'Low Risk',
      mainFindings: '경미한 건성안 의심',
      followUp: '12개월'
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
      refraction: '경도 근시 / 규칙 난시',
      externalEye: '결막 약간 충혈',
      lens: '수정체 투명',
      fundus: '정상'
    },
    detailedExam: {
      topography: '정상',
      oct: '정상',
      visualField: '정상',
      dryEye: '경미'
    }
  })

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
              <option value="Low Risk">Low Risk</option>
              <option value="Moderate Risk">Moderate Risk</option>
              <option value="High Risk">High Risk</option>
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
              placeholder="경미한 건성안 의심"
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
            <input
              type="text"
              value={comprehensiveData.basicExam.refraction}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                basicExam: { ...comprehensiveData.basicExam, refraction: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="경도 근시 / 규칙 난시"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">외안부</label>
            <input
              type="text"
              value={comprehensiveData.basicExam.externalEye}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                basicExam: { ...comprehensiveData.basicExam, externalEye: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="결막 약간 충혈"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">수정체</label>
            <input
              type="text"
              value={comprehensiveData.basicExam.lens}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                basicExam: { ...comprehensiveData.basicExam, lens: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="수정체 투명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">안저</label>
            <input
              type="text"
              value={comprehensiveData.basicExam.fundus}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                basicExam: { ...comprehensiveData.basicExam, fundus: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="정상"
            />
          </div>
        </div>
      </div>

      {/* 정밀 검사 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">정밀 검사</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">각막지형도 검사</label>
            <select
              value={comprehensiveData.detailedExam.topography}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                detailedExam: { ...comprehensiveData.detailedExam, topography: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="정상">정상</option>
              <option value="경미한 이상">경미한 이상</option>
              <option value="이상 소견">이상 소견</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OCT 검사</label>
            <select
              value={comprehensiveData.detailedExam.oct}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                detailedExam: { ...comprehensiveData.detailedExam, oct: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="정상">정상</option>
              <option value="경미한 이상">경미한 이상</option>
              <option value="이상 소견">이상 소견</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">시야 검사</label>
            <select
              value={comprehensiveData.detailedExam.visualField}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                detailedExam: { ...comprehensiveData.detailedExam, visualField: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="정상">정상</option>
              <option value="경미한 이상">경미한 이상</option>
              <option value="이상 소견">이상 소견</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">안구건조증 검사</label>
            <select
              value={comprehensiveData.detailedExam.dryEye}
              onChange={(e) => setComprehensiveData({
                ...comprehensiveData,
                detailedExam: { ...comprehensiveData.detailedExam, dryEye: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="정상">정상</option>
              <option value="경미">경미</option>
              <option value="중등도">중등도</option>
              <option value="중증">중증</option>
            </select>
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
          <div className="border border-gray-300 rounded-lg bg-white overflow-y-auto max-h-[calc(100vh-200px)] print-hide" style={{transform: 'scale(0.95)', transformOrigin: 'top left', width: '105.26%', height: 'auto'}}>
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
            margin: 15mm; 
          }
          body { 
            -webkit-print-color-adjust: exact; 
            font-size: 12px;
          }
          
          /* 인쇄 시 숨길 요소들 */
          .print-hide { display: none !important; }
          
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
        }
      `}</style>
      
      <div className="max-w-[18cm] mx-auto border border-gray-300 p-4 rounded-xl shadow-lg print:shadow-none print:border-none print:rounded-none print:p-2 bg-white">
        {/* Header */}
        <header className="mb-4 text-center print:mb-3">
          <h1 className="text-xl font-semibold tracking-tight print:text-lg">당뇨망막병증 검진 결과 안내</h1>
          <p className="text-xs text-gray-500">검사일: {diabeticData.examDate}</p>
        </header>

        {/* Executive Summary */}
        <section className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3 print:mb-3 print:p-2">
          <h2 className="text-sm font-semibold mb-2 print:text-xs print:mb-1">요약</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm print:text-xs print:space-y-0">
            <li><span className="font-medium">{getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).message}</span></li>
            <li>혈당·혈압·지질을 꾸준히 관리하시면 진행을 늦출 수 있습니다.</li>
            <li><strong>{getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).followUp} 후</strong> 안저 검사를 통해 변화 여부를 다시 확인하세요.</li>
          </ul>
        </section>

        {/* Patient Info */}
        <section className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-sm print:text-xs print:mb-3">
          <div><span className="font-medium">환자</span><span className="ml-2">{diabeticData.name}</span></div>
          <div><span className="font-medium">생년월일</span><span className="ml-2">{diabeticData.birthDate}</span></div>
          <div><span className="font-medium">검사일</span><span className="ml-2">{diabeticData.examDate}</span></div>
          <div><span className="font-medium">판독의</span><span className="ml-2">{diabeticData.doctorName}</span></div>
        </section>

        {/* Vision & IOP */}
        <section className="mb-4 print:mb-3">
          <h2 className="text-sm font-semibold mb-2 print:text-xs print:mb-1">1. 시력 &amp; 안압</h2>
          <div className="grid grid-cols-2 gap-4 print:gap-3">
            <table className="w-full border text-center text-sm print:text-xs">
              <caption className="caption-top font-medium mb-1 text-left text-xs print:text-[10px]">시력</caption>
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1 print:p-0.5"></th>
                  <th className="border p-1 print:p-0.5">나안</th>
                  <th className="border p-1 print:p-0.5">교정</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium print:p-0.5">우안</td>
                  <td className="border p-1 print:p-0.5">{diabeticData.vision.od.naked}</td>
                  <td className="border p-1 print:p-0.5">{diabeticData.vision.od.corrected}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium print:p-0.5">좌안</td>
                  <td className="border p-1 print:p-0.5">{diabeticData.vision.os.naked}</td>
                  <td className="border p-1 print:p-0.5">{diabeticData.vision.os.corrected}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border text-center text-sm print:text-xs">
              <caption className="caption-top font-medium mb-1 text-left text-xs print:text-[10px]">안압 (mmHg)</caption>
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1 print:p-0.5"></th>
                  <th className="border p-1 print:p-0.5">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium print:p-0.5">우안</td>
                  <td className="border p-1 print:p-0.5">{diabeticData.iop.od}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium print:p-0.5">좌안</td>
                  <td className="border p-1 print:p-0.5">{diabeticData.iop.os}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Fundus Exam */}
        <section className="mb-4 print:mb-3">
          <h2 className="text-sm font-semibold mb-2 print:text-xs print:mb-1">2. 안저 검사</h2>
          <table className="w-full border text-center mb-2 text-sm print:text-xs print:mb-1">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1 w-16 print:p-0.5">부위</th>
                <th className="border p-1 print:p-0.5">단계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1 font-medium print:p-0.5">우안</td>
                <td className="border p-1 text-black font-semibold print:p-0.5">{diabeticData.fundus.od.stage}</td>
              </tr>
              <tr>
                <td className="border p-1 font-medium print:p-0.5">좌안</td>
                <td className="border p-1 text-black font-semibold print:p-0.5">{diabeticData.fundus.os.stage}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Recommendations */}
        <section className="mb-4 print:mb-3">
          <h2 className="text-sm font-semibold mb-2 print:text-xs print:mb-1">3. 권고 사항</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm print:text-xs print:space-y-0 print:pl-4">
            <li>혈당·혈압·지질을 목표 범위로 관리하세요.</li>
            <li>{getDiabeticRetinopathyInfo(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).followUp} 후 안저 검사를 예약해 진행 여부를 확인하세요.</li>
            <li>시력 저하·비문증·광시증이 나타나면 즉시 내원하세요.</li>
          </ol>
        </section>

        {/* Integrated Plan */}
        <section className="mb-4 print:mb-3">
          <h2 className="text-sm font-semibold mb-2 print:text-xs print:mb-1">4. 통합 해석 &amp; 향후 계획</h2>
          <p className="pl-3 text-sm print:text-xs print:pl-2" dangerouslySetInnerHTML={{__html: getDiabeticRetinopathyPlan(diabeticData.fundus.od.stage, diabeticData.fundus.os.stage).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}></p>
        </section>

        {/* Footer */}
        <footer className="flex justify-between items-start mt-4 pt-3 border-t border-gray-200 print:mt-3 print:pt-2">
          <div className="flex items-start space-x-2 text-xs leading-snug print:text-[10px] print:space-x-1">
            <Image src="/lee-eyeclinic-logo.png" alt="이안과의원" width={40} height={40} className="rounded-full" />
            <div>
              <div className="font-medium">이안과의원</div>
              <div>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
              <div>Tel. 051-866-7592~4</div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 print:text-[10px]">발행일: {diabeticData.examDate}</div>
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
            margin: 15mm; 
          }
          body { 
            -webkit-print-color-adjust: exact; 
            font-size: 12px;
          }
          
          /* 인쇄 시 숨길 요소들 */
          .print-hide { display: none !important; }
          
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
        }
      `}</style>
      
      <div className="max-w-[18cm] mx-auto border border-gray-300 p-6 rounded-xl shadow-lg print:shadow-none bg-white">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">고혈압망막병증 검진 결과 안내</h1>
          <p className="text-xs text-gray-500">검사일: {hypertensionData.examDate}</p>
        </header>

        {/* Executive Summary */}
        <section className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-base font-semibold mb-2">요약</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-medium">초기 단계({hypertensionData.summary.stage})</span> — 시력에 영향이 없는 경미한 변화입니다.</li>
            <li>혈압을 <strong>{hypertensionData.summary.bloodPressureTarget}&nbsp;mmHg</strong> 미만으로 유지하시면 진행을 늦출 수 있습니다.</li>
            <li><strong>{hypertensionData.summary.followUp} 후</strong> 안저 검사로 변화 여부를 다시 확인하세요.</li>
          </ul>
        </section>

        {/* Patient Info */}
        <section className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6">
          <div><span className="font-medium">환자</span><span className="ml-2">{hypertensionData.name}</span></div>
          <div><span className="font-medium">생년월일</span><span className="ml-2">{hypertensionData.birthDate}</span></div>
          <div><span className="font-medium">검사일</span><span className="ml-2">{hypertensionData.examDate}</span></div>
          <div><span className="font-medium">판독의</span><span className="ml-2">{hypertensionData.doctorName}</span></div>
        </section>

        {/* Fundus Result */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-2">1. 안저 검사</h2>
          <table className="w-full border text-center mb-3">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1 w-16"></th>
                <th className="border p-1">단계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1 font-medium">우안</td>
                <td className="border p-1 text-black font-semibold">{hypertensionData.fundus.od.stage}</td>
              </tr>
              <tr>
                <td className="border p-1 font-medium">좌안</td>
                <td className="border p-1 text-black font-semibold">{hypertensionData.fundus.os.stage}</td>
              </tr>
            </tbody>
          </table>
          <p className="pl-4 text-sm"><span className="font-medium">소견:</span> 가벼운 동맥 협착 외 출혈·부종·시신경 부종은 보이지 않습니다.</p>
        </section>

        {/* Vision & IOP */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-2">2. 시력 &amp; 안압</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Vision table */}
            <table className="w-full border text-center">
              <caption className="caption-top font-medium mb-1 text-left">시력</caption>
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1"></th>
                  <th className="border p-1">나안</th>
                  <th className="border p-1">교정</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium">우안</td>
                  <td className="border p-1">{hypertensionData.vision.od.naked}</td>
                  <td className="border p-1">{hypertensionData.vision.od.corrected}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium">좌안</td>
                  <td className="border p-1">{hypertensionData.vision.os.naked}</td>
                  <td className="border p-1">{hypertensionData.vision.os.corrected}</td>
                </tr>
              </tbody>
            </table>
            {/* IOP table */}
            <table className="w-full border text-center">
              <caption className="caption-top font-medium mb-1 text-left">안압 (mmHg)</caption>
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1"></th>
                  <th className="border p-1">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium">우안</td>
                  <td className="border p-1">{hypertensionData.iop.od}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium">좌안</td>
                  <td className="border p-1">{hypertensionData.iop.os}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-2">3. 권고 사항</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>혈압을 꾸준히 관리해 <strong>{hypertensionData.summary.bloodPressureTarget}&nbsp;mmHg</strong> 미만을 유지하세요.</li>
            <li>{hypertensionData.summary.followUp} 후 안저 검사를 예약해 변화 여부를 확인하세요.</li>
            <li>시력 변화·점이나 번쩍임이 느껴지면 바로 내원하세요.</li>
          </ol>
        </section>

        {/* Integrated Plan */}
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-2">4. 통합 해석 &amp; 향후 계획</h2>
          <p className="pl-4 text-sm">현재 검사 결과는 초기 단계이며 시력과 일상생활에는 영향이 없습니다. <strong>혈압 관리와 정기 검진</strong>만 꾸준히 이어가시면 됩니다.</p>
        </section>

        {/* Footer */}
        <footer className="flex justify-between items-start mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-start space-x-3 text-xs leading-snug">
            <Image src="/lee-eyeclinic-logo.png" alt="이안과의원" width={40} height={40} className="rounded-full" />
            <div>
              <div className="font-medium">이안과의원</div>
              <div>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
              <div>Tel. 051-866-7592~4</div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">발행일: {hypertensionData.examDate}</div>
        </footer>
      </div>
    </div>
  )

  const renderComprehensivePreview = () => (
    <div id="comprehensive-preview">
      <div className="bg-white p-8 space-y-6 comprehensive-page-1">
        {/* 인쇄용 스타일 */}
        <style jsx global>{`
          @media print {
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            .page-break { page-break-after: always; }
            body { 
              -webkit-print-color-adjust: exact; 
              font-size: 11px;
            }
            
            /* 인쇄 시 숨길 요소들 */
            .print-hide { display: none !important; }
            
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
          }
        `}</style>
        
        {/* ================= PAGE 1 ================= */}
        <section className="max-w-[18cm] mx-auto border border-gray-300 p-6 rounded-xl shadow-lg print:shadow-none bg-white">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-2xl font-semibold">눈종합검사 결과 안내서</h1>
            <p className="text-xs text-gray-500">검사일: {comprehensiveData.examDate}</p>
          </header>

          {/* Executive Summary */}
          <section className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-base font-semibold mb-2">요약</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-medium">{comprehensiveData.summary.riskLevel}</span> &mdash; 전반적 상태 양호</li>
              <li>주요 이상: {comprehensiveData.summary.mainFindings}</li>
              <li>{comprehensiveData.summary.followUp} 후 간단한 시력·안압·안저 검사 권장</li>
            </ul>
          </section>

          {/* Patient Info */}
          <section className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6">
            <div><span className="font-medium">환자</span><span className="ml-2">{comprehensiveData.name}</span></div>
            <div><span className="font-medium">생년월일</span><span className="ml-2">{comprehensiveData.birthDate}</span></div>
            <div><span className="font-medium">검사기관</span><span className="ml-2">이안과의원</span></div>
            <div><span className="font-medium">판독의</span><span className="ml-2">{comprehensiveData.doctorName}</span></div>
          </section>

          {/* Vision & IOP */}
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2">1. 시력 &amp; 안압</h2>
            <div className="grid grid-cols-2 gap-6">
              <table className="w-full border text-center">
                <caption className="caption-top font-medium mb-1 text-left">시력</caption>
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-1"> </th>
                    <th className="border p-1">나안</th>
                    <th className="border p-1">교정</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1 font-medium">우안</td>
                    <td className="border p-1">{comprehensiveData.vision.od.naked}</td>
                    <td className="border p-1">{comprehensiveData.vision.od.corrected}</td>
                  </tr>
                  <tr>
                    <td className="border p-1 font-medium">좌안</td>
                    <td className="border p-1">{comprehensiveData.vision.os.naked}</td>
                    <td className="border p-1">{comprehensiveData.vision.os.corrected}</td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full border text-center">
                <caption className="caption-top font-medium mb-1 text-left">안압 (mmHg)</caption>
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-1"> </th>
                    <th className="border p-1">결과</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1 font-medium">우안</td>
                    <td className="border p-1">{comprehensiveData.iop.od}</td>
                  </tr>
                  <tr>
                    <td className="border p-1 font-medium">좌안</td>
                    <td className="border p-1">{comprehensiveData.iop.os}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Basic Exam */}
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2">2. 기본 검사</h2>
            <table className="w-full border text-left">
              <tbody>
                <tr className="bg-gray-50">
                  <th className="border p-1 w-40">굴절</th>
                  <td className="border p-1">{comprehensiveData.basicExam.refraction}</td>
                </tr>
                <tr>
                  <th className="border p-1">외안부</th>
                  <td className="border p-1">{comprehensiveData.basicExam.externalEye}</td>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border p-1">수정체</th>
                  <td className="border p-1">{comprehensiveData.basicExam.lens}</td>
                </tr>
                <tr>
                  <th className="border p-1">안저</th>
                  <td className="border p-1">{comprehensiveData.basicExam.fundus}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Recommendations */}
          <section className="mb-8">
            <h2 className="text-base font-semibold mb-2">3. 권고 사항</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>인공눈물 하루 4회 &nbsp;—&nbsp; 건성안 증상 지속 시 유지</li>
              <li>{comprehensiveData.summary.followUp} 후 간단한 시력·안압·안저 검사 권장</li>
            </ol>
          </section>
        </section>

        <div className="page-break"></div>

        {/* ================= PAGE 2 ================= */}
        <section className="max-w-[18cm] mx-auto border border-gray-300 p-6 rounded-xl shadow-lg print:shadow-none bg-white">
          <header className="text-center mb-6">
            <h2 className="text-xl font-semibold">정밀 검사 세부 소견</h2>
          </header>

          {/* Topography */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">1. 각막·전안부 (토포그래피)</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.topography === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.topography === '경미한 이상'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.topography}
              </span>
              <span>각막 형태와 두께 정상 범위</span>
            </p>
          </section>

          {/* OCT */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">2. 망막·시신경 (OCT)</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.oct === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.oct === '경미한 이상'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.oct}
              </span>
              <span>시신경층 두께 정상</span>
            </p>
          </section>

          {/* Visual Field */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">3. 시야 검사</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.visualField === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.visualField === '경미한 이상'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.visualField}
              </span>
              <span>주변 시야 이상 없음</span>
            </p>
          </section>

          {/* Dry Eye */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">4. 안구건조증 검사</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.dryEye === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.dryEye === '경미'
                  ? 'bg-yellow-100 text-yellow-800'
                  : comprehensiveData.detailedExam.dryEye === '중등도'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.dryEye}
              </span>
              <span>눈물량 약간 부족</span>
            </p>
          </section>

          {/* Final Comments */}
          <section className="mb-8 border-t pt-6">
            <h3 className="text-base font-semibold mb-2">종합 소견</h3>
            <p className="text-sm leading-relaxed">
              전반적인 눈 건강 상태는 양호합니다. {comprehensiveData.summary.mainFindings}이 관찰되어 인공눈물 사용을 권장드립니다. 
              정기적인 검진을 통해 눈 건강을 유지하시기 바랍니다.
            </p>
          </section>

          {/* Footer */}
          <footer className="flex justify-between items-start mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3 text-xs leading-snug">
              <Image src="/lee-eyeclinic-logo.png" alt="이안과의원" width={40} height={40} className="rounded-full" />
              <div>
                <div className="font-medium">이안과의원</div>
                <div>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
                <div>Tel. 051-866-7592~4</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">발행일: {comprehensiveData.examDate}</div>
              <div className="text-sm font-medium mt-2">{comprehensiveData.doctorName}</div>
              <div className="w-24 h-10 border-t border-gray-400 mt-1"></div>
            </div>
          </footer>
        </section>
      </div>

      <div className="bg-white p-8 space-y-6 comprehensive-page-2">
        {/* 인쇄용 스타일 */}
        <style jsx global>{`
          @media print {
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            .page-break { page-break-after: always; }
            body { 
              -webkit-print-color-adjust: exact; 
              font-size: 11px;
            }
            
            /* 인쇄 시 숨길 요소들 */
            .print-hide { display: none !important; }
            
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
          }
        `}</style>
        
        {/* ================= PAGE 2 ================= */}
        <section className="max-w-[18cm] mx-auto border border-gray-300 p-6 rounded-xl shadow-lg print:shadow-none bg-white">
          {/* Header */}
          <header className="text-center mb-6">
            <h2 className="text-xl font-semibold">정밀 검사 세부 소견</h2>
          </header>

          {/* Topography */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">1. 각막·전안부 (토포그래피)</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.topography === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.topography === '경미한 이상'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.topography}
              </span>
              <span>각막 형태와 두께 정상 범위</span>
            </p>
          </section>

          {/* OCT */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">2. 망막·시신경 (OCT)</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.oct === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.oct === '경미한 이상'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.oct}
              </span>
              <span>시신경층 두께 정상</span>
            </p>
          </section>

          {/* Visual Field */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">3. 시야 검사</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.visualField === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.visualField === '경미한 이상'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.visualField}
              </span>
              <span>주변 시야 이상 없음</span>
            </p>
          </section>

          {/* Dry Eye */}
          <section className="mb-6">
            <h3 className="text-base font-semibold mb-2">4. 안구건조증 검사</h3>
            <p className="pl-4 flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs ${
                comprehensiveData.detailedExam.dryEye === '정상' 
                  ? 'bg-green-100 text-green-800' 
                  : comprehensiveData.detailedExam.dryEye === '경미'
                  ? 'bg-yellow-100 text-yellow-800'
                  : comprehensiveData.detailedExam.dryEye === '중등도'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {comprehensiveData.detailedExam.dryEye}
              </span>
              <span>눈물량 약간 부족</span>
            </p>
          </section>

          {/* Final Comments */}
          <section className="mb-8 border-t pt-6">
            <h3 className="text-base font-semibold mb-2">종합 소견</h3>
            <p className="text-sm leading-relaxed">
              전반적인 눈 건강 상태는 양호합니다. {comprehensiveData.summary.mainFindings}이 관찰되어 인공눈물 사용을 권장드립니다. 
              정기적인 검진을 통해 눈 건강을 유지하시기 바랍니다.
            </p>
          </section>

          {/* Footer */}
          <footer className="flex justify-between items-start mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3 text-xs leading-snug">
              <Image src="/lee-eyeclinic-logo.png" alt="이안과의원" width={40} height={40} className="rounded-full" />
              <div>
                <div className="font-medium">이안과의원</div>
                <div>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</div>
                <div>Tel. 051-866-7592~4</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">발행일: {comprehensiveData.examDate}</div>
              <div className="text-sm font-medium mt-2">{comprehensiveData.doctorName}</div>
              <div className="w-24 h-10 border-t border-gray-400 mt-1"></div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <div className="max-w-6xl mx-auto mb-8 print-hide">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50">
          <Link 
            href="/" 
            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">홈으로</span>
          </Link>
          
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

      {/* 메인 콘텐츠 */}
      {!selectedType && renderTemplateSelector()}
      
      {selectedType === 'diabetic' && renderDiabeticForm()}
      {selectedType === 'hypertension' && renderHypertensionForm()}
      {selectedType === 'comprehensive' && renderComprehensiveForm()}
    </div>
  )
}