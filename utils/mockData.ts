
import { DataRecord, DataSource } from "../types";

export const MOCK_SOURCES: DataSource[] = [
  {
    id: 'src-1',
    name: 'Main_Production_SQL',
    type: 'SQL_SERVER',
    status: 'CONNECTED',
    lastSync: '2023-11-20 14:30',
    recordCount: 15420
  },
  {
    id: 'src-2',
    name: 'Legacy_Sales_Access',
    type: 'MS_ACCESS',
    status: 'CONNECTED',
    lastSync: '2023-11-19 09:15',
    recordCount: 4210
  }
];

export const generateMockData = (): DataRecord[] => {
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const products = ['Enterprise Suite', 'Cloud Connect', 'Edge Gateway', 'Security Core'];
  const data: DataRecord[] = [];

  for (let i = 0; i < 100; i++) {
    const date = new Date(2023, 0, 1 + i).toISOString().split('T')[0];
    data.push({
      id: i + 1,
      date,
      region: regions[Math.floor(Math.random() * regions.length)],
      product: products[Math.floor(Math.random() * products.length)],
      sales: Math.floor(Math.random() * 5000) + 1000,
      profit: Math.floor(Math.random() * 2000) + 200,
      inventory: Math.floor(Math.random() * 1000)
    });
  }
  return data;
};
