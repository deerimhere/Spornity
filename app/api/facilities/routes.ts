import { NextResponse } from 'next/server';
import { CSV_URLS } from '../config/urls';
import { fetchCSV } from '../utils/csv';
import type { Facility } from '@/app/types';

export async function GET() {
  try {
    const facilities = await fetchCSV(CSV_URLS.SPORTS_FACILITIES);

    const mappedFacilities = facilities.map((row: any, index: number) => ({
      id: index,
      name: row['시설명'] || '정보 없음',
      type: row['시설유형'] || '정보 없음',
      address: row['주소'] || '정보 없음',
      phone: row['전화번호'] || '정보 없음',
      agencyPhone: row['관리기관전화번호'] || '정보 없음',
      disabilityFriendly: row['장애인편의시설여부'] || '정보 없음',
      big: row['대분류'] || '정보 없음',
      normal: row['중분류'] || '정보 없음',
      small: row['소분류'] || '정보 없음',
    }));

    return NextResponse.json(mappedFacilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 });
  }
}