import React, { useState, useRef } from 'react';
import { useElectionStore } from '../store/electionStore';
import { ResultsChart } from './ResultsChart';
import { Position, Candidate } from '../types';
import { generateResultsPDF } from '../utils/pdfExport';
import {
  Download,
  Play,
  Square,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  FileText,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    positions,
    votes,
    electionState,
    startElection,
    endElection,
    addPosition,
    updatePosition,
    deletePosition,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    setElectionState,
  } = useElectionStore();

  const [editingPosition, setEditingPosition] = useState<Partial<Position> | null>(
    null
  );
  const [editingCandidate, setEditingCandidate] = useState<{
    positionId: string;
    candidate: Partial<Candidate>;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadResults = () => {
    const doc = generateResultsPDF(positions, votes, electionState);
    doc.save(`${electionState.electionName}-results.pdf`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingCandidate) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCandidate({
          ...editingCandidate,
          candidate: {
            ...editingCandidate.candidate,
            photoUrl: reader.result as string,
            photoFile: file,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePosition = () => {
    if (editingPosition?.title && editingPosition?.description) {
      if (editingPosition.id) {
        updatePosition(editingPosition as Position);
      } else {
        addPosition({
          title: editingPosition.title,
          description: editingPosition.description,
        });
      }
      setEditingPosition(null);
    }
  };

  const handleSaveCandidate = () => {
    if (
      editingCandidate &&
      editingCandidate.candidate.name &&
      editingCandidate.candidate.email &&
      editingCandidate.candidate.year &&
      editingCandidate.candidate.platform &&
      editingCandidate.candidate.photoUrl
    ) {
      if (editingCandidate.candidate.id) {
        updateCandidate(
          editingCandidate.positionId,
          editingCandidate.candidate as Candidate
        );
      } else {
        addCandidate(editingCandidate.positionId, {
          name: editingCandidate.candidate.name,
          email: editingCandidate.candidate.email,
          year: editingCandidate.candidate.year,
          platform: editingCandidate.candidate.platform,
          photoUrl: editingCandidate.candidate.photoUrl,
          position: positions.find((p) => p.id === editingCandidate.positionId)
            ?.title || '',
          experience: editingCandidate.candidate.experience || [],
          socialLinks: editingCandidate.candidate.socialLinks,
        });
      }
      setEditingCandidate(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Election Dashboard</h2>
            <input
              type="text"
              value={electionState.electionName}
              onChange={(e) =>
                setElectionState({ electionName: e.target.value })
              }
              className="mt-2 px-3 py-2 border rounded-md"
              placeholder="Election Name"
            />
          </div>
          <div className="flex gap-4">
            {!electionState.isVoting ? (
              <button
                onClick={startElection}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Election
              </button>
            ) : (
              <button
                onClick={endElection}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <Square className="w-4 h-4 mr-2" />
                End Election
              </button>
            )}
            <button
              onClick={downloadResults}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF Results
            </button>
          </div>
        </div>

        {/* Position Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Positions</h3>
            <button
              onClick={() => setEditingPosition({})}
              className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </button>
          </div>

          {editingPosition && (
            <div className="mb-4 p-4 border rounded-md">
              <input
                type="text"
                value={editingPosition.title || ''}
                onChange={(e) =>
                  setEditingPosition({
                    ...editingPosition,
                    title: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
                placeholder="Position Title"
              />
              <textarea
                value={editingPosition.description || ''}
                onChange={(e) =>
                  setEditingPosition({
                    ...editingPosition,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
                placeholder="Position Description"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingPosition(null)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePosition}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {positions.map((position) => (
            <div key={position.id} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{position.title}</h4>
                  <p className="text-gray-600">{position.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPosition(position)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePosition(position.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Candidate Management */}
              <div className="ml-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Candidates</h5>
                  <button
                    onClick={() =>
                      setEditingCandidate({
                        positionId: position.id,
                        candidate: {},
                      })
                    }
                    className="flex items-center px-2 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Candidate
                  </button>
                </div>

                {editingCandidate?.positionId === position.id && (
                  <div className="mb-4 p-4 border rounded-md">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo
                      </label>
                      <div className="flex items-center space-x-4">
                        {editingCandidate.candidate.photoUrl && (
                          <img
                            src={editingCandidate.candidate.photoUrl}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editingCandidate.candidate.name || ''}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          candidate: {
                            ...editingCandidate.candidate,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mb-2"
                      placeholder="Candidate Name"
                    />
                    <input
                      type="email"
                      value={editingCandidate.candidate.email || ''}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          candidate: {
                            ...editingCandidate.candidate,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mb-2"
                      placeholder="Candidate Email"
                    />
                    <input
                      type="text"
                      value={editingCandidate.candidate.year || ''}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          candidate: {
                            ...editingCandidate.candidate,
                            year: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mb-2"
                      placeholder="Academic Year"
                    />
                    <textarea
                      value={editingCandidate.candidate.platform || ''}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          candidate: {
                            ...editingCandidate.candidate,
                            platform: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md mb-2"
                      placeholder="Platform Statement"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCandidate(null)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCandidate}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {position.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-600">
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingCandidate({
                              positionId: position.id,
                              candidate,
                            })
                          }
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            deleteCandidate(position.id, candidate.id)
                          }
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <ResultsChart position={position} votes={votes} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};