# University Club Election

A secure and transparent electronic voting system for university club elections. This project allows students to vote for candidates in various positions, ensuring fairness and confidentiality.

## Features

- **Voter Login**: Students can log in using their university email, name, semester, and student ID.
- **Admin Dashboard**: Admins can manage positions, candidates, and election settings.
- **Voting System**: Students can cast votes for candidates in different positions.
- **Results Visualization**: Election results are displayed using charts and can be exported as a PDF.
- **Election Rules**: Detailed rules for the election process.
- **Support Page**: Contact support for assistance or FAQs.

## Storage Architecture (No Database)

Since this project doesn't use a traditional database, here's how data persistence works:

### 1. Client-Side Storage Only

All data is stored in the browser's `localStorage`:

```typescript
const useElectionStore = create<StoreState>()(
  persist(
    (set, get) => ({
      positions: [],
      votes: [],
      electionState: {},
      // ... other state
    }),
    {
      name: 'election-store', // localStorage key
      partialize: (state) => ({
        // Only these parts get persisted
        positions: state.positions,
        electionState: state.electionState,
        adminCredentials: state.adminCredentials,
      }),
    }
  )
);
```
### 2. Data Structure in LocalStorage
The browser stores a JSON object under the key election-store:
```typescript
{
  "positions": [
    {
      "id": "uuid-1",
      "title": "President",
      "description": "Lead the club...",
      "candidates": [
        {
          "id": "uuid-2",
          "name": "John Doe",
          "email": "john@university.edu",
          "photoUrl": "data:image/jpeg;base64,/9j/4AAQ...",
          "platform": "My vision is...",
          "experience": ["Previous role 1", "Previous role 2"]
        }
      ]
    }
  ],
  "electionState": {
    "isVoting": true,
    "electionName": "Spring 2024 Elections",
    "voters": {
      "student@university.edu": {
        "email": "student@university.edu",
        "name": "Jane Smith",
        "semester": "6",
        "studentId": "12345"
      }
    }
  },
  "adminCredentials": {
    "username": "admin",
    "password": "admin123"
  }
}
```
### 3. Vote Storage
Votes are stored in memory during the session and in localStorage as drafts:

```typescript
// Draft votes saved automatically
useEffect(() => {
  localStorage.setItem('draftVotes', JSON.stringify(votes));
}, [votes]);

// Vote structure
interface Vote {
  positionId: string;
  candidateId: string;
  timestamp: number;
  voterEmail: string;
  voterName: string;
  voterSemester: string;
  voterStudentId: string;
}
```
### 4. How It Works Without a Database
Advantages:
✅ No server costs - Everything runs client-side
✅ Instant deployment - Just static files
✅ Fast performance - No network requests for data
✅ Simple architecture - No backend complexity
### Limitations:
❌ Single device storage - Data doesn't sync across devices
❌ Admin-only setup - Only the admin device has the full data
❌ No real-time sync - Multiple admins can't collaborate
❌ Data loss risk - Clearing browser data loses everything
### 5. Data Flow
Admin Setup: Admin creates positions/candidates → Stored in localStorage
Voter Access: Voters access the same URL → Get fresh app, no stored data initially
Voting: Votes stored temporarily in voter's localStorage as drafts
Vote Submission: Votes are "submitted" (cleared from drafts, shown as confirmed)
Results: Admin can see aggregated results from their stored data
### 6. Session Management
```typescript
// Session timeout for security
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.removeItem('draftVotes');
    // Clear sensitive data after 5 minutes
  }, 5 * 60 * 1000);
  
  return () => clearTimeout(timer);
}, []);
```
This approach works well for small, internal club elections where:
One admin manages the entire process
Voters don't need accounts or complex authentication
Results don't need to be stored permanently
The election happens in a short timeframe
### Tech Stack
Frontend: React, TailwindCSS
State Management: Zustand
Charts: Chart.js
PDF Generation: jsPDF
Routing: React Router
Build Tool: Vite
### Installation
Clone the repository:
```
git clone https://github.com/your-username/university-club-election.git
cd university-club-election
```
Install dependencies:
```
npm install
```
Start the development server:
```
npm run dev
```
Open the application in your browser at http://localhost:5173.

### Scripts
npm run dev: Start the development server.
npm run build: Build the project for production.
npm run preview: Preview the production build.
npm run lint: Run ESLint to check for code issues.
npm run deploy: Deploy the project to GitHub Pages.
Deployment
The project can be deployed to GitHub Pages using the following commands:
```
npm run predeploy
npm run deploy
```
### Folder Structure
src/
├── components/       # React components
├── store/            # Zustand state management
├── utils/            # Utility functions
├── types.ts          # TypeScript types
├── App.tsx           # Main application component
├── main.tsx          # Entry point
├── index.css         # Global styles
Configuration
TailwindCSS: Configured in tailwind.config.js.
Vite: Configured in vite.config.ts.
TypeScript: Configured in tsconfig.json.
License
This project is licensed under the MIT License. See the LICENSE file for details.

### Contact
For support or inquiries, contact:

Email: tanvirjoym@gmail.com
Phone: +8801812345678

