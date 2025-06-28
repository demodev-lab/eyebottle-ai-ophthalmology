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
import { Users, AlertTriangle, Activity, UserPlus, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
        if (visits.length > 0) {
          const progression = calculateProgressionRate(visits, settings);
          
          if (progression.riskLevel === RiskLevel.RED) {
            highRisk++;
          } else if (progression.riskLevel === RiskLevel.YELLOW) {
            mediumRisk++;
          }

          // 활성 환자 확인
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">대시보드</h1>
          <p className="text-lg text-slate-600 mt-1">근시케어 현황을 한눈에 확인하세요</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">마지막 업데이트</p>
          <p className="text-lg font-medium text-slate-700">{new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
      
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">전체 환자</CardTitle>
            <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="text-4xl font-bold text-slate-900">{stats.totalPatients}</div>
            <p className="text-base text-slate-600 mt-2">등록된 환자 수</p>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">지난달 대비</span>
                <span className="font-medium text-blue-600">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">고위험 환자</CardTitle>
            <div className="p-3 bg-red-500 rounded-xl shadow-sm animate-pulse">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="text-4xl font-bold text-red-600">{stats.highRiskPatients}</div>
            <p className="text-base text-slate-600 mt-2">즉시 관리 필요</p>
            <div className="mt-4 pt-4 border-t border-red-100">
              <p className="text-sm text-red-700 font-medium">※ 연간 진행속도 &gt; 1.5D/yr</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">중위험 환자</CardTitle>
            <div className="p-3 bg-yellow-500 rounded-xl shadow-sm">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="text-4xl font-bold text-yellow-600">{stats.mediumRiskPatients}</div>
            <p className="text-base text-slate-600 mt-2">주의 관찰 필요</p>
            <div className="mt-4 pt-4 border-t border-yellow-100">
              <p className="text-sm text-yellow-700 font-medium">※ 연간 진행속도 &gt; 0.75D/yr</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 중단 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">활성 환자</CardTitle>
                <p className="text-sm text-slate-600 mt-1">최근 6개월 이내 방문</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <span className="text-5xl font-bold text-slate-900">{stats.activePatients}</span>
              <span className="text-xl text-slate-500">명</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">전체 대비 비율</span>
                <span className="text-sm font-medium text-slate-800">
                  {stats.totalPatients > 0 ? 
                    `${Math.round((stats.activePatients / stats.totalPatients) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: stats.totalPatients > 0 ? 
                      `${Math.round((stats.activePatients / stats.totalPatients) * 100)}%` : '0%' 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">신규 등록</CardTitle>
                <p className="text-sm text-slate-600 mt-1">최근 30일 내</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <UserPlus className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <span className="text-5xl font-bold text-slate-900">{stats.recentPatients}</span>
              <span className="text-xl text-slate-500">명</span>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">지난달 대비 +23%</span>
            </div>
            <div className="mt-3 flex items-center text-sm text-slate-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>일평균 {Math.round(stats.recentPatients / 30 * 10) / 10}명 등록</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 치료방법 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">치료방법 분포</CardTitle>
            <p className="text-base text-slate-600">현재 진행 중인 치료방법별 환자 현황</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
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
                    labelLine={false}
                    label={(entry) => `${entry.value}명`}
                    outerRadius={80}
                    fill="#8884d8"
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
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">치료방법별 상세</CardTitle>
            <p className="text-base text-slate-600">각 치료방법의 환자 수</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(TREATMENT_METHOD_LABELS).map(([key, label]) => {
                const count = stats.treatmentDistribution[key as TreatmentMethod] || 0;
                const total = Object.values(stats.treatmentDistribution).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? (count / total * 100).toFixed(1) : '0';
                const colors = {
                  'atropine_0.042': 'bg-blue-500',
                  'atropine_0.05': 'bg-blue-600',
                  'atropine_0.063': 'bg-indigo-500',
                  'atropine_0.125': 'bg-indigo-600',
                  'dream_lens': 'bg-purple-500',
                  'myosight': 'bg-orange-500',
                  'dims_glasses': 'bg-green-500',
                  'combined': 'bg-teal-500',
                };
                const bgColor = colors[key as TreatmentMethod] || 'bg-gray-500';
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${bgColor} rounded-full`} />
                      <span className="text-base font-medium text-slate-700">{label}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-slate-900">{count}명</span>
                      <span className="text-sm text-slate-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}