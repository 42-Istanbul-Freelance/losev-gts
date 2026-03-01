"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

interface CityChartData {
  name: string
  value: number
}

interface CityChartsProps {
  data: CityChartData[]
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#14b8a6']

export function CityCharts({ data }: CityChartsProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
        Yeterli veri bulunmuyor.
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
          <XAxis type="number" tick={{fontSize: 12}} hide />
          <YAxis dataKey="name" type="category" tick={{fontSize: 12}} axisLine={false} tickLine={false} width={80} />
          <Tooltip 
            formatter={(value: any) => [`${value} Saat`, 'Toplam Gönüllülük']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{fill: '#f3f4f6'}}
          />
          <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
