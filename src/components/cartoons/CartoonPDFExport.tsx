// 안과 만화 PDF 생성 컴포넌트
import React from 'react';
import { Document, Page, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cartoon } from '@/types/cartoon';

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  imagesContainer: {
    flex: 1,
  },
  singleImageWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  singleImage: {
    maxWidth: '100%',
    maxHeight: 700,
    objectFit: 'contain',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  gridImage: {
    width: '48%',
    height: 280,
    objectFit: 'contain',
    marginBottom: 10,
  },
});

interface CartoonPDFDocumentProps {
  cartoon: Cartoon;
  layout?: 'single' | 'grid';
}

export const CartoonPDFDocument = ({ cartoon, layout = 'single' }: CartoonPDFDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 이미지만 표시 - 한글 폰트 문제 회피 */}
        <View style={styles.imagesContainer}>
          {layout === 'grid' ? (
            <View style={styles.gridContainer}>
              {cartoon.images.map((image) => (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image
                  key={image.id}
                  src={image.url}
                  style={styles.gridImage}
                />
              ))}
            </View>
          ) : (
            cartoon.images.map((image) => (
              <View key={image.id} style={styles.singleImageWrapper}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                  src={image.url}
                  style={styles.singleImage}
                />
              </View>
            ))
          )}
        </View>
      </Page>
    </Document>
  );
};