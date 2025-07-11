import React, { useState } from 'react';
import { Position, Vote } from '../types';
import { Check, AlertCircle, Info } from 'lucide-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';

interface VotingStepProps {
  positions: Position[];
  onVote: (vote: Vote) => void;
  currentVotes: Record<string, string>;
  currentVoterEmail: string;
}

export const VotingStep: React.FC<VotingStepProps> = ({
  positions,
  onVote,
  currentVotes,
  currentVoterEmail,
}) => {
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const handleVote = async (vote: Vote) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    onVote(vote);
    
    await Toast.fire({
      icon: 'success',
      title: 'Vote recorded successfully'
    });
  };

  // Calculate completion status
  const totalPositions = positions.length;
  const votedPositions = Object.keys(currentVotes).length;
  const completionPercentage = (votedPositions / totalPositions) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cast Your Votes</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {votedPositions} of {totalPositions} positions voted
            </p>
            <p className="text-sm font-medium text-blue-600">
              {completionPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Voting Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-blue-900">How to Vote</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Select one candidate for each position</li>
              <li>• Click the checkbox to cast your vote</li>
              <li>• Review your choices before final submission</li>
              <li>• You cannot change your votes after submission</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {positions.map((position) => (
          <div
            key={position.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              !currentVotes[position.id] ? 'border-2 border-yellow-200' : ''
            }`}
          >
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{position.title}</h3>
                  <p className="text-gray-600 mt-1">{position.description}</p>
                </div>
                {!currentVotes[position.id] && (
                  <div className="flex items-center text-yellow-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Vote Required</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {position.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`relative rounded-lg border-2 transition-all ${
                      currentVotes[position.id] === candidate.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                        currentVotes[position.id] === candidate.id
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 bg-white hover:border-blue-400'
                      }`}
                      onClick={() =>
                        handleVote({
                          positionId: position.id,
                          candidateId: candidate.id,
                          timestamp: Date.now(),
                          voterEmail: currentVoterEmail,
                          voterName: '',
                          voterSemester: '',
                          voterStudentId: '',
                        })
                      }
                    >
                      {currentVotes[position.id] === candidate.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">
                            {candidate.name}
                          </h4>
                          <p className="text-gray-600">{candidate.year}</p>
                          
                          <div className="mt-2">
                            <button
                              onClick={() => setExpandedInfo(expandedInfo === candidate.id ? null : candidate.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              {expandedInfo === candidate.id ? 'Show Less' : 'Show More'}
                            </button>
                          </div>

                          <div className={`mt-2 transition-all duration-300 ${
                            expandedInfo === candidate.id ? 'block' : 'hidden'
                          }`}>
                            <p className="text-gray-700">{candidate.platform}</p>

                            {candidate.experience.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-medium mb-2">Experience</h5>
                                <ul className="list-disc list-inside text-gray-600">
                                  {candidate.experience.map((exp, index) => (
                                    <li key={index}>{exp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {candidate.socialLinks && (
                              <div className="mt-4 flex space-x-4">
                                {Object.entries(candidate.socialLinks).map(([platform, url]) => (
                                  url && (
                                    <a
                                      key={platform}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-600 hover:text-blue-600"
                                    >
                                      {platform}
                                    </a>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};