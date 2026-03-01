"use client"

import { ACTIVITY_TYPES } from "@/lib/constants"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"

interface ChartData {
  name: string
  value: number
}

interface HQChartsProps {
  typeData: ChartData[]
  trendData: ChartData[]
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6']

const formatTypeName = (name: string) => {
  return ACTIVITY_TYPES[name as keyof typeof ACTIVITY_TYPES] || name
}

export function HQCharts({ typeData, trendData }: HQChartsProps) {
  const formattedTypeData = typeData
    .filter(d => d.value > 0)
    .map(d => ({
      ...d,
      name: formatTypeName(d.name)
    }))

  if (typeData.length === 0 && trendData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
        Görselleştirilecek yeterli istatistik bulunamadı.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Aylık Trend Grafiği */}
      <div className="h-[350px] flex flex-col">
        <h3 className="text-sm font-bold text-gray-700 mb-6 text-center uppercase tracking-wider">Aylık Gönüllülük Trendi (Son 6 Ay)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value: any) => [`${value} Saat`, 'Toplam Gönüllülük']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dağılım Grafiği */}
      <div className="h-[350px] flex flex-col">
        <h3 className="text-sm font-bold text-gray-700 mb-6 text-center uppercase tracking-wider">Faaliyet Türü Dağılımı</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedTypeData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {formattedTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value} Saat`, 'Toplam Süre']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '13px'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
