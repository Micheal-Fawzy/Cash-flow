import React, { useMemo } from 'react';
import type { Transaction } from '../types.ts';
import { CASH_INFLOW_CATEGORIES } from '../constants.ts';

interface AllTransactionsViewProps {
  transactions: Transaction[];
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-EG').format(num);
};

const TransactionTable: React.FC<{ title: string; transactions: Transaction[]; colorClass: string; }> = ({ title, transactions, colorClass }) => {
    const total = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className={`text-xl font-bold mb-4 ${colorClass}`}>{title}</h2>
            <div className="overflow-y-auto max-h-[65vh] relative">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3">التاريخ</th>
                            <th className="px-4 py-3">البند</th>
                            <th className="px-4 py-3">المبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map(t => (
                                <tr key={t.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3 font-medium whitespace-nowrap">{t.date}</td>
                                    <td className="px-4 py-3">{t.category}</td>
                                    <td className={`px-4 py-3 font-semibold ${colorClass}`}>{formatNumber(t.amount)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    لا توجد معاملات لعرضها.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {transactions.length > 0 && (
                        <tfoot className="font-bold bg-gray-100 dark:bg-gray-700 sticky bottom-0">
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-left">الإجمالي</td>
                                <td className={`px-4 py-3 ${colorClass}`}>{formatNumber(total)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
};

export const AllTransactionsView: React.FC<AllTransactionsViewProps> = ({ transactions }) => {
    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    const inflows = useMemo(() => {
        return sortedTransactions.filter(t => CASH_INFLOW_CATEGORIES.includes(t.category));
    }, [sortedTransactions]);

    const outflows = useMemo(() => {
        return sortedTransactions.filter(t => !CASH_INFLOW_CATEGORIES.includes(t.category));
    }, [sortedTransactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionTable title="كافة التدفقات النقدية الداخلة" transactions={inflows} colorClass="text-green-600 dark:text-green-400" />
            <TransactionTable title="كافة التدفقات النقدية الخارجة" transactions={outflows} colorClass="text-red-600 dark:text-red-400" />
        </div>
    );
};