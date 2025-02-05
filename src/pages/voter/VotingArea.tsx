import React from 'react';
import Layout from '../../components/Layout';
import { Candidate } from '../../types';

const candidates: Candidate[] = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    qualification: "Ph.D. in Public Policy",
    party: "Progressive Party",
    votes: 0
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 52,
    qualification: "Master's in Economics",
    party: "Democratic Alliance",
    votes: 0
  },
  {
    id: 3,
    name: "Michael Chen",
    age: 48,
    qualification: "J.D. in Constitutional Law",
    party: "People's Front",
    votes: 0
  }
];

export default function VotingArea() {
  return (
    <Layout type="voter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Voting Area</h1>

        <div className="grid gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
                  <div className="space-y-2 text-gray-600">
                    <p>Age: {candidate.age}</p>
                    <p>Qualification: {candidate.qualification}</p>
                    <p>Party: {candidate.party}</p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}