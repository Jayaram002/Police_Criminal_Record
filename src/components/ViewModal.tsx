import { X } from 'lucide-react';
import { Criminal } from '../lib/supabase';

interface ViewModalProps {
  criminal: Criminal;
  onClose: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Incarcerated':
      return 'bg-yellow-500 text-white';
    case 'On Parole':
      return 'bg-blue-500 text-white';
    case 'Released':
      return 'bg-green-500 text-white';
    case 'Wanted':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export default function ViewModal({ criminal, onClose }: ViewModalProps) {
  const photoUrl = criminal.photo_url || `https://placehold.co/400x400/6b7280/ffffff?text=${criminal.first_name[0]}${criminal.last_name[0]}`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl bg-white rounded-lg shadow-2xl z-50">
        <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">
            Criminal Record: {criminal.first_name} {criminal.last_name}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img
                src={photoUrl}
                className="rounded-lg shadow-lg w-full"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/400x400/6b7280/ffffff?text=${criminal.first_name[0]}${criminal.last_name[0]}`;
                }}
              />
              <div className="mt-4 bg-gray-50 p-3 rounded-lg space-y-2">
                <h4 className="font-bold text-lg mb-2">Details</h4>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`font-normal px-2 py-1 text-xs rounded-full ${getStatusBadge(criminal.status)}`}>
                    {criminal.status}
                  </span>
                </p>
                <p>
                  <strong>DOB:</strong> <span className="font-normal">{criminal.dob}</span>
                </p>
                <p>
                  <strong>Height:</strong> <span className="font-normal">{criminal.physical.height}</span>
                </p>
                <p>
                  <strong>Weight:</strong> <span className="font-normal">{criminal.physical.weight} lbs</span>
                </p>
                <p>
                  <strong>Hair:</strong> <span className="font-normal">{criminal.physical.hair}</span>
                </p>
                <p>
                  <strong>Eyes:</strong> <span className="font-normal">{criminal.physical.eyes}</span>
                </p>
                <p className="mt-2">
                  <strong>Last Known Address:</strong>
                  <br />
                  <span className="font-normal">{criminal.address}</span>
                </p>
                <p className="mt-2">
                  <strong>Last Seen:</strong>
                  <br />
                  <span className="font-normal">{criminal.last_seen}</span>
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold text-lg mb-2 border-b pb-2">Offense History</h4>
              <div className="space-y-4">
                {criminal.offenses && criminal.offenses.length > 0 ? (
                  criminal.offenses.map((offense, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <p className="font-semibold text-md">{offense.crime}</p>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Date: {offense.date}</span>
                        <span>Severity: {offense.severity}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No offenses on record.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
