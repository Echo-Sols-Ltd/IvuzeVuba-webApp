"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarCard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const renderCalendar = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const firstDay = firstDayOfMonth(currentDate);
        const today = new Date();
        const isCurrentMonth = 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear();

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-10 flex items-center justify-center"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const isToday = isCurrentMonth && day === today.getDate();
            days.push(
                <div
                    key={day}
                    className={`h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
                        isToday
                            ? "bg-blue-600 text-white font-bold"
                            : "hover:bg-gray-100"
                    }`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Calendar</CardTitle>
                    <button
                        onClick={goToToday}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Today
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h3 className="font-semibold text-lg">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="h-10 flex items-center justify-center text-sm font-medium text-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                    {renderCalendar()}
                </div>

                {/* Current Date Display */}
                <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Today</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {new Date().getDate()}
                        </p>
                        <p className="text-sm text-gray-600">
                            {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {dayNames[new Date().getDay()]}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CalendarCard;
