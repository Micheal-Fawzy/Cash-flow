import React, { useState, useMemo, useEffect } from 'react';
import { DailyView } from './components/DailyView.tsx';
import { MonthlyView } from './components/MonthlyView.tsx';
import { AllTransactionsView } from './components/AllTransactionsView.tsx';
import { Header } from './components/Header.tsx';
import { Transaction } from './types.ts';
import { generateInitialData } from './constants.ts';

export type View = 'daily' | 'monthly' | 'all';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 1)); // Start with Jan 2025
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('cashflow-transactions');
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error reading transactions from localStorage:", error);
    }
    return generateInitialData();
  });

  useEffect(() => {
    try {
      localStorage.setItem('cashflow-transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }
  }, [transactions]);


  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleTransactionChange = (date: string, category: string, amount: number) => {
    setTransactions(prevTransactions => {
      const existingTransactionIndex = prevTransactions.findIndex(
        t => t.date === date && t.category === category
      );

      if (existingTransactionIndex > -1) {
        if (amount === 0) {
          // Remove transaction if amount is set to 0
          return prevTransactions.filter((_, index) => index !== existingTransactionIndex);
        } else {
          // Update existing transaction
          const updatedTransactions = [...prevTransactions];
          updatedTransactions[existingTransactionIndex] = { ...updatedTransactions[existingTransactionIndex], amount };
          return updatedTransactions;
        }
      } else if (amount !== 0) {
        // Add new transaction
        const newTransaction: Transaction = {
          id: `${date}-${category}`,
          date,
          category,
          amount,
        };
        return [...prevTransactions, newTransaction];
      }
      return prevTransactions;
    });
  };
  
  const filteredTransactions = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    return transactions.filter(t => t.date.startsWith(monthString));
  }, [transactions, selectedDate]);

  const renderView = () => {
    switch(currentView) {
      case 'daily':
        return (
          <DailyView
            selectedDate={selectedDate}
            transactions={filteredTransactions}
            onTransactionChange={handleTransactionChange}
          />
        );
      case 'monthly':
        return (
          <MonthlyView
            selectedYear={selectedDate.getFullYear()}
            transactions={transactions}
          />
        );
      case 'all':
        return <AllTransactionsView transactions={transactions} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200" dir="rtl">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;