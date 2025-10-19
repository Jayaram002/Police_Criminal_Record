import { Database, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="w-6 h-6 mr-3" />
          <h1 className="text-xl font-bold">Criminal Record Database</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:text-gray-300 transition">Home</a>
          <a href="#" className="hover:text-gray-300 transition">Dashboard</a>
          <a href="#" className="hover:text-gray-300 transition">Reports</a>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Logout
          </button>
        </nav>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-2 pb-4">
          <a href="#" className="block py-2 hover:text-gray-300 transition">Home</a>
          <a href="#" className="block py-2 hover:text-gray-300 transition">Dashboard</a>
          <a href="#" className="block py-2 hover:text-gray-300 transition">Reports</a>
          <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
