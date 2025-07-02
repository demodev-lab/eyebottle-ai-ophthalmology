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
import { Users, AlertTriangle, Activity, CheckCircle, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* 헤더 섹션 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MyoCare Dashboard</h1>
                <p className="text-slate-600 font-medium">근시 진행 관리 임상 현황</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="flex items-center space-x-2 text-slate-700">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">{new Date().toLocaleDateString('ko-KR')}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">실시간 업데이트</p>
            </div>
            <div className="hidden lg:flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs font-medium text-slate-600">시스템 정상</span>
            </div>
          </div>
        </div>
        
        {/* 핵심 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* 전체 환자 카드 */}
          <Card className="relative group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{stats.totalPatients}</div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">전체 환자</h3>
                <p className="text-xs text-slate-500">등록된 총 환자 수</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            </CardContent>
          </Card>

          {/* 고위험 환자 카드 */}
          <Card className="relative group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{stats.highRiskPatients}</div>
                  {stats.totalPatients > 0 && (
                    <div className="text-xs text-red-500 font-medium">
                      {Math.round((stats.highRiskPatients / stats.totalPatients) * 100)}%
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">고위험군</h3>
                <p className="text-xs text-slate-500">&gt; 0.6mm/yr 진행</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            </CardContent>
          </Card>

          {/* 중위험 환자 카드 */}
          <Card className="relative group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">{stats.mediumRiskPatients}</div>
                  {stats.totalPatients > 0 && (
                    <div className="text-xs text-amber-500 font-medium">
                      {Math.round((stats.mediumRiskPatients / stats.totalPatients) * 100)}%
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">중위험군</h3>
                <p className="text-xs text-slate-500">0.3 - 0.6mm/yr</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            </CardContent>
          </Card>

          {/* 정상 환자 카드 */}
          <Card className="relative group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{normalPatients}</div>
                  {stats.totalPatients > 0 && (
                    <div className="text-xs text-emerald-500 font-medium">
                      {Math.round((normalPatients / stats.totalPatients) * 100)}%
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">정상군</h3>
                <p className="text-xs text-slate-500">≤ 0.3mm/yr</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
            </CardContent>
          </Card>

          {/* 활성 환자 카드 */}
          <Card className="relative group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-violet-100 rounded-xl group-hover:bg-violet-200 transition-colors">
                  <Activity className="h-6 w-6 text-violet-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-violet-600">{stats.activePatients}</div>
                  {stats.totalPatients > 0 && (
                    <div className="text-xs text-violet-500 font-medium">
                      {Math.round((stats.activePatients / stats.totalPatients) * 100)}%
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">활성 환자</h3>
                <p className="text-xs text-slate-500">6개월 내 방문</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
            </CardContent>
          </Card>
        </div>

        {/* 분석 차트 섹션 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 치료방법 분포 차트 */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900">치료방법 분포</CardTitle>
                  <p className="text-sm text-slate-600">현재 적용 중인 치료법별 환자 현황</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72">
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
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      paddingAngle={3}
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
                    <Tooltip 
                      formatter={(value) => [`${value}명`, '환자 수']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        fontSize: '13px'
                      }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: '12px',
                        paddingLeft: '24px',
                        fontWeight: '500'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* 치료방법 요약 통계 */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {Object.entries(stats.treatmentDistribution)
                  .filter(([, count]) => count > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 2)
                  .map(([key, count]) => {
                    const colors = {
                      'atropine_0.042': { bg: 'from-blue-50 to-blue-100', border: 'blue-100', text: 'blue-700', icon: 'blue-200', iconText: 'blue-700' },
                      'atropine_0.05': { bg: 'from-indigo-50 to-indigo-100', border: 'indigo-100', text: 'indigo-700', icon: 'indigo-200', iconText: 'indigo-700' },
                      'atropine_0.063': { bg: 'from-violet-50 to-violet-100', border: 'violet-100', text: 'violet-700', icon: 'violet-200', iconText: 'violet-700' },
                      'atropine_0.125': { bg: 'from-purple-50 to-purple-100', border: 'purple-100', text: 'purple-700', icon: 'purple-200', iconText: 'purple-700' },
                      'dream_lens': { bg: 'from-fuchsia-50 to-fuchsia-100', border: 'fuchsia-100', text: 'fuchsia-700', icon: 'fuchsia-200', iconText: 'fuchsia-700' },
                      'myosight': { bg: 'from-orange-50 to-orange-100', border: 'orange-100', text: 'orange-700', icon: 'orange-200', iconText: 'orange-700' },
                      'dims_glasses': { bg: 'from-emerald-50 to-emerald-100', border: 'emerald-100', text: 'emerald-700', icon: 'emerald-200', iconText: 'emerald-700' },
                      'combined': { bg: 'from-teal-50 to-teal-100', border: 'teal-100', text: 'teal-700', icon: 'teal-200', iconText: 'teal-700' },
                    };
                    const colorSet = colors[key as keyof typeof colors] || { bg: 'from-gray-50 to-gray-100', border: 'gray-100', text: 'gray-700', icon: 'gray-200', iconText: 'gray-700' };
                    
                    return (
                      <div key={key} className={`bg-gradient-to-br ${colorSet.bg} p-4 rounded-xl border border-${colorSet.border}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs font-medium text-${colorSet.text} mb-1`}>
                              {TREATMENT_METHOD_LABELS[key as TreatmentMethod]}
                            </p>
                            <p className={`text-xl font-bold text-${colorSet.text}`}>
                              {stats.totalPatients > 0 ? 
                                `${Math.round((count / stats.totalPatients) * 100)}%` : '0%'}
                            </p>
                          </div>
                          <div className={`w-8 h-8 bg-${colorSet.icon} rounded-lg flex items-center justify-center`}>
                            <span className={`text-xs font-bold text-${colorSet.iconText}`}>{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* 위험도 분포 차트 */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900">위험도 분포</CardTitle>
                  <p className="text-sm text-slate-600">근시 진행 위험도별 환자 분류</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      paddingAngle={5}
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}명`, '환자 수']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        fontSize: '13px'
                      }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: '12px',
                        paddingLeft: '24px',
                        fontWeight: '500'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* 위험도 요약 통계 */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">고위험 비율</p>
                      <p className="text-xl font-bold text-red-800">
                        {stats.totalPatients > 0 ? 
                          `${Math.round((stats.highRiskPatients / stats.totalPatients) * 100)}%` : '0%'}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-amber-700 mb-1">중위험 비율</p>
                      <p className="text-xl font-bold text-amber-800">
                        {stats.totalPatients > 0 ? 
                          `${Math.round((stats.mediumRiskPatients / stats.totalPatients) * 100)}%` : '0%'}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-amber-700" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}