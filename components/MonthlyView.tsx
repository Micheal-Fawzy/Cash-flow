import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Transaction } from '../types.ts';
import { MONTHS, CASH_INFLOW_CATEGORIES } from '../constants.ts';

interface MonthlyViewProps {
  selectedYear: number;
  transactions: Transaction[];
}

interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
}

const formatCurrency = (value: number) => {
  if (value === 0) return "0";
  return new Intl.NumberFormat('ar-EG', { notation: 'compact', compactDisplay: 'short' }).format(value);
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-EG').format(num);
};

export const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedYear, transactions }) => {
  const monthlyData = useMemo<MonthlySummary[]>(() => {
    const data: MonthlySummary[] = MONTHS.map(monthName => ({
      month: monthName,
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
    }));

    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (transactionDate.getFullYear() === selectedYear) {
        const monthIndex = transactionDate.getMonth();
        if (CASH_INFLOW_CATEGORIES.includes(t.category)) {
          data[monthIndex].totalIncome += t.amount;
        } else {
          data[monthIndex].totalExpenses += t.amount;
        }
      }
    });

    data.forEach(month => {
      month.netCashFlow = month.totalIncome - month.totalExpenses;
    });

    return data;
  }, [selectedYear, transactions]);
  
  const hasData = useMemo(() => monthlyData.some(d => d.totalIncome > 0 || d.totalExpenses > 0), [monthlyData]);

  const totals = useMemo(() => {
    return monthlyData.reduce(
      (acc, month) => {
        acc.totalIncome += month.totalIncome;
        acc.totalExpenses += month.totalExpenses;
        acc.netCashFlow += month.netCashFlow;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, netCashFlow: 0 }
    );
  }, [monthlyData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Summary Table */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400">ملخص حسب الشهر لعام {selectedYear}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">الشهر</th>
                <th className="px-6 py-3">إجمالي الدخل</th>
                <th className="px-6 py-3">إجمالي المصروفات</th>
                <th className="px-6 py-3">صافي التدفق</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(data => (
                <tr key={data.month} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{data.month}</td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400">{formatNumber(data.totalIncome)}</td>
                  <td className="px-6 py-4 text-red-600 dark:text-red-400">{formatNumber(data.totalExpenses)}</td>
                  <td className={`px-6 py-4 font-semibold ${data.netCashFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500'}`}>{formatNumber(data.netCashFlow)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold bg-gray-100 dark:bg-gray-700">
              <tr>
                <td className="px-6 py-3">الإجمالي</td>
                <td className="px-6 py-3 text-green-700 dark:text-green-300">{formatNumber(totals.totalIncome)}</td>
                <td className="px-6 py-3 text-red-700 dark:text-red-300">{formatNumber(totals.totalExpenses)}</td>
                <td className={`px-6 py-3 ${totals.netCashFlow >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-600'}`}>{formatNumber(totals.netCashFlow)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400">ملخص مرئي حسب الشهر</h2>
        <div className="w-full h-96">
            {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                        contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        borderColor: '#4B5563',
                        borderRadius: '0.5rem',
                        color: '#F9FAFB'
                        }}
                        formatter={(value: number, name: string) => {
                            if (name === 'صافي التدفق النقدي') {
                                return [formatNumber(value), 'صافي التدفق'];
                            }
                            return [formatNumber(value), name];
                        }}
                    />
                    <Legend />
                    <Bar dataKey="netCashFlow" name="صافي التدفق النقدي" fill="#8884d8">
                        {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.netCashFlow >= 0 ? '#10B981' : '#EF4444'} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    لا توجد بيانات لعرضها لهذا العام.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};