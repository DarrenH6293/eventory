'use client';

import { useState } from 'react';

const getToday = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    date: now.getDate(),
  };
};

const generateCalendarDays = (year: number, month: number) => {
  const days: (Date | null)[] = [];
  const firstDay = new Date(year, month, 1);
  const firstDayWeekday = firstDay.getDay();
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  for (let i = 0; i < firstDayWeekday; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));

  return days;
};

export default function EventsPage() {
  const today = getToday();
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');
  const [year, setYear] = useState<number>(today.year);
  const [month, setMonth] = useState<number>(today.month);

  const calendarDays = generateCalendarDays(year, month);
  const isCurrentMonth = year === today.year && month === today.month;

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(year, month + offset);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth());
  };

  const monthLabel = new Date(year, month).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {view === 'calendar' ? 'Event Calendar' : 'Event Timeline'}
        </h1>
        <button
          onClick={() => setView(view === 'calendar' ? 'timeline' : 'calendar')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Switch to {view === 'calendar' ? 'Timeline' : 'Calendar'}
        </button>
      </div>

      {view === 'calendar' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              className="px-3 py-1 bg-blue-400 rounded hover:bg-blue-500"
            >
              &larr; Prev
            </button>
            <div className="text-xl font-semibold">{monthLabel}</div>
            <button
              onClick={() => handleMonthChange(1)}
              className="px-3 py-1 bg-blue-400 rounded hover:bg-blue-500"
            >
              Next &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 border-t pt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-center">{day}</div>
            ))}
            {calendarDays.map((day, idx) => {
              const isToday =
                day &&
                isCurrentMonth &&
                day.getDate() === today.date;

              return (
                <div
                  key={idx}
                  className={`h-24 border rounded p-2 text-sm ${
                    isToday ? 'bg-blue-100 border-blue-500' : 'bg-grey'
                  }`}
                >
                  <div className={`font-semibold ${isToday ? 'text-blue-700' : ''}`}>
                    {day ? day.getDate() : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <ul className="space-y-4 mt-4">
          {[...Array(5)].map((_, i) => {
            const futureDate = new Date();
            futureDate.setDate(today.date + i);
            const formattedDate = futureDate.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <li key={i} className="border-l-4 border-blue-600 pl-4">
                <div className="text-lg font-medium">Event #{i + 1}</div>
                <div className="text-gray-500">{formattedDate}</div>
                <div className="text-gray-700 mt-1">Details about event #{i + 1}.</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
