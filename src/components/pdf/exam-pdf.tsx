// 의료 검진 결과 PDF 생성 컴포넌트
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// 폰트 등록 (한글 지원)
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4PNjXhFVadyB1Wk.ttf',
      fontWeight: 'normal'
    },
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0NIpQlx3QUlC5A4PNjThZVatyB1Wk-18jmRFQNQg.ttf', 
      fontWeight: 'bold'
    }
  ]
});

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'NotoSans',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
  },
  summaryBox: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletText: {
    marginLeft: 10,
    flex: 1,
  },
  patientInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  patientItem: {
    width: '50%',
    marginBottom: 3,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f1f3f4',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5,
    textAlign: 'center',
  },
  tableCellLeft: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5,
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e9ecef',
    paddingTop: 10,
  },
  clinicInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clinicLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  clinicText: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  issueDate: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'right',
  },
});

// 당뇨망막병증 PDF
export const DiabeticReportPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>당뇨망막병증 검진 결과 안내</Text>
        <Text style={styles.subtitle}>검사일: {data.examDate}</Text>
      </View>

      {/* 요약 */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>요약</Text>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>현재 단계: {data.fundus.od.stage} / {data.fundus.os.stage}</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>혈당·혈압·지질을 꾸준히 관리하시면 진행을 늦출 수 있습니다.</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>{data.summary.followUp} 후 안저 검사를 통해 변화 여부를 다시 확인하세요.</Text>
        </View>
      </View>

      {/* 환자 정보 */}
      <View style={styles.patientInfo}>
        <View style={styles.patientItem}>
          <Text>환자: {data.name}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>생년월일: {data.birthDate}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>검사일: {data.examDate}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>판독의: {data.doctorName}</Text>
        </View>
      </View>

      {/* 시력 & 안압 */}
      <Text style={styles.sectionTitle}>1. 시력 & 안압</Text>
      
      {/* 시력 테이블 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '20%' }]}>시력</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>나안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>교정</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '20%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.od.naked}</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.od.corrected}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '20%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.os.naked}</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.os.corrected}</Text>
        </View>
      </View>

      {/* 안압 테이블 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '50%' }]}>안압 (mmHg)</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>결과</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '50%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>{data.iop.od}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '50%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>{data.iop.os}</Text>
        </View>
      </View>

      {/* 안저 검사 */}
      <Text style={styles.sectionTitle}>2. 안저 검사</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '30%' }]}>부위</Text>
          <Text style={[styles.tableCell, { width: '70%' }]}>단계</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '30%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '70%' }]}>{data.fundus.od.stage}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '30%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '70%' }]}>{data.fundus.os.stage}</Text>
        </View>
      </View>

      {/* 권고 사항 */}
      <Text style={styles.sectionTitle}>3. 권고 사항</Text>
      <View style={styles.bulletPoint}>
        <Text>1.</Text>
        <Text style={styles.bulletText}>혈당·혈압·지질을 목표 범위로 관리하세요.</Text>
      </View>
      <View style={styles.bulletPoint}>
        <Text>2.</Text>
        <Text style={styles.bulletText}>{data.summary.followUp} 후 안저 검사를 예약해 진행 여부를 확인하세요.</Text>
      </View>
      <View style={styles.bulletPoint}>
        <Text>3.</Text>
        <Text style={styles.bulletText}>시력 저하·비문증·광시증이 나타나면 즉시 내원하세요.</Text>
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <View style={styles.clinicInfo}>
          <Image src="/lee_eye_symbol.png" style={styles.clinicLogo} />
          <View style={styles.clinicText}>
            <Text style={{ fontWeight: 'bold' }}>이안과의원</Text>
            <Text>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</Text>
            <Text>Tel. 051-866-7592~4</Text>
          </View>
        </View>
        <View style={styles.issueDate}>
          <Text>발행일: {data.examDate}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// 고혈압망막병증 PDF
