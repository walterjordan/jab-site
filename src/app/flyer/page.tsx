import type { Metadata } from "next";
import Image from "next/image";
import UpcomingSessions from "@/components/booking/UpcomingSessions";

export const metadata: Metadata = {
  title: "Register for Event | Jordan & Borden",
  description: "Secure your spot for the next upcoming session.",
};

export default function FlyerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
                <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-xl shadow-lg shadow-[#7fff41]/20">
                    <Image 
                      src="/jab-logo.png" 
                      alt="JAB logo" 
                      fill
                      className="object-cover invert"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Upcoming Sessions
                    </h1>
                    <p className="mt-2 text-slate-400 text-lg">
                        Tap below to secure your spot.
                    </p>
                </div>
            </div>
            
            <UpcomingSessions 
                title="Next Available" 
                filterKeyword="" 
                featuredLayout={true}
                waitlistTrack="General"
            />

            <div className="text-center pt-8">
                <p className="text-xs text-slate-500">
                    Need help? <a href="https://m.me/611741395360453" className="text-[#7fff41] hover:underline">Chat on Messenger</a>
                </p>
            </div>
        </div>
    </main>
  );
}
