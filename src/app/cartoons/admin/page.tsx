"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Download,
  Printer,
  ArrowLeft,
  LogOut,
  FilmIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getCartoons,
  updateCartoon,
  deleteCartoon,
  checkAdminAuth,
  clearAdminAuth,
} from "@/lib/cartoon-storage";
import { Cartoon } from "@/types/cartoon";

export default function AdminPage() {
  const router = useRouter();
  const [cartoons, setCartoons] = useState<Cartoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCartoonId, setSelectedCartoonId] = useState<string | null>(null);

  useEffect(() => {
    // 관리자 인증 확인
    if (!checkAdminAuth()) {
      router.push("/cartoons");
      return;
    }

    loadCartoons();
  }, []);

  const loadCartoons = async () => {
    setLoading(true);
    try {
      // 모든 만화 로드 (게시/미게시 포함)
      const allCartoons = getCartoons();
      setCartoons(allCartoons);
    } catch (error) {
      console.error("만화 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (cartoonId: string, currentStatus: boolean) => {
    try {
      await updateCartoon(cartoonId, {
        isPublished: !currentStatus,
      });
      loadCartoons();
    } catch (error) {
      console.error("게시 상태 변경 실패:", error);
      alert("게시 상태 변경에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedCartoonId) return;

    try {
      deleteCartoon(selectedCartoonId);
      setDeleteDialogOpen(false);
      setSelectedCartoonId(null);
      loadCartoons();
      alert("만화가 삭제되었습니다.");
    } catch (error) {
      console.error("만화 삭제 실패:", error);
      alert("만화 삭제에 실패했습니다.");
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    router.push("/cartoons");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">만화 관리</h1>
          <p className="text-base text-slate-600 mt-1">안과 만화 콘텐츠를 관리하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="h-11 px-5 text-base font-medium border-slate-200 hover:bg-slate-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            로그아웃
          </Button>
          <Link href="/cartoons/admin/new">
            <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
              <Plus className="w-5 h-5 mr-2" />
              새 만화 추가
            </Button>
          </Link>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              전체 만화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {cartoons.length}
              </p>
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <FilmIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              게시된 만화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {cartoons.filter(c => c.isPublished).length}
              </p>
              <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              총 조회수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {cartoons.reduce((sum, c) => sum + c.viewCount, 0).toLocaleString()}
              </p>
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              총 다운로드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {cartoons.reduce((sum, c) => sum + c.downloadCount, 0).toLocaleString()}
              </p>
              <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                <Download className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 만화 목록 테이블 */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
          <CardTitle className="text-xl font-semibold text-slate-800">만화 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-100/50">
                  <TableHead>제목</TableHead>
                  <TableHead>태그</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">조회수</TableHead>
                  <TableHead className="text-center">다운로드</TableHead>
                  <TableHead className="text-center">인쇄</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartoons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      등록된 만화가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  cartoons.map(cartoon => (
                    <TableRow key={cartoon.id}>
                      <TableCell>
                        <Link
                          href={`/cartoons/${cartoon.id}`}
                          className="font-medium text-slate-800 hover:text-blue-600 transition-colors"
                        >
                          {cartoon.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cartoon.tags.slice(0, 2).map(tag => (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                          {cartoon.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{cartoon.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={cartoon.isPublished ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {cartoon.isPublished ? "게시" : "미게시"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-slate-500" />
                          {cartoon.viewCount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Download className="w-3 h-3 text-slate-500" />
                          {cartoon.downloadCount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Printer className="w-3 h-3 text-slate-500" />
                          {cartoon.printCount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(cartoon.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(cartoon.id, cartoon.isPublished)}
                            className="hover:bg-slate-100"
                          >
                            {cartoon.isPublished ? (
                              <EyeOff className="w-4 h-4 text-slate-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-600" />
                            )}
                          </Button>
                          <Link href={`/cartoons/admin/${cartoon.id}/edit`}>
                            <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                              <Edit className="w-4 h-4 text-slate-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCartoonId(cartoon.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>만화 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 만화를 삭제하시겠습니까? 삭제된 만화는 복구할 수 없으며,
              관련된 모든 댓글도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}