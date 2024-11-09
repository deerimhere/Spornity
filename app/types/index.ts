export interface Program {
    id: number;
    facilityName: string;
    facilityType: string;
    region: string;
    city: string;
    address: string;
    phone: string;
    programName: string;
    targetAudience: string;
    startDate: string;
    endDate: string;
    days: string;
    time: string;
    capacity: string;
    price: string;
    priceType: string | null;
    website: string;
    isDisabilityProgram: boolean;
    sportName?: string;
    subSportName?: string;
    disabilityType?: string;
    programIntroduction?: string;
    recruitmentStartDate?: string;
    recruitmentEndDate?: string;
  }
  
  export interface Club {
    id: number;
    name: string;
    sport: string;
    members: string;
    meetingDay: string;
    location: string;
    region: string;
    district: string;
    disabilityFriendly: string;
  }
  
  export interface Facility {
    id: number;
    name: string;
    type: string;
    address: string;
    phone: string;
    agencyPhone: string;
    disabilityFriendly: string;
    big: string;
    normal: string;
    small: string;
  }
  
  export interface SomaExhibition {
    id: number;
    gallery: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
    location: string;
    organizer: string;
    artists: string;
    type: string;
    hours: string;
    admission: string;
    posterUrl: string;
    posterFileName: string;
    englishTitle: string;
  }
  
  export interface SomaEducationProgram {
    id: number;
    title: string;
    type: string;
    target: string;
    status: string;
    startDate: string;
    endDate: string;
    time: string;
    location: string;
    capacity: string;
    fee: string;
  }
  
  export interface SomaCollection {
    id: number;
    title: string;
    artist: string;
    year: string;
    medium: string;
    size: string;
    location: string;
    imageUrl: string;
  }