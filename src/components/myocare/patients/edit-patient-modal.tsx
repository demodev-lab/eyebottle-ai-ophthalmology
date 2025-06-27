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
import { updatePatient, deletePatient } from '@/lib/storage';
import { Patient } from '@/types/database';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EditPatientModalProps {
  patient: Patient;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
}

export function EditPatientModal({
  patient,
  open,
  onClose,
  onSuccess,
  onDelete,
}: EditPatientModalProps) {
  const [formData, setFormData] = useState({
    name: patient.name,
    birth_date: patient.birth_date,
    chart_number: patient.chart_number || '',
    notes: patient.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birth_date) {
      alert('이름과 생년월일은 필수 항목입니다.');
      return;
    }

    setLoading(true);
    try {
      await updatePatient(patient.id, {
        name: formData.name,
        birth_date: formData.birth_date,
        chart_number: formData.chart_number || undefined,
        notes: formData.notes || undefined,
      });
      
      alert('환자 정보가 수정되었습니다.');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('환자 정보 수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePatient(patient.id);
      alert('환자 정보가 삭제되었습니다.');
      onDelete?.();
      onClose();
    } catch (error) {
      console.error('환자 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">환자 정보 수정</DialogTitle>
            <DialogDescription className="text-base">
              환자의 기본 정보를 수정하거나 삭제할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_date" className="text-base font-medium">
                  생년월일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  className="h-12 text-base"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chart_number" className="text-base font-medium">
                  차트번호
                </Label>
                <Input
                  id="chart_number"
                  value={formData.chart_number}
                  onChange={(e) => setFormData({ ...formData, chart_number: e.target.value })}
                  placeholder="선택사항"
                  className="h-12 text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-base font-medium">
                  메모
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="환자에 대한 추가 메모사항"
                  rows={3}
                  className="text-base"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteAlert(true)}
                disabled={loading}
                className="mr-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? '저장 중...' : '수정 완료'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              환자 삭제 확인
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              <div className="space-y-2">
                <p className="font-semibold">{patient.name} 환자를 정말 삭제하시겠습니까?</p>
                <p className="text-red-600">이 작업은 되돌릴 수 없으며, 모든 검사 기록도 함께 삭제됩니다.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}