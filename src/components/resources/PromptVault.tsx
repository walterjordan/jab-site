'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { categories as handbookCategories, prompts as handbookPrompts, Category, Prompt } from '@/lib/prompt-data';
import { CategorySection } from './CategorySection';
import { parseCSV } from '@/lib/csv-parser';

type GuideType = 'handbook' | 'awesome';

export const PromptVault = () => {
  const [activeGuide, setActiveGuide] = useState<GuideType>('handbook');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [awesomeCategories, setAwesomeCategories] = useState<Category[]>([]);
  const [awesomePrompts, setAwesomePrompts] = useState<Prompt[]>([]);
  const [isLoadingAwesome, setIsLoadingAwesome] = useState(false);

  // Fetch and Parse Awesome Prompts
  useEffect(() => {
    if (activeGuide === 'awesome' && awesomeCategories.length === 0 && !isLoadingAwesome) {
      setIsLoadingAwesome(true);
      fetch('/prompts.csv')
        .then(res => res.text())
        .then(text => {
          const rows = parseCSV(text);
          // Skip header row if "act" and "prompt"
          const dataRows = rows.slice(1); // Assuming first row is header
          
          const newCats: Category[] = [];
          const newPrompts: Prompt[] = [];

          dataRows.forEach((row, index) => {
            if (row.length < 2) return;
            const act = row[0];
            const promptText = row[1];
            const id = `awesome-${index}`;

            // In this guide, each "Act" is a Category with 1 prompt
            newCats.push({
              id: id,
              title: act,
              description: '', // No description in CSV
              icon: 'Zap', // Default icon
            });

            newPrompts.push({
              id: `p-${id}`,
              category: id,
              text: promptText,
            });
          });

          setAwesomeCategories(newCats);
          setAwesomePrompts(newPrompts);
        })
        .catch(err => console.error('Failed to load prompts:', err))
        .finally(() => setIsLoadingAwesome(false));
    }
  }, [activeGuide, awesomeCategories.length, isLoadingAwesome]);

  // Determine current dataset
  const currentCategories = activeGuide === 'handbook' ? handbookCategories : awesomeCategories;
  const currentPrompts = activeGuide === 'handbook' ? handbookPrompts : awesomePrompts;

  // Filter logic
  const filteredData = useMemo(() => {
    return currentCategories.map(cat => {
      const catPrompts = currentPrompts.filter(p => p.category === cat.id);
      
      // Filter by category selection (only relevant if we add a dropdown for this mode, but for Awesome it might be too long)
      if (selectedCategory && cat.id !== selectedCategory) {
        return { ...cat, prompts: [] };
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        // Check if category title matches
        const titleMatch = cat.title.toLowerCase().includes(query);
        // Check if any prompt matches
        const promptMatch = catPrompts.some(p => p.text.toLowerCase().includes(query));

        if (!titleMatch && !promptMatch) {
          return { ...cat, prompts: [] };
        }
        // If title matches, show all. If prompt matches, show it.
        // Actually, for "Awesome", title match IS the card match.
      }

      return { ...cat, prompts: catPrompts };
    }).filter(cat => cat.prompts.length > 0);
  }, [searchQuery, selectedCategory, currentCategories, currentPrompts]);

  return (
    <div className="space-y-8">
      {/* Guide Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => { setActiveGuide('handbook'); setSelectedCategory(null); setSearchQuery(''); }}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeGuide === 'handbook'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            The Ultimate Handbook
          </button>
          <button
            onClick={() => { setActiveGuide('awesome'); setSelectedCategory(null); setSearchQuery(''); }}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeGuide === 'awesome'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Awesome ChatGPT Prompts
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={activeGuide === 'handbook' ? "Search prompts (e.g. 'email', 'growth', 'sales')..." : "Search roles (e.g. 'Linux', 'Doctor', 'Coder')..."}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {activeGuide === 'handbook' && (
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all appearance-none cursor-pointer"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {handbookCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoadingAwesome && activeGuide === 'awesome' ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading awesome prompts...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map(cat => (
            <CategorySection key={cat.id} category={cat} prompts={cat.prompts} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No prompts found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-gray-400 mt-12 pb-8 border-t border-gray-100 pt-8">
        <p>
          {activeGuide === 'handbook' 
            ? 'Based on "The Ultimate ChatGPT Prompt Handbook" by YourChatGPTGuide.' 
            : 'Sourced from the "Awesome ChatGPT Prompts" repository.'}
        </p>
        <p className="mt-1">Curated for educational purposes. Use responsibly.</p>
      </div>
    </div>
  );
};