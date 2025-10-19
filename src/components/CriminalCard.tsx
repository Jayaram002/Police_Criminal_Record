import { Criminal } from '../lib/supabase';

interface CriminalCardProps {
  criminal: Criminal;
  onViewDetails: (criminal: Criminal) => void;
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

export default function CriminalCard({ criminal, onViewDetails }: CriminalCardProps) {
  const mostRecentOffense = criminal.offenses && criminal.offenses.length > 0
    ? criminal.offenses[0].crime
    : 'N/A';

  const photoUrl = criminal.photo_url || `https://placehold.co/400x400/6b7280/ffffff?text=${criminal.first_name[0]}${criminal.last_name[0]}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition">
      <img
        src={photoUrl}
        alt={`${criminal.first_name} ${criminal.last_name}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/400x400/6b7280/ffffff?text=${criminal.first_name[0]}${criminal.last_name[0]}`;
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">
            {criminal.first_name} {criminal.last_name}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(criminal.status)}`}>
            {criminal.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mt-1 truncate" title={criminal.id}>
          Person No: {criminal.id}
        </p>
        <div className="mt-4 border-t pt-3">
          <p className="text-sm text-gray-500 font-medium">Most Recent Offense:</p>
          <p className="text-sm text-gray-700">{mostRecentOffense}</p>
        </div>
        <button
          onClick={() => onViewDetails(criminal)}
          className="w-full mt-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          View Full Record
        </button>
      </div>
    </div>
  );
}
