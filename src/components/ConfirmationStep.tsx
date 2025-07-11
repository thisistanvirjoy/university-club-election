import React from 'react';
import { Position, Vote } from '../types';
import { Check, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';

interface ConfirmationStepProps {
  positions: Position[];
  votes: Vote[];
  onConfirm: () => void;
  onEdit: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  positions,
  votes,
  onConfirm,
  onEdit,
}) => {
  const getVoteForPosition = (positionId: string) => {
    const vote = votes.find(v => v.positionId === positionId);
    if (!vote) return null;
    
    const position = positions.find(p => p.id === positionId);
    const candidate = position?.candidates.find(c => c.id === vote.candidateId);
    return candidate;
  };

  const unvotedPositions = positions.filter(
    position => !votes.some(vote => vote.positionId === position.id)
  );

  const handleConfirm = async () => {
    const result = await Swal.fire({
      title: 'Submit Votes?',
      text: 'Once submitted, you cannot change your votes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit votes',
      cancelButtonText: 'No, review again'
    });

    if (result.isConfirmed) {
      onConfirm();
      await Swal.fire({
        title: 'Thank You for Voting!',
        text: 'Your votes have been recorded successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Review Your Votes</h2>
        <p className="text-gray-600">
          Please review your selections carefully. You cannot change your votes after submission.
        </p>
      </div>

      {unvotedPositions.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Incomplete Votes
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You haven't voted for the following positions:</p>
                <ul className="list-disc list-inside mt-1">
                  {unvotedPositions.map(position => (
                    <li key={position.id}>{position.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {positions.map((position) => {
          const selectedCandidate = getVoteForPosition(position.id);
          
          return (
            <div
              key={position.id}
              className={`bg-white p-6 rounded-lg shadow-md ${
                !selectedCandidate ? 'border-2 border-yellow-200' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{position.title}</h3>
                  {selectedCandidate ? (
                    <div className="mt-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={selectedCandidate.photoUrl}
                          alt={selectedCandidate.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-lg">
                            {selectedCandidate.name}
                          </p>
                          <p className="text-gray-600">{selectedCandidate.year}</p>
                        </div>
                        <div className="ml-auto">
                          <div className="flex items-center text-green-600">
                            <Check className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Vote Recorded</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-yellow-600">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <p>No candidate selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onEdit}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Edit Votes
        </button>
        <button
          onClick={handleConfirm}
          disabled={unvotedPositions.length > 0}
          className={`px-6 py-3 rounded-md transition-colors ${
            unvotedPositions.length > 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Submit Votes
        </button>
      </div>
    </div>
  );
};