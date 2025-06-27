'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  getUserSettings, 
  updateUserSettings,
  getCurrentUser,
  createDemoUser
} from '@/lib/storage';
import { 
  UserSettings,
  TREATMENT_METHOD_LABELS,
  TreatmentMethod,
  DEFAULT_SETTINGS
} from '@/types/database';
import { Save, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // 현재 사용자 확인, 없으면 데모 사용자 생성
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = createDemoUser();
      }

      const userSettings = getUserSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { id, user_id, created_at, ...updates } = settings;
      await updateUserSettings(updates);
      alert('설정이 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('모든 설정을 초기값으로 되돌리시겠습니까?')) {
      setSettings({
        ...settings!,
        ...DEFAULT_SETTINGS,
      });
    }
  };

  const updateThreshold = (
    type: 'se' | 'al',
    level: 'yellow' | 'red',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setSettings({
      ...settings!,
      thresholds: {
        ...settings!.thresholds,
        [type]: {
          ...settings!.thresholds[type],
          [level]: numValue,
        },
      },
    });
  };

  const updateTreatmentColor = (method: TreatmentMethod, color: string) => {
    setSettings({
      ...settings!,
      treatmentColors: {
        ...settings!.treatmentColors,
        [method]: color,
      },
    });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">설정</h1>
          <p className="text-lg text-slate-600 mt-1">근시케어 차트의 각종 설정을 관리하세요</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-slate-200 hover:bg-slate-50 text-slate-700 h-12 px-5 text-base font-medium"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            초기화
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md h-12 px-6 text-base font-medium"
          >
            <Save className="mr-2 h-5 w-5" />
            {saving ? '저장 중...' : '설정 저장'}
          </Button>
        </div>
      </div>

      {/* 진행 임계값 설정 */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">진행 임계값 설정</CardTitle>
          <CardDescription className="text-base text-slate-600 mt-2">
            연간 진행 속도에 따른 위험도 판단 기준을 설정합니다. 
            임계값을 초과하면 해당 위험도로 분류됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              구면 상당치 (Spherical Equivalent) 임계값
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="se-yellow" className="text-base font-medium text-slate-700 flex items-center mb-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  중위험 경고선 (D/yr)
                </Label>
                <Input
                  id="se-yellow"
                  type="number"
                  step="0.01"
                  value={settings.thresholds.se.yellow}
                  onChange={(e) => updateThreshold('se', 'yellow', e.target.value)}
                  className="h-12 text-lg font-medium border-2 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                />
                <p className="text-sm text-slate-600 mt-2">기본값: 0.75 D/yr</p>
              </div>
              <div>
                <Label htmlFor="se-red" className="text-base font-medium text-slate-700 flex items-center mb-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  고위험 경고선 (D/yr)
                </Label>
                <Input
                  id="se-red"
                  type="number"
                  step="0.01"
                  value={settings.thresholds.se.red}
                  onChange={(e) => updateThreshold('se', 'red', e.target.value)}
                  className="h-12 text-lg font-medium border-2 border-red-200 focus:border-red-500 focus:ring-red-500"
                />
                <p className="text-sm text-slate-600 mt-2">기본값: 1.50 D/yr</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              안축장 (Axial Length) 임계값
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="al-yellow" className="text-base font-medium text-slate-700 flex items-center mb-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  중위험 경고선 (mm/yr)
                </Label>
                <Input
                  id="al-yellow"
                  type="number"
                  step="0.01"
                  value={settings.thresholds.al.yellow}
                  onChange={(e) => updateThreshold('al', 'yellow', e.target.value)}
                  className="h-12 text-lg font-medium border-2 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                />
                <p className="text-sm text-slate-600 mt-2">기본값: 0.30 mm/yr</p>
              </div>
              <div>
                <Label htmlFor="al-red" className="text-base font-medium text-slate-700 flex items-center mb-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  고위험 경고선 (mm/yr)
                </Label>
                <Input
                  id="al-red"
                  type="number"
                  step="0.01"
                  value={settings.thresholds.al.red}
                  onChange={(e) => updateThreshold('al', 'red', e.target.value)}
                  className="h-12 text-lg font-medium border-2 border-red-200 focus:border-red-500 focus:ring-red-500"
                />
                <p className="text-sm text-slate-600 mt-2">기본값: 0.60 mm/yr</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 치료 색상표 */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">치료방법 색상 설정</CardTitle>
          <CardDescription className="text-base text-slate-600 mt-2">
            차트와 그래프에서 각 치료방법을 구분하기 위한 색상을 지정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(TREATMENT_METHOD_LABELS).map(([key, label]) => (
              <div key={key} className="bg-slate-50 p-5 rounded-xl hover:bg-slate-100 transition-colors">
                <Label htmlFor={`color-${key}`} className="text-base font-semibold text-slate-800 block mb-3">
                  {label}
                </Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Input
                      id={`color-${key}`}
                      type="color"
                      value={settings.treatmentColors[key as TreatmentMethod]}
                      onChange={(e) =>
                        updateTreatmentColor(key as TreatmentMethod, e.target.value)
                      }
                      className="w-20 h-12 p-1 cursor-pointer border-2 border-slate-300 rounded-lg"
                    />
                  </div>
                  <div 
                    className="flex-1 h-12 rounded-lg border-2 border-slate-200 flex items-center justify-center font-medium text-base"
                    style={{ 
                      backgroundColor: settings.treatmentColors[key as TreatmentMethod] + '20', 
                      color: settings.treatmentColors[key as TreatmentMethod] 
                    }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 팁:</span> 치료방법별로 구분이 쉽도록 서로 다른 색상 계열을 사용하는 것이 좋습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* EMR 복사 문구 */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">EMR 템플릿 설정</CardTitle>
          <CardDescription className="text-base text-slate-600 mt-2">
            환자 정보를 EMR 시스템에 복사할 때 사용할 템플릿을 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-xl mb-6 border border-amber-200">
            <p className="text-base text-amber-800 font-semibold mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span> 사용 가능한 변수
            </p>
            <p className="text-sm text-amber-700 mb-3">아래 변수들을 선택하여 EMR 복사 시 포함할 항목을 지정하세요:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { var: '[환자명]', desc: '환자 이름' },
                { var: '[치료방법]', desc: '현재 치료방법' },
                { var: '[검사일]', desc: '검사 날짜' },
                { var: '[SE_OD]', desc: '우안 구면상당치' },
                { var: '[SE_OS]', desc: '좌안 구면상당치' },
                { var: '[AL_OD]', desc: '우안 안축장' },
                { var: '[AL_OS]', desc: '좌안 안축장' },
                { var: '[SE_PROGRESS_OD]', desc: '우안 SE 진행속도' },
                { var: '[SE_PROGRESS_OS]', desc: '좌안 SE 진행속도' },
              ].map(({ var: variable, desc }) => {
                const isChecked = settings.emrTemplateVariables?.includes(variable) ?? true;
                return (
                  <div key={variable} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-amber-200">
                    <input
                      type="checkbox"
                      id={`var-${variable}`}
                      checked={isChecked}
                      onChange={() => {
                        const currentVariables = settings.emrTemplateVariables || DEFAULT_SETTINGS.emrTemplateVariables || [];
                        const updatedVariables = isChecked
                          ? currentVariables.filter(v => v !== variable)
                          : [...currentVariables, variable];
                        setSettings({ ...settings, emrTemplateVariables: updatedVariables });
                      }}
                      className="h-5 w-5 text-blue-600 rounded border-amber-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={`var-${variable}`} className="flex-1 cursor-pointer">
                      <code className="text-sm text-amber-900 font-mono block">
                        {variable}
                      </code>
                      <span className="text-xs text-amber-600">{desc}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-700">템플릿 내용</Label>
            <Textarea
              value={settings.emrTemplate}
              onChange={(e) =>
                setSettings({ ...settings, emrTemplate: e.target.value })
              }
              rows={12}
              className="font-mono text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500 p-4"
              placeholder="EMR 템플릿을 입력하세요..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}