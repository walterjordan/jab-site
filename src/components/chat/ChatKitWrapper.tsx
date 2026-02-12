'use client';

import { useEffect, useRef } from 'react';

// Declare custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openai-chatkit': any;
    }
  }
}

export default function ChatKitWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const container = containerRef.current;
    if (!container) return;

    const initChat = async () => {
      try {
        // Wait for script to register the element
        await customElements.whenDefined('openai-chatkit');
        
        if (!isMounted.current || !container) return;

        const chatkit = document.createElement('openai-chatkit') as any;
        
        // Add public key if available
        if (process.env.NEXT_PUBLIC_CHATKIT_PUBLIC_KEY) {
          chatkit.setAttribute('public-key', process.env.NEXT_PUBLIC_CHATKIT_PUBLIC_KEY);
        }

        const getClientSecret = async () => {
          const res = await fetch('/api/chatkit/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'web-visitor-' + Date.now() })
          });
          
          if (!res.ok) throw new Error('Failed session');
          const data = await res.json();
          return data.client_secret;
        };

        // Configure using available API
        if (typeof chatkit.setOptions === 'function') {
          chatkit.setOptions({
            api: { getClientSecret }
          });
        } else {
          // Fallback property assignment
          chatkit.api = { getClientSecret };
        }

        // Mount safely
        container.innerHTML = '';
        container.appendChild(chatkit);
      } catch (err) {
        console.error("ChatKit initialization failed:", err);
      }
    };

    initChat();

    return () => {
      isMounted.current = false;
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
