
import React, { useState, useEffect } from 'react';

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    setIsEditing(false);
    const numericValue = Number(currentValue) || 0;
    if (numericValue !== value) {
      onSave(numericValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num === 0) return "-";
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="w-full h-full min-h-[40px] flex items-center justify-center" onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input
          type="number"
          value={currentValue === 0 ? '' : currentValue}
          onChange={(e) => setCurrentValue(Number(e.target.value))}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-full text-center bg-teal-100 dark:bg-teal-800 border-none outline-none focus:ring-2 focus:ring-teal-500 p-2"
        />
      ) : (
        <span className="cursor-pointer w-full h-full flex items-center justify-center p-2">
            {value !== 0 ? formatNumber(value) : <span className="text-gray-400">-</span>}
        </span>
      )}
    </div>
  );
};
