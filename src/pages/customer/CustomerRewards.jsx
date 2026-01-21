import React, { useState, useEffect } from 'react';
import { Gift, Star, Award, CheckCircle } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const CustomerRewards = () => {
  const { customerUser } = useCustomerAuth();
  const [rewardsData, setRewardsData] = useState({
    points: 1250,
    tier: 'Gold',
    nextTierPoints: 2000,
    redemptions: [
      { id: 1, name: '₹100 Off', cost: 500, redeemed: false },
      { id: 2, name: 'Free Manicure', cost: 800, redeemed: false },
      { id: 3, name: 'Exclusive Gift Kit', cost: 1500, redeemed: true }
    ],
    history: [
      { id: 3, reward: 'Exclusive Gift Kit', date: '2025-08-10' }
    ]
  });

  const handleRedeem = (reward) => {
    if (rewardsData.points < reward.cost) return;
    setRewardsData(prev => ({
      ...prev,
      points: prev.points - reward.cost,
      redemptions: prev.redemptions.map(r =>
        r.id === reward.id ? { ...r, redeemed: true } : r
      ),
      history: [...prev.history, { id: reward.id, reward: reward.name, date: new Date().toISOString().split('T')[0] }]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Rewards</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and redeem your loyalty points</p>
        </div>

        {/* Rewards Data */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Points</p>
              <p className="text-4xl font-bold text-pink-600 dark:text-pink-400">{rewardsData.points}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tier</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{rewardsData.tier}</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {rewardsData.points >= rewardsData.nextTierPoints
                ? 'You have reached the highest tier!'
                : `Earn ${rewardsData.nextTierPoints - rewardsData.points} more points to reach Platinum tier.`}
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Rewards</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {rewardsData.redemptions.map(r => (
              <div key={r.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between transition-colors duration-200">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{r.cost} points</p>
                </div>
                {r.redeemed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <button
                    onClick={() => handleRedeem(r)}
                    disabled={rewardsData.points < r.cost}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Redeem
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Redemption History</h3>
          {rewardsData.history.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No redemptions yet.</p>
          ) : (
            <ul className="space-y-3">
              {rewardsData.history.map(h => (
                <li key={h.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
                  <span className="text-gray-900 dark:text-white">{h.reward}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{h.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRewards;
