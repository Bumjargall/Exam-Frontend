import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  Area, 
  AreaChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ChartType = 'bar' | 'line' | 'area';

type ChartProps = {
  data: any[];
  title: string;
  description?: string;
  xAxisKey: string;
  yAxisKey: string;
  loading?: boolean;
  height?: number;
};

export default function AdvancedChart({ 
  data, 
  title, 
  description, 
  xAxisKey, 
  yAxisKey, 
  loading = false, 
  height = 300 
}: ChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState(data);
  
  useEffect(() => {
    setChartData(data);
  }, [data]);
  
  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-gray-400">Өгөгдөл ачааллаж байна...</div>
        </div>
      );
    }
    
    if (chartData.length === 0) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-gray-400">Өгөгдөл олдсонгүй</div>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxisKey} fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={yAxisKey} stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Диаграмын төрөл" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Багана</SelectItem>
            <SelectItem value="line">Шугаман</SelectItem>
            <SelectItem value="area">Талбай</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}