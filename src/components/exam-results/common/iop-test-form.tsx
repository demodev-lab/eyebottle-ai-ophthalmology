'use client'

interface IopData {
  od: string
  os: string
}

interface IopTestFormProps {
  iop: IopData
  onIopChange: (iop: IopData) => void
}

export function IopTestForm({ iop, onIopChange }: IopTestFormProps) {
  const updateIop = (eye: 'od' | 'os', value: string) => {
    onIopChange({
      ...iop,
      [eye]: value
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">안압 검사</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="text-sm font-medium text-gray-600">구분</div>
          <div className="text-sm font-medium text-gray-600">측정값 (mmHg)</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="text-sm font-medium">우안 (OD)</div>
          <input
            type="text"
            value={iop.od}
            onChange={(e) => updateIop('od', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="15"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="text-sm font-medium">좌안 (OS)</div>
          <input
            type="text"
            value={iop.os}
            onChange={(e) => updateIop('os', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="16"
          />
        </div>
      </div>
    </div>
  )
}