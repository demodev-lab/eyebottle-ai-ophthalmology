'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { createPatient } from '@/lib/storage';
import { TREATMENT_METHOD_LABELS, TreatmentMethod } from '@/types/database';

interface NewPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewPatientModal({ open, onClose, onSuccess }: NewPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    chart_number: '',
    treatment_method: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = '이름은 필수입니다.';
    }
    if (!formData.birth_date) {
      newErrors.birth_date = '생년월일은 필수입니다.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createPatient({
        name: formData.name.trim(),
        birth_date: formData.birth_date,
        chart_number: formData.chart_number.trim() || undefined,
        treatment_method: formData.treatment_method as TreatmentMethod || undefined,
        notes: formData.notes.trim() || undefined,
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('환자 등록 실패:', error);
      alert('환자 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      birth_date: '',
      chart_number: '',
      treatment_method: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">신규 환자 등록</DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              새로운 환자 정보를 입력해주세요. <span className="text-red-500 font-medium">*</span> 표시는 필수 항목입니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-5 py-6">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-base font-medium text-slate-700">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                }}
                placeholder="홍길동"
                className="h-12 text-base"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="birth_date" className="text-base font-medium text-slate-700">
                생년월일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => {
                  setFormData({ ...formData, birth_date: e.target.value });
                  setErrors({ ...errors, birth_date: '' });
                }}
                className="h-12 text-base"
              />
              {errors.birth_date && (
                <p className="text-sm text-red-500 mt-1">{errors.birth_date}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="chart_number" className="text-base font-medium text-slate-700">차트번호</Label>
              <Input
                id="chart_number"
                value={formData.chart_number}
                onChange={(e) =>
                  setFormData({ ...formData, chart_number: e.target.value })
                }
                placeholder="선택사항"
                className="h-12 text-base"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="treatment_method" className="text-base font-medium text-slate-700">치료방법</Label>
              <Select
                value={formData.treatment_method}
                onValueChange={(value) =>
                  setFormData({ ...formData, treatment_method: value })
                }
              >
                <SelectTrigger id="treatment_method" className="h-12 text-base">
                  <SelectValue placeholder="치료방법을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TREATMENT_METHOD_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-base py-2">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="notes" className="text-base font-medium text-slate-700">메모</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="환자에 대한 추가 정보를 입력하세요"
                rows={3}
                className="text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-slate-200 hover:bg-slate-50 text-slate-700 h-12 px-6 text-base font-medium"
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 text-base font-medium"
            >
              {loading ? '등록 중...' : '환자 등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}