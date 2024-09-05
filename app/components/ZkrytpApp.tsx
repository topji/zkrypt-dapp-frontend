"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { ChevronLeft, User, MessageSquare, Award } from 'lucide-react'
import DesktopMessage from '@/app/components/ui/DesktopMessage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Message = {
  text: string
  isUser: boolean
  model?: string
}

interface UserProfile {
  name: string;
  points: number;
}

const ZkryptApp: React.FC = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    fetchChatHistory();
    fetchUserProfile();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/chatHistory');
      if (response.ok) {
        const history = await response.json();
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, isUser: true };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');

      try {
        const response = await fetch('http://localhost:8000/sendPrompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        });

        if (response.ok) {
          const aiResponse = await response.json();
          setMessages(prevMessages => [...prevMessages, {
            text: aiResponse.text,
            isUser: false,
            model: aiResponse.model
          }]);
        }
      } catch (error) {
        console.error('Failed to send prompt:', error);
      }
    }
  };

  // if (!isMobile) {
  //   return <DesktopMessage />;
  // }

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      <Card className="w-full h-full rounded-none shadow-none flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4 bg-white border-b">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="text-2xl font-bold text-purple-600">Zkrypt</div>
          <div className="w-8 relative">
            <select className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
              <option>Zkrypt-1.0</option>
              <option>GPT3.5</option>
              <option>GPT4-mini</option>
              <option>Claude-sonnet3.5</option>
              <option>Gemini-1.5-flash</option>
              <option>Pro mode (beta)</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-2xl ${
                    message.isUser ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  } max-w-[80%]`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {!message.isUser && message.model && (
                    <div className="text-xs text-gray-500 mt-1 ml-2">
                      Model used: {message.model}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-2 bg-white border-t">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              placeholder="Type here to ask AI"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow rounded-full border-gray-300"
            />
            <Button type="submit" className="rounded-full bg-purple-600 text-white px-6">
              Ask
            </Button>
          </form>
        </div>
        <div className="flex justify-around items-center py-1 bg-white border-t">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500" onClick={() => router.push('/profile')}>
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-purple-600">
            <MessageSquare className="h-5 w-5 fill-current" />
            <span className="text-xs mt-1 font-semibold">Chat</span>
          </Button>
          <Link href="/points">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <Award className="h-5 w-5" />
              <span className="text-xs mt-1">Points</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default ZkryptApp;