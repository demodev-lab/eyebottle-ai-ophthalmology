'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPatientById, createVisit, getVisits } from '@/lib/storage';
import { Patient, TREATMENT_METHOD_LABELS, TreatmentMethod } from '@/types/database';
import { ArrowLeft, Save } from 'lucide-react';
import { calculateSE } from '@/lib/calculations';

export default function NewVisitPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    visit_date: new Date().toISOString().split('T')[0],
    treatment_method: '',
    od_sphere: '',
    od_cylinder: '',
    od_axial_length: '',
    os_sphere: '',
    os_cylinder: '',
    os_axial_length: '',
    new_prescription: false,
    notes: '',
  });

  // 자동 계산된 SE 값
  const odSE = calculateSE(
    formData.od_sphere ? parseFloat(formData.od_sphere) : undefined,
    formData.od_cylinder ? parseFloat(formData.od_cylinder) : undefined
  );
  const osSE = calculateSE(
    formData.os_sphere ? parseFloat(formData.os_sphere) : undefined,
    formData.os_cylinder ? parseFloat(formData.os_cylinder) : undefined
  );

  const loadPatient = useCallback(async () => {
    try {
      const patientData = getPatientById(patientId);
      if (!patientData) {
        alert('환자를 찾을 수 없습니다.');
        router.push('/myocare/patients');
        return;
      }
      setPatient(patientData);
      
      // 치료방법 기본값 설정: 최근 방문 > 환자 기본 치료방법
      const visits = getVisits(patientId);
      let defaultTreatmentMethod = '';
      
      if (visits.length > 0 && visits[0].treatment_method) {
        // 최근 방문의 치료방법 사용
        defaultTreatmentMethod = visits[0].treatment_method;
      } else if (patientData.treatment_method) {
        // 환자의 기본 치료방법 사용
        defaultTreatmentMethod = patientData.treatment_method;
      }
      
      if (defaultTreatmentMethod) {
        setFormData(prev => ({ ...prev, treatment_method: defaultTreatmentMethod }));
      }
    } catch (error) {
      console.error('환자 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [patientId, router]);

  useEffect(() => {
    loadPatient();
  }, [patientId, loadPatient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.visit_date) {
      alert('검사일을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      await createVisit({
        patient_id: patientId,
        visit_date: formData.visit_date,
        treatment_method: formData.treatment_method as TreatmentMethod,
        od_sphere: formData.od_sphere ? parseFloat(formData.od_sphere) : undefined,
        od_cylinder: formData.od_cylinder ? parseFloat(formData.od_cylinder) : undefined,
        od_axial_length: formData.od_axial_length ? parseFloat(formData.od_axial_length) : undefined,
        os_sphere: formData.os_sphere ? parseFloat(formData.os_sphere) : undefined,
        os_cylinder: formData.os_cylinder ? parseFloat(formData.os_cylinder) : undefined,
        os_axial_length: formData.os_axial_length ? parseFloat(formData.os_axial_length) : undefined,
        new_prescription: formData.new_prescription,
        notes: formData.notes,
      });
      
      alert('검사 결과가 저장되었습니다.');
      router.push('/myocare/patients');
    } catch (error) {
      console.error('검사 결과 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !patient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-slate-800">검사결과 입력</h1>
            <p className="text-lg text-slate-600 mt-1">{patient.name} 환자의 새로운 검사 결과를 입력하세요</p>
          </div>
        </div>
      </div>

      {/* 환자 정보 */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg">환자 정보</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600">이름</p>
              <p className="font-semibold">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">생년월일</p>
              <p className="font-semibold">{patient.birth_date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">차트번호</p>
              <p className="font-semibold">{patient.chart_number || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 검사 입력 폼 */}
      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">검사 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 검사일과 치료방법 */}
            <div className="flex items-center gap-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <Label htmlFor="visit_date" className="text-base font-medium whitespace-nowrap">검사일</Label>
                <Input
                  id="visit_date"
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                  className="w-40"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="treatment_method" className="text-base font-medium whitespace-nowrap">치료방법</Label>
                <Select
                  value={formData.treatment_method}
                  onValueChange={(value) => setFormData({ ...formData, treatment_method: value })}
                >
                  <SelectTrigger id="treatment_method" className="w-48">
                    <SelectValue placeholder="치료방법 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TREATMENT_METHOD_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  id="new_prescription"
                  checked={formData.new_prescription}
                  onChange={(e) => setFormData({ ...formData, new_prescription: e.target.checked })}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300"
                />
                <Label htmlFor="new_prescription" className="cursor-pointer text-base font-medium">
                  안경 처방
                </Label>
              </div>
            </div>

            {/* 검사 결과 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left p-3 font-semibold text-base">구분</th>
                    <th className="text-center p-3 font-semibold text-base">SPH</th>
                    <th className="text-center p-3 font-semibold text-base">CYL</th>
                    <th className="text-center p-3 font-semibold text-base bg-blue-50">SE</th>
                    <th className="text-center p-3 font-semibold text-base">축 길이</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 우안 */}
                  <tr className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">우안</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="-2.50"
                        value={formData.od_sphere}
                        onChange={(e) => {
                          const value = e.target.value;
                          // 숫자, 마이너스, 소수점만 허용
                          if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                            setFormData({ ...formData, od_sphere: value });
                          }
                        }}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="-1.00"
                        value={formData.od_cylinder}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                            setFormData({ ...formData, od_cylinder: value });
                          }
                        }}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                    <td className="p-3 bg-blue-50">
                      <div className="px-3 py-2 bg-white rounded-md font-semibold text-center text-blue-600">
                        {odSE !== undefined ? odSE.toFixed(2) : '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="24.50"
                        value={formData.od_axial_length}
                        onChange={(e) => {
                          const value = e.target.value;
                          // 양수, 소수점만 허용 (안축장은 음수가 없음)
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setFormData({ ...formData, od_axial_length: value });
                          }
                        }}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                  </tr>
                  
                  {/* 좌안 */}
                  <tr className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">좌안</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="-2.50"
                        value={formData.os_sphere}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                            setFormData({ ...formData, os_sphere: value });
                          }
                        }}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="-1.00"
                        value={formData.os_cylinder}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                            setFormData({ ...formData, os_cylinder: value });
                          }
                        }}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                    <td className="p-3 bg-orange-50">
                      <div className="px-3 py-2 bg-white rounded-md font-semibold text-center text-orange-600">
                        {osSE !== undefined ? osSE.toFixed(2) : '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="24.50"
                        value={formData.os_axial_length}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setFormData({ ...formData, os_axial_length: value });
                          }
                        }}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 메모 */}
            <div>
              <Label htmlFor="notes" className="text-base font-medium">메모</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="추가 메모사항을 입력하세요"
                rows={3}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/myocare/patients')}
            className="px-6"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? '저장 중...' : '검사 결과 저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}