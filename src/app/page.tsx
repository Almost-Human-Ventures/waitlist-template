'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const waitlistId = process.env.NEXT_PUBLIC_WAITLIST_ID;
      
      if (!waitlistId) {
        throw new Error('Waitlist ID not configured. Please check your deployment settings.');
      }

      const response = await fetch('https://waitlist.email/api/subscribers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waitlist: waitlistId,
          email,
          name: name || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setEmail('');
      setName('');
      setMessage({ type: 'success', text: 'You have been added to the waitlist!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Something went wrong' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            We're working on something exciting. Join our waitlist to be the first to know when we launch.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Jane Smith"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="jane@example.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Joining...' : 'Join the waitlist'}
              </button>
            </div>
          </form>
          
          {message && (
            <div 
              className={`mt-4 p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <footer className="text-center text-sm text-gray-500">
          <p>Powered by <a href="https://waitlist.email" target="_blank" rel="noopener noreferrer" className="underline">waitlist.email</a></p>
        </footer>
      </div>
    </main>
  );
} 