'use client';

import React, { useState } from 'react';
import { Prompt, Category } from '@/lib/prompt-data';
import { PromptCard } from './PromptCard';
import { Icon } from './Icons';

type CategorySectionProps = {
  category: Category;
  prompts: Prompt[];
};

export const CategorySection = ({ category, prompts }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // If filtered prompts are empty but the category is passed, it means we shouldn't show it if we are strictly filtering
  // However, the parent will control visibility. Here we just render.
  // Wait, if search is active, we might want to default to open if there are matches? 
  // For now, let's keep it simple: manual toggle. 
  // We can pass `defaultOpen` prop if needed.

  if (prompts.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mb-6 transition-all hover:border-blue-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Icon name={category.icon} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </div>
        </div>
        <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0 bg-gray-50/50 border-t border-gray-100 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} text={prompt.text} />
          ))}
        </div>
      </div>
    </div>
  );
};
