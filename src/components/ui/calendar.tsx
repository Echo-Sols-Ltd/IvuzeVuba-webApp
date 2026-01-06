"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white border border-gray-200 rounded-xl shadow-lg p-4 [--cell-size:2.5rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "long" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none hover:bg-blue-50 hover:border-blue-200 transition-colors",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none hover:bg-blue-50 hover:border-blue-200 transition-colors",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) mb-2",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-base font-semibold justify-center h-(--cell-size) gap-2",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-blue-500 border border-gray-200 shadow-sm has-focus:ring-blue-500/20 has-focus:ring-2 rounded-lg bg-white",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-white inset-0 opacity-0 cursor-pointer",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-semibold text-gray-900",
          captionLayout === "label"
            ? "text-base"
            : "rounded-lg pl-3 pr-2 flex items-center gap-2 text-base h-9 bg-gray-50 hover:bg-gray-100 transition-colors [&>svg]:text-gray-500 [&>svg]:size-4",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse mt-2",
        weekdays: cn("flex mb-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-500 rounded-md flex-1 font-medium text-sm select-none py-2 text-center",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size) text-gray-500 font-medium",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-sm select-none text-gray-400",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0.5 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-lg bg-blue-100",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-blue-50", defaultClassNames.range_middle),
        range_end: cn("rounded-r-lg bg-blue-100", defaultClassNames.range_end),
        today: cn(
          "bg-blue-50 text-blue-700 rounded-lg font-semibold data-[selected=true]:bg-blue-600 data-[selected=true]:text-white",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-300 aria-selected:text-gray-400",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-gray-200 opacity-30 cursor-not-allowed",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-5 text-gray-600", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-5 text-gray-600", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4 text-gray-500", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center text-gray-400 text-sm">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative w-full h-full rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200",
        "data-[selected-single=true]:bg-blue-600 data-[selected-single=true]:text-white data-[selected-single=true]:shadow-md data-[selected-single=true]:font-semibold",
        "data-[range-middle=true]:bg-blue-100 data-[range-middle=true]:text-blue-800",
        "data-[range-start=true]:bg-blue-600 data-[range-start=true]:text-white data-[range-start=true]:rounded-l-lg",
        "data-[range-end=true]:bg-blue-600 data-[range-end=true]:text-white data-[range-end=true]:rounded-r-lg",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-blue-500/50 group-data-[focused=true]/day:ring-offset-1",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300",
        "aspect-square size-auto w-full min-w-(--cell-size) flex items-center justify-center leading-none",
        "hover:scale-105 active:scale-95 transform transition-transform duration-150",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
