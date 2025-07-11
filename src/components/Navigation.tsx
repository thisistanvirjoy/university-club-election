import React from 'react';
import { useElectionStore } from '../store/electionStore';
import { Home, Vote, LogOut } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    electionState, 
    currentVoterEmail,
    setCurrentVoterEmail,
    setElectionState
  } = useElectionStore();

  const handleLogout = () => {
    if (electionState.isAdmin) {
      setElectionState({ isAdmin: false });
    }
    setCurrentVoterEmail(null);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Home className="w-6 h-6" />
            <span className="font-bold text-lg">{electionState.electionName}</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {electionState.isVoting && (
              <div className="flex items-center text-green-400">
                <Vote className="w-5 h-5 mr-2" />
                <span>Voting Open</span>
              </div>
            )}
            
            {(currentVoterEmail || electionState.isAdmin) && (
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {electionState.isAdmin ? 'Exit Admin' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};