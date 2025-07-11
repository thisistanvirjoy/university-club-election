import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowToVote: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Voting
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">How to Vote</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Step 1: Login</h2>
              <p className="text-gray-600">
                Enter your student email, full name, and current semester to access the voting system.
                Make sure to use your official university email address.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Step 2: Review Candidates</h2>
              <p className="text-gray-600">
                Browse through all positions and their candidates. Click "Show More" to read detailed
                information about each candidate's platform and experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Step 3: Cast Your Votes</h2>
              <p className="text-gray-600">
                Select one candidate for each position by clicking the checkbox next to their card.
                You must vote for all positions to proceed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Step 4: Review and Submit</h2>
              <p className="text-gray-600">
                Review your selections carefully on the confirmation page. Once submitted, votes cannot
                be changed. Make sure all your choices are correct before final submission.
              </p>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notes:</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-2">
                <li>You can only vote once for each position</li>
                <li>Candidates cannot vote for their own position</li>
                <li>All votes are confidential and secure</li>
                <li>The voting period has a specific start and end time</li>
                <li>Results will be published after the election ends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};