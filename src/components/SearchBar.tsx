import { Search, Plus } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearch: () => void;
  onAddRecord: () => void;
}

export default function SearchBar({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onSearch,
  onAddRecord
}: SearchBarProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Search Records</h2>
        <button
          onClick={onAddRecord}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by Name, Person No, or Offense..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="col-span-1 md:col-span-2 lg:col-span-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Incarcerated">Incarcerated</option>
          <option value="On Parole">On Parole</option>
          <option value="Released">Released</option>
          <option value="Wanted">Wanted</option>
        </select>
        <button
          onClick={onSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  );
}
