"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, User, MessageSquare, Award, LogOut, Wallet, CreditCard, Hash, Clock, Copy, Server } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopMessage  from '@/app/components/ui/DesktopMessage';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';

interface ProfileData {
  username: string;
  walletBalance: number;
  totalUsage: string;
  refCode: string;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

const ProfileScreen: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchProfileData();
    }
  }, [isConnected]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data: ProfileData = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleLogout = () => {
    setProfileData(null);
    setWalletAddress(null);
    setIsConnected(false);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  const copyRefCode = () => {
    if (profileData?.refCode) {
      navigator.clipboard.writeText(profileData.refCode)
        .then(() => alert('Ref Code copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const handleAddFunds = () => {
    // Implement the logic to add funds here
    console.log(`Adding ${fundAmount} $ZKR`);
    setIsAddFundsOpen(false);
    setFundAmount('');
  };

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
          <div className="space-y-6">
            {isConnected && profileData ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                    <Image 
                      src="/pfp.jpeg" 
                      alt="Profile Picture" 
                      width={96} 
                      height={96} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{profileData.username}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {walletAddress && (
                    <Card className="bg-white dark:bg-gray-800">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <Wallet className="h-5 w-5 mr-2 text-purple-600" />
                          <span className="font-semibold">Wallet Address</span>
                        </div>
                        <span className="text-sm">{truncateAddress(walletAddress)}</span>
                      </CardContent>
                    </Card>
                  )}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                        <span className="font-semibold">Wallet Balance</span>
                      </div>
                      <span>{profileData.walletBalance} $ZKR</span>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-purple-600" />
                        <span className="font-semibold">Total Usage</span>
                      </div>
                      <span>{profileData.totalUsage}</span>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Hash className="h-5 w-5 mr-2 text-purple-600" />
                        <span className="font-semibold">Ref Code</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{profileData.refCode}</span>
                        <Button variant="ghost" size="icon" onClick={copyRefCode} className="h-6 w-6 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center py-6 mt-4"
                    onClick={() => setIsAddFundsOpen(true)}
                  >
                    Add Funds
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-center py-6 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Server className="mr-2 h-5 w-5" />
                    Run a Node <span className="text-xs opacity-75">( Coming Soon )</span>
                  </Button>
                  
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Button onClick={connectWallet} className="px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white">
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        {isConnected && (
          <div className="p-4 ">
            <Button variant="outline" className="w-full justify-center py-6 text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          </div>
        )}
        <div className="flex justify-around items-center py-1 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-purple-600 dark:text-purple-400">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1 font-semibold">Profile</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Chat</span>
            </Button>
          </Link>
          <Link href="/points">
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <Award className="h-5 w-5" />
              <span className="text-xs mt-1">Points</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Custom Add Funds Modal */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Funds</h2>
            <input
              type="number"
              placeholder="Amount in $ZKR"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddFundsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddFunds}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
