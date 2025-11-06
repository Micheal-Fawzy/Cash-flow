import React from 'react';
import type { View } from '../App.tsx';
import { MONTHS } from '../constants.ts';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ArrowLeftIcon: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ArrowRightIcon: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);


export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, selectedDate, onDateChange }) => {
  const handleMonthChange = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    onDateChange(newDate);
  };

  const handleYearChange = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + increment);
    onDateChange(newDate);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">لوحة تحكم التدفق النقدي</h1>
        
        {(currentView === 'daily' || currentView === 'monthly') && (
            <div className="flex items-center gap-2 sm:gap-4 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <div className="flex items-center gap-1">
                <button onClick={() => handleYearChange(-1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><ArrowRightIcon className="w-5 h-5" /></button>
                <span className="font-semibold w-12 text-center">{selectedDate.getFullYear()}</span>
                <button onClick={() => handleYearChange(1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><ArrowLeftIcon className="w-5 h-5" /></button>
              </div>
              {currentView === 'daily' && (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><ArrowRightIcon className="w-5 h-5" /></button>
                  <span className="font-semibold w-20 text-center">{MONTHS[selectedDate.getMonth()]}</span>
                  <button onClick={() => handleMonthChange(1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><ArrowLeftIcon className="w-5 h-5" /></button>
                </div>
              )}
            </div>
        )}

        <div className="flex items-center gap-4">
          <nav className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setCurrentView('daily')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                currentView === 'daily' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              العرض اليومي
            </button>
            <button
              onClick={() => setCurrentView('monthly')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                currentView === 'monthly' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              الملخص الشهري
            </button>
            <button
              onClick={() => setCurrentView('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                currentView === 'all' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              سجل المعاملات
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};