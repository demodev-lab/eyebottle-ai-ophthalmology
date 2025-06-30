'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getPatients, 
  getVisits, 
  getCurrentUser, 
  createDemoUser,
  getUserSettings 
} from '@/lib/storage';
import { 
  calculateProgressionRate, 
  isActivePatient, 
  isRecentPatient
} from '@/lib/calculations';
import { 
  DashboardStats, 
  RiskLevel,
  TREATMENT_METHOD_LABELS,
  TreatmentMethod
} from '@/types/database';
import { Users, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    highRiskPatients: 0,
    mediumRiskPatients: 0,
    activePatients: 0,
    recentPatients: 0,
    treatmentDistribution: {} as Record<TreatmentMethod, number>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 현재 사용자 확인, 없으면 데모 사용자 생성
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = createDemoUser();
      }

      const patients = getPatients();
      const settings = getUserSettings();
      
      // 통계 계산
      let highRisk = 0;
      let mediumRisk = 0;
      let active = 0;
      let recent = 0;
      const treatmentCount: Partial<Record<TreatmentMethod, number>> = {};

      patients.forEach((patient) => {
        // 최근 방문 기록으로 위험도 계산
        const visits = getVisits(patient.id);
        if (visits.length >= 2) {
          // 최근 2개 방문만 사용하여 진행률 계산 (오래된 순으로)
          const recentVisits = visits.slice(0, 2).reverse();
          const progression = calculateProgressionRate(recentVisits, settings);
          
          if (progression.riskLevel === RiskLevel.RED) {
            highRisk++;
          } else if (progression.riskLevel === RiskLevel.YELLOW) {
            mediumRisk++;
          }

        }
        
        // 활성 환자 확인 (방문 기록이 있는 경우)
        if (visits.length > 0) {
          if (isActivePatient(visits[0].visit_date)) {
            active++;
          }

          // 치료방법 분포
          const latestVisit = visits[0];
          if (latestVisit.treatment_method) {
            treatmentCount[latestVisit.treatment_method] = 
              (treatmentCount[latestVisit.treatment_method] || 0) + 1;
          }
        }

        // 최근 등록 환자
        if (isRecentPatient(patient.created_at)) {
          recent++;
        }
      });

      setStats({
        totalPatients: patients.length,
        highRiskPatients: highRisk,
        mediumRiskPatients: mediumRisk,
        activePatients: active,
        recentPatients: recent,
        treatmentDistribution: treatmentCount as Record<TreatmentMethod, number>,
      });
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const normalPatients = stats.totalPatients - stats.highRiskPatients - stats.mediumRiskPatients;

  // 위험도 분포 데이터
  const riskDistributionData = [
    { name: '고위험', value: stats.highRiskPatients, color: '#ef4444' },
    { name: '중위험', value: stats.mediumRiskPatients, color: '#eab308' },
    { name: '정상', value: normalPatients, color: '#22c55e' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">MyoCare 대시보드</h1>
        <p className="text-sm text-slate-500">{new Date().toLocaleDateString('ko-KR')} 기준</p>
      </div>
      
      {/* 상단 통계 카드 - 5개를 한 줄에 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-0 shadow-sm bg-blue-50 hover:shadow-md transition-shadow">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">전체</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-slate-900">{stats.totalPatients}</div>
            <p className="text-xs text-slate-500">환자</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-red-50 hover:shadow-md transition-shadow">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">고위험</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-red-600">{stats.highRiskPatients}</div>
            <p className="text-xs text-slate-500">&gt;0.6mm/yr</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-yellow-50 hover:shadow-md transition-shadow">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">중위험</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-yellow-600">{stats.mediumRiskPatients}</div>
            <p className="text-xs text-slate-500">&gt;0.3mm/yr</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-green-50 hover:shadow-md transition-shadow">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">정상</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-green-600">{normalPatients}</div>
            <p className="text-xs text-slate-500">≤0.3mm/yr</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-purple-50 hover:shadow-md transition-shadow">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">활성</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-purple-600">{stats.activePatients}</div>
            <p className="text-xs text-slate-500">6개월내</p>
          </CardContent>
        </Card>
      </div>

      {/* 하단 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 치료방법 분포 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold text-slate-800">치료방법 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(stats.treatmentDistribution)
                      .filter(([, count]) => count > 0)
                      .map(([key, count]) => ({
                        name: TREATMENT_METHOD_LABELS[key as TreatmentMethod],
                        value: count,
                        color: {
                          'atropine_0.042': '#3b82f6',
                          'atropine_0.05': '#2563eb',
                          'atropine_0.063': '#6366f1',
                          'atropine_0.125': '#4f46e5',
                          'dream_lens': '#a855f7',
                          'myosight': '#f97316',
                          'dims_glasses': '#10b981',
                          'combined': '#14b8a6',
                        }[key] || '#6b7280'
                      }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {Object.entries(stats.treatmentDistribution)
                      .filter(([, count]) => count > 0)
                      .map(([key], index) => {
                        const colors = {
                          'atropine_0.042': '#3b82f6',
                          'atropine_0.05': '#2563eb',
                          'atropine_0.063': '#6366f1',
                          'atropine_0.125': '#4f46e5',
                          'dream_lens': '#a855f7',
                          'myosight': '#f97316',
                          'dims_glasses': '#10b981',
                          'combined': '#14b8a6',
                        };
                        return <Cell key={`cell-${index}`} fill={colors[key as keyof typeof colors] || '#6b7280'} />
                      })}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}명`} />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingLeft: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 위험도 분포 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold text-slate-800">위험도 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}명`} />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingLeft: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">고위험 비율</span>
                <span className="font-medium text-red-600">
                  {stats.totalPatients > 0 ? 
                    `${Math.round((stats.highRiskPatients / stats.totalPatients) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">중위험 비율</span>
                <span className="font-medium text-yellow-600">
                  {stats.totalPatients > 0 ? 
                    `${Math.round((stats.mediumRiskPatients / stats.totalPatients) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}