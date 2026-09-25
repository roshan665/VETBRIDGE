import { useId } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { chartColors, coverageColors, diseaseTrendSeries, riskColors } from '@/lib/status'
import type { HealthCoveragePoint, MonthlyTrendPoint, RiskSlice, TrendPoint } from '@/types'

/* ------------------------------- Shared bits ----------------------------- */

interface TooltipItem {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipItem[]
  label?: string | number
  unit?: string
}

/** Tooltip used by every chart so styling stays consistent. */
function ChartTooltip({ active, payload, label, unit = '' }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-raised">
      {label !== undefined ? <p className="text-xs font-semibold text-ink">{String(label)}</p> : null}
      <ul className="mt-1 space-y-1">
        {payload.map((item) => (
          <li
            key={String(item.dataKey ?? item.name)}
            className="flex items-center gap-2 text-xs text-ink-soft"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color ?? chartColors.neutral }}
            />
            <span className="font-medium text-ink">{item.name}</span>
            <span className="nums ml-auto">
              {item.value}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const axisTick = { fill: chartColors.axis, fontSize: 12 }

/* --------------------------- Herd health over time ----------------------- */

export interface DiseaseRiskChartProps {
  data: TrendPoint[]
  variant?: 'area' | 'line'
  height?: number
  showLegend?: boolean
}

/**
 * Healthy / At risk / Critical composition over the last 7 days.
 * Used by the farmer and veterinarian dashboards.
 */
export function DiseaseRiskChart({
  data,
  variant = 'area',
  height = 300,
  showLegend = true,
}: DiseaseRiskChartProps) {
  const uid = useId().replace(/[:]/g, '')
  const series = [
    { key: 'healthy', name: 'Healthy', color: chartColors.healthy },
    { key: 'atRisk', name: 'At Risk', color: chartColors.atRisk },
    { key: 'critical', name: 'Critical', color: chartColors.critical },
  ] as const

  if (variant === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} width={44} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          {showLegend ? (
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
          ) : null}
          {series.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stroke={item.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <defs>
          {series.map((item) => (
            <linearGradient key={item.key} id={`${uid}-${item.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={item.color} stopOpacity={0.26} />
              <stop offset="95%" stopColor={item.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={44} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} />
        {showLegend ? (
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
        ) : null}
        {series.map((item) => (
          <Area
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.name}
            stroke={item.color}
            strokeWidth={2}
            fill={`url(#${uid}-${item.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ------------------------- Disease risk distribution --------------------- */

export interface RiskDistributionChartProps {
  data: RiskSlice[]
  height?: number
}

/** Donut chart of Low / Medium / High risk animals with a numeric legend. */
export function RiskDistributionChart({ data, height = 240 }: RiskDistributionChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <div className="relative w-full shrink-0 sm:w-1/2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((slice) => (
                <Cell key={slice.name} fill={riskColors[slice.level]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="nums text-2xl font-semibold text-ink">{total}</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">
            animals
          </span>
        </div>
      </div>

      <ul className="w-full space-y-3 sm:w-1/2">
        {data.map((slice) => {
          const share = total > 0 ? Math.round((slice.value / total) * 100) : 0
          return (
            <li key={slice.name} className="flex items-center gap-3">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: riskColors[slice.level] }}
              />
              <span className="text-sm text-ink-soft">{slice.name}</span>
              <span className="nums ml-auto text-sm font-semibold text-ink">{slice.value}</span>
              <span className="nums w-10 text-right text-xs text-ink-muted">{share}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------ Disease trends --------------------------- */

export interface DiseaseTrendChartProps {
  data: MonthlyTrendPoint[]
  height?: number
}

/** 12-month multi-disease trend used by the government dashboards. */
export function DiseaseTrendChart({ data, height = 320 }: DiseaseTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={44} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
        {diseaseTrendSeries.map((series) => (
          <Line
            key={series.key}
            type="monotone"
            dataKey={series.key}
            name={series.name}
            stroke={series.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/* --------------------------------- Coverage ------------------------------ */

export interface CoverageBarChartProps {
  data: HealthCoveragePoint[]
  height?: number
}

/** District-wise vaccination / health coverage as horizontal bars. */
export function CoverageBarChart({ data, height = 320 }: CoverageBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          unit="%"
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          width={96}
        />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Bar
          dataKey="value"
          name="Coverage"
          fill={chartColors.healthy}
          radius={[0, 6, 6, 0]}
          barSize={14}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export interface HealthCoverageChartProps {
  data: HealthCoveragePoint[]
  height?: number
}

/** Donut for the state-wide livestock health coverage split. */
export function HealthCoverageChart({ data, height = 240 }: HealthCoverageChartProps) {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <div className="relative w-full shrink-0 sm:w-1/2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((slice, index) => (
                <Cell key={slice.name} fill={coverageColors[index % coverageColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip unit="%" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full space-y-3 sm:w-1/2">
        {data.map((slice, index) => (
          <li key={slice.name} className="flex items-center gap-3">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: coverageColors[index % coverageColors.length] }}
            />
            <span className="text-sm text-ink-soft">{slice.name}</span>
            <span className="nums ml-auto text-sm font-semibold text-ink">{slice.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DiseaseRiskChart


