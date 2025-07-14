'use client'

import { DiabeticData } from '@/types/exam-results'
import { getDiabeticRetinopathyPlan } from '@/lib/exam-results-utils'

interface DiabeticPreviewProps {
  data: DiabeticData
}

export function DiabeticPreview({ data }: DiabeticPreviewProps) {
  const plan = getDiabeticRetinopathyPlan(data.fundus.od.stage, data.fundus.os.stage)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 print-hide">
        <h3 className="text-lg font-semibold">실시간 미리보기</h3>
      </div>

      {/* 미리보기 내용 */}
      <div id="diabetic-preview" className="space-y-6">
        {/* 제목 */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">당뇨망막병증 검진 결과서</h1>
        </div>

        {/* 환자 정보 */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">환자 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">환자명:</span>
              <span className="ml-2">{data.name || '미입력'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">생년월일:</span>
              <span className="ml-2">{data.birthDate || '미입력'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">검사일:</span>
              <span className="ml-2">{data.examDate || '미입력'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">판독의사:</span>
              <span className="ml-2">{data.doctorName || '미입력'}</span>
            </div>
          </div>
        </section>

        {/* 시력 검사 */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">시력 검사</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left text-lg text-gray-600">구분</th>
                <th className="pb-2 text-center text-lg text-gray-600">나안시력</th>
                <th className="pb-2 text-center text-lg text-gray-600">교정시력</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 text-lg font-medium">우안 (OD)</td>
                <td className="py-3 text-center text-lg">{data.vision.od.naked || '-'}</td>
                <td className="py-3 text-center text-lg">{data.vision.od.corrected || '-'}</td>
              </tr>
              <tr>
                <td className="py-3 text-lg font-medium">좌안 (OS)</td>
                <td className="py-3 text-center text-lg">{data.vision.os.naked || '-'}</td>
                <td className="py-3 text-center text-lg">{data.vision.os.corrected || '-'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 안압 검사 */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">안압 검사</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left text-lg text-gray-600">구분</th>
                <th className="pb-2 text-center text-lg text-gray-600">측정값 (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 text-lg font-medium">우안 (OD)</td>
                <td className="py-3 text-center text-lg">{data.iop.od || '-'}</td>
              </tr>
              <tr>
                <td className="py-3 text-lg font-medium">좌안 (OS)</td>
                <td className="py-3 text-center text-lg">{data.iop.os || '-'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 안저 검사 */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">안저 검사</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-600">우안 (OD):</span>
              <span className="ml-2">{data.fundus.od.stage || '미입력'}</span>
              {data.fundus.od.additional && (
                <div className="mt-1 ml-4 text-sm text-gray-600">
                  추가 소견: {data.fundus.od.additional}
                </div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-600">좌안 (OS):</span>
              <span className="ml-2">{data.fundus.os.stage || '미입력'}</span>
              {data.fundus.os.additional && (
                <div className="mt-1 ml-4 text-sm text-gray-600">
                  추가 소견: {data.fundus.os.additional}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 종합 의견 */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-3">종합 의견</h3>
          <div className="space-y-2">
            <p className="text-gray-700">{data.summary.stage || '단계를 선택하면 자동으로 생성됩니다.'}</p>
            <div className="mt-4">
              <p className="font-medium text-gray-800">향후 계획:</p>
              <p className="text-gray-700 mt-1">{plan}</p>
            </div>
            <div className="mt-3">
              <p className="font-medium text-gray-800">추적 검사:</p>
              <p className="text-gray-700">{data.summary.followUp} 후 재검사 권장</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}