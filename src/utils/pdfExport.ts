import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Position, Vote, ElectionState } from '../types';

export const generateResultsPDF = (positions: Position[], votes: Vote[], electionState: ElectionState) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Election Results', 20, 20);
  
  let currentY = 40;

  // Add voter list
  doc.setFontSize(16);
  doc.text('Voter List', 20, currentY);
  currentY += 10;

  const voters = Object.values(electionState.voters);
  const voterData = voters.map(voter => [
    voter.name,
    voter.studentId,
    voter.email,
    voter.semester
  ]);

  (doc as any).autoTable({
    startY: currentY,
    head: [['Name', 'Student ID', 'Email', 'Semester']],
    body: voterData,
    margin: { left: 20 },
    theme: 'grid'
  });

  currentY = (doc as any).autoTable.previous.finalY + 20;

  // Results for each position
  positions.forEach((position) => {
    if (currentY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(16);
    doc.text(position.title, 20, currentY);
    currentY += 10;
    
    // Calculate vote counts
    const voteCounts = position.candidates.map(candidate => {
      const count = votes.filter(
        vote => vote.positionId === position.id && vote.candidateId === candidate.id
      ).length;
      return {
        name: candidate.name,
        votes: count,
        percentage: ((count / votes.length) * 100).toFixed(1) + '%'
      };
    }).sort((a, b) => b.votes - a.votes);
    
    // Add table
    (doc as any).autoTable({
      startY: currentY,
      head: [['Candidate', 'Votes', 'Percentage']],
      body: voteCounts.map(count => [
        count.name,
        count.votes.toString(),
        count.percentage
      ]),
      margin: { left: 20 },
      theme: 'grid'
    });
    
    currentY = (doc as any).autoTable.previous.finalY + 15;

    // Add winner banner
    if (voteCounts.length > 0) {
      const winner = voteCounts[0];
      doc.setFillColor(200, 230, 200);
      doc.rect(20, currentY - 10, 170, 10, 'F');
      doc.setTextColor(0, 100, 0);
      doc.setFontSize(12);
      doc.text(
        `Winner: ${winner.name} with ${winner.votes} votes (${winner.percentage})`,
        25,
        currentY - 2
      );
      doc.setTextColor(0, 0, 0);
      currentY += 20;
    }
  });
  
  return doc;
};