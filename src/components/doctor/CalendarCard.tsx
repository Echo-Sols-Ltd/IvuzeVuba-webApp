"use client"

import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

const CalendarCard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 w-[380px]">
      <h2 className="font-semibold text-lg text-gray-900 mb-4">Calendar</h2>
      
      <Calendar 
        mode="single" 
        selected={date} 
        onSelect={setDate} 
        className="rounded-xl border-0 shadow-none w-full" 
      />      
    </div>
  )
} 

export default CalendarCard
