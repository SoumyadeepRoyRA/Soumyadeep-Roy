
export type DatabaseType = 'SQL_SERVER' | 'MS_ACCESS';

export interface DataSource {
  id: string;
  name: string;
  type: DatabaseType;
  status: 'CONNECTED' | 'DISCONNECTED' | 'POLLING';
  lastSync: string;
  recordCount: number;
}

export interface DataRecord {
  id: number;
  date: string;
  region: string;
  product: string;
  sales: number;
  profit: number;
  inventory: number;
}

export interface Insight {
  title: string;
  description: string;
  type: 'TREND' | 'WARNING' | 'OPPORTUNITY';
  confidence: number;
}

export interface AnalysisResponse {
  summary: string;
  insights: Insight[];
  recommendations: string[];
  suggestedCharts: string[];
}
