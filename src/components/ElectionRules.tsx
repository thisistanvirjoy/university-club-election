import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ElectionRules: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Voting
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold">Election Rules</h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Must be a currently enrolled student</li>
                <li>Must use official university email address</li>
                <li>Must be in good academic standing</li>
                <li>Cannot vote in positions where you are a candidate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Voting Process</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>One vote per position per student</li>
                <li>All votes are final once submitted</li>
                <li>Must vote for all positions</li>
                <li>No proxy voting allowed</li>
                <li>Voting period cannot be extended</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Campaign Guidelines</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>No negative campaigning against other candidates</li>
                <li>Campaign materials must be approved by election committee</li>
                <li>Equal platform visibility for all candidates</li>
                <li>No campaigning during voting period</li>
                <li>Respect university policies and guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Results and Appeals</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Results will be announced within 24 hours of election end</li>
                <li>Appeals must be filed within 48 hours of results announcement</li>
                <li>Election committee decisions are final</li>
                <li>Vote counts will be publicly available</li>
                <li>Winners determined by simple majority</li>
              </ul>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-8">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Violations:</h3>
              <p className="text-yellow-800">
                Any violation of these rules may result in disqualification from the election.
                Serious violations will be reported to the university administration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};