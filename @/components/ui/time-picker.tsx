import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Clock } from "lucide-react"
import { cn } from "../../../src/lib/utils"

const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-[#00786f33] bg-background px-3 py-2 text-sm",
      "focus:outline-none focus:ring-2 focus:ring-[#00786f] hover:border-[#00786f99]",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-60" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-72 min-w-[6rem] overflow-hidden rounded-md border bg-white text-sm shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 outline-none",
      "focus:bg-[#00786f] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <div className="h-2 w-2 rounded-full bg-[#00786f]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

interface TimePickerProps {
  value?: string // "HH:mm"
  onChange?: (value: string) => void
  placeholder?: string
}

export function TimePicker({ value, onChange, placeholder = "Select time" }: TimePickerProps) {
  const [hour, setHour] = React.useState(value ? value.split(":")[0] : "")
  const [minute, setMinute] = React.useState(value ? value.split(":")[1] : "")

  // Keep internal state in sync if parent changes value
  React.useEffect(() => {
    if (!value) return
    const [h, m] = value.split(":")
    setHour(h ?? "")
    setMinute(m ?? "")
  }, [value])

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const emit = (h?: string, m?: string) => {
    const hh = h ?? hour
    const mm = m ?? minute
    if (hh !== "" && mm !== "") {
      onChange?.(`${hh}:${mm}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-[#00786f]" />
      <div className="flex items-center gap-1">
        {/* Hour (00–23) */}
        <Select
          value={hour}
          onValueChange={(v) => {
            setHour(v)
            emit(v, undefined)
          }}
        >
          <SelectTrigger className="w-16 h-9 text-sm">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h} className="justify-center">
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="px-1 text-[#00786f] font-semibold">:</span>

        {/* Minute (00–59) */}
        <Select
          value={minute}
          onValueChange={(v) => {
            setMinute(v)
            emit(undefined, v)
          }}
        >
          <SelectTrigger className="w-16 h-9 text-sm">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m} className="justify-center">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}