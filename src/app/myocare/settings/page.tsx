'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const loadSettings = useCallback(async () => {
    try {
      // 현재 사용자 확인, 없으면 데모 사용자 생성
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = createDemoUser();
      }

      const userSettings = getUserSettings();
      
      // emrTemplateVariables가 undefined인 경우에만 기본값으로 설정 (빈 배열은 사용자가 의도적으로 비운 것)
      if (userSettings.emrTemplateVariables === undefined) {
        userSettings.emrTemplateVariables = DEFAULT_SETTINGS.emrTemplateVariables || [];
      }
      
      // 템플릿 생성 (항상 재생성하여 최신 변수 선택사항 반영)
      const originalTemplate = userSettings.emrTemplate;
      const newTemplate = generateTemplate(userSettings);
      userSettings.emrTemplate = newTemplate;
      
      // 템플릿이 변경되었으면 저장소에 저장
      if (newTemplate !== originalTemplate) {
        const { id: _id, user_id: _userId, created_at: _createdAt, ...updates } = userSettings;
        await updateUserSettings(updates);
      }
      
      setSettings(userSettings);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { id: _id, user_id: _userId, created_at: _createdAt, ...updates } = settings;
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
      const resetSettings = {
        ...settings!,
        ...DEFAULT_SETTINGS,
      };
      
      // 템플릿도 재생성
      const newTemplate = generateTemplate(resetSettings);
      setSettings({
        ...resetSettings,
        emrTemplate: newTemplate,
      });
    }
  };

  // 선택된 변수들을 기반으로 템플릿 생성
  const generateTemplate = (customSettings?: UserSettings) => {
    const currentSettings = customSettings || settings;
    if (!currentSettings) return '';
    
    const variables = currentSettings.emrTemplateVariables || [];
    let template = '';
    
    // 치료방법
    if (variables.includes('[치료방법]')) {
      template += '치료방법: [치료방법]\n\n';
    }
    
    // SE 정보
    if (variables.includes('[구면상당치]')) {
      template += '우안 S.E.: [SE_OD] D / 좌안 S.E.: [SE_OS] D\n';
    }
    
    // AL 정보
    if (variables.includes('[안축장]')) {
      template += '우안 안축장: [AL_OD] mm / 좌안 안축장: [AL_OS] mm\n';
    }
    
    // 진행속도
    const hasSEProgress = variables.includes('[SE 진행속도]');
    const hasALProgress = variables.includes('[AL 진행속도]');
    
    if (hasSEProgress || hasALProgress) {
      template += '\n연간 진행속도:\n';
      
      // SE 진행속도
      if (hasSEProgress) {
        template += '우안 S.E.: [SE_PROGRESS_OD] D/yr / 좌안 S.E.: [SE_PROGRESS_OS] D/yr\n';
      }
      
      // AL 진행속도
      if (hasALProgress) {
        template += '우안 A.L.: [AL_PROGRESS_OD] mm/yr / 좌안 A.L.: [AL_PROGRESS_OS] mm/yr\n';
      }
    }
    
    // 안경처방
    if (variables.includes('[안경처방]')) {
      template += '\n당일 안경처방함';
    }
    
    // 사용자 경과 문구
    if (variables.includes('[사용자 경과 문구]')) {
      template += '\n[사용자 경과 문구]';
    }
    
    return template.trim();
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
    <div className="flex justify-center">
      <div className="space-y-6 max-w-4xl w-full">
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
                { var: '[치료방법]', desc: '현재 치료방법' },
                { var: '[구면상당치]', desc: '우안/좌안 S.E. (구면상당치)' },
                { var: '[안축장]', desc: '우안/좌안 안축장' },
                { var: '[SE 진행속도]', desc: '우안/좌안 S.E. 진행속도' },
                { var: '[AL 진행속도]', desc: '우안/좌안 A.L. 진행속도' },
                { var: '[안경처방]', desc: '당일 안경처방 여부' },
                { var: '[사용자 경과 문구]', desc: '사용자 정의 문구' },
              ].map(({ var: variable, desc }) => {
                // emrTemplateVariables가 undefined면 기본값 사용, 빈 배열이면 그대로 사용
                const variables = settings.emrTemplateVariables !== undefined 
                  ? settings.emrTemplateVariables 
                  : DEFAULT_SETTINGS.emrTemplateVariables || [];
                const isChecked = variables.includes(variable);
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
                        const updatedSettings = { ...settings, emrTemplateVariables: updatedVariables };
                        setSettings(updatedSettings);
                        
                        // 템플릿 자동 업데이트
                        const newTemplate = generateTemplate(updatedSettings);
                        setSettings({ ...updatedSettings, emrTemplate: newTemplate });
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
            
            {/* 변수가 선택되지 않았을 때 경고 메시지 */}
            {settings.emrTemplateVariables && settings.emrTemplateVariables.length === 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 font-medium flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  최소 하나 이상의 변수를 선택해주세요.
                </p>
                <p className="text-xs text-red-600 mt-1 ml-7">
                  변수가 선택되지 않으면 EMR 복사 시 내용이 없습니다.
                </p>
              </div>
            )}
            
            {/* 사용자 경과 문구 입력 필드 */}
            {settings.emrTemplateVariables?.includes('[사용자 경과 문구]') && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                <Label className="text-sm font-medium text-amber-900 mb-2 block">
                  사용자 경과 문구 입력
                </Label>
                <Input
                  type="text"
                  value={settings.customComment || ''}
                  onChange={(e) => setSettings({ ...settings, customComment: e.target.value })}
                  placeholder="예: 4개월 뒤 경과관찰, AL, 안경시력, 교정 후 진료"
                  className="w-full border-amber-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-700">템플릿 내용</Label>
            <Textarea
              value={settings.emrTemplate}
              readOnly
              rows={12}
              className="font-mono text-base border-slate-200 bg-slate-50 p-4"
              placeholder={settings.emrTemplateVariables && settings.emrTemplateVariables.length === 0 
                ? "⚠️ 변수를 선택하지 않아 템플릿이 비어있습니다." 
                : "체크박스를 선택하여 템플릿을 구성하세요..."}
            />
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}