import { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CriminalCard from './components/CriminalCard';
import ViewModal from './components/ViewModal';
import AddModal from './components/AddModal';
import { supabase, Criminal } from './lib/supabase';

function App() {
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [filteredCriminals, setFilteredCriminals] = useState<Criminal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCriminals = async () => {
    const { data, error } = await supabase
      .from('criminals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching records:', error);
      return;
    }

    setCriminals(data || []);
    setFilteredCriminals(data || []);
  };

  useEffect(() => {
    fetchCriminals();

    const channel = supabase
      .channel('criminals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'criminals' },
        () => {
          fetchCriminals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSearch = () => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = criminals.filter((criminal) => {
      const matchesSearch =
        searchTerm === '' ||
        criminal.first_name.toLowerCase().includes(searchLower) ||
        criminal.last_name.toLowerCase().includes(searchLower) ||
        criminal.id.toLowerCase().includes(searchLower) ||
        (criminal.offenses &&
          criminal.offenses.some((off) =>
            off.crime.toLowerCase().includes(searchLower)
          ));

      const matchesStatus =
        statusFilter === '' || criminal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredCriminals(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statusFilter, criminals]);

  const showEmptyState = filteredCriminals.length === 0;
  const hasSearchOrFilter = searchTerm || statusFilter;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto p-6">
        <SearchBar
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onSearch={handleSearch}
          onAddRecord={() => setShowAddModal(true)}
        />

        {showEmptyState ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              {hasSearchOrFilter
                ? 'No records found matching your criteria.'
                : 'No records in the database.'}
            </p>
            <p className="text-gray-500 mt-2">
              {hasSearchOrFilter
                ? 'Try adjusting your search or filter.'
                : 'Click "Add Record" to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCriminals.map((criminal) => (
              <CriminalCard
                key={criminal.id}
                criminal={criminal}
                onViewDetails={setSelectedCriminal}
              />
            ))}
          </div>
        )}
      </main>

      {selectedCriminal && (
        <ViewModal
          criminal={selectedCriminal}
          onClose={() => setSelectedCriminal(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCriminals}
        />
      )}
    </div>
  );
}

export default App;
