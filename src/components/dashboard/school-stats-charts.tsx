"use client"

import { ACTIVITY_TYPES } from "@/lib/constants"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface ChartData {
  name: string
  value: number
}

interface SchoolStatsChartsProps {
  typeData: ChartData[]
  gradeData: ChartData[]
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6']

const formatTypeName = (name: string) => {
  return ACTIVITY_TYPES[name as keyof typeof ACTIVITY_TYPES] || name
}

export function SchoolStatsCharts({ typeData, gradeData }: SchoolStatsChartsProps) {
  // Veriyi formatla (Tür isimlerini Türkçeleştir)
  const formattedTypeData = typeData.map(d => ({
    ...d,
    name: formatTypeName(d.name)
  }))

  const sortedGradeData = [...gradeData].sort((a, b) => parseInt(a.name) - parseInt(b.name))

  if (typeData.length === 0 && gradeData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
        Yeterli veri bulunmuyor.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[350px]">
      <div className="h-full flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Faaliyet Türlerine Göre Dağılım (Saat)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {formattedTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value} Saat`, 'Süre']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '12px'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-full flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Sınıflara Göre Gönüllülük (Saat)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedGradeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value: any) => [`${value} Saat`, 'Süre']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: '#f3f4f6'}}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
              {sortedGradeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
