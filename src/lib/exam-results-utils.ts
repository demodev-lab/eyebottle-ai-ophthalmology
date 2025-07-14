// 당뇨망막병증 단계별 멘트 및 추적 간격 설정
export const getDiabeticRetinopathyInfo = (odStage: string, osStage: string) => {
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
export const getDiabeticRetinopathyPlan = (odStage: string, osStage: string) => {
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
export const getHypertensionRetinopathyInfo = (odStage: string, osStage: string) => {
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

// 종합검진 위험도 평가
export const getComprehensiveRiskLevel = (data: any) => {
  // 여기서 위험도 평가 로직을 구현
  // 실제 로직은 원본 파일에서 가져와야 함
  return '정상'
}