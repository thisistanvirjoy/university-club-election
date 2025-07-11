import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Position, Vote } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsChartProps {
  position: Position;
  votes: Vote[];
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ position, votes }) => {
  const positionVotes = votes.filter((vote) => vote.positionId === position.id);

  const voteCounts = position.candidates.reduce<Record<string, number>>((acc, candidate) => {
    acc[candidate.id] = positionVotes.filter(
      (vote) => vote.candidateId === candidate.id
    ).length;
    return acc;
  }, {});

  const data = {
    labels: position.candidates.map((candidate) => candidate.name),
    datasets: [
      {
        label: 'Votes',
        data: position.candidates.map((candidate) => voteCounts[candidate.id]),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Vote Results: ${position.title}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};