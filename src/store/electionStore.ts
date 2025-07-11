import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vote, Position, ElectionState, Candidate, ElectionConfig, Voter } from '../types';

interface StoreState {
  positions: Position[];
  votes: Vote[];
  currentStep: number;
  electionState: ElectionState;
  currentVoterEmail: string | null;
  adminCredentials: {
    username: string;
    password: string;
  };
  addVote: (vote: Vote) => void;
  setCurrentStep: (step: number) => void;
  clearVotes: () => void;
  setElectionState: (state: Partial<ElectionState>) => void;
  toggleAdmin: (username: string, password: string) => boolean;
  startElection: () => void;
  endElection: () => void;
  setElectionConfig: (config: ElectionConfig) => void;
  addPosition: (position: Omit<Position, 'id' | 'candidates'>) => void;
  updatePosition: (position: Position) => void;
  deletePosition: (id: string) => void;
  addCandidate: (positionId: string, candidate: Omit<Candidate, 'id'>) => void;
  updateCandidate: (positionId: string, candidate: Candidate) => void;
  deleteCandidate: (positionId: string, candidateId: string) => void;
  setCurrentVoterEmail: (email: string | null) => void;
  addVoter: (voter: Voter) => void;
  canVote: (positionId: string, email: string) => boolean;
  getVoter: (email: string) => Voter | undefined;
  setAdminCredentials: (username: string, password: string) => void;
}

export const useElectionStore = create<StoreState>()(
  persist(
    (set, get) => ({
      positions: [],
      votes: [],
      currentStep: 0,
      currentVoterEmail: null,
      adminCredentials: {
        username: 'admin',
        password: 'admin123',
      },
      electionState: {
        isAdmin: false,
        isVoting: false,
        isConfirmationStep: false,
        electionName: 'New Election',
        voters: {},
      },
      addVote: (vote) =>
        set((state) => ({
          votes: state.votes
            .filter((v) => v.positionId !== vote.positionId)
            .concat(vote),
        })),
      setCurrentStep: (step) =>
        set((state) => ({
          currentStep: Math.max(0, Math.min(step, state.positions.length - 1)),
        })),
      clearVotes: () => set({ votes: [] }),
      setElectionState: (newState) =>
        set((state) => ({
          electionState: { ...state.electionState, ...newState },
        })),
      toggleAdmin: (username, password) => {
        const state = get();
        const isValid = 
          username === state.adminCredentials.username && 
          password === state.adminCredentials.password;
        
        if (isValid) {
          set((state) => ({
            electionState: {
              ...state.electionState,
              isAdmin: !state.electionState.isAdmin,
            },
          }));
        }
        return isValid;
      },
      startElection: () =>
        set((state) => ({
          electionState: {
            ...state.electionState,
            isVoting: true,
            electionStartTime: Date.now(),
          },
        })),
      endElection: () =>
        set((state) => ({
          electionState: {
            ...state.electionState,
            isVoting: false,
            electionEndTime: Date.now(),
          },
        })),
      setElectionConfig: (config) =>
        set((state) => ({
          positions: config.positions,
          electionState: {
            ...state.electionState,
            electionName: config.name,
          },
        })),
      addPosition: (position) =>
        set((state) => ({
          positions: [
            ...state.positions,
            { ...position, id: crypto.randomUUID(), candidates: [] },
          ],
        })),
      updatePosition: (position) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === position.id ? position : p
          ),
        })),
      deletePosition: (id) =>
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        })),
      addCandidate: (positionId, candidate) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === positionId
              ? {
                  ...p,
                  candidates: [
                    ...p.candidates,
                    { ...candidate, id: crypto.randomUUID() },
                  ],
                }
              : p
          ),
        })),
      updateCandidate: (positionId, candidate) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === positionId
              ? {
                  ...p,
                  candidates: p.candidates.map((c) =>
                    c.id === candidate.id ? candidate : c
                  ),
                }
              : p
          ),
        })),
      deleteCandidate: (positionId, candidateId) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === positionId
              ? {
                  ...p,
                  candidates: p.candidates.filter((c) => c.id !== candidateId),
                }
              : p
          ),
        })),
      setCurrentVoterEmail: (email) => set({ currentVoterEmail: email }),
      addVoter: (voter) =>
        set((state) => ({
          electionState: {
            ...state.electionState,
            voters: {
              ...state.electionState.voters,
              [voter.email]: voter,
            },
          },
        })),
      canVote: (positionId, email) => {
        const state = get();
        const position = state.positions.find((p) => p.id === positionId);
        if (!position) return false;

        // Check if the voter exists
        const voter = state.electionState.voters[email];
        if (!voter) return false;

        // Check if the voter is a candidate for this position
        const isCandidate = position.candidates.some((c) => c.email === email);
        if (isCandidate) return false;

        // Check if the voter has already voted for this position
        const hasVoted = state.votes.some(
          (v) => v.positionId === positionId && v.voterEmail === email
        );
        return !hasVoted;
      },
      getVoter: (email) => {
        const state = get();
        return state.electionState.voters[email];
      },
      setAdminCredentials: (username, password) =>
        set({ adminCredentials: { username, password } }),
    }),
    {
      name: 'election-store',
      partialize: (state) => ({
        positions: state.positions,
        electionState: state.electionState,
        adminCredentials: state.adminCredentials,
      }),
    }
  )
);