export const HypertensionReportPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>고혈압망막병증 검진 결과 안내</Text>
        <Text style={styles.subtitle}>검사일: {data.examDate}</Text>
      </View>

      {/* 요약 */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>요약</Text>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>현재 단계: {data.fundus.od.stage} / {data.fundus.os.stage}</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>혈압을 {data.summary.bloodPressureTarget} mmHg 미만으로 유지하시면 진행을 늦출 수 있습니다.</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>{data.summary.followUp} 후 안저 검사로 변화 여부를 다시 확인하세요.</Text>
        </View>
      </View>

      {/* 환자 정보 */}
      <View style={styles.patientInfo}>
        <View style={styles.patientItem}>
          <Text>환자: {data.name}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>생년월일: {data.birthDate}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>검사일: {data.examDate}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>판독의: {data.doctorName}</Text>
        </View>
      </View>

      {/* 안저 검사 */}
      <Text style={styles.sectionTitle}>1. 안저 검사</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '30%' }]}>부위</Text>
          <Text style={[styles.tableCell, { width: '70%' }]}>단계</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '30%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '70%' }]}>{data.fundus.od.stage}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '30%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '70%' }]}>{data.fundus.os.stage}</Text>
        </View>
      </View>

      {/* 시력 & 안압 */}
      <Text style={styles.sectionTitle}>2. 시력 & 안압</Text>
      
      {/* 시력 테이블 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '20%' }]}>시력</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>나안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>교정</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '20%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.od.naked}</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.od.corrected}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '20%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.os.naked}</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.os.corrected}</Text>
        </View>
      </View>

      {/* 안압 테이블 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '50%' }]}>안압 (mmHg)</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>결과</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '50%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>{data.iop.od}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '50%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>{data.iop.os}</Text>
        </View>
      </View>

      {/* 권고 사항 */}
      <Text style={styles.sectionTitle}>3. 권고 사항</Text>
      <View style={styles.bulletPoint}>
        <Text>1.</Text>
        <Text style={styles.bulletText}>혈압을 꾸준히 관리해 {data.summary.bloodPressureTarget} mmHg 미만을 유지하세요.</Text>
      </View>
      <View style={styles.bulletPoint}>
        <Text>2.</Text>
        <Text style={styles.bulletText}>{data.summary.followUp} 후 안저 검사를 예약해 변화 여부를 확인하세요.</Text>
      </View>
      <View style={styles.bulletPoint}>
        <Text>3.</Text>
        <Text style={styles.bulletText}>시력 변화·점이나 번쩍임이 느껴지면 바로 내원하세요.</Text>
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <View style={styles.clinicInfo}>
          <Image src="/lee_eye_symbol.png" style={styles.clinicLogo} />
          <View style={styles.clinicText}>
            <Text style={{ fontWeight: 'bold' }}>이안과의원</Text>
            <Text>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</Text>
            <Text>Tel. 051-866-7592~4</Text>
          </View>
        </View>
        <View style={styles.issueDate}>
          <Text>발행일: {data.examDate}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// 종합검사 PDF
export const ComprehensiveReportPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>눈종합검사 결과 안내서</Text>
        <Text style={styles.subtitle}>검사일: {data.examDate}</Text>
      </View>

      {/* 요약 */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>요약</Text>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>{data.summary.riskLevel} — 전반적 상태 양호</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>주요 이상: {data.summary.mainFindings}</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text>•</Text>
          <Text style={styles.bulletText}>{data.summary.followUp} 후 간단한 시력·안압·안저 검사 권장</Text>
        </View>
      </View>

      {/* 환자 정보 */}
      <View style={styles.patientInfo}>
        <View style={styles.patientItem}>
          <Text>환자: {data.name}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>생년월일: {data.birthDate}</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>검사기관: 이안과의원</Text>
        </View>
        <View style={styles.patientItem}>
          <Text>판독의: {data.doctorName}</Text>
        </View>
      </View>

      {/* 시력 & 안압 */}
      <Text style={styles.sectionTitle}>1. 시력 & 안압</Text>
      
      {/* 시력 테이블 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '20%' }]}>시력</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>나안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>교정</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '20%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.od.naked}</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.od.corrected}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '20%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.os.naked}</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>{data.vision.os.corrected}</Text>
        </View>
      </View>

      {/* 안압 테이블 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '50%' }]}>안압 (mmHg)</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>결과</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '50%' }]}>우안</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>{data.iop.od}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '50%' }]}>좌안</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>{data.iop.os}</Text>
        </View>
      </View>

      {/* 기본 검사 */}
      <Text style={styles.sectionTitle}>2. 기본 검사</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellLeft, { width: '30%', backgroundColor: '#f1f3f4' }]}>굴절</Text>
          <Text style={[styles.tableCellLeft, { width: '70%' }]}>{data.basicExam.refraction}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellLeft, { width: '30%' }]}>외안부</Text>
          <Text style={[styles.tableCellLeft, { width: '70%' }]}>{data.basicExam.externalEye}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellLeft, { width: '30%', backgroundColor: '#f1f3f4' }]}>수정체</Text>
          <Text style={[styles.tableCellLeft, { width: '70%' }]}>{data.basicExam.lens}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellLeft, { width: '30%' }]}>안저</Text>
          <Text style={[styles.tableCellLeft, { width: '70%' }]}>{data.basicExam.fundus}</Text>
        </View>
      </View>

      {/* 권고 사항 */}
      <Text style={styles.sectionTitle}>3. 권고 사항</Text>
      <View style={styles.bulletPoint}>
        <Text>1.</Text>
        <Text style={styles.bulletText}>인공눈물 하루 4회 — 건성안 증상 지속 시 유지</Text>
      </View>
      <View style={styles.bulletPoint}>
        <Text>2.</Text>
        <Text style={styles.bulletText}>{data.summary.followUp} 후 간단한 시력·안압·안저 검사 권장</Text>
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <View style={styles.clinicInfo}>
          <Image src="/lee_eye_symbol.png" style={styles.clinicLogo} />
          <View style={styles.clinicText}>
            <Text style={{ fontWeight: 'bold' }}>이안과의원</Text>
            <Text>부산광역시 연제구 반송로 30, 석산빌딩 5~8층</Text>
            <Text>Tel. 051-866-7592~4</Text>
          </View>
        </View>
        <View style={styles.issueDate}>
          <Text>발행일: {data.examDate}</Text>
        </View>
      </View>
    </Page>
  </Document>
); 