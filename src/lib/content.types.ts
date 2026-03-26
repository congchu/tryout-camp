export interface DailyMission {
  day: number;
  title: string;
  mission: string;
  duration: string;
  tips?: string[];
  deliverable?: string;
}

export interface Challenge {
  title: string;
  description: string;
  days: number;
  difficulty?: string;
  goal?: string;
  dailyMissions?: DailyMission[];
}

export interface WorkbookMeta {
  title: string;
  slug: string;
  description: string;
  image?: string;
  published: boolean;
  createdAt: string;
  challenge?: Challenge;
}

export interface Workbook extends WorkbookMeta {
  // 추가 데이터가 필요하면 여기에
}
