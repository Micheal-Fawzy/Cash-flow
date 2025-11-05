import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import { CASH_INFLOW_CATEGORIES, CASH_OUTFLOW_CATEGORIES } from '../constants';
import { EditableCell } from './EditableCell';

interface DailyViewProps {
  selectedDate: Date;
  transactions: Transaction[];
  onTransactionChange: (date: string, category: string, amount: number) => void;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const formatNumber = (num: number) => {
    if (num === 0) return "-";
    return new Intl.NumberFormat('ar-EG').format(num);
};

const calculatePeriodTotal = (data: number[], start: number, end: number) => {
    return data.slice(start, end).reduce((sum, value) => sum + value, 0);
};

export const DailyView: React.FC<DailyViewProps> = ({ selectedDate, transactions, onTransactionChange }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const transactionsMap = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach(t => {
      map.set(`${t.date}-${t.category}`, t.amount);
    });
    return map;
  }, [transactions]);

  const getTransactionValue = (day: number, category: string) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return transactionsMap.get(`${date}-${category}`) || 0;
  };
  
  const calculateDailyTotals = (day: number, categories: string[]) => {
      return categories.reduce((sum, category) => sum + getTransactionValue(day, category), 0);
  };
  
  const dailyInflows = days.map(day => calculateDailyTotals(day, CASH_INFLOW_CATEGORIES));
  const dailyOutflows = days.map(day => calculateDailyTotals(day, CASH_OUTFLOW_CATEGORIES));
  const dailyNetFlow = days.map((_, index) => dailyInflows[index] - dailyOutflows[index]);
  
  const cumulativeBalance = days.reduce<number[]>((acc, _, index) => {
      const prevBalance = index > 0 ? acc[index - 1] : 0;
      acc.push(prevBalance + dailyNetFlow[index]);
      return acc;
  }, []);

  const renderSection = (title: string, categories: string[]) => (
    <>
      <tr className="bg-teal-100 dark:bg-teal-900/50 sticky top-10 z-[2]">
        <th className="font-bold text-right p-2 whitespace-nowrap sticky right-0 bg-teal-100 dark:bg-teal-900/50 z-[3]">{title}</th>
        <td colSpan={days.length + 3} className="p-0"></td>
      </tr>
      {categories.map(category => (
        <tr key={category} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50">
          <td className="text-right p-2 pr-4 sticky right-0 bg-white dark:bg-gray-800 whitespace-nowrap z-[3]">{category}</td>
          {days.map(day => {
             const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
             return (
              <td key={day} className="p-0 text-center text-sm">
                <EditableCell
                  value={getTransactionValue(day, category)}
                  onSave={(newValue) => onTransactionChange(dateStr, category, newValue)}
                />
              </td>
            )
          })}
          {/* Summary Cells */}
          <td className="p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500">{formatNumber(calculatePeriodTotal(days.map(d => getTransactionValue(d, category)), 0, 10))}</td>
          <td className="p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500">{formatNumber(calculatePeriodTotal(days.map(d => getTransactionValue(d, category)), 10, 20))}</td>
          <td className="p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500">{formatNumber(calculatePeriodTotal(days.map(d => getTransactionValue(d, category)), 20, daysInMonth))}</td>
        </tr>
      ))}
    </>
  );

  const renderTotalsRow = (title: string, data: number[], isBold: boolean = false, isNegativeRed: boolean = false) => (
     <tr className={`
      ${isBold ? 'bg-blue-100 dark:bg-blue-900/50 font-bold' : 'bg-gray-100 dark:bg-gray-800'}
      border-b border-gray-200 dark:border-gray-700`}>
        <td className={`text-right p-2 pr-4 sticky right-0 whitespace-nowrap z-[3] ${isBold ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800'}`}>{title}</td>
        {data.map((value, index) => (
          <td key={index} className={`p-2 text-center text-sm ${isNegativeRed && value < 0 ? 'text-red-500' : ''}`}>
              {formatNumber(value)}
          </td>
        ))}
        {/* Summary Cells */}
        <td className={`p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500 ${isNegativeRed && calculatePeriodTotal(data, 0, 10) < 0 ? 'text-red-500' : ''}`}>{formatNumber(calculatePeriodTotal(data, 0, 10))}</td>
        <td className={`p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500 ${isNegativeRed && calculatePeriodTotal(data, 10, 20) < 0 ? 'text-red-500' : ''}`}>{formatNumber(calculatePeriodTotal(data, 10, 20))}</td>
        <td className={`p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500 ${isNegativeRed && calculatePeriodTotal(data, 20, daysInMonth) < 0 ? 'text-red-500' : ''}`}>{formatNumber(calculatePeriodTotal(data, 20, daysInMonth))}</td>
     </tr>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: `${200 + (daysInMonth * 112) + (3 * 120)}px` }}>
            <thead className="sticky top-0 z-[4]">
              <tr className="bg-gray-200 dark:bg-gray-700 text-sm">
                <th className="text-right p-2 sticky right-0 bg-gray-200 dark:bg-gray-700 min-w-[200px] z-[5]">البند / اليوم</th>
                {days.map(day => <th key={day} className="p-2 w-28 min-w-[112px]">{day}</th>)}
                {/* Summary Headers */}
                <th className="p-2 bg-teal-600 text-white min-w-[120px] border-l-2 border-r-2 border-teal-400 dark:border-teal-500">Q1</th>
                <th className="p-2 bg-teal-600 text-white min-w-[120px] border-l-2 border-r-2 border-teal-400 dark:border-teal-500">Q2</th>
                <th className="p-2 bg-teal-600 text-white min-w-[120px] border-l-2 border-r-2 border-teal-400 dark:border-teal-500">Q3</th>
              </tr>
            </thead>
            <tbody>
              {renderSection('التدفقات النقدية الداخلة', CASH_INFLOW_CATEGORIES)}
              {renderTotalsRow('إجمالي الإيصالات', dailyInflows, true)}
              {renderSection('التدفقات النقدية الخارجة', CASH_OUTFLOW_CATEGORIES)}
              {renderTotalsRow('إجمالي المدفوعات', dailyOutflows, true)}
              {renderTotalsRow('صافي التدفق النقدي', dailyNetFlow, false, true)}
              <tr className="bg-green-100 dark:bg-green-900/50 font-bold border-t-2 border-gray-300 dark:border-gray-600">
                <td className="text-right p-2 pr-4 sticky right-0 bg-green-100 dark:bg-green-900/50 whitespace-nowrap z-[3]">الرصيد الختامي / التراكمي</td>
                {cumulativeBalance.map((value, index) => (
                    <td key={index} className={`p-2 text-center text-sm ${value < 0 ? 'text-red-500' : 'text-green-700 dark:text-green-400'}`}>
                    {formatNumber(value)}
                    </td>
                ))}
                {/* Summary Cells */}
                <td className={`p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500 ${cumulativeBalance.length > 9 && cumulativeBalance[9] < 0 ? 'text-red-500' : 'text-green-700 dark:text-green-400'}`}>{formatNumber(cumulativeBalance[9])}</td>
                <td className={`p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500 ${cumulativeBalance.length > 19 && cumulativeBalance[19] < 0 ? 'text-red-500' : 'text-green-700 dark:text-green-400'}`}>{formatNumber(cumulativeBalance[19])}</td>
                <td className={`p-2 text-center text-sm font-semibold bg-teal-100 dark:bg-teal-900/50 border-l-2 border-r-2 border-teal-400 dark:border-teal-500 ${cumulativeBalance.length > 0 && cumulativeBalance[daysInMonth - 1] < 0 ? 'text-red-500' : 'text-green-700 dark:text-green-400'}`}>{formatNumber(cumulativeBalance[daysInMonth - 1])}</td>
              </tr>
            </tbody>
        </table>
    </div>
  );
};