import React from 'react';
import { PromptVault } from '@/components/resources/PromptVault';
import { Header } from '@/components/landing/Header';

export default function PromptVaultPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
            AI Mastermind Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Prompt Vault
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Unlock the power of AI with this curated collection of high-impact prompts. 
            Select a guide below to start exploring.
          </p>
        </div>

        <PromptVault />
      </main>
    </div>
  );
}
