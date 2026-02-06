"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, Zap, Users, Trophy, Layers, ArrowRight, Sparkles } from "lucide-react";

export default function JABAIMastermindLanding() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#010E63] to-black opacity-80" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7FFF41]/10 via-transparent to-transparent" />

      <div className="relative z-10">
        {/* Navigation / Header */}
        <nav className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
             <a href="https://jordanborden.com" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Home
             </a>
             <a 
               href="https://aimastermind.jordanborden.com" 
               target="_blank"
               rel="noopener noreferrer"
               className="text-[#7FFF41] font-medium hover:underline hidden md:block"
             >
                Login to Member Portal
             </a>
        </nav>

        {/* HERO */}
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#7FFF41]/10 border border-[#7FFF41]/30 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#7FFF41]" />
              <span className="text-sm text-[#7FFF41] font-medium">Mission-Based AI Learning</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6">
              JAB AI Mastermind
              <br />
              <span className="bg-gradient-to-r from-[#7FFF41] to-[#4ADE80] bg-clip-text text-transparent">
                Build Real AI Systems
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Stop watching tutorials. Start designing, testing, and deploying 
              real AI workflows that actually matter.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-[#7FFF41] hover:bg-[#6FEF31] text-black text-lg px-10 py-7 rounded-full font-semibold shadow-lg shadow-[#7FFF41]/20 transition-all hover:scale-105"
                onClick={() => window.open("https://jordanborden.com/#cta", "_self")}
              >
                Reserve a Workshop Seat
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white/20 hover:border-[#7FFF41]/50 hover:bg-white/5 text-lg px-10 py-7 rounded-full font-semibold transition-all"
                onClick={() => window.open("https://aimastermind.jordanborden.com", "_blank")}
              >
                Go to JAB AI Mastermind Site
              </Button>
            </div>
          </motion.div>
        </section>

        {/* PROGRAM STRUCTURE */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              icon: Layers,
              title: "Seasons & Missions",
              text: "Progress through structured Seasons made up of hands-on Missions that build real AI capability.",
              color: "from-purple-500/20 to-blue-500/20"
            }, {
              icon: Zap,
              title: "Hands-On Challenges",
              text: "Every mission includes practical tasks, deliverables, and system builds. Not theory.",
              color: "from-blue-500/20 to-cyan-500/20"
            }, {
              icon: Trophy,
              title: "XP & Badges",
              text: "Earn XP, unlock badges, and level up as you demonstrate real world AI mastery.",
              color: "from-cyan-500/20 to-[#7FFF41]/20"
            }].map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 rounded-3xl h-full hover:border-[#7FFF41]/30 transition-all group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8 text-[#7FFF41]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEASON 1 */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-4">
            Season 1: Foundations
          </motion.h2>
          <motion.p {...fadeInUp} className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Master the fundamentals of AI thinking and system design
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {[{
              mission: "101",
              title: "Your Personal Research Assistant",
              text: "Build a personal knowledge base and learn how to extract intelligence from AI instead of passively consuming content."
            }, {
              mission: "102",
              title: "Talking to AI Like a Pro",
              text: "Understand how LLMs interpret tone, intent, and ambiguity and how to control it."
            }, {
              mission: "103",
              title: "Structured Prompting Basics",
              text: "Master the Role,Task, Context framework to produce consistent, reliable AI output."
            }, {
              mission: "104",
              title: "The Truth Filter",
              text: "Develop a critical 'trust but verify' mindset to detect hallucinations and grounded output."
            }, {
              mission: "105",
              title: "Architecting the Mind",
              text: "Graduate from chatting to system design by creating reusable system instructions."
            }].map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 rounded-3xl h-full hover:border-[#7FFF41]/30 transition-all group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#7FFF41]/10 border border-[#7FFF41]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#7FFF41] font-bold">{item.mission}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#7FFF41] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="px-6 py-24 max-w-5xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-16">
            This Is For You If...
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "You want to understand how AI actually thinks",
              "You're tired of surface level prompt tutorials",
              "You want repeatable AI systems you can reuse or sell",
              "You learn best by building, testing, and iterating"
            ].map((text, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#7FFF41]/30 transition-all"
              >
                <CheckCircle className="text-[#7FFF41] w-6 h-6 flex-shrink-0" />
                <span className="text-lg text-gray-200">{text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* OFFER */}
        <section className="px-6 py-24 max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <Card className="bg-gradient-to-br from-[#010E63] via-[#010E63]/80 to-black border-2 border-[#7FFF41]/30 rounded-[2rem] shadow-2xl shadow-[#7FFF41]/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7FFF41]/5 to-transparent" />
              <CardContent className="p-12 md:p-16 relative">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Join JAB AI Mastermind
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Mission-based learning • XP & badges • Community access
                  </p>
                  <div className="mb-10">
                    <p className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#7FFF41] to-[#4ADE80] bg-clip-text text-transparent">
                      $299
                    </p>
                    <p className="text-gray-400 mt-2">One-time payment • Lifetime access</p>
                  </div>
                  <Button 
                     className="bg-[#7FFF41] hover:bg-[#6FEF31] text-black text-xl px-12 py-8 rounded-full font-bold shadow-xl shadow-[#7FFF41]/30 transition-all hover:scale-105"
                     onClick={() => window.open("https://aimastermind.jordanborden.com", "_blank")}
                  >
                    Start Season 1 Now
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                  <div className="mt-6">
                    <a 
                       href="https://jordanborden.com/#cta" 
                       className="text-gray-400 hover:text-white text-sm border-b border-gray-600 hover:border-white transition pb-0.5"
                    >
                       Looking for the live workshops? Reserve a seat here.
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* FOOTER & CREDITS */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="space-y-2">
                <p className="text-lg text-gray-300 font-medium">
                  This program was thoughtfully created with success in mind just for you by
                </p>
                <p className="text-xl text-[#7FFF41] font-bold">
                  Walter Jordan & Alysia Borden (JAB)
                </p>
                <a 
                  href="https://jordanborden.com" 
                  className="text-gray-400 hover:text-white transition underline"
                >
                  www.jordanborden.com
                </a>
            </div>

            <div className="flex justify-center gap-6 pt-6">
              <Button 
                variant="outline"
                className="gap-2 border-white/10 hover:bg-white/5"
                onClick={() => {
                   if (navigator.share) {
                      navigator.share({
                        title: 'JAB AI Mastermind',
                        text: 'Check out the JAB AI Mastermind: Build Real AI Systems.',
                        url: window.location.href,
                      }).catch(console.error);
                   } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                   }
                }}
              >
                 <Sparkles className="w-4 h-4" />
                 Share this Page
              </Button>
              <a 
                href="https://www.facebook.com/profile.php?id=61583817749327" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center h-10 px-4 py-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors text-sm font-medium"
              >
                 Follow us on Facebook
              </a>
            </div>

            <p className="text-xs text-gray-600 pt-8">
              © {new Date().getFullYear()} JAB AI Mastermind · Jordan & Borden Automation Consulting
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}