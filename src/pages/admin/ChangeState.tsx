import React, { useState } from 'react';
import Layout from '../../components/Layout';

type ElectionState = 'registration' | 'voting' | 'results';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newState: ElectionState;
}

function ConfirmModal({ isOpen, onClose, onConfirm, newState }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Phase Change</h3>
        <p className="mb-4">Are you sure you want to change the election phase to <span className="font-semibold capitalize">{newState}</span>?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Yes, Change Phase
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChangeState() {
  const [currentState, setCurrentState] = useState<ElectionState>('registration');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingState, setPendingState] = useState<ElectionState | null>(null);

  const handleStateChangeRequest = (state: ElectionState) => {
    if (state === currentState) return;
    setPendingState(state);
    setShowConfirmModal(true);
  };

  const handleConfirmStateChange = () => {
    if (pendingState) {
      setCurrentState(pendingState);
      setPendingState(null);
    }
    setShowConfirmModal(false);
  };

  return (
    <Layout type="admin">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Change Election State</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current State: 
                <span className="ml-2 text-indigo-600 font-semibold capitalize">{currentState}</span>
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleStateChangeRequest('registration')}
                className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
                  currentState === 'registration'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Registration Phase
              </button>

              <button
                onClick={() => handleStateChangeRequest('voting')}
                className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
                  currentState === 'voting'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Voting Phase
              </button>

              <button
                onClick={() => handleStateChangeRequest('results')}
                className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
                  currentState === 'results'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Results Phase
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Phase Description:</h3>
              <p className="text-sm text-gray-600">
                {currentState === 'registration' && 'Candidates can be registered during this phase.'}
                {currentState === 'voting' && 'Voters can cast their votes during this phase.'}
                {currentState === 'results' && 'Voting has ended and results are being displayed.'}
              </p>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setPendingState(null);
          }}
          onConfirm={handleConfirmStateChange}
          newState={pendingState || 'registration'}
        />
      </div>
    </Layout>
  );
}