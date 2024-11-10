import fs from 'fs/promises';
import Papa from 'papaparse';

async function preprocessClubData() {
  try {
    // CSV 파일 읽기
    const generalCsv = await fs.readFile('C:/Users/jm010/sports/Spornity/public/data/sports-club.csv', 'utf-8');
    const disabilityCsv = await fs.readFile('C:/Users/jm010/sports/Spornity/public/data/disabled-sports-club.csv', 'utf-8');

    // CSV 파싱
    const generalResults = Papa.parse(generalCsv, { header: true, skipEmptyLines: true });
    const disabilityResults = Papa.parse(disabilityCsv, { header: true, skipEmptyLines: true });

    // 데이터 가공
    const generalClubs = generalResults.data.map((row, index) => ({
      id: `general-${index}`,
      name: row['동호회명'] || '정보 없음',
      sport: row['종목명'] || '정보 없음',
      members: row['회원수'] || '0',
      meetingDay: '정보 없음',
      location: row['시군구명'] || '정보 없음',
      disabilityFriendly: false,
      region: row['시도명'] || '정보 없음',
      district: row['시군구명']?.replace(row['시도명'], '').trim() || '정보 없음',
    }));

    const disabilityClubs = disabilityResults.data.map((row, index) => ({
      id: `disability-${index}`,
      name: row['동호회명'] || '정보 없음',
      sport: row['종목명'] || '정보 없음',
      members: '정보 없음',
      meetingDay: row['운영시간내용'] || '정보 없음',
      location: row['시군구명'] || '정보 없음',
      disabilityFriendly: true,
      region: row['시도명'] || '정보 없음',
      district: row['시군구명']?.replace(row['시도명'], '').trim() || '정보 없음',
      disabilityType: row['장애유형명'] || '정보 없음',
      introduction: row['동호회 소개내용'] || '정보 없음',
    }));

    const allClubs = [...generalClubs, ...disabilityClubs];

    // 고유한 지역과 구 추출
    const uniqueRegions = [...new Set(allClubs.map(club => club.region))];
    const uniqueDistricts = [...new Set(allClubs.map(club => club.district))];

    // 결과 객체 생성
    const result = {
      clubs: allClubs,
      uniqueRegions,
      uniqueDistricts,
    };

    // JSON 파일로 저장
    await fs.writeFile('C:/Users/jm010/sports/Spornity/public/data/preprocessed_club_data.json', JSON.stringify(result, null, 2));
    console.log('Data preprocessing completed. Results saved to C:/Users/jm010/sports/Spornity/public/data/preprocessed_club_data.json');
  } catch (error) {
    console.error('Error during data preprocessing:', error);
  }
}

preprocessClubData();