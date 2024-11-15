import fs from 'fs/promises';
import Papa from 'papaparse';
import { format, parseISO } from 'date-fns';

async function preprocessSomaData() {
  try {
    // CSV 파일 읽기
    const collectionsCsv = await fs.readFile('./public/data/soma-collections.csv', 'utf-8');
    const educationProgramsCsv = await fs.readFile('./public/data/soma-education-programs.csv', 'utf-8');
    const exhibitionsCsv = await fs.readFile('./public/data/soma-exhibitions.csv', 'utf-8');

    // CSV 파싱
    const collections = Papa.parse(collectionsCsv, { header: true, skipEmptyLines: true }).data;
    const educationPrograms = Papa.parse(educationProgramsCsv, { header: true, skipEmptyLines: true }).data;
    const exhibitions = Papa.parse(exhibitionsCsv, { header: true, skipEmptyLines: true }).data;

    // 데이터 가공
    const processedCollections = collections.map((collection, index) => ({
      id: `collection-${index}`,
      ...collection
    }));

    const processedEducationPrograms = educationPrograms.map((program, index) => ({
      id: `program-${index}`,
      ...program,
      교육시작일자: format(parseISO(program.교육시작일자), 'yyyy-MM-dd'),
      교육종료일자: format(parseISO(program.교육종료일자), 'yyyy-MM-dd'),
      교육대상전처리: program.교육대상명.split(',')[0].trim()
    }));

    const currentDate = new Date();
    const processedExhibitions = exhibitions.map((exhibition, index) => ({
      id: `exhibition-${index}`,
      ...exhibition,
      전시시작일자: format(parseISO(exhibition.전시시작일자), 'yyyy-MM-dd'),
      전시종료일자: format(parseISO(exhibition.전시종료일자), 'yyyy-MM-dd'),
      status: 
        parseISO(exhibition.전시종료일자) < currentDate ? '종료' :
        parseISO(exhibition.전시시작일자) > currentDate ? '예정' : '진행중'
    }));

    // 필터 옵션 추출
    const filterOptions = {
      교육종류: ['전체', ...new Set(processedEducationPrograms.map(p => p.교육종류명))],
      교육대상: ['전체', ...new Set(processedEducationPrograms.map(p => p.교육대상전처리))],
      접수상태: ['전체', ...new Set(processedEducationPrograms.map(p => p.접수상태))]
    };

    // 결과 객체 생성
    const result = {
      collections: processedCollections,
      educationPrograms: processedEducationPrograms,
      exhibitions: processedExhibitions,
      filterOptions
    };

    // JSON 파일로 저장
    await fs.writeFile('./public/data/preprocessed_soma_data.json', JSON.stringify(result, null, 2));
    console.log('Data preprocessing completed. Results saved to public/data/preprocessed_soma_data.json');
  } catch (error) {
    console.error('Error during data preprocessing:', error);
  }
}

preprocessSomaData();