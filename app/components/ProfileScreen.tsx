"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, User, MessageSquare, Award, LogOut } from 'lucide-react';
import Link from 'next/link';
import DesktopMessage from '@/app/components/ui/DesktopMessage';
import { Input } from "@/app/components/ui/input";
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';

interface ProfileData {
  username: string;
  walletBalance: number;
  totalUsage: string;
  refCode: string;
}

const ProfileScreen: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:8000/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data: ProfileData = await response.json();
        setProfileData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  if (!isMobile) {
    return <DesktopMessage />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-gray-900">
      <Card className="w-full h-full rounded-none shadow-none flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <Link href="/">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Profile</div>
          <ThemeToggle />
        </CardHeader>
        <CardContent className="flex-grow overflow-auto p-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center mb-2">
              <User className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">{profileData.username}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Wallet Balance:</span>
              <span>{profileData.walletBalance} $ZKR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Usage:</span>
              <span>{profileData.totalUsage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Ref Code:</span>
              <Input value={profileData.refCode} readOnly className="w-32 text-right" />
            </div>
            <Button variant="outline" className="w-full justify-center py-6">
              Add Funds
            </Button>
            <Button variant="outline" className="w-full justify-center py-6 text-red-500">
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          </div>
        </CardContent>
        <div className="flex justify-around items-center py-1 bg-white border-t">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-purple-600">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1 font-semibold">Profile</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Chat</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500">
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1">Points</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileScreen;
