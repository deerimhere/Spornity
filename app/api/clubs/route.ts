import { NextResponse } from 'next/server';
import { CSV_URLS } from '../config/urls';
import { fetchCSV } from '../utils/csv';
import type { Club } from '@/app/types';

export async function GET() {
  try {
    const [regularClubs, disabilityClubs] = await Promise.all([
      fetchCSV(CSV_URLS.SPORTS_CLUB),
      fetchCSV(CSV_URLS.DISABLED_SPORTS_CLUB)
    ]);

    const mappedRegularClubs = regularClubs.map((row: any, index: number) => ({
      id: index,
      name: row['동호회명'] || '정보 없음',
      sport: row['종목'] || '정보 없음',
      members: row['회원수'] || '0',
      meetingDay: row['모임요일'] || '정보 없음',
      location: row['활동장소'] || '정보 없음',
      region: row['시도명'] || '정보 없음',
      district: row['시군구명'] || '정보 없음',
      disabilityFriendly: 'No'
    }));

    const mappedDisabilityClubs = disabilityClubs.map((row: any, index: number) => ({
      id: mappedRegularClubs.length + index,
      name: row['동호회명'] || '정보 없음',
      sport: row['종목'] || '정보 없음',
      members: row['회원수'] || '0',
      meetingDay: row['모임요일'] || '정보 없음',
      location: row['활동장소'] || '정보 없음',
      region: row['시도명'] || '정보 없음',
      district: row['시군구명'] || '정보 없음',
      disabilityFriendly: 'Yes'
    }));

    return NextResponse.json([...mappedRegularClubs, ...mappedDisabilityClubs]);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 });
  }
}