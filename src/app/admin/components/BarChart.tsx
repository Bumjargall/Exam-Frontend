import { useState, useEffect } from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ChartDataProps = {
  data: { week: string; count: number }[];
  loading?: boolean;
};

export default function BarChart({ data, loading = false }: ChartDataProps) {
  const [chartData, setChartData] = useState(data);
  
  useEffect(() => {
    setChartData(data);
  }, [data]);
  
  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-400">Өгөгдөл ачааллаж байна...</div>
      </div>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-400">Өгөгдөл олдсонгүй</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-gray-700">7 хоногийн шалгалтын тоо</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Шалгалтын тоо" fill="#8884d8" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}