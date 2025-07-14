'use client'

interface FundusData {
  od: { stage: string; additional: string }
  os: { stage: string; additional: string }
}

interface HypertensionFundusFormProps {
  fundus: FundusData
  onFundusChange: (fundus: FundusData) => void
  onAutoFill: () => void
}

export function HypertensionFundusForm({ fundus, onFundusChange, onAutoFill }: HypertensionFundusFormProps) {
  const stages = [
    '정상',
    '1기 고혈압망막병증',
    '2기 고혈압망막병증',
    '3기 고혈압망막병증',
    '4기 고혈압망막병증'
  ]

  const updateFundus = (eye: 'od' | 'os', field: 'stage' | 'additional', value: string) => {
    onFundusChange({
      ...fundus,
      [eye]: {
        ...fundus[eye],
        [field]: value
      }
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">안저 검사</h3>
        <button
          onClick={onAutoFill}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          자동 입력
        </button>
      </div>
      
      <div className="space-y-4">
        {/* 우안 */}
        <div>
          <label className="block text-sm font-medium mb-2">우안 (OD) 단계</label>
          <select
            value={fundus.od.stage}
            onChange={(e) => updateFundus('od', 'stage', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">단계를 선택하세요</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">우안 추가 소견</label>
          <textarea
            value={fundus.od.additional}
            onChange={(e) => updateFundus('od', 'additional', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="추가 소견이 있으면 입력하세요"
          />
        </div>

        {/* 좌안 */}
        <div>
          <label className="block text-sm font-medium mb-2">좌안 (OS) 단계</label>
          <select
            value={fundus.os.stage}
            onChange={(e) => updateFundus('os', 'stage', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">단계를 선택하세요</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">좌안 추가 소견</label>
          <textarea
            value={fundus.os.additional}
            onChange={(e) => updateFundus('os', 'additional', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="추가 소견이 있으면 입력하세요"
          />
        </div>
      </div>
    </div>
  )
}