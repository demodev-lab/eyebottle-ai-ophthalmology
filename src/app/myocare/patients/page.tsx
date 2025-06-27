'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  getPatients, 
  getVisits,
  getCurrentUser,
  createDemoUser,
  getUserSettings 
} from '@/lib/storage';
import { 
  calculateProgressionRate,
  calculateAge,
  daysSinceLastVisit,
  getRiskColor,
  getRiskText
} from '@/lib/calculations';
import { 
  Patient, 
  MyoCareVisit,
  TREATMENT_METHOD_LABELS,
  RiskLevel
} from '@/types/database';
import { Search, UserPlus, Eye, Edit, Trash2, Users } from 'lucide-react';
import { NewPatientModal } from '@/components/myocare/patients/new-patient-modal';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      // 현재 사용자 확인, 없으면 데모 사용자 생성
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = createDemoUser();
      }

      const patientList = getPatients();
      setPatients(patientList);
      setFilteredPatients(patientList);
    } catch (error) {
      console.error('환자 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(
      patient =>
        patient.name.toLowerCase().includes(term) ||
        patient.chart_number?.toLowerCase().includes(term)
    );
    setFilteredPatients(filtered);
  };

  const getPatientRiskInfo = (patient: Patient) => {
    const visits = getVisits(patient.id);
    if (visits.length < 2) {
      return { riskLevel: RiskLevel.NORMAL, lastVisit: visits[0] };
    }

    const settings = getUserSettings();
    const progression = calculateProgressionRate(visits, settings);
    return { riskLevel: progression.riskLevel, lastVisit: visits[0] };
  };

  const sortPatientsByLastVisit = (patients: Patient[]) => {
    return [...patients].sort((a, b) => {
      const visitsA = getVisits(a.id);
      const visitsB = getVisits(b.id);
      
      if (visitsA.length === 0 && visitsB.length === 0) return 0;
      if (visitsA.length === 0) return 1;
      if (visitsB.length === 0) return -1;
      
      const daysA = daysSinceLastVisit(visitsA[0].visit_date);
      const daysB = daysSinceLastVisit(visitsB[0].visit_date);
      
      return daysB - daysA; // 오래된 방문이 먼저 오도록
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const sortedPatients = sortPatientsByLastVisit(filteredPatients);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">환자 관리</h1>
          <p className="text-lg text-slate-600 mt-1">등록된 환자를 검색하고 관리하세요</p>
        </div>
        <Button 
          onClick={() => setShowNewPatientModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md h-12 px-6 text-base font-medium"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          신규환자 등록
        </Button>
      </div>

      {/* 검색바 */}
      <Card className="border-0 shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">환자 검색</h2>
            <p className="text-sm text-slate-600">총 {filteredPatients.length}명의 환자가 검색되었습니다</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>정렬:</span>
            <span className="font-medium">마지막 방문 오래된 순</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
          <Input
            type="text"
            placeholder="환자 이름 또는 차트번호를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </Card>

      {/* 환자 목록 테이블 */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="font-semibold text-base text-slate-700 py-4">환자 정보</TableHead>
                <TableHead className="font-semibold text-base text-slate-700 py-4">치료 상태</TableHead>
                <TableHead className="font-semibold text-base text-slate-700 py-4">마지막 방문</TableHead>
                <TableHead className="font-semibold text-base text-slate-700 py-4">위험도</TableHead>
                <TableHead className="text-right font-semibold text-base text-slate-700 py-4">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-10 w-10 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-700 mb-1">
                        {searchTerm ? '검색 결과가 없습니다' : '등록된 환자가 없습니다'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {searchTerm ? '다른 검색어를 사용해보세요' : '신규환자 등록 버튼을 눌러 환자를 추가하세요'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedPatients.map((patient) => {
                  const { riskLevel, lastVisit } = getPatientRiskInfo(patient);
                  const age = calculateAge(patient.birth_date);
                  const daysSince = lastVisit ? daysSinceLastVisit(lastVisit.visit_date) : null;
                  
                  return (
                    <TableRow key={patient.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                      <TableCell className="py-6">
                        <div>
                          <p className="font-semibold text-lg text-slate-800">{patient.name}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-slate-600">{patient.birth_date} ({age}세)</span>
                            {patient.chart_number && (
                              <>
                                <span className="text-slate-300">|</span>
                                <span className="text-sm text-slate-600">차트: {patient.chart_number}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        {lastVisit?.treatment_method ? (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm">
                            {TREATMENT_METHOD_LABELS[lastVisit.treatment_method]}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-base">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        {lastVisit ? (
                          <div>
                            <div className="text-base font-medium text-slate-700">{lastVisit.visit_date}</div>
                            <div className="text-sm text-slate-500 mt-0.5">
                              {daysSince < 7 ? (
                                <span className="text-green-600 font-medium">{daysSince}일 전</span>
                              ) : daysSince < 30 ? (
                                <span className="text-yellow-600 font-medium">{daysSince}일 전</span>
                              ) : (
                                <span className="text-red-600 font-medium">{daysSince}일 전</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-base">방문 기록 없음</span>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        <Badge
                          className="font-semibold px-4 py-1.5 text-sm"
                          style={{
                            backgroundColor: getRiskColor(riskLevel) + '20',
                            color: getRiskColor(riskLevel),
                            borderColor: getRiskColor(riskLevel),
                          }}
                          variant="outline"
                        >
                          {getRiskText(riskLevel)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 h-10 px-4 font-medium"
                            onClick={() => router.push(`/myocare/patients/${patient.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            상세보기
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 h-10 w-10"
                            onClick={() => router.push(`/myocare/patients/${patient.id}/edit`)}
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* 신규 환자 등록 모달 */}
      {showNewPatientModal && (
        <NewPatientModal
          open={showNewPatientModal}
          onClose={() => setShowNewPatientModal(false)}
          onSuccess={() => {
            loadPatients();
            setShowNewPatientModal(false);
          }}
        />
      )}
    </div>
  );
}