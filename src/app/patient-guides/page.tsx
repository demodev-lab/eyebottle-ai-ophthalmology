"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DocumentTextIcon, FilmIcon, DocumentIcon, EyeIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, KeyIcon } from "@heroicons/react/24/outline";
import { 
  getGuides, 
  sortGuides, 
  isAdminAuthenticated,
  createSampleGuides,
} from "@/lib/patient-guide-storage";
import { 
  PatientGuide, 
  GuideCategory, 
  GuideCategoryLabels,
  GuideSortOption,
  ContentType,
  DiseaseCategories,
} from "@/types/patient-guide";

export default function PatientGuidesPage() {
  const [guides, setGuides] = useState<PatientGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<PatientGuide[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | "">("");
  const [selectedDisease, setSelectedDisease] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<GuideSortOption>(GuideSortOption.CUSTOM_ORDER);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 샘플 데이터 생성
    createSampleGuides();
    
    // 관리자 권한 확인
    setIsAdmin(isAdminAuthenticated());
    
    // 안내자료 로드
    loadGuides();
  }, []);

  useEffect(() => {
    filterAndSortGuides();
  }, [guides, selectedCategory, selectedDisease, searchQuery, sortOption]);

  const loadGuides = () => {
    // 공개된 자료만 표시 (관리자는 모두 표시)
    const filter = isAdmin ? {} : { isPublished: true };
    const allGuides = getGuides(filter);
    setGuides(allGuides);
  };

  const filterAndSortGuides = () => {
    let filtered = [...guides];

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(g => g.primaryCategory === selectedCategory);
    }

    // 질환 필터
    if (selectedDisease) {
      filtered = filtered.filter(g => g.secondaryCategories.includes(selectedDisease));
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 정렬
    filtered = sortGuides(filtered, sortOption);
    
    setFilteredGuides(filtered);
  };

  const getContentIcon = (contentType: ContentType) => {
    switch (contentType) {
      case ContentType.PDF:
        return <DocumentTextIcon className="w-5 h-5 text-red-600" />;
      case ContentType.VIDEO:
        return <FilmIcon className="w-5 h-5 text-blue-600" />;
      case ContentType.MIXED:
        return <DocumentIcon className="w-5 h-5 text-purple-600" />;
    }
  };

  const getContentTypeLabel = (contentType: ContentType) => {
    switch (contentType) {
      case ContentType.PDF:
        return "PDF";
      case ContentType.VIDEO:
        return "동영상";
      case ContentType.MIXED:
        return "PDF+동영상";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">환자 안내자료</h1>
            <p className="text-slate-600 mt-2">
              수술 전후 안내, 질환 정보, 검사 안내 등 유용한 자료를 제공합니다
            </p>
          </div>
          
          {/* 관리자 버튼 */}
          <Link 
            href="/patient-guides/admin"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <KeyIcon className="w-5 h-5" />
            관리자
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 검색 */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 카테고리 필터 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GuideCategory | "")}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 카테고리</option>
              {Object.entries(GuideCategoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* 질환 필터 */}
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 질환</option>
              {Object.entries(DiseaseCategories).map(([key, label]) => (
                <option key={key} value={label}>{label}</option>
              ))}
            </select>

            {/* 정렬 옵션 */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as GuideSortOption)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={GuideSortOption.CUSTOM_ORDER}>기본 순서</option>
              <option value={GuideSortOption.LATEST}>최신순</option>
              <option value={GuideSortOption.MOST_VIEWED}>조회순</option>
              <option value={GuideSortOption.MOST_DOWNLOADED}>다운로드순</option>
              <option value={GuideSortOption.ALPHABETICAL}>가나다순</option>
            </select>
          </div>
        </div>

        {/* 결과 통계 */}
        <div className="mb-4">
          <p className="text-slate-600">
            총 <span className="font-semibold text-slate-800">{filteredGuides.length}</span>개의 자료
          </p>
        </div>

        {/* 안내자료 목록 테이블 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">제목</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-700">카테고리</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-700">타입</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-700">조회수</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-700">다운로드</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-700">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuides.length > 0 ? (
                filteredGuides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link 
                        href={`/patient-guides/${guide.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-slate-800 flex items-center gap-2">
                            {guide.title}
                            {!guide.isPublished && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                비공개
                              </span>
                            )}
                            {guide.tags.includes('중요') && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                중요
                              </span>
                            )}
                            {guide.tags.includes('신규') && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                신규
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">{guide.description}</div>
                        </div>
                      </Link>
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
                      <div className="flex justify-center items-center gap-1">
                        {getContentIcon(guide.contentType)}
                        <span className="text-sm text-slate-600">
                          {getContentTypeLabel(guide.contentType)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center gap-1 text-slate-600">
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm">{guide.viewCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center gap-1 text-slate-600">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span className="text-sm">{guide.downloadCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">
                        {new Date(guide.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-500">
                      <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>검색 결과가 없습니다</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}