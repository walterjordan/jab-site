import React from 'react';
import { Check, Globe, MessageSquare, Zap, Target, ArrowRight, Smartphone } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-24 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Simple Pricing. Powerful Results.
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Choose the EdgeMax AI package that fits your business. Stop juggling five different apps and let our Centralized Operations & Revenue Engine (CORE) do the heavy lifting.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* EdgeMax AI Core Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-8 sm:p-10 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">EdgeMax AI Core</h2>
              <p className="text-gray-500 mb-6 min-h-[48px]">The &quot;Command Center&quot; for your business. Perfect for teams that already have a website but need better lead management.</p>
              <div className="flex items-baseline text-5xl font-extrabold text-gray-900 mb-8">
                $199
                <span className="text-xl font-medium text-gray-500 ml-2">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-blue-600 shrink-0 mr-3" />
                  <span><strong>The Unified Inbox:</strong> See every text, email, and social message in one single dashboard.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-blue-600 shrink-0 mr-3" />
                  <span><strong>EdgeAssist (AI Sidekick):</strong> AI suggests the perfect reply to leads so you respond faster.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-blue-600 shrink-0 mr-3" />
                  <span><strong>Automated Follow-Up:</strong> System auto-texts leads who go quiet. Never miss a booking again.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-blue-600 shrink-0 mr-3" />
                  <span><strong>Visual Sales Pipeline:</strong> Drag-and-drop boards to see where every dollar is sitting.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-blue-600 shrink-0 mr-3" />
                  <span><strong>Done-For-You Setup:</strong> We build and configure it. You just run your business.</span>
                </li>
              </ul>
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <a href="#contact" className="block w-full py-4 px-6 text-center text-white bg-gray-900 hover:bg-gray-800 font-bold rounded-xl transition-all">
                Get Started with Core
              </a>
            </div>
          </div>

          {/* Edge AI Core + Card */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-600 overflow-hidden flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600"></div>
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">
              Most Popular
            </div>
            <div className="p-8 sm:p-10 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">EdgeMax AI Core <span className="text-blue-600">+</span></h2>
              <p className="text-gray-500 mb-6 min-h-[48px]">Everything in Core, PLUS a high-converting, fully integrated website designed to turn visitors into leads.</p>
              <div className="flex items-baseline text-5xl font-extrabold text-gray-900 mb-8">
                $299
                <span className="text-xl font-medium text-gray-500 ml-2">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-blue-600 shrink-0 mr-3" />
                  <span className="font-semibold">Everything included in EdgeMax AI Core.</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-6 w-6 text-blue-600 shrink-0 mr-3 mt-1" />
                  <div>
                    <strong>Integrated Business Website</strong>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p className="flex items-center gap-1.5"><Target size={14} className="text-blue-500"/> Real pages</p>
                      <p className="flex items-center gap-1.5"><Smartphone size={14} className="text-blue-500"/> Mobile-ready</p>
                      <p className="flex items-center gap-1.5"><Zap size={14} className="text-blue-500"/> Fast load</p>
                      <p className="flex items-center gap-1.5"><MessageSquare size={14} className="text-blue-500"/> Lead capture</p>
                      <p className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> CORE integration-ready</p>
                    </div>
                  </div>
                </li>
              </ul>

              {/* Demo Links */}
              <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wider">See Live Demos:</p>
                <div className="space-y-2">
                  <a href="https://demo.edgemax.ai/demos/landscaping/" target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                    <ArrowRight size={16} className="mr-2" /> Landscaping Demo
                  </a>
                  <a href="https://demo.edgemax.ai/demos/hvac/" target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                    <ArrowRight size={16} className="mr-2" /> HVAC Demo
                  </a>
                  <a href="https://demo.edgemax.ai/demos/dental/" target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                    <ArrowRight size={16} className="mr-2" /> Dental Demo
                  </a>
                </div>
              </div>
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <a href="#contact" className="block w-full py-4 px-6 text-center text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1">
                Get Started with Core +
              </a>
            </div>
          </div>

        </div>

        {/* Layman's Summary Footer */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
           <div className="inline-block p-1 px-4 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-widest mb-4">
              The Bottom Line
           </div>
           <p className="text-xl text-gray-700 italic leading-relaxed">
             &quot;CORE is a premium business operating system that organizes your leads, automates your follow-ups, and uses AI to help your team close deals faster. It’s not just software; it’s a fully configured revenue engine that we set up for you, so you can stop worrying about the tech and start focusing on growth.&quot;
           </p>
        </div>

      </div>
    </div>
  );
}