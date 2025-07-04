"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  ArrowDownTrayIcon, 
  DocumentIcon,
  FilmIcon,
  PrinterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { 
  getGuideById, 
  incrementViewCount, 
  incrementDownloadCount,
  formatFileSize,
} from "@/lib/patient-guide-storage";
import { 
  PatientGuide, 
  GuideCategoryLabels,
  ContentType,
} from "@/types/patient-guide";

export default function PatientGuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [guide, setGuide] = useState<PatientGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuide();
  }, [id]);

  const loadGuide = async () => {
    setLoading(true);
    const guideData = getGuideById(id);
    
    if (!guideData) {
      router.push("/patient-guides");
      return;
    }

    // 조회수 증가
    incrementViewCount(id);
    
    setGuide(guideData);
    setLoading(false);
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    // 다운로드 수 증가
    incrementDownloadCount(id);
    
    // 파일 다운로드
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: guide?.title,
          text: guide?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link 
            href="/patient-guides"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            목록으로 돌아가기
          </Link>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* 제목 및 메타 정보 */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-800">{guide.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="인쇄"
                >
                  <PrinterIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="공유"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-lg text-slate-600 mb-4">{guide.description}</p>
            
            {/* 카테고리 및 태그 */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {GuideCategoryLabels[guide.primaryCategory]}
              </span>
              {guide.secondaryCategories.map((cat) => (
                <span key={cat} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {cat}
                </span>
              ))}
              {guide.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* 통계 정보 */}
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span>조회수 {guide.viewCount}회</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>다운로드 {guide.downloadCount}회</span>
              </div>
              <div>
                등록일: {new Date(guide.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>

          {/* 콘텐츠 섹션 */}
          <div className="border-t border-slate-200 pt-8">
            {/* PDF 파일 */}
            {guide.files.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">첨부 파일</h2>
                <div className="space-y-3">
                  {guide.files.map((file) => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="font-medium text-slate-800">{file.name}</p>
                          {file.size && (
                            <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(file.url, file.name)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube 비디오 */}
            {guide.youtubeUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">동영상 자료</h2>
                <div className="aspect-w-16 aspect-h-9 bg-slate-100 rounded-lg overflow-hidden">
                  <iframe
                    src={guide.youtubeUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    title={guide.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-[500px] rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* PDF 미리보기 (간단한 iframe 사용) */}
            {guide.contentType === ContentType.PDF && guide.files[0]?.url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">문서 미리보기</h2>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <iframe
                    src={guide.files[0].url}
                    className="w-full h-[600px]"
                    title="PDF 미리보기"
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  * 미리보기가 표시되지 않는 경우 다운로드 버튼을 클릭하여 파일을 확인하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>안내:</strong> 이 자료는 일반적인 정보 제공을 목적으로 하며, 
            개인의 상황에 따라 다를 수 있습니다. 자세한 내용은 담당 의료진과 상담하시기 바랍니다.
          </p>
        </div>
      </div>

      {/* 인쇄용 스타일 */}
      <style jsx>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}