import { X, Plus, Minus } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface AddModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Offense {
  crime: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function AddModal({ onClose, onSuccess }: AddModalProps) {
  const [offenses, setOffenses] = useState<Offense[]>([
    { crime: '', date: '', severity: 'Low' }
  ]);

  const addOffense = () => {
    setOffenses([...offenses, { crime: '', date: '', severity: 'Low' }]);
  };

  const removeOffense = (index: number) => {
    if (offenses.length > 1) {
      setOffenses(offenses.filter((_, i) => i !== index));
    }
  };

  const updateOffense = (index: number, field: keyof Offense, value: string) => {
    const newOffenses = [...offenses];
    newOffenses[index] = { ...newOffenses[index], [field]: value };
    setOffenses(newOffenses);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const validOffenses = offenses.filter(
      (off) => off.crime && off.date && off.severity
    );

    validOffenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const personNumber = formData.get('personNumber') as string;

    const newCriminal = {
      id: personNumber,
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      dob: formData.get('dob') as string,
      address: formData.get('address') as string,
      status: formData.get('status') as string,
      photo_url: formData.get('photoUrl') as string || `https://placehold.co/400x400/6b7280/ffffff?text=${(formData.get('firstName') as string)[0]}${(formData.get('lastName') as string)[0]}`,
      last_seen: formData.get('lastSeen') as string || '',
      physical: {
        height: formData.get('height') as string || '',
        weight: formData.get('weight') as string || '',
        hair: formData.get('hair') as string || '',
        eyes: formData.get('eyes') as string || ''
      },
      offenses: validOffenses
    };

    const { error } = await supabase.from('criminals').insert([newCriminal]);

    if (error) {
      console.error('Error saving record:', error);
      alert('Could not save the record. Please check the console for errors.');
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl bg-white rounded-lg shadow-2xl z-50">
        <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Add New Criminal Record</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Person Number (ID)</label>
              <input
                type="text"
                name="personNumber"
                placeholder="e.g., 1234-5678-9012"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
                pattern="[A-Za-z0-9\-]+"
                title="Person number can contain letters, numbers, and hyphens"
              />
              <p className="text-xs text-gray-500 mt-1">Enter a unique identification number for this person</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Status</label>
              <select
                name="status"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              >
                <option>Incarcerated</option>
                <option>On Parole</option>
                <option>Released</option>
                <option>Wanted</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Photo URL</label>
              <input
                type="text"
                name="photoUrl"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Last Seen Location</label>
              <input
                type="text"
                name="lastSeen"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>

          <h4 className="font-bold text-lg p-2 rounded-md bg-gray-100 text-gray-800">
            Physical Description
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Height</label>
              <input
                type="text"
                name="height"
                placeholder="e.g., 5'11&quot;"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Weight (lbs)</label>
              <input
                type="number"
                name="weight"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Hair Color</label>
              <input
                type="text"
                name="hair"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Eye Color</label>
              <input
                type="text"
                name="eyes"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>

          <h4 className="font-bold text-lg p-2 rounded-md bg-gray-100 text-gray-800 mt-4">
            Offenses
          </h4>
          <div className="space-y-2">
            {offenses.map((offense, index) => (
              <div key={index} className="relative grid grid-cols-1 md:grid-cols-3 gap-2 p-2 border rounded-md bg-gray-50">
                <input
                  type="text"
                  placeholder="Crime"
                  value={offense.crime}
                  onChange={(e) => updateOffense(index, 'crime', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
                <input
                  type="date"
                  value={offense.date}
                  onChange={(e) => updateOffense(index, 'date', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
                <select
                  value={offense.severity}
                  onChange={(e) => updateOffense(index, 'severity', e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                {offenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOffense(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOffense}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Offense
          </button>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
