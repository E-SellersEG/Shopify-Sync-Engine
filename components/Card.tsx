

import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  colSpan?: string;
}

const Card: React.FC<CardProps> = ({ title, children, colSpan = '' }) => {
  const cardClasses = `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden ${colSpan}`;

  return (
    <div className={cardClasses}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;