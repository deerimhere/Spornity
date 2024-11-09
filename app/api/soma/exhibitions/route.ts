import { NextResponse } from 'next/server';
import { CSV_URLS } from '../../config/urls';
import { fetchCSV } from '../../utils/csv';
import type { SomaExhibition } from '@/app/types';

export async function GET() {
  try {
    const exhibitions = await fetchCSV(CSV_URLS.SOMA_EXHIBITIONS);

    const mappedExhibitions = exhibitions.map((row: any, index: number) => ({
      id: index,
      gallery: row['관'] || '정보 없음',
      title: row['전시명'] || '정보 없음',
      startDate: row['시작일'] || '정보 없음',
      endDate: row['종료일'] || '정보 없음',
      status: row['상태'] || '정보 없음',
      location: row['장소'] || '정보 없음',
      organizer: row['주최/주관'] || '정보 없음',
      artists: row['참여작가'] || '정보 없음',
      type: row['전시유형'] || '정보 없음',
      hours: row['관람시간'] || '정보 없음',
      admission: row['관람료'] || '정보 없음',
      posterUrl: row['포스터URL'] || '',
      posterFileName: row['포스터파일명'] || '정보 없음',
      englishTitle: row['영문전시명'] || '정보 없음',
    }));

    return NextResponse.json(mappedExhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json({ error: 'Failed to fetch exhibitions' }, { status: 500 });
  }
}