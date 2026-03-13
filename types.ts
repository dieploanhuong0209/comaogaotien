export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum QualityLevel {
  Simple = 'Simple',
  Standard = 'Standard',
  HighQuality = 'High Quality',
  Special = 'Special',
}

export interface RateCardItem {
  id: string;
  name: string;
  category: string;
  // Prices are structured: [QualityLevel][Grade] -> number
  prices: {
    [key in QualityLevel]?: {
      [key in Grade]?: number;
    };
  };
  unit?: string;
  note?: string;
}

export interface LineItem {
  id: string; // Unique ID for the row in the invoice
  rateCardId: string;
  inputName: string; // The user's specific task description
  name: string; // The mapped standard format name
  category: string;
  quality: QualityLevel;
  grade: Grade;
  quantity: number;
  percentage: number; // Share percentage (1-100)
  isOT: boolean;      // Overtime flag (x1.5)
  unitPrice: number;
  total: number;
}

export interface CategoryGroup {
  name: string;
  items: RateCardItem[];
}