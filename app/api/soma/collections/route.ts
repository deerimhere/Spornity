import { NextResponse } from 'next/server';
import { CSV_URLS } from '../../config/urls';
import { fetchCSV } from '../../utils/csv';
import type { SomaCollection } from '@/app/types';

export async function GET() {
  try {
    const collections = await fetchCSV(CSV_URLS.SOMA_COLLECTIONS);

    const mappedCollections = collections.map((row: any, index: number) => ({
      id: index,
      title: row['작품명'] || '정보 없음',
      artist: row['작가명'] || '정보 없음',
      year: row['제작년도'] || '정보 없음',
      medium: row['재료'] || '정보 없음',
      size: row['크기'] || '정보 없음',
      location: row['소장처'] || '정보 없음',
      imageUrl: row['이미지URL'] || '',
    }));

    return NextResponse.json(mappedCollections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}