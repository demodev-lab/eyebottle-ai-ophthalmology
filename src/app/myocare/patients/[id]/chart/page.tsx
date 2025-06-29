'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getPatientById, getVisits, getUserSettings, updateVisit, deleteVisit } from '@/lib/storage';
import { Patient, MyoCareVisit, TREATMENT_METHOD_LABELS, RiskLevel, TreatmentMethod } from '@/types/database';
import { 
  calculateAge, 
  calculateProgressionRate, 
  calculateSE,
  getRiskColor,
  getRiskText 
} from '@/lib/calculations';
import { ArrowLeft, Edit2, Trash2, Save, X, Printer, FileText, Plus } from 'lucide-react';
import { TREATMENT_COLORS, TREATMENT_COLORS_SOLID, PRINT_CONSTANTS } from '@/constants';
import { TreatmentArea } from '@/types/chart-props';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';



// 커스텀 Dot 컴포넌트
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDot = (props: any) => {
  const { cx, cy, payload, dataKey } = props;
  const riskLevel = dataKey === 'od' ? payload.odRisk : payload.osRisk;
  const color = getRiskColor(riskLevel);
  
  return (
    <g>
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill={color} 
        stroke="#fff" 
        strokeWidth={2}
      />
      {/* 안경 처방 표시 */}
      {payload.new_prescription && (
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize="14"
          fill="#4b5563"
        >
          👓
        </text>
      )}
    </g>
  );
};

export default function PatientChartPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<MyoCareVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEye, setSelectedEye] = useState<'both' | 'od' | 'os'>('both');
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);
  // 편집 중에는 문자열로 관리하기 위한 타입
  const [editingData, setEditingData] = useState<{
    visit_date?: string;
    od_sphere?: string;
    od_cylinder?: string;
    od_axial_length?: string;
    os_sphere?: string;
    os_cylinder?: string;
    os_axial_length?: string;
    new_prescription?: boolean;
    treatment_method?: TreatmentMethod;
  }>({});
  const [copyButtonText, setCopyButtonText] = useState('EMR 복사');

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      console.log('[MyoCare Chart] 환자 데이터 로딩 시작:', patientId);
      
      const patientData = getPatientById(patientId);
      if (!patientData) {
        alert('환자를 찾을 수 없습니다.');
        router.push('/myocare/patients');
        return;
      }
      setPatient(patientData);
      
      const visitsData = getVisits(patientId);
      console.log('[MyoCare Chart] 방문 기록 로드:', {
        count: visitsData.length,
        visits: visitsData.map(v => ({
          date: v.visit_date,
          od_se: v.od_se,
          os_se: v.os_se,
          od_sphere: v.od_sphere,
          od_cylinder: v.od_cylinder,
          od_al: v.od_axial_length,
          os_al: v.os_axial_length
        }))
      });
      
      setVisits(visitsData.reverse()); // 오래된 것부터 최신순으로
    } catch (error) {
      console.error('[MyoCare Chart] 환자 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visit: MyoCareVisit) => {
    setEditingVisitId(visit.id);
    setEditingData({
      visit_date: visit.visit_date,
      od_sphere: visit.od_sphere?.toString() || '',
      od_cylinder: visit.od_cylinder?.toString() || '',
      od_axial_length: visit.od_axial_length?.toString() || '',
      os_sphere: visit.os_sphere?.toString() || '',
      os_cylinder: visit.os_cylinder?.toString() || '',
      os_axial_length: visit.os_axial_length?.toString() || '',
      new_prescription: visit.new_prescription,
      treatment_method: visit.treatment_method,
    });
  };

  const handleSave = async (visitId: string) => {
    try {
      // 문자열을 숫자로 변환
      const dataToSave: Partial<MyoCareVisit> = {
        visit_date: editingData.visit_date,
        od_sphere: editingData.od_sphere ? parseFloat(editingData.od_sphere) : undefined,
        od_cylinder: editingData.od_cylinder ? parseFloat(editingData.od_cylinder) : undefined,
        od_axial_length: editingData.od_axial_length ? parseFloat(editingData.od_axial_length) : undefined,
        os_sphere: editingData.os_sphere ? parseFloat(editingData.os_sphere) : undefined,
        os_cylinder: editingData.os_cylinder ? parseFloat(editingData.os_cylinder) : undefined,
        os_axial_length: editingData.os_axial_length ? parseFloat(editingData.os_axial_length) : undefined,
        new_prescription: editingData.new_prescription,
        treatment_method: editingData.treatment_method,
      };
      
      await updateVisit(visitId, dataToSave);
      await loadPatientData();
      setEditingVisitId(null);
      setEditingData({});
    } catch (error) {
      console.error('검사 수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setEditingVisitId(null);
    setEditingData({});
  };

  const handleDelete = async (visitId: string) => {
    if (confirm('이 검사 기록을 삭제하시겠습니까?')) {
      try {
        await deleteVisit(visitId);
        await loadPatientData();
      } catch (error) {
        console.error('검사 삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePrint = () => {
    // 인쇄용 날짜 설정
    const printDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    const mainElement = document.querySelector('.max-w-7xl');
    if (mainElement) {
      mainElement.setAttribute('data-print-date', printDate);
      // 인쇄 전용 클래스 추가
      mainElement.classList.add('printing');
    }
    
    // SVG 렌더링이 완료될 때까지 대기
    setTimeout(() => {
      console.log('[MyoCare Chart] 인쇄 시작');
      window.print();
      
      // 인쇄 후 클래스 제거
      setTimeout(() => {
        if (mainElement) {
          mainElement.classList.remove('printing');
        }
      }, PRINT_CONSTANTS.DELAY_AFTER_PRINT);
    }, PRINT_CONSTANTS.DELAY_BEFORE_PRINT);
  };

  // EMR 텍스트 생성 함수
  const generateEMRText = () => {
    if (!patient || visits.length === 0) {
      return '검사 데이터가 없습니다.';
    }

    const settings = getUserSettings();
    const variables = settings.emrTemplateVariables || [];
    const latestVisit = visits[visits.length - 1];
    const recentVisits = visits.slice(-10);
    const progression = recentVisits.length >= 2 ? calculateProgressionRate(recentVisits, settings) : null;
    
    let template = '';
    
    // 치료방법
    if (variables.includes('[치료방법]')) {
      const treatmentMethod = latestVisit.treatment_method || patient.treatment_method;
      const treatmentLabel = treatmentMethod ? TREATMENT_METHOD_LABELS[treatmentMethod] : '미지정';
      template += `치료방법: ${treatmentLabel}\n\n`;
    }
    
    // SE 정보
    if (variables.includes('[구면상당치]')) {
      const odSE = calculateSE(latestVisit.od_sphere, latestVisit.od_cylinder);
      const osSE = calculateSE(latestVisit.os_sphere, latestVisit.os_cylinder);
      template += `우안 S.E.: ${odSE !== undefined ? odSE.toFixed(2) : 'N/A'} D / `;
      template += `좌안 S.E.: ${osSE !== undefined ? osSE.toFixed(2) : 'N/A'} D\n`;
    }
    
    // AL 정보
    if (variables.includes('[안축장]')) {
      template += `우안 안축장: ${latestVisit.od_axial_length !== undefined ? latestVisit.od_axial_length.toFixed(2) : 'N/A'} mm / `;
      template += `좌안 안축장: ${latestVisit.os_axial_length !== undefined ? latestVisit.os_axial_length.toFixed(2) : 'N/A'} mm\n`;
    }
    
    // 진행속도
    const hasSEProgress = variables.includes('[SE 진행속도]');
    const hasALProgress = variables.includes('[AL 진행속도]');
    
    if ((hasSEProgress || hasALProgress) && progression) {
      template += '\n연간 진행속도:\n';
      
      // SE 진행속도
      if (hasSEProgress) {
        template += `우안 S.E.: ${progression.se_od !== undefined ? progression.se_od.toFixed(2) : 'N/A'} D/yr / `;
        template += `좌안 S.E.: ${progression.se_os !== undefined ? progression.se_os.toFixed(2) : 'N/A'} D/yr\n`;
      }
      
      // AL 진행속도
      if (hasALProgress) {
        template += `우안 A.L.: ${progression.al_od !== undefined ? progression.al_od.toFixed(2) : 'N/A'} mm/yr / `;
        template += `좌안 A.L.: ${progression.al_os !== undefined ? progression.al_os.toFixed(2) : 'N/A'} mm/yr\n`;
      }
    }
    
    // 안경처방 - 최신 검사에서 처방이 있었을 때만 표시
    if (variables.includes('[안경처방]') && latestVisit.new_prescription) {
      template += '\n당일 안경처방함';
    }
    
    // 사용자 경과 문구
    if (variables.includes('[사용자 경과 문구]') && settings.customComment) {
      template += `\n${settings.customComment}`;
    }
    
    return template.trim();
  };

  // EMR 복사 함수
  const handleCopyEMR = async () => {
    try {
      const emrText = generateEMRText();
      
      // 클립보드 API 지원 확인
      if (!navigator.clipboard) {
        // 구형 브라우저를 위한 대체 방법
        const textArea = document.createElement('textarea');
        textArea.value = emrText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        // 최신 클립보드 API 사용
        await navigator.clipboard.writeText(emrText);
      }
      
      // 성공 피드백
      setCopyButtonText('복사됨!');
      setTimeout(() => {
        setCopyButtonText('EMR 복사');
      }, 2000);
    } catch (error) {
      console.error('EMR 복사 실패:', error);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  // 치료 구간 계산
  const getTreatmentAreas = (): TreatmentArea[] => {
    const areas: TreatmentArea[] = [];
    if (visits.length < 2 || !patient) return areas;
    
    console.log('[MyoCare Chart] 치료 구간 계산 시작:', {
      visitsCount: visits.length,
      patient: patient.name,
      treatments: visits.map(v => ({ date: v.visit_date, method: v.treatment_method }))
    });

    for (let i = 0; i < visits.length - 1; i++) {
      const currentVisit = visits[i];
      const nextVisit = visits[i + 1];
      
      if (currentVisit.treatment_method) {
        const startAge = calculateAge(patient.birth_date, currentVisit.visit_date);
        const endAge = calculateAge(patient.birth_date, nextVisit.visit_date);
        
        areas.push({
          x1: startAge,
          x2: endAge,
          fill: TREATMENT_COLORS[currentVisit.treatment_method] || 'rgba(240, 240, 240, 0.3)',
          opacity: 1,
          key: `area-${i}`,
          treatment: currentVisit.treatment_method,
        });
      }
    }

    // 마지막 치료 구간 (마지막 검사부터 현재까지) - 현재 치료 중
    const lastVisit = visits[visits.length - 1];
    if (lastVisit.treatment_method) {
      const startAge = calculateAge(patient.birth_date, lastVisit.visit_date);
      const currentAge = calculateAge(patient.birth_date);
      
      // TREATMENT_COLORS에서 해당 색상이 있는지 확인
      const baseColor = TREATMENT_COLORS[lastVisit.treatment_method];
      const fillColor = baseColor 
        ? baseColor.replace('0.45)', '0.6)') // 현재 치료 중이므로 60% 투명도
        : 'rgba(240, 240, 240, 0.6)'; // 기본 색상
      
      areas.push({
        x1: startAge,
        x2: currentAge,
        fill: fillColor,
        opacity: 1,
        key: `area-last`,
        treatment: lastVisit.treatment_method,
        isCurrent: true, // 현재 치료 중 표시
      });
    }

    console.log('[MyoCare Chart] 치료 구간 계산 완료:', {
      areasCount: areas.length,
      areas: areas.map(a => ({
        x1: a.x1,
        x2: a.x2,
        treatment: a.treatment,
        isCurrent: a.isCurrent,
        fill: a.fill
      }))
    });
    
    return areas;
  };

  // 두 검사 간의 진행 속도 계산
  const calculateProgressionBetweenVisits = (prevVisit: MyoCareVisit, currentVisit: MyoCareVisit) => {
    const prevDate = new Date(prevVisit.visit_date);
    const currentDate = new Date(currentVisit.visit_date);
    const yearsDiff = (currentDate.getTime() - prevDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    if (yearsDiff === 0) return { se_od: undefined, se_os: undefined, al_od: undefined, al_os: undefined };
    
    const prevOdSE = calculateSE(prevVisit.od_sphere, prevVisit.od_cylinder);
    const currentOdSE = calculateSE(currentVisit.od_sphere, currentVisit.od_cylinder);
    const prevOsSE = calculateSE(prevVisit.os_sphere, prevVisit.os_cylinder);
    const currentOsSE = calculateSE(currentVisit.os_sphere, currentVisit.os_cylinder);
    
    const se_od = (prevOdSE !== undefined && currentOdSE !== undefined) 
      ? (currentOdSE - prevOdSE) / yearsDiff : undefined;
    const se_os = (prevOsSE !== undefined && currentOsSE !== undefined)
      ? (currentOsSE - prevOsSE) / yearsDiff : undefined;
    const al_od = (prevVisit.od_axial_length !== undefined && currentVisit.od_axial_length !== undefined)
      ? (currentVisit.od_axial_length - prevVisit.od_axial_length) / yearsDiff : undefined;
    const al_os = (prevVisit.os_axial_length !== undefined && currentVisit.os_axial_length !== undefined)
      ? (currentVisit.os_axial_length - prevVisit.os_axial_length) / yearsDiff : undefined;
    
    return { se_od, se_os, al_od, al_os };
  };

  // 진행 속도에 따른 위험도 판단
  const getProgressionRiskLevel = (seProgression?: number, alProgression?: number) => {
    const settings = getUserSettings();
    let riskLevel = RiskLevel.NORMAL;
    
    if (seProgression !== undefined) {
      const absSeProgression = Math.abs(seProgression);
      if (absSeProgression >= settings.thresholds.se.red) {
        riskLevel = RiskLevel.RED;
      } else if (absSeProgression >= settings.thresholds.se.yellow) {
        riskLevel = RiskLevel.YELLOW;
      }
    }
    
    if (alProgression !== undefined) {
      const absAlProgression = Math.abs(alProgression);
      if (absAlProgression >= settings.thresholds.al.red && riskLevel !== RiskLevel.RED) {
        riskLevel = RiskLevel.RED;
      } else if (absAlProgression >= settings.thresholds.al.yellow && riskLevel === RiskLevel.NORMAL) {
        riskLevel = RiskLevel.YELLOW;
      }
    }
    
    return riskLevel;
  };

  const prepareChartData = (type: 'se' | 'axial') => {
    return visits.map((visit, index) => {
      const age = calculateAge(patient!.birth_date, visit.visit_date);
      
      let odValue: number | null = null;
      let osValue: number | null = null;
      let odRisk = RiskLevel.NORMAL;
      let osRisk = RiskLevel.NORMAL;
      
      // 이전 검사가 있으면 진행 속도 계산
      if (index > 0) {
        const progression = calculateProgressionBetweenVisits(visits[index - 1], visit);
        
        if (type === 'se') {
          odRisk = getProgressionRiskLevel(progression.se_od, undefined);
          osRisk = getProgressionRiskLevel(progression.se_os, undefined);
        } else {
          odRisk = getProgressionRiskLevel(undefined, progression.al_od);
          osRisk = getProgressionRiskLevel(undefined, progression.al_os);
        }
      }
      
      switch(type) {
        case 'se':
          odValue = calculateSE(visit.od_sphere, visit.od_cylinder) ?? null;
          osValue = calculateSE(visit.os_sphere, visit.os_cylinder) ?? null;
          break;
        case 'axial':
          odValue = visit.od_axial_length ?? null;
          osValue = visit.os_axial_length ?? null;
          break;
      }
      
      return {
        date: visit.visit_date,
        age: age,
        od: odValue,
        os: osValue,
        odRisk,
        osRisk,
        treatment: visit.treatment_method,
        new_prescription: visit.new_prescription,
      };
    });
  };


  if (loading || !patient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const settings = getUserSettings();
  // 최근 2개 검사만으로 진행률 계산
  const recentVisits = visits.slice(-2);
  console.log('[MyoCare Chart] 진행률 계산용 최근 방문:', {
    recentVisitsCount: recentVisits.length,
    recentVisits: recentVisits.map(v => ({
      date: v.visit_date,
      od_se: v.od_se,
      os_se: v.os_se
    }))
  });
  
  const progression = recentVisits.length >= 2 ? calculateProgressionRate(recentVisits, settings) : null;
  console.log('[MyoCare Chart] 진행률 계산 결과:', progression);
  
  const age = calculateAge(patient.birth_date);

  // 최근 검사 정보
  const latestVisit = visits.length > 0 ? visits[visits.length - 1] : null;
  const odSE = latestVisit ? calculateSE(latestVisit.od_sphere, latestVisit.od_cylinder) : undefined;
  const osSE = latestVisit ? calculateSE(latestVisit.os_sphere, latestVisit.os_cylinder) : undefined;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/myocare/patients')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">MyoCare Chart</h1>
            <p className="text-sm sm:text-lg text-slate-600 mt-1">{patient.name} 환자의 근시 진행 상태</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-5 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-medium transition-all duration-200 shadow-sm hover:shadow print:hidden"
            >
              <Printer className="h-4 sm:h-5 w-4 sm:w-5 text-slate-500" />
              <span className="hidden sm:inline">인쇄</span>
            </Button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              차트 인쇄
            </div>
          </div>
          
          <div className="relative group">
            <Button
              onClick={handleCopyEMR}
              variant="outline"
              className={`flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-5 font-medium transition-all duration-200 shadow-sm hover:shadow print:hidden ${
                copyButtonText === '복사됨!' 
                  ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100' 
                  : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-300'
              }`}
            >
              {copyButtonText === '복사됨!' ? (
                <svg className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
              )}
              <span className="hidden sm:inline">{copyButtonText}</span>
            </Button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              EMR 시스템에 복사
            </div>
          </div>
          
          <div className="relative group">
            <Button
              onClick={() => router.push(`/myocare/patients/${patientId}/visits/new`)}
              className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] print:hidden"
            >
              <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline">새 검사결과 입력</span>
              <span className="sm:hidden">추가</span>
            </Button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              새로운 검사 데이터 추가
            </div>
          </div>
        </div>
      </div>

      {/* 환자 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">환자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">이름</p>
                <p className="font-semibold text-lg">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">생년월일 (나이)</p>
                <p className="font-semibold">{patient.birth_date} ({age}세)</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">차트번호</p>
                <p className="font-semibold">{patient.chart_number || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">최근 검사 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">검사일</p>
                <p className="font-semibold text-lg">{latestVisit?.visit_date || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">우안 S.E.</p>
                  <p className="font-bold text-blue-600">
                    {odSE !== undefined ? `${odSE.toFixed(2)}D` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">좌안 S.E.</p>
                  <p className="font-bold text-blue-600">
                    {osSE !== undefined ? `${osSE.toFixed(2)}D` : '-'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">우안 안축장</p>
                  <p className="font-bold text-blue-600">
                    {latestVisit?.od_axial_length !== undefined ? `${latestVisit.od_axial_length.toFixed(2)}mm` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">좌안 안축장</p>
                  <p className="font-bold text-blue-600">
                    {latestVisit?.os_axial_length !== undefined ? `${latestVisit.os_axial_length.toFixed(2)}mm` : '-'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600">치료방법</p>
                <p className="font-semibold">
                  {latestVisit?.treatment_method 
                    ? TREATMENT_METHOD_LABELS[latestVisit.treatment_method]
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-md ${
          progression?.riskLevel === RiskLevel.RED ? 'border-red-500 bg-red-50/30' :
          progression?.riskLevel === RiskLevel.YELLOW ? 'border-yellow-500 bg-yellow-50/30' :
          'border-0'
        }`}>
          <CardHeader className="pb-3">
            <div className={`h-1.5 -mt-4 -mx-4 mb-3 ${
              progression?.riskLevel === RiskLevel.RED ? 'bg-red-500' :
              progression?.riskLevel === RiskLevel.YELLOW ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <CardTitle className="text-lg">진행 상태</CardTitle>
          </CardHeader>
          <CardContent>
            {progression ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">위험도 평가</p>
                  <Badge
                    className="font-bold px-6 py-2 text-lg"
                    style={{
                      backgroundColor: getRiskColor(progression.riskLevel) + '20',
                      color: getRiskColor(progression.riskLevel),
                      borderColor: getRiskColor(progression.riskLevel),
                    }}
                    variant="outline"
                  >
                    {progression.riskLevel === RiskLevel.RED ? '⚠️ ' : 
                     progression.riskLevel === RiskLevel.YELLOW ? '🟡 ' : '🟢 '}
                    {getRiskText(progression.riskLevel)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-3">연간 진행속도</p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* SE 진행률 */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-700">S.E. 진행속도</h4>
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-slate-600">우안:</span>
                          <span className={`${
                            Math.abs(progression.se_od || 0) >= settings.thresholds.se.red ? 'bg-red-50 text-red-600 px-2 py-1 rounded' :
                            Math.abs(progression.se_od || 0) >= settings.thresholds.se.yellow ? 'bg-yellow-50 text-yellow-600 px-2 py-1 rounded' : 
                            'text-green-600'
                          }`}>
                            <span className="font-bold text-xl">{progression.se_od !== undefined ? progression.se_od.toFixed(2) : '-'}</span>
                            <span className="text-sm ml-1">D/yr</span>
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-slate-600">좌안:</span>
                          <span className={`${
                            Math.abs(progression.se_os || 0) >= settings.thresholds.se.red ? 'bg-red-50 text-red-600 px-2 py-1 rounded' :
                            Math.abs(progression.se_os || 0) >= settings.thresholds.se.yellow ? 'bg-yellow-50 text-yellow-600 px-2 py-1 rounded' : 
                            'text-green-600'
                          }`}>
                            <span className="font-bold text-xl">{progression.se_os !== undefined ? progression.se_os.toFixed(2) : '-'}</span>
                            <span className="text-sm ml-1">D/yr</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-l pl-4">
                      {/* AL 진행률 */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-700">A.L. 진행속도</h4>
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm text-slate-600">우안:</span>
                            <span className={`${
                              (progression.al_od || 0) >= settings.thresholds.al.red ? 'bg-red-50 text-red-600 px-2 py-1 rounded' :
                              (progression.al_od || 0) >= settings.thresholds.al.yellow ? 'bg-yellow-50 text-yellow-600 px-2 py-1 rounded' : 
                              'text-green-600'
                            }`}>
                              <span className="font-bold text-xl">{progression.al_od !== undefined ? progression.al_od.toFixed(2) : '-'}</span>
                              <span className="text-sm ml-1">mm/yr</span>
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm text-slate-600">좌안:</span>
                            <span className={`${
                              (progression.al_os || 0) >= settings.thresholds.al.red ? 'bg-red-50 text-red-600 px-2 py-1 rounded' :
                              (progression.al_os || 0) >= settings.thresholds.al.yellow ? 'bg-yellow-50 text-yellow-600 px-2 py-1 rounded' : 
                              'text-green-600'
                            }`}>
                              <span className="font-bold text-xl">{progression.al_os !== undefined ? progression.al_os.toFixed(2) : '-'}</span>
                              <span className="text-sm ml-1">mm/yr</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">총 검사 횟수</p>
                  <p className="font-semibold">{visits.length}회</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">진행 분석을 위해서는</p>
                <p className="text-slate-500">2회 이상의 검사가 필요합니다</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 그래프 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SE 그래프 */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">S.E. (구면대응치) 진행 그래프</CardTitle>
              <Select value={selectedEye} onValueChange={(value) => setSelectedEye(value as 'both' | 'od' | 'os')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">양안</SelectItem>
                  <SelectItem value="od">우안 (OD)</SelectItem>
                  <SelectItem value="os">좌안 (OS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 진행 속도 위험도 가이드 */}
            <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
              <span className="text-slate-600">진행 속도:</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-600">정상</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-slate-600">주의</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">위험</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareChartData('se')}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  {/* 치료 방법별 배경색 - CartesianGrid 앞에 렌더링 */}
                  {getTreatmentAreas().map((area) => (
                    <ReferenceArea
                      key={area.key}
                      x1={area.x1}
                      x2={area.x2}
                      y1={-20}
                      y2={5}
                      fill={area.fill}
                      fillOpacity={1}
                      stroke={area.isCurrent && area.treatment ? TREATMENT_COLORS_SOLID[area.treatment] : undefined}
                      strokeWidth={area.isCurrent ? 2 : undefined}
                      strokeDasharray={area.isCurrent ? "5 5" : undefined}
                      ifOverflow="visible"
                      style={{
                        fill: area.fill,
                        fillOpacity: 1,
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact'
                      }}
                    />
                  ))}
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="age" 
                    label={{ value: '나이 (세)', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => Number(value).toFixed(1)}
                  />
                  <YAxis 
                    domain={[-20, 5]}
                    tickFormatter={(value) => `${value}D`}
                    label={{ 
                      value: '굴절력 (D)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => {
                      if (value === null || value === undefined) return '-';
                      return `${value}D`;
                    }}
                    labelFormatter={(label) => `${Number(label).toFixed(1)}세`}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(props: any) => {
                      const { active, payload, label } = props;
                      if (!active || !payload || !payload.length) return null;
                      
                      const data = payload[0]?.payload;
                      const treatment = data?.treatment as TreatmentMethod | undefined;
                      
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-semibold">{`${Number(label).toFixed(1)}세`}</p>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {payload.map((entry: any, index: number) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.dataKey}: {entry.value}D
                            </p>
                          ))}
                          {treatment && (
                            <p className="text-sm text-gray-600 mt-1">
                              치료: {TREATMENT_METHOD_LABELS[treatment]}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="line"
                  />
                  
                  {/* 위험 구간 표시 */}
                  <ReferenceLine y={-6} stroke="#ff0000" strokeDasharray="5 5" />
                  <ReferenceLine y={-3} stroke="#ffa500" strokeDasharray="5 5" />
                  
                  {(selectedEye === 'both' || selectedEye === 'od') && (
                    <Line
                      name="우안 (OD)"
                      type="monotone"
                      dataKey="od"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={<CustomDot />}
                      connectNulls
                      isAnimationActive={false}
                    />
                  )}
                  {(selectedEye === 'both' || selectedEye === 'os') && (
                    <Line
                      name="좌안 (OS)"
                      type="monotone"
                      dataKey="os"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={<CustomDot />}
                      connectNulls
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 범례 설명 */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span className="text-slate-600">고도근시 기준 (-6D)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-orange-500"></div>
                  <span className="text-slate-600">중등도근시 기준 (-3D)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">👓</span>
                  <span className="text-slate-600">안경처방</span>
                </div>
              </div>
              
              {/* 치료 방법 색상 범례 */}
              {visits.some(v => v.treatment_method) && (
                <div className="border-t pt-3">
                  <p className="text-xs text-slate-600 text-center mb-2">치료 방법</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from(new Set(visits.filter(v => v.treatment_method).map(v => v.treatment_method))).map(method => (
                      <div key={method} className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: TREATMENT_COLORS_SOLID[method!] }}
                        />
                        <span className="text-xs text-slate-600">
                          {TREATMENT_METHOD_LABELS[method as TreatmentMethod]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 안축장 그래프 */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">안축장 (Axial Length) 진행 그래프</CardTitle>
            {/* 진행 속도 위험도 가이드 */}
            <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
              <span className="text-slate-600">진행 속도:</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-600">정상</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-slate-600">주의</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">위험</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareChartData('axial')}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  {/* 치료 방법별 배경색 - CartesianGrid 앞에 렌더링 */}
                  {getTreatmentAreas().map((area) => (
                    <ReferenceArea
                      key={area.key}
                      x1={area.x1}
                      x2={area.x2}
                      y1={20}
                      y2={30}
                      fill={area.fill}
                      fillOpacity={1}
                      stroke={area.isCurrent && area.treatment ? TREATMENT_COLORS_SOLID[area.treatment] : undefined}
                      strokeWidth={area.isCurrent ? 2 : undefined}
                      strokeDasharray={area.isCurrent ? "5 5" : undefined}
                      ifOverflow="visible"
                      style={{
                        fill: area.fill,
                        fillOpacity: 1,
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact'
                      }}
                    />
                  ))}
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="age" 
                    label={{ value: '나이 (세)', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => Number(value).toFixed(1)}
                  />
                  <YAxis 
                    domain={[20, 30]}
                    tickFormatter={(value) => `${value}mm`}
                    label={{ 
                      value: '안축장 (mm)', 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => {
                      if (value === null || value === undefined) return '-';
                      return `${value}mm`;
                    }}
                    labelFormatter={(label) => `${Number(label).toFixed(1)}세`}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(props: any) => {
                      const { active, payload, label } = props;
                      if (!active || !payload || !payload.length) return null;
                      
                      const data = payload[0]?.payload;
                      const treatment = data?.treatment as TreatmentMethod | undefined;
                      
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-semibold">{`${Number(label).toFixed(1)}세`}</p>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {payload.map((entry: any, index: number) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.dataKey}: {entry.value}mm
                            </p>
                          ))}
                          {treatment && (
                            <p className="text-sm text-gray-600 mt-1">
                              치료: {TREATMENT_METHOD_LABELS[treatment]}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="line"
                  />
                  
                  {/* 위험 구간 표시 */}
                  <ReferenceLine y={26} stroke="#ff0000" strokeDasharray="5 5" />
                  <ReferenceLine y={24.5} stroke="#ffa500" strokeDasharray="5 5" />
                  
                  {(selectedEye === 'both' || selectedEye === 'od') && (
                    <Line
                      name="우안 (OD)"
                      type="monotone"
                      dataKey="od"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={<CustomDot />}
                      connectNulls
                      isAnimationActive={false}
                    />
                  )}
                  {(selectedEye === 'both' || selectedEye === 'os') && (
                    <Line
                      name="좌안 (OS)"
                      type="monotone"
                      dataKey="os"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={<CustomDot />}
                      connectNulls
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 범례 설명 */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span className="text-slate-600">고도근시 기준 (26mm)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-orange-500"></div>
                  <span className="text-slate-600">중등도근시 기준 (24.5mm)</span>
                </div>
              </div>
              
              {/* 치료 방법 색상 범례 */}
              {visits.some(v => v.treatment_method) && (
                <div className="border-t pt-3">
                  <p className="text-xs text-slate-600 text-center mb-2">치료 방법</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from(new Set(visits.filter(v => v.treatment_method).map(v => v.treatment_method))).map(method => (
                      <div key={method} className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: TREATMENT_COLORS_SOLID[method!] }}
                        />
                        <span className="text-xs text-slate-600">
                          {TREATMENT_METHOD_LABELS[method as TreatmentMethod]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검사 이력 */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">검사 이력</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 font-semibold text-sm text-slate-700">#</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-700">검사일</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-700">나이</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700" colSpan={2}>우안 (OD)</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700" colSpan={2}>좌안 (OS)</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700">우안<br/>안축장</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700">좌안<br/>안축장</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700">SE<br/>진행속도</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700">AL<br/>진행속도</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700">안경처방</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-700">치료방법</th>
                  <th className="text-center p-4 font-semibold text-sm text-slate-700">관리</th>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">SPH/CYL</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">S.E.</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">SPH/CYL</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">S.E.</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">AL</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">AL</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">(D/yr)</th>
                  <th className="text-center p-2 text-xs text-slate-600 font-medium">(mm/yr)</th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {[...visits].reverse().map((visit, index) => {
                  const actualIndex = visits.length - 1 - index;
                  const odSE = calculateSE(visit.od_sphere, visit.od_cylinder);
                  const osSE = calculateSE(visit.os_sphere, visit.os_cylinder);
                  const age = calculateAge(patient.birth_date, visit.visit_date);
                  const isEditing = editingVisitId === visit.id;
                  
                  // 진행 속도 계산 (이전 검사와 비교)
                  let progression: { se_od: number | undefined; se_os: number | undefined; al_od: number | undefined; al_os: number | undefined } = { se_od: undefined, se_os: undefined, al_od: undefined, al_os: undefined };
                  if (actualIndex > 0) {
                    progression = calculateProgressionBetweenVisits(visits[actualIndex - 1], visits[actualIndex]);
                  }
                  
                  return (
                    <tr key={visit.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 text-sm text-slate-600">{visits.length - index}</td>
                      <td className="p-4 font-medium">
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editingData.visit_date || visit.visit_date}
                            onChange={(e) => setEditingData({ ...editingData, visit_date: e.target.value })}
                            className="w-32"
                          />
                        ) : (
                          visit.visit_date
                        )}
                      </td>
                      <td className="p-4 text-sm">{age !== undefined && age !== null ? `${age.toFixed(1)}세` : '-'}</td>
                      <td className="p-4 text-center text-sm">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Input
                              type="text"
                              value={editingData.od_sphere || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                // 숫자, 마이너스, 소수점만 허용
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                  setEditingData({ 
                                    ...editingData, 
                                    od_sphere: value
                                  });
                                }
                              }}
                              className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                            />
                            <span>/</span>
                            <Input
                              type="text"
                              value={editingData.od_cylinder || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                  setEditingData({ 
                                    ...editingData, 
                                    od_cylinder: value
                                  });
                                }
                              }}
                              className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                            />
                          </div>
                        ) : (
                          visit.od_sphere !== undefined ? (
                            <span>
                              {visit.od_sphere.toFixed(2)}/
                              {visit.od_cylinder !== undefined ? visit.od_cylinder.toFixed(2) : '0.00'}
                            </span>
                          ) : '-'
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {odSE !== undefined ? `${odSE.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-4 text-center text-sm">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Input
                              type="text"
                              value={editingData.os_sphere || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                  setEditingData({ 
                                    ...editingData, 
                                    os_sphere: value
                                  });
                                }
                              }}
                              className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                            />
                            <span>/</span>
                            <Input
                              type="text"
                              value={editingData.os_cylinder || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                                  setEditingData({ 
                                    ...editingData, 
                                    os_cylinder: value
                                  });
                                }
                              }}
                              className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                            />
                          </div>
                        ) : (
                          visit.os_sphere !== undefined ? (
                            <span>
                              {visit.os_sphere.toFixed(2)}/
                              {visit.os_cylinder !== undefined ? visit.os_cylinder.toFixed(2) : '0.00'}
                            </span>
                          ) : '-'
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {osSE !== undefined ? `${osSE.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-4 text-center text-sm">
                        {isEditing ? (
                          <Input
                            type="text"
                            value={editingData.od_axial_length || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setEditingData({ 
                                  ...editingData, 
                                  od_axial_length: value
                                });
                              }
                            }}
                            className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="font-bold text-blue-600">
                            {visit.od_axial_length !== undefined ? visit.od_axial_length.toFixed(2) : '-'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center text-sm">
                        {isEditing ? (
                          <Input
                            type="text"
                            value={editingData.os_axial_length || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setEditingData({ 
                                  ...editingData, 
                                  os_axial_length: value
                                });
                              }
                            }}
                            className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="font-bold text-blue-600">
                            {visit.os_axial_length !== undefined ? visit.os_axial_length.toFixed(2) : '-'}
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center text-sm">
                        <div className="space-y-1">
                          {actualIndex === 0 ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <>
                              {progression.se_od !== undefined && (
                                <div className="text-xs">
                                  OD: <span className={`font-bold ${
                                    Math.abs(progression.se_od) >= settings.thresholds.se.red ? 'text-red-600' :
                                    Math.abs(progression.se_od) >= settings.thresholds.se.yellow ? 'text-yellow-600' : 
                                    'text-green-600'
                                  }`}>
                                    {progression.se_od.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {progression.se_os !== undefined && (
                                <div className="text-xs">
                                  OS: <span className={`font-bold ${
                                    Math.abs(progression.se_os) >= settings.thresholds.se.red ? 'text-red-600' :
                                    Math.abs(progression.se_os) >= settings.thresholds.se.yellow ? 'text-yellow-600' : 
                                    'text-green-600'
                                  }`}>
                                    {progression.se_os.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-center text-sm">
                        <div className="space-y-1">
                          {actualIndex === 0 ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <>
                              {progression.al_od !== undefined && (
                                <div className="text-xs">
                                  OD: <span className={`font-bold ${
                                    progression.al_od >= settings.thresholds.al.red ? 'text-red-600' :
                                    progression.al_od >= settings.thresholds.al.yellow ? 'text-yellow-600' : 
                                    'text-green-600'
                                  }`}>
                                    {progression.al_od.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {progression.al_os !== undefined && (
                                <div className="text-xs">
                                  OS: <span className={`font-bold ${
                                    progression.al_os >= settings.thresholds.al.red ? 'text-red-600' :
                                    progression.al_os >= settings.thresholds.al.yellow ? 'text-yellow-600' : 
                                    'text-green-600'
                                  }`}>
                                    {progression.al_os.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={editingData.new_prescription ?? visit.new_prescription ?? false}
                            onChange={(e) => setEditingData({ ...editingData, new_prescription: e.target.checked })}
                            className="h-5 w-5"
                          />
                        ) : (
                          visit.new_prescription ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <Select
                            value={editingData.treatment_method || visit.treatment_method || ''}
                            onValueChange={(value) => setEditingData({ ...editingData, treatment_method: value as TreatmentMethod })}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(TREATMENT_METHOD_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          visit.treatment_method && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-xs">
                              {TREATMENT_METHOD_LABELS[visit.treatment_method]}
                            </span>
                          )
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <div className="flex justify-center gap-1 print:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:bg-green-50"
                              onClick={() => handleSave(visit.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-1 print:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEdit(visit)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(visit.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}