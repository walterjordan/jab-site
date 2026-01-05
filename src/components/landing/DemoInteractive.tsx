"use client";

import { useState, useEffect } from "react";
import { Channel, Scenario, generateDemoResponse, DemoOutput } from "@/lib/demo-logic";

const channels: Channel[] = ["Instagram", "Messenger", "WhatsApp", "TikTok"];
const scenarios: Scenario[] = ["New Lead", "Comment on Post", "Booking Request", "Support Question", "Follow-up"];

export default function DemoInteractive() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("Instagram");
  const [selectedScenario, setSelectedScenario] = useState<Scenario>("New Lead");
  const [output, setOutput] = useState<DemoOutput | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation reset
    setAnimate(true);
    const data = generateDemoResponse(selectedChannel, selectedScenario);
    setOutput(data);
    
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [selectedChannel, selectedScenario]);

  return (
    <section id="demo" className="border-b border-white/5 py-16 md:py-24 bg-slate-950/50">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              See How the System Thinks
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Your automations shouldn't just "reply"—they should think, decide, and route data. 
              Select a scenario below to see the logic in real-time.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center">
          
          {/* Channel Selector */}
          <div className="flex flex-wrap gap-2">
            {channels.map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedChannel === ch
                  ? "bg-[#7fff41] text-slate-900 shadow-lg shadow-[#7fff41]/20"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* Scenario Selector */}
          <div className="relative">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value as Scenario)}
              className="appearance-none rounded-lg bg-slate-900 border border-white/10 px-4 py-2 pr-10 text-sm font-medium text-white focus:border-[#7fff41] focus:outline-none focus:ring-1 focus:ring-[#7fff41]"
            >
              {scenarios.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* Interactive Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: The Chat Interface */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 h-[400px] flex flex-col">
            {/* Fake Phone Header */}
            <div className="border-b border-white/5 bg-slate-950 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7fff41] to-[#010e63]" />
                 <div>
                   <p className="text-sm font-semibold text-white">Jordan & Borden</p>
                   <p className="text-xs text-slate-400">Automated Assistant • {selectedChannel}</p>
                 </div>
               </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
               {/* User Message */}
               <div className={`self-end max-w-[80%] transition-all duration-500 transform ${animate ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                  <div className="rounded-2xl rounded-tr-sm bg-[#7fff41] px-4 py-3 text-sm font-medium text-slate-900 shadow-md">
                    {output?.incoming_message}
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500 text-right">Just now</p>
               </div>

               {/* System Reply */}
               <div className={`self-start max-w-[80%] transition-all duration-700 delay-100 transform ${animate ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                  <div className="rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3 text-sm text-slate-200 border border-white/5 shadow-sm">
                    {output?.auto_reply}
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Automated • &lt; 1s</p>
               </div>
            </div>
          </div>

          {/* Right: The JSON Brain */}
          <div className="relative rounded-2xl border border-white/10 bg-black/80 backdrop-blur font-mono text-xs md:text-sm h-[400px] flex flex-col shadow-2xl">
             <div className="border-b border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">System_Logic_Log.json</span>
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                </span>
             </div>
             
             <div className="flex-1 p-6 overflow-auto text-slate-300">
                {output && (
                  <pre className={`transition-opacity duration-300 ${animate ? 'opacity-50' : 'opacity-100'}`}>
                    <span className="text-purple-400">{"{"}"</span>
                    {"\n  "}
                    <span className="text-blue-400">"decision"</span>: <span className={output.decision === 'high_intent_lead' ? 'text-[#7fff41] font-bold' : 'text-orange-300'}>"{output.decision}"</span>,
                    {"\n  "}
                    <span className="text-blue-400">"next_step"</span>: <span className="text-white">"{output.next_step}"</span>,
                    {"\n  "}
                    <span className="text-blue-400">"insights"</span>: <span className="text-purple-400">{"{"}"</span>
                    {"\n    "}
                    <span className="text-blue-400">"channel"</span>: <span className="text-green-300">"{output.insights.channel}"</span>,
                    {"\n    "}
                    <span className="text-blue-400">"intent_level"</span>: <span className={output.insights.intent_level === 'high' ? 'text-[#7fff41]' : 'text-slate-400'}>"{output.insights.intent_level}"</span>,
                    {"\n    "}
                    <span className="text-blue-400">"log_destination"</span>: <span className="text-yellow-200">"{output.insights.log_destination}"</span>
                    {"\n    "}
                    <span className="text-blue-400">"data_captured"</span>: [
                    {"\n      "}
                    {output.insights.data_to_capture.map((d, i) => (
                      <span key={d}>
                        <span className="text-slate-400">"{d}"</span>
                        {i < output.insights.data_to_capture.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    {"\n    "}]
                    {"\n  "}
                    <span className="text-purple-400">{"}"}</span>
                    {"\n"}
                    <span className="text-purple-400">{"}"}</span>
                  </pre>
                )}
             </div>

             {/* Status Bar */}
             <div className="border-t border-white/10 bg-white/5 px-4 py-2 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
                <span>Status: Active</span>
                <span>Latency: 24ms</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
