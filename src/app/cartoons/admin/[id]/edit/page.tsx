"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, GripVertical, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  checkAdminAuth,
  getCartoonById,
  updateCartoon,
  createCartoonImage,
  generateThumbnail,
} from "@/lib/cartoon-storage";
import {
  Cartoon,
  CartoonImage,
  CartoonTag,
  DEFAULT_TAGS,
  CartoonTagCategory,
} from "@/types/cartoon";

export default function EditCartoonPage() {
  const router = useRouter();
  const params = useParams();
  const cartoonId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cartoon, setCartoon] = useState<Cartoon | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: false,
  });
  const [selectedTags, setSelectedTags] = useState<CartoonTag[]>([]);
  const [images, setImages] = useState<CartoonImage[]>([]);

  useEffect(() => {
    // 관리자 인증 확인
    if (!checkAdminAuth()) {
      router.push("/cartoons");
      return;
    }
    
    // 만화 데이터 로드
    loadCartoon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartoonId]);

  const loadCartoon = () => {
    const cartoonData = getCartoonById(cartoonId);
    if (!cartoonData) {
      router.push("/cartoons/admin");
      return;
    }
    
    setCartoon(cartoonData);
    setFormData({
      title: cartoonData.title,
      description: cartoonData.description || "",
      isPublished: cartoonData.isPublished,
    });
    setSelectedTags(cartoonData.tags);
    setImages(cartoonData.images);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: CartoonImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은 5MB를 초과합니다.`);
        continue;
      }
      
      // 이미지 파일 체크
      if (!file.type.startsWith("image/")) {
        alert(`${file.name}은 이미지 파일이 아닙니다.`);
        continue;
      }
      
      // 최대 10개 체크
      if (images.length + newImages.length >= 10) {
        alert("최대 10개의 이미지만 업로드할 수 있습니다.");
        break;
      }
      
      try {
        const cartoonImage = await createCartoonImage(
          file,
          images.length + newImages.length
        );
        newImages.push(cartoonImage);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert(`${file.name} 업로드에 실패했습니다.`);
      }
    }
    
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
    
    // 순서 재정렬
    setImages(prev => 
      prev.filter(img => img.id !== imageId)
        .map((img, index) => ({ ...img, order: index }))
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // 이미지 순서 변경
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    // order 재정렬
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }));
    
    setImages(reorderedImages);
    setDraggedIndex(null);
  };

  const toggleTag = (tag: CartoonTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    if (images.length === 0) {
      alert("최소 1개 이상의 이미지를 업로드해주세요.");
      return;
    }
    
    if (selectedTags.length === 0) {
      alert("최소 1개 이상의 태그를 선택해주세요.");
      return;
    }
    
    setSaving(true);
    
    try {
      // 썸네일 생성
      const thumbnail = generateThumbnail(images);
      
      // 만화 업데이트
      updateCartoon(cartoonId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: selectedTags,
        images: images,
        thumbnail,
        isPublished: formData.isPublished,
      });
      
      alert("만화가 수정되었습니다.");
      router.push("/cartoons/admin");
    } catch (error) {
      console.error("만화 수정 실패:", error);
      alert("만화 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    );
  }

  if (!cartoon) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">만화 수정</h1>
          <p className="text-base text-slate-600 mt-1">만화 정보를 수정하세요</p>
        </div>
        <Link
          href="/cartoons/admin"
          className="flex items-center gap-2 h-11 px-5 text-base font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          관리자 페이지로
        </Link>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <CardTitle className="text-xl font-semibold text-slate-800">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <Label htmlFor="title" className="text-base font-semibold text-slate-700">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="만화 제목을 입력하세요"
                maxLength={100}
                className="mt-2 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base font-semibold text-slate-700">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="만화에 대한 간단한 설명을 입력하세요"
                rows={3}
                maxLength={500}
                className="mt-2 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
              />
              <Label htmlFor="isPublished" className="text-base font-medium text-slate-700 cursor-pointer">게시 상태</Label>
            </div>
          </CardContent>
        </Card>

        {/* 태그 선택 */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <CardTitle className="text-xl font-semibold text-slate-800">태그 선택 *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {/* 전문분야 태그 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">전문분야</h3>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_TAGS.filter(tag => tag.category === CartoonTagCategory.SPECIALTY).map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.some(t => t.id === tag.id) ? "default" : "outline"}
                    className={`cursor-pointer h-8 px-3 text-sm font-medium transition-all ${
                      selectedTags.some(t => t.id === tag.id)
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "hover:bg-slate-100 border-slate-300"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 증상 태그 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">증상</h3>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_TAGS.filter(tag => tag.category === CartoonTagCategory.CONDITION).map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.some(t => t.id === tag.id) ? "default" : "outline"}
                    className={`cursor-pointer h-8 px-3 text-sm font-medium transition-all ${
                      selectedTags.some(t => t.id === tag.id)
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "hover:bg-slate-100 border-slate-300"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {selectedTags.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-slate-600">
                  선택된 태그: <span className="text-blue-600">{selectedTags.map(t => t.name).join(", ")}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 이미지 관리 */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <CardTitle className="text-xl font-semibold text-slate-800">이미지 관리 * (최대 10개)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {/* 업로드 버튼 */}
            <div>
              <Label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center gap-2 h-11 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Upload className="w-5 h-5" />
                이미지 추가
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-sm text-slate-600 mt-2">
                JPG, PNG 등의 이미지 파일 (최대 5MB)
              </p>
            </div>
            
            {/* 이미지 목록 */}
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  업로드된 이미지 ({images.length}/10)
                </p>
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 cursor-move hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <div className="w-16 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={image.url}
                          alt={`이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">이미지 {index + 1}</p>
                        {image.width && image.height && (
                          <p className="text-xs text-slate-500">
                            {image.width} x {image.height}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  드래그하여 순서를 변경할 수 있습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Link href="/cartoons/admin">
            <Button 
              type="button" 
              variant="outline"
              className="h-11 px-5 text-base font-medium border-slate-200 hover:bg-slate-50"
            >
              취소
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={saving}
            className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "저장 중..." : "변경사항 저장"}
          </Button>
        </div>
      </form>
    </div>
  );
}