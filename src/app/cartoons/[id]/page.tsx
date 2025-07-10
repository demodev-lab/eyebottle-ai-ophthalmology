"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Printer,
  Eye,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
  FilmIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  getCartoonById,
  incrementCartoonCount,
  getComments,
  createComment,
  deleteComment,
  getCartoons,
  checkAdminAuth,
} from "@/lib/cartoon-storage";
import {
  Cartoon,
  CartoonComment,
} from "@/types/cartoon";
import { pdf } from "@react-pdf/renderer";
import { CartoonPDFDocument } from "@/components/cartoons/CartoonPDFExport";

export default function CartoonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cartoonId = params.id as string;

  const [cartoon, setCartoon] = useState<Cartoon | null>(null);
  const [comments, setComments] = useState<CartoonComment[]>([]);
  const [relatedCartoons, setRelatedCartoons] = useState<Cartoon[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  
  // 댓글 작성 폼
  const [commentForm, setCommentForm] = useState({
    nickname: "",
    content: "",
  });
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  useEffect(() => {
    loadCartoonData();
    setIsAdminAuth(checkAdminAuth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartoonId]);

  const loadCartoonData = async () => {
    setLoading(true);
    try {
      // 만화 데이터 로드
      const cartoonData = getCartoonById(cartoonId);
      if (!cartoonData) {
        router.push("/cartoons");
        return;
      }
      
      setCartoon(cartoonData);
      
      // 조회수 증가
      incrementCartoonCount(cartoonId, "viewCount");
      
      // 댓글 로드
      const cartoonComments = getComments(cartoonId);
      setComments(cartoonComments);
      
      // 관련 만화 로드 (같은 태그를 가진 만화)
      const allCartoons = getCartoons({ isPublished: true });
      const related = allCartoons
        .filter(c => 
          c.id !== cartoonId && 
          c.tags.some(tag => cartoonData.tags.some(t => t.id === tag.id))
        )
        .slice(0, 4);
      setRelatedCartoons(related);
      
    } catch (error) {
      console.error("만화 로드 실패:", error);
      router.push("/cartoons");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousImage = () => {
    if (cartoon && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (cartoon && currentImageIndex < cartoon.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cartoon) return;
    
    try {
      incrementCartoonCount(cartoonId, "downloadCount");
      
      // PDF 생성
      const doc = <CartoonPDFDocument cartoon={cartoon} />;
      const blob = await pdf(doc).toBlob();
      
      // 다운로드
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cartoon.title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성에 실패했습니다.");
    }
  };

  const handlePrint = async () => {
    if (!cartoon) return;
    
    incrementCartoonCount(cartoonId, "printCount");
    
    // 디버깅: 이미지 URL 확인
    console.log("인쇄할 이미지들:", cartoon.images.map(img => img.url));
    
    // 모든 이미지 로드 대기
    const printImages = document.querySelectorAll('.print-only img');
    console.log("찾은 인쇄용 이미지 수:", printImages.length);
    
    if (printImages.length === 0) {
      console.error("인쇄용 이미지를 찾을 수 없습니다!");
      // 이미지가 없어도 인쇄 시도
      window.print();
      return;
    }
    
    const imageLoadPromises = Array.from(printImages).map((img, index) => {
      return new Promise((resolve) => {
        const imgElement = img as HTMLImageElement;
        console.log(`이미지 ${index + 1} 상태:`, {
          src: imgElement.src,
          complete: imgElement.complete,
          naturalWidth: imgElement.naturalWidth,
          naturalHeight: imgElement.naturalHeight
        });
        
        if (imgElement.complete && imgElement.naturalWidth > 0) {
          resolve(true);
        } else {
          imgElement.onload = () => {
            console.log(`이미지 ${index + 1} 로드 완료`);
            resolve(true);
          };
          imgElement.onerror = () => {
            console.error(`이미지 ${index + 1} 로드 실패:`, imgElement.src);
            resolve(false);
          };
        }
      });
    });
    
    try {
      await Promise.all(imageLoadPromises);
      console.log("모든 이미지 로드 완료, 인쇄 시작");
      // 잠시 대기하여 브라우저가 렌더링을 완료하도록 함
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      console.error("이미지 로드 중 오류:", error);
      window.print(); // 오류가 있어도 인쇄 시도
    }
  };

  const handleShare = async () => {
    if (!cartoon) return;
    
    const shareData = {
      title: cartoon.title,
      text: cartoon.description || "",
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다.");
      }
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.nickname.trim() || !commentForm.content.trim()) {
      alert("닉네임과 내용을 모두 입력해주세요.");
      return;
    }
    
    setIsCommentSubmitting(true);
    try {
      const newComment = createComment({
        cartoon_id: cartoonId,
        nickname: commentForm.nickname.trim(),
        content: commentForm.content.trim(),
      });
      
      setComments([newComment, ...comments]);
      setCommentForm({ nickname: "", content: "" });
      alert("댓글이 등록되었습니다.");
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    
    try {
      deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
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

  const currentImage = cartoon.images[currentImageIndex];

  return (
    <div className="space-y-6 cartoon-detail-page">
      {/* 인쇄 모드 - 이미지만 표시 (최상위에 배치) */}
      <div className="print-only">
        {cartoon.images.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={`${cartoon.title} - ${index + 1}`}
            className="w-full h-auto object-contain"
            loading="eager"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error(`이미지 로드 실패: ${image.url}`);
              const target = e.target as HTMLImageElement;
              // 대체 이미지 표시
              target.src = '/eyebottle-logo.png';
            }}
          />
        ))}
      </div>
      
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{cartoon.title}</h1>
          <p className="text-base text-slate-600 mt-1">{cartoon.description || '안과 만화 상세보기'}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="h-11 px-5 text-base font-medium border-slate-200 hover:bg-slate-50"
          >
            <Share2 className="w-5 h-5 mr-2" />
            공유
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="h-11 px-5 text-base font-medium border-slate-200 hover:bg-slate-50"
          >
            <Printer className="w-5 h-5 mr-2" />
            인쇄
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Download className="w-5 h-5 mr-2" />
            PDF 저장
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid lg:grid-cols-3 gap-6 print:block">
        {/* 왼쪽: 만화 뷰어 */}
        <div className="lg:col-span-2 space-y-6 main-content print:col-span-3">
          <Card className="border-0 shadow-xl bg-white overflow-hidden print:shadow-none print:border-0">
            <CardContent className="p-0">
              {/* 이미지 뷰어 */}
              <div className="relative bg-slate-100 cartoon-images print:bg-white">
                {cartoon.images.length > 0 ? (
                  <>
                    {/* 일반 보기 모드 - 현재 이미지만 표시 */}
                    <div className="aspect-[4/5] flex items-center justify-center print:hidden">
                      <img
                        src={currentImage?.url || cartoon.thumbnail || ""}
                        alt={`${cartoon.title} - ${currentImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    {/* 네비게이션 버튼 */}
                    {cartoon.images.length > 1 && (
                      <div className="navigation-buttons print:hidden">
                        <button
                          onClick={handlePreviousImage}
                          disabled={currentImageIndex === 0}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all hover:scale-110"
                        >
                          <ChevronLeft className="w-6 h-6 text-slate-700" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          disabled={currentImageIndex === cartoon.images.length - 1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all hover:scale-110"
                        >
                          <ChevronRight className="w-6 h-6 text-slate-700" />
                        </button>
                      </div>
                    )}
                    
                    {/* 페이지 인디케이터 */}
                    {cartoon.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm print:hidden">
                        {currentImageIndex + 1} / {cartoon.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-[4/5] flex items-center justify-center">
                    <FilmIcon className="w-24 h-24 text-slate-300" />
                  </div>
                )}
              </div>
              
              {/* 썸네일 리스트 */}
              {cartoon.images.length > 1 && (
                <div className="thumbnail-list print:hidden">
                <div className="p-6 border-t bg-slate-50">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {cartoon.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${
                          index === currentImageIndex
                            ? "border-blue-500 shadow-xl ring-4 ring-blue-500/30"
                            : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`썸네일 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 댓글 섹션 */}
          <Card className="border-0 shadow-xl bg-white comment-section print:hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-600" />
                  댓글 ({comments.length})
                </h3>
              </div>
              
              <Separator />
              
              {/* 댓글 작성 폼 (로그인 기능 구현 전까지는 모든 사용자가 작성 가능) */}
              <form onSubmit={handleCommentSubmit} className="space-y-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100">
                <div>
                  <Label htmlFor="nickname" className="text-base font-semibold text-slate-700">닉네임</Label>
                  <Input
                    id="nickname"
                    value={commentForm.nickname}
                    onChange={(e) => setCommentForm({ ...commentForm, nickname: e.target.value })}
                    placeholder="닉네임을 입력하세요"
                    maxLength={20}
                    className="mt-2 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-base font-semibold text-slate-700">내용</Label>
                  <Textarea
                    id="content"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    placeholder="댓글을 입력하세요"
                    rows={3}
                    maxLength={500}
                    className="mt-2 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isCommentSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isCommentSubmitting ? "등록 중..." : "댓글 등록"}
                </Button>
              </form>
              
              <Separator />
              
              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-base">첫 번째 댓글을 남겨주세요!</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-slate-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-base text-slate-800">{comment.nickname}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(comment.created_at).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <p className="text-base text-slate-700 leading-relaxed">{comment.content}</p>
                        </div>
                        {isAdminAuth && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                          >
                            삭제
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 정보 사이드바 */}
        <div className="space-y-6 sidebar print:hidden">
          {/* 만화 정보 */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">만화 정보</h2>
              
              {cartoon.description && (
                <p className="text-slate-600">{cartoon.description}</p>
              )}
              
              {/* 태그 */}
              <div className="flex flex-wrap gap-2">
                {cartoon.tags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    className="h-8 px-3 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              
              {/* 통계 */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 stats-section">
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{cartoon.viewCount.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">조회수</p>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                      <Download className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{cartoon.downloadCount.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">다운로드</p>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                      <Printer className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{cartoon.printCount.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">인쇄</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 관련 만화 */}
          {relatedCartoons.length > 0 && (
            <Card className="border-0 shadow-xl bg-white related-cartoons">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">관련 만화</h3>
                <div className="space-y-3">
                  {relatedCartoons.map(related => (
                    <Link
                      key={related.id}
                      href={`/cartoons/${related.id}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden flex-shrink-0">
                        {related.thumbnail ? (
                          <img
                            src={related.thumbnail}
                            alt={related.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FilmIcon className="w-8 h-8 text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-800 line-clamp-2">
                          {related.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          조회 {related.viewCount.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}