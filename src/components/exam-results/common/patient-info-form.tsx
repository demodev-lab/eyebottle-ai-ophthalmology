'use client'

interface PatientInfoFormProps {
  name: string
  birthDate: string
  examDate: string
  doctorName: string
  onNameChange: (value: string) => void
  onBirthDateChange: (value: string) => void
  onExamDateChange: (value: string) => void
  onDoctorNameChange: (value: string) => void
}

export function PatientInfoForm({
  name,
  birthDate,
  examDate,
  doctorName,
  onNameChange,
  onBirthDateChange,
  onExamDateChange,
  onDoctorNameChange
}: PatientInfoFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">환자 정보</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">환자명</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="환자 이름을 입력하세요"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">생년월일</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">검사일</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => onExamDateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">판독의사</label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => onDoctorNameChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="판독의사 이름을 입력하세요"
          />
        </div>
      </div>
    </div>
  )
}