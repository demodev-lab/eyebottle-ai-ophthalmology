"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Download, Printer, Key, FilmIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getCartoons,
  sortCartoons,
  createSampleCartoons,
  setAdminAuth,
  checkAdminAuth,
} from "@/lib/cartoon-storage";
import {
  Cartoon,
  CartoonFilter,
  CartoonSortOption,
  DEFAULT_TAGS,
  CartoonTagCategory,
} from "@/types/cartoon";

export default function CartoonsPage() {
  const [cartoons, setCartoons] = useState<Cartoon[]>([]);
  const [filteredCartoons, setFilteredCartoons] = useState<Cartoon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<CartoonSortOption>(CartoonSortOption.LATEST);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    // 샘플 데이터 생성 (처음 실행 시)
    createSampleCartoons();
    
    // 관리자 인증 확인
    setIsAdminAuth(checkAdminAuth());
    
    // 만화 목록 로드
    loadCartoons();
  }, []);

  // 필터링 및 정렬
  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartoons, searchQuery, selectedTags, sortOption]);

  const loadCartoons = () => {
    setLoading(true);
    try {
      const filter: CartoonFilter = {
        isPublished: true, // 게시된 만화만 표시
      };
      const allCartoons = getCartoons(filter);
      setCartoons(allCartoons);
    } catch (error) {
      console.error("만화 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...cartoons];

    // 태그 필터
    if (selectedTags.length > 0) {
      filtered = filtered.filter(cartoon =>
        cartoon.tags.some(tag => selectedTags.includes(tag.id))
      );
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        cartoon =>
          cartoon.title.toLowerCase().includes(query) ||
          cartoon.description?.toLowerCase().includes(query) ||
          cartoon.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // 정렬
    filtered = sortCartoons(filtered, sortOption);

    setFilteredCartoons(filtered);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAdminAuth = () => {
    const success = setAdminAuth(adminPassword);
    if (success) {
      setIsAdminAuth(true);
      setShowAdminDialog(false);
      setAdminPassword("");
      window.location.reload(); // 레이아웃 업데이트를 위해 새로고침
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 - 제거 (레이아웃 헤더로 충분) */}

      {/* 검색 및 필터 섹션 */}
      <Card className="border-0 shadow-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">만화 검색</h2>
            <p className="text-sm text-slate-600">총 {filteredCartoons.length}개의 만화가 검색되었습니다</p>
          </div>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as CartoonSortOption)}>
            <SelectTrigger className="w-40 h-11 border-slate-200 text-base bg-white hover:bg-slate-50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CartoonSortOption.LATEST}>최신순</SelectItem>
              <SelectItem value={CartoonSortOption.POPULAR}>인기순</SelectItem>
              <SelectItem value={CartoonSortOption.DOWNLOAD}>다운로드순</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* 검색바 */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
          <Input
            type="text"
            placeholder="만화 제목 또는 태그로 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* 태그 필터 */}
        <div className="space-y-4 border-t pt-4">
          {/* 전문분야 태그 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">전문분야</h3>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TAGS.filter(tag => tag.category === CartoonTagCategory.SPECIALTY).map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer h-8 px-3 text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id) 
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                      : "hover:bg-slate-100 border-slate-300"
                  }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* 증상 태그 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">증상</h3>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TAGS.filter(tag => tag.category === CartoonTagCategory.CONDITION).map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer h-8 px-3 text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id) 
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                      : "hover:bg-slate-100 border-slate-300"
                  }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 만화 갤러리 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCartoons.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <FilmIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-slate-400 text-sm mt-2">다른 검색어나 태그를 시도해보세요.</p>
            </div>
          ) : (
            filteredCartoons.map((cartoon, index) => (
              <Link
                key={cartoon.id}
                href={`/cartoons/${cartoon.id}`}
                className="group"
              >
                <Card className="group relative border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {/* 썸네일 이미지 */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
                    {/* 새 콘텐츠 배지 */}
                    {index === 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
                          NEW
                        </span>
                      </div>
                    )}
                    {cartoon.viewCount > 100 && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                          🔥 HOT
                        </span>
                      </div>
                    )}
                    
                    {cartoon.thumbnail ? (
                      <img
                        src={cartoon.thumbnail}
                        alt={cartoon.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FilmIcon className="w-20 h-20 text-blue-300" />
                      </div>
                    )}
                    
                    {/* 기본 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium mb-2">클릭하여 자세히 보기</p>
                        <div className="flex items-center gap-4 text-white/90 text-xs">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatCount(cartoon.viewCount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {formatCount(cartoon.downloadCount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {cartoon.title}
                    </h3>
                    
                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cartoon.tags.slice(0, 2).map(tag => (
                        <Badge key={tag.id} variant="secondary" className="text-xs h-7 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 font-medium shadow-sm">
                          {tag.name}
                        </Badge>
                      ))}
                      {cartoon.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs h-7 px-3 bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600 border-slate-200 font-medium shadow-sm">
                          +{cartoon.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* 통계 */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-blue-50 rounded-lg mb-1 group-hover:bg-blue-100 transition-colors">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{formatCount(cartoon.viewCount)}</span>
                          <span className="text-xs text-slate-500">조회</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-green-50 rounded-lg mb-1 group-hover:bg-green-100 transition-colors">
                            <Download className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{formatCount(cartoon.downloadCount)}</span>
                          <span className="text-xs text-slate-500">다운로드</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-purple-50 rounded-lg mb-1 group-hover:bg-purple-100 transition-colors">
                            <Printer className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{formatCount(cartoon.printCount)}</span>
                          <span className="text-xs text-slate-500">인쇄</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>

      {/* 관리자 로그인 다이얼로그 */}
      {!isAdminAuth && (
        <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="fixed bottom-6 right-6 opacity-70 hover:opacity-100 bg-white border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Key className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">관리자</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>관리자 인증</DialogTitle>
              <DialogDescription>
                관리자 비밀번호를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="비밀번호"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdminAuth()}
              />
              <Button 
                onClick={handleAdminAuth} 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                인증
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}