"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentArrowUpIcon,
  KeyIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { 
  getGuides,
  createGuide,
  updateGuide,
  deleteGuide,
  adminLogin,
  adminLogout,
  isAdminAuthenticated,
  formatFileSize,
} from "@/lib/patient-guide-storage";
import { 
  PatientGuide,
  GuideCategory,
  GuideCategoryLabels,
  ContentType,
  DiseaseCategories,
  GuideFormData,
  DEFAULT_GUIDE_TAGS,
} from "@/types/patient-guide";

export default function PatientGuidesAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [guides, setGuides] = useState<PatientGuide[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState<PatientGuide | null>(null);
  
  // 폼 상태
  const [formData, setFormData] = useState<GuideFormData>({
    title: "",
    description: "",
    primaryCategory: "",
    secondaryCategories: [],
    tags: [],
    contentType: ContentType.PDF,
    youtubeUrl: "",
    isPublished: true,
    order: 0,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadGuides();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const authenticated = isAdminAuthenticated();
    setIsAuthenticated(authenticated);
    if (!authenticated) {
      // 인증되지 않은 경우 로그인 화면 표시
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(password);
    if (success) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    router.push("/patient-guides");
  };

  const loadGuides = () => {
    const allGuides = getGuides(); // 모든 자료 표시 (비공개 포함)
    setGuides(allGuides);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      primaryCategory: "",
      secondaryCategories: [],
      tags: [],
      contentType: ContentType.PDF,
      youtubeUrl: "",
      isPublished: true,
      order: 0,
    });
    setEditingGuide(null);
    setShowForm(false);
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.primaryCategory) {
      alert("제목과 카테고리는 필수입니다.");
      return;
    }

    setIsUploading(true);

    try {
      if (editingGuide) {
        // 수정
        updateGuide(editingGuide.id, {
          ...formData,
          primaryCategory: formData.primaryCategory as GuideCategory,
        });
      } else {
        // 파일 업로드 처리
        const uploadedFileData = [];
        
        for (const file of uploadedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (response.ok) {
              const data = await response.json();
              uploadedFileData.push({
                id: 'file_' + Date.now() + '_' + uploadedFileData.length,
                type: 'pdf' as const,
                name: file.name,
                url: data.url,
                size: data.size,
              });
            }
          } catch (error) {
            console.error('File upload error:', error);
          }
        }
        
        // 생성
        const newGuide = {
          ...formData,
          primaryCategory: formData.primaryCategory as GuideCategory,
          files: formData.contentType !== ContentType.VIDEO ? uploadedFileData : [],
          createdBy: 'admin',
        };
        createGuide(newGuide);
      }

      loadGuides();
      resetForm();
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (guide: PatientGuide) => {
    setEditingGuide(guide);
    setFormData({
      title: guide.title,
      description: guide.description,
      primaryCategory: guide.primaryCategory,
      secondaryCategories: guide.secondaryCategories,
      tags: guide.tags,
      contentType: guide.contentType,
      youtubeUrl: guide.youtubeUrl || "",
      isPublished: guide.isPublished,
      order: guide.order,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteGuide(id);
      loadGuides();
    }
  };

  const togglePublished = (guide: PatientGuide) => {
    updateGuide(guide.id, { isPublished: !guide.isPublished });
    loadGuides();
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <KeyIcon className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-800">관리자 로그인</h1>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <Link href="/patient-guides" className="text-sm text-slate-600 hover:text-slate-800">
              돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 관리자 페이지
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/patient-guides"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              돌아가기
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">환자 안내자료 관리</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              새 자료 추가
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-slate-600 mb-2">전체 자료</h3>
            <p className="text-2xl font-bold text-slate-800">{guides.length}개</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-slate-600 mb-2">공개 자료</h3>
            <p className="text-2xl font-bold text-slate-800">
              {guides.filter(g => g.isPublished).length}개
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-slate-600 mb-2">총 조회수</h3>
            <p className="text-2xl font-bold text-slate-800">
              {guides.reduce((sum, g) => sum + g.viewCount, 0)}회
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-slate-600 mb-2">총 다운로드</h3>
            <p className="text-2xl font-bold text-slate-800">
              {guides.reduce((sum, g) => sum + g.downloadCount, 0)}회
            </p>
          </div>
        </div>

        {/* 자료 목록 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">제목</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-700">카테고리</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-700">상태</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-700">조회수</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-800">{guide.title}</div>
                      <div className="text-sm text-slate-500">{guide.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-slate-700">
                        {GuideCategoryLabels[guide.primaryCategory]}
                      </div>
                      {guide.secondaryCategories.length > 0 && (
                        <div className="text-slate-500">
                          {guide.secondaryCategories.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => togglePublished(guide)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        guide.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {guide.isPublished ? (
                        <>
                          <EyeIcon className="w-4 h-4" />
                          공개
                        </>
                      ) : (
                        <>
                          <EyeSlashIcon className="w-4 h-4" />
                          비공개
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-slate-600">{guide.viewCount}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(guide)}
                        className="p-1 text-slate-600 hover:text-blue-600 transition-colors"
                        title="수정"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(guide.id)}
                        className="p-1 text-slate-600 hover:text-red-600 transition-colors"
                        title="삭제"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <Link
                        href={`/patient-guides/${guide.id}`}
                        target="_blank"
                        className="p-1 text-slate-600 hover:text-slate-800 transition-colors"
                        title="보기"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 생성/수정 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                {editingGuide ? '자료 수정' : '새 자료 추가'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* 카테고리 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      주 카테고리 *
                    </label>
                    <select
                      value={formData.primaryCategory}
                      onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value as GuideCategory })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">선택하세요</option>
                      {Object.entries(GuideCategoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      콘텐츠 타입
                    </label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={ContentType.PDF}>PDF</option>
                      <option value={ContentType.VIDEO}>동영상</option>
                      <option value={ContentType.MIXED}>PDF+동영상</option>
                    </select>
                  </div>
                </div>

                {/* 질환 카테고리 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    질환 카테고리 (복수 선택)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(DiseaseCategories).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.secondaryCategories.includes(label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                secondaryCategories: [...formData.secondaryCategories, label]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                secondaryCategories: formData.secondaryCategories.filter(c => c !== label)
                              });
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 태그 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    태그
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {DEFAULT_GUIDE_TAGS.map((tag) => (
                      <label key={tag} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.tags.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                tags: [...formData.tags, tag]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                tags: formData.tags.filter(t => t !== tag)
                              });
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* YouTube URL (동영상 타입인 경우) */}
                {(formData.contentType === ContentType.VIDEO || formData.contentType === ContentType.MIXED) && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}

                {/* 파일 업로드 */}
                {formData.contentType !== ContentType.VIDEO && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      파일 업로드
                    </label>
                    <div 
                      className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                        const files = Array.from(e.dataTransfer.files).filter(
                          file => file.type === 'application/pdf'
                        );
                        if (files.length > 0) {
                          setUploadedFiles(prev => [...prev, ...files]);
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setUploadedFiles(prev => [...prev, ...files]);
                        }}
                      />
                      <DocumentArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-1">
                        PDF 파일을 클릭하거나 드래그하여 업로드
                      </p>
                      <p className="text-xs text-slate-500">
                        최대 10MB, PDF 형식만 가능
                      </p>
                    </div>
                    
                    {/* 업로드된 파일 목록 */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <DocumentIcon className="w-5 h-5 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 추가 설정 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      정렬 순서
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm font-medium text-slate-700">즉시 공개</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 폼 버튼 */}
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? '업로드 중...' : (editingGuide ? '수정' : '추가')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}