import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"

type CalendarProps = {
  selected?: Date | null
  onSelect?: (date: Date) => void
  className?: string
}

function monthName(year: number, month: number) {
  return new Date(year, month, 1).toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  })
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const initial = selected ?? new Date()
  const [viewYear, setViewYear] = React.useState<number>(initial.getFullYear())
  const [viewMonth, setViewMonth] = React.useState<number>(initial.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayIdx = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun

  // Build 6 rows x 7 cols = 42 cells; hide outside days by leaving blanks
  const cells: (number | null)[] = Array(42).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells[firstDayIdx + d - 1] = d
  }

  const isSelected = (d: number) => {
    if (!selected) return false
    return (
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === d
    )
  }

  const handlePrev = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }
  const handleNext = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className={cn("w-[360px] p-3", className)}>
      <div className="relative flex items-center justify-center py-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={handlePrev}
          className="absolute left-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#00786f]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-base font-semibold">{monthName(viewYear, viewMonth)}</div>
        <button
          type="button"
          aria-label="Next month"
          onClick={handleNext}
          className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#00786f]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-2">
        {weekdays.map((wd) => (
          <div key={wd} className="text-center text-slate-500 font-medium text-sm py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-2">
        {cells.map((d, i) =>
          d === null ? (
            <div key={i} className="h-9 w-9 mx-auto" aria-hidden="true" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => {
                const picked = new Date(viewYear, viewMonth, d)
                onSelect?.(picked)
              }}
              className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-md text-sm",
                "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:ring-offset-2",
                isSelected(d) && "bg-[#00786f] text-white hover:bg-[#00786f]"
              )}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  )
}
