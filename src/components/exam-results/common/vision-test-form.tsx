'use client'

interface VisionData {
  od: { naked: string; corrected: string }
  os: { naked: string; corrected: string }
}

interface VisionTestFormProps {
  vision: VisionData
  onVisionChange: (vision: VisionData) => void
}

export function VisionTestForm({ vision, onVisionChange }: VisionTestFormProps) {
  const updateVision = (eye: 'od' | 'os', type: 'naked' | 'corrected', value: string) => {
    onVisionChange({
      ...vision,
      [eye]: {
        ...vision[eye],
        [type]: value
      }
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">시력 검사</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-sm font-medium text-gray-600">구분</div>
          <div className="text-sm font-medium text-gray-600">나안시력</div>
          <div className="text-sm font-medium text-gray-600">교정시력</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-sm font-medium">우안 (OD)</div>
          <input
            type="text"
            value={vision.od.naked}
            onChange={(e) => updateVision('od', 'naked', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.8"
          />
          <input
            type="text"
            value={vision.od.corrected}
            onChange={(e) => updateVision('od', 'corrected', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1.0"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-sm font-medium">좌안 (OS)</div>
          <input
            type="text"
            value={vision.os.naked}
            onChange={(e) => updateVision('os', 'naked', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.8"
          />
          <input
            type="text"
            value={vision.os.corrected}
            onChange={(e) => updateVision('os', 'corrected', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1.0"
          />
        </div>
      </div>
    </div>
  )
}