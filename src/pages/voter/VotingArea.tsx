import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Candidate } from "../../types";

export default function VotingArea() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Assuming you have the user's email stored somewhere (e.g., in localStorage, context, or session)
    const storedEmail = localStorage.getItem("userEmail"); // You can replace this with your email handling logic
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    axios.get("/api/candidates")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCandidates(response.data);
        } else {
          console.error("Invalid candidates data:", response.data);
        }
      })
      .catch(() => setErrorMessage("Failed to load candidates."));

    // Check voter status (Make sure to pass the email in the query string)
    if (storedEmail) {
      axios.get(`/api/voter-status?email=${storedEmail}`)
        .then((response) => setHasVoted(response.data.hasVoted))
        .catch(() => setErrorMessage("Failed to check voter status."));
    }
  }, []);

  const handleVote = (candidate: Candidate) => {
    if (hasVoted) {
      alert("You have already voted!");
      return;
    }

    // Check if userEmail is valid
    if (!userEmail || userEmail.trim() === "") {
      setErrorMessage("User email is missing or invalid.");
      return;
    }

    // Check if a candidate is selected and has a valid ID
    if (!candidate || !candidate.id) {
      setErrorMessage("Invalid candidate selected.");
      return;
    }

    setSelectedCandidate(candidate);
  };

  const confirmVote = async () => {
    if (!selectedCandidate || !selectedCandidate.id) {
      setErrorMessage("Invalid candidate. Please select a valid candidate.");
      return;
    }

    // Check if userEmail is valid
    if (!userEmail || userEmail.trim() === "") {
      setErrorMessage("User email is missing.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post("/api/vote", { email: userEmail, candidateId: selectedCandidate.id });

      // Update local state
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c
        )
      );
      setHasVoted(true);
      setSelectedCandidate(null);
    } catch (error) {
      setErrorMessage("Error submitting vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout type="voter">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Voting Area</h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
                  <div className="text-gray-600 space-y-1">
                    <p>Age: {candidate.age}</p>
                    <p>Qualification: {candidate.qualification}</p>
                    <p>Party: {candidate.party}</p>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 text-white rounded ${hasVoted ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  onClick={() => handleVote(candidate)}
                  disabled={hasVoted}
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vote Confirmation Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to vote for {selectedCandidate.name}?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setSelectedCandidate(null)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                onClick={confirmVote}
                disabled={loading}
              >
                {loading ? "Voting..." : "Yes, Vote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
