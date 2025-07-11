import React from 'react';
import { Candidate } from '../types';
import { LinkedinIcon, TwitterIcon, GithubIcon } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-all ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-white hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4">
        <img
          src={candidate.photoUrl}
          alt={candidate.name}
          className="w-24 h-24 rounded-full object-cover"
          loading="lazy"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{candidate.name}</h3>
          <p className="text-gray-600">{candidate.year}</p>
          <p className="mt-2 text-gray-700">{candidate.platform}</p>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Experience</h4>
            <ul className="list-disc list-inside text-gray-600">
              {candidate.experience.map((exp, index) => (
                <li key={index}>{exp}</li>
              ))}
            </ul>
          </div>

          {candidate.socialLinks && (
            <div className="mt-4 flex space-x-4">
              {candidate.socialLinks.linkedin && (
                <a
                  href={candidate.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <LinkedinIcon size={20} />
                </a>
              )}
              {candidate.socialLinks.twitter && (
                <a
                  href={candidate.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400"
                >
                  <TwitterIcon size={20} />
                </a>
              )}
              {candidate.socialLinks.github && (
                <a
                  href={candidate.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <GithubIcon size={20} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};