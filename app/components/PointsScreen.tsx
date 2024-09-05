"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, Star, MessageSquare, CheckCircle, User, ArrowUp, Lock } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import Image from 'next/image';

interface Task {
  id: number;
  description: string;
  reward: number;
  progress?: number;
  total?: number;
}

interface Activity {
  id: number;
  description: string;
  points: number;
  type: 'earned' | 'spent';
  date: string;
}

const dummyTasks: Task[] = [
  { id: 1, description: "Daily Streak: Complete 7 days in a row", reward: 10, progress: 3, total: 7 },
  { id: 2, description: "Refer a Friend", reward: 100 },
  { id: 3, description: "Token Usage: Stake $ZKR", reward: 50, progress: 25, total: 100 },
];

const dummyActivities: Activity[] = [
  { id: 1, description: "Completed daily task", points: 10, type: 'earned', date: '2023-04-15' },
  { id: 2, description: "Leveled up Rizzy", points: 100, type: 'spent', date: '2023-04-14' },
  { id: 3, description: "Referred Alice", points: 100, type: 'earned', date: '2023-04-13' },
];

const PointsScreen: React.FC = () => {
  const [earnedBerries, setEarnedBerries] = useState(500);
  const [usedBerries, setUsedBerries] = useState(200);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [berriesForNextLevel, setBerriesForNextLevel] = useState(300);
  const [activeSection, setActiveSection] = useState<'raccoon' | 'tasks' | 'earnMore'>('raccoon');
  const [claimableBerries, setClaimableBerries] = useState(100); // New state for claimable berries
  const [betAmount, setBetAmount] = useState<number>(0);
  const [prediction, setPrediction] = useState<'heads' | 'tails' | null>(null);

  const availableBerries = earnedBerries - usedBerries;

  const handleClaimTask = (taskId: number) => {
    // Implement claim logic here
    console.log(`Claimed task ${taskId}`);
  };

  const handleFeedRizzy = () => {
    if (availableBerries >= 10) {
      setUsedBerries(usedBerries + 10);
    }
  };

  const handleLevelUpRizzy = () => {
    if (availableBerries >= berriesForNextLevel) {
      setUsedBerries(usedBerries + berriesForNextLevel);
      setCurrentLevel(currentLevel + 1);
      setBerriesForNextLevel(berriesForNextLevel + 100); // Increase berries needed for next level
      // Additional level up logic can be added here
    }
  };

  const handleClaimBerries = () => {
    setEarnedBerries(earnedBerries + claimableBerries);
    setClaimableBerries(0); // Reset claimable berries to 0 after claiming
    // You might want to add logic here to regenerate claimable berries over time
  };

  const handleBet = () => {
    if (betAmount <= 0 || !prediction || availableBerries < betAmount) return;

    const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
    if (result === prediction) {
      setEarnedBerries(earnedBerries + betAmount);
      alert(`Congratulations! You won ${betAmount} berries!`);
    } else {
      setUsedBerries(usedBerries + betAmount);
      alert(`Sorry, you lost ${betAmount} berries. Better luck next time!`);
    }
    setBetAmount(0);
    setPrediction(null);
  };

  const progressPercentage = (availableBerries / berriesForNextLevel) * 100;
  const isLevelUpReady = progressPercentage >= 100;

  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-gray-900">
      <Card className="w-full h-full rounded-none shadow-none flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Points</div>
          <ThemeToggle />
        </CardHeader>
        <CardContent className="flex-grow overflow-auto p-4">
          <div className="space-y-6">
            {/* Berries Overview */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Image src="/berry-icon.png" alt="Berry" width={24} height={24} className="mr-2" />
                    Berries Overview
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Earned</p>
                    <p className="text-xl font-bold">{earnedBerries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Used</p>
                    <p className="text-xl font-bold">{usedBerries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                    <p className="text-xl font-bold">{availableBerries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subsection Titles */}
            <div className="flex justify-around border-b dark:border-gray-700">
              <Button
                variant="ghost"
                className={`pb-2 ${activeSection === 'raccoon' ? 'border-b-2 border-purple-600' : ''}`}
                onClick={() => setActiveSection('raccoon')}
              >
                Rizzy
              </Button>
              <Button
                variant="ghost"
                className={`pb-2 ${activeSection === 'tasks' ? 'border-b-2 border-purple-600' : ''}`}
                onClick={() => setActiveSection('tasks')}
              >
                Tasks
              </Button>
              <Button
                variant="ghost"
                className={`pb-2 ${activeSection === 'earnMore' ? 'border-b-2 border-purple-600' : ''}`}
                onClick={() => setActiveSection('earnMore')}
              >
                Earn More
              </Button>
            </div>

            {/* Raccoon Section */}
            {activeSection === 'raccoon' && (
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-lg font-semibold">Level {currentLevel} Rizzy</h3>
                    <div className="rounded-md overflow-hidden border-1 border-purple-600">
                      <Image src="/rizzy.png" alt="Rizzy the Raccoon" width={200} height={200} className="mb-4 rounded-md" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Progress to Level {currentLevel + 1}</span>
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{availableBerries}/{berriesForNextLevel}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleFeedRizzy} 
                      disabled={availableBerries < 10}
                      className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 w-full"
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Feed Rizzy (10 Berries)
                    </Button>
                    <Button 
                      onClick={handleLevelUpRizzy} 
                      disabled={!isLevelUpReady}
                      className={`w-full ${
                        isLevelUpReady 
                          ? 'bg-transparent text-black border border-purple-600 dark:border-purple-400 dark:text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isLevelUpReady ? (
                        <>
                          <Star className="mr-2 h-4 w-4" />
                          Level Up
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Level Up Locked
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks Section */}
            {activeSection === 'tasks' && (
              <div className="space-y-4">
                {dummyTasks.map((task) => (
                  <Card key={task.id} className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p>{task.description}</p>
                        <Button onClick={() => handleClaimTask(task.id)} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          {task.reward} Berries
                        </Button>
                      </div>
                      {task.progress !== undefined && task.total !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(task.progress / task.total) * 100}%` }}></div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {/* Claim Berries Button */}
                <Button 
                  onClick={handleClaimBerries} 
                  disabled={claimableBerries === 0}
                  className="w-full py-6 text-lg font-semibold border-4 border-purple-600 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 disabled:border-gray-300 disabled:text-gray-300"
                >
                  Claim {claimableBerries} Berries
                </Button>
              </div>
            )}

            {/* Earn More Section (previously Activity) */}
            {activeSection === 'earnMore' && (
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Earn More Berries</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bet Amount (Berries)
                      </label>
                      <input
                        type="number"
                        id="betAmount"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        min="0"
                        max={availableBerries}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prediction
                      </label>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setPrediction('heads')}
                          className={`flex-1 ${prediction === 'heads' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                          Heads
                        </Button>
                        <Button
                          onClick={() => setPrediction('tails')}
                          className={`flex-1 ${prediction === 'tails' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                          Tails
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleBet}
                      disabled={betAmount <= 0 || !prediction || availableBerries < betAmount}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      Try My Luck
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        {/* Add Navbar */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around py-2">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs mt-1">Chat</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="flex flex-col items-center text-purple-600 dark:text-purple-400">
              <Star className="h-5 w-5" />
              <span className="text-xs mt-1 font-semibold">Points</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PointsScreen;
