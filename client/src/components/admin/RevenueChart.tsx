import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useGetDashboardRevenue } from '@/hooks/admin/useGetRevenue';


const RevenueChart = () => {
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { data, loading, error, refetch } = useGetDashboardRevenue(timePeriod);

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#3B82F6',
    },
  };

  const chartData = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Overview</CardTitle>
        <Select
          value={timePeriod}
          onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setTimePeriod(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-2 text-blue-500 underline hover:text-blue-700"
              onClick={refetch}
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && chartData.length === 0 && (
          <p className="text-center text-gray-500">No revenue data available</p>
        )}
        {!loading && !error && chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;