import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertSportsClassesToJSON() {
  try {
    // CSV 파일 읽기
    const csvFilePath = path.join(__dirname, '..', 'public', 'data', '스포츠강좌.csv');
    const csvData = await fs.readFile(csvFilePath, 'utf-8');

    // CSV 파싱
    const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    // 데이터 가공
    const sportsClasses = parsedData.data.map((row, index) => ({
      id: index.toString(),
      region: row['시도명'] || '정보 없음',
      city: row['시군구명'] || '정보 없음',
      facilityName: row['시설명'] || '정보 없음',
      phone: row['대표자전화번호'] || '정보 없음',
      address: row['시설주소'] || '정보 없음',
      detailAddress: row['상세주소'] || '정보 없음',
      sportName: row['종목명'] || '정보 없음',
      longitude: parseFloat(row['longitude']) || null,
      latitude: parseFloat(row['latitude']) || null,
      isDisabilityFriendly: row['disabilityfriendly'].toLowerCase() === 'true'
    }));

    // 고유한 지역과 도시 추출
    const uniqueRegions = [...new Set(sportsClasses.map(cls => cls.region))];
    const uniqueCities = [...new Set(sportsClasses.map(cls => cls.city))];

    // 결과 객체 생성
    const result = {
      sportsClasses,
      uniqueRegions,
      uniqueCities
    };

    // JSON 파일로 저장
    const outputPath = path.join(__dirname, '..', 'public', 'data', 'preprocessed_sports_classes.json');
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
    console.log(`Data preprocessing completed. Results saved to ${outputPath}`);
  } catch (error) {
    console.error('Error during data preprocessing:', error);
  }
}

convertSportsClassesToJSON();