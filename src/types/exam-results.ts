// 검진 타입 정의
export type ExamType = 'diabetic' | 'hypertension' | 'comprehensive' | null

// 공통 환자 정보 타입
export interface PatientInfo {
  name: string
  birthDate: string
  examDate: string
  doctorName: string
}

// 각 검진별 데이터 타입
export interface DiabeticData extends PatientInfo {
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

export interface HypertensionData extends PatientInfo {
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

export interface ComprehensiveData extends PatientInfo {
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