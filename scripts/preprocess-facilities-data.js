import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

async function preprocessFacilityData() {
  try {
    // CSV 파일 읽기
    const facilitiesCsv = await fs.readFile(path.join('C:', 'Users', 'jm010', 'sports', 'Spornity', 'public', 'data', 'sports-facilities.csv'), 'utf-8');

    // CSV 파싱
    const facilitiesResults = Papa.parse(facilitiesCsv, { header: true, skipEmptyLines: true });

    // 데이터 가공
    const facilities = facilitiesResults.data.map((row, index) => ({
      id: index.toString(),
      name: row.name || '정보 없음',
      type: row.type || '정보 없음',
      address: row.address || '정보 없음',
      phone: row.phone || '정보 없음',
      agencyPhone: row.agencyPhone || '정보 없음',
      disabilityFriendly: row.disabilityFriendly || '정보 없음',
      big: row.big || '정보 없음',
      normal: row.normal || ' ',
      small: row.small || ' ',
    }));

    // 고유한 지역 정보 추출
    const uniqueBig = [...new Set(facilities.map(facility => facility.big))];
    const uniqueNormal = [...new Set(facilities.map(facility => facility.normal))];
    const uniqueSmall = [...new Set(facilities.map(facility => facility.small))];

    // 결과 객체 생성
    const result = {
      facilities,
      uniqueBig,
      uniqueNormal,
      uniqueSmall,
    };

    // JSON 파일로 저장
    const outputPath = path.join('C:', 'Users', 'jm010', 'sports', 'Spornity', 'public', 'data', 'preprocessed_facilities_data.json');
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
    console.log(`Data preprocessing completed. Results saved to ${outputPath}`);
  } catch (error) {
    console.error('Error during data preprocessing:', error);
  }
}

preprocessFacilityData();