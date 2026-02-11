import ChatKitWrapper from '@/components/chat/ChatKitWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with AI | Jordan & Borden',
  description: 'Ask our AI assistant about our services and solutions.',
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Chat with JAB Assistant
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Get instant answers about our automation consulting, AI implementations, and services.
          </p>
        </div>
        
        <ChatKitWrapper />
      </div>
    </div>
  );
}
