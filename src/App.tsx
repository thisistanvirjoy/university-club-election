import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VotingStep } from './components/VotingStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { AdminDashboard } from './components/AdminDashboard';
import { VoterLogin } from './components/VoterLogin';
import { AdminLogin } from './components/AdminLogin';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HowToVote } from './components/HowToVote';
import { ElectionRules } from './components/ElectionRules';
import { Support } from './components/Support';
import { useElectionStore } from './store/electionStore';
import { Lock, Settings } from 'lucide-react';
import { Vote } from './types';

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const {
    positions,
    votes,
    electionState,
    currentVoterEmail,
    addVote,
    setElectionState,
    canVote,
  } = useElectionStore();

  useEffect(() => {
    const savedVotes = localStorage.getItem('draftVotes');
    if (savedVotes) {
      try {
        const parsedVotes = JSON.parse(savedVotes);
        if (Array.isArray(parsedVotes)) {
          parsedVotes.forEach((vote: Vote) => addVote(vote));
        }
      } catch (error) {
        console.error('Error loading saved votes:', error);
        localStorage.removeItem('draftVotes');
      }
    }
  }, [addVote]);

  useEffect(() => {
    try {
      localStorage.setItem('draftVotes', JSON.stringify(votes));
    } catch (error) {
      console.error('Error saving votes:', error);
    }
  }, [votes]);

  const handleVote = (vote: Vote) => {
    if (currentVoterEmail && canVote(vote.positionId, currentVoterEmail)) {
      addVote({
        ...vote,
        voterEmail: currentVoterEmail,
      });
    }
  };

  const handleConfirm = () => {
    try {
      localStorage.removeItem('draftVotes');
      setElectionState({ isConfirmationStep: false });
      alert('Thank you for voting!');
    } catch (error) {
      console.error('Error confirming votes:', error);
      alert('There was an error submitting your votes. Please try again.');
    }
  };

  const getCurrentVotes = () => {
    return votes.reduce<Record<string, string>>((acc, vote) => {
      if (vote.voterEmail === currentVoterEmail) {
        acc[vote.positionId] = vote.candidateId;
      }
      return acc;
    }, {});
  };

  const AdminButton = () => (
    <button
      onClick={() => setShowAdminLogin(true)}
      className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      title="Admin Login"
    >
      <Settings className="w-6 h-6" />
    </button>
  );

  const MainContent = () => {
    if (electionState.isAdmin) {
      return <AdminDashboard />;
    }

    if (!electionState.isVoting) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Lock className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {electionState.electionName} is currently closed
            </h1>
            <p className="text-gray-600">
              Please check back later when the election begins.
            </p>
          </div>
        </div>
      );
    }

    if (!currentVoterEmail) {
      return <VoterLogin />;
    }

    return (
      <div className="flex-grow">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {electionState.electionName}
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {electionState.isConfirmationStep ? (
            <ConfirmationStep
              positions={positions}
              votes={votes}
              onConfirm={handleConfirm}
              onEdit={() => setElectionState({ isConfirmationStep: false })}
            />
          ) : (
            <div>
              <VotingStep
                positions={positions}
                onVote={handleVote}
                currentVotes={getCurrentVotes()}
                currentVoterEmail={currentVoterEmail}
              />
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setElectionState({ isConfirmationStep: true })}
                  className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Review Votes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/how-to-vote" element={<HowToVote />} />
          <Route path="/election-rules" element={<ElectionRules />} />
          <Route path="/support" element={<Support />} />
        </Routes>
        <AdminButton />
        {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
        <Footer />
      </div>
    </Router>
  );
}

export default App;