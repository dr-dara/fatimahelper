import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Applicant } from './types';
import ApplicantForm from './components/ApplicantForm';
import ApplicantList from './components/ApplicantList';

const FILTERS = ['All', 'Awaiting Application', 'Awaiting Return', 'Awaiting Lodgement', 'Complete'];

const App: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    supabase
      .from('applicants')
      .select('*')
      .then(({ data, error }) => {
        if (error) { setApplicants([]); return; }
        setApplicants(data || []);
      });
  }, []);

  const filteredAndSortedApplicants = useMemo(() => {
    return applicants
      .filter(applicant => {
        switch (activeFilter) {
          case 'Awaiting Application':
            return !applicant.application_sent;
          case 'Awaiting Return':
            return applicant.application_sent && !applicant.application_returned;
          case 'Awaiting Lodgement':
            return applicant.application_returned && !applicant.cheque_lodged;
          case 'Complete':
            return applicant.cheque_lodged;
          case 'All':
          default:
            return true;
        }
      })
      .filter(applicant => {
        const query = searchQuery.toLowerCase();
        return (
          applicant.name.toLowerCase().includes(query) ||
          applicant.address.toLowerCase().includes(query) ||
          applicant.eircode.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (b.created_at ? new Date(b.created_at).getTime() : 0) - (a.created_at ? new Date(a.created_at).getTime() : 0));
  }, [applicants, searchQuery, activeFilter]);

  const handleAddApplicant = (applicant: Partial<Applicant>) => {
    supabase
      .from('applicants')
      .insert([applicant])
      .then(({ data }) => {
        if (data) setApplicants(prev => [data[0], ...prev]);
        setIsFormVisible(false);
      });
  };

  const handleUpdateApplicant = (id: string, updates: Partial<Applicant>) => {
  // Optimistic local update
  setApplicants(prev =>
    prev.map(applicant =>
      applicant.id === id ? { ...applicant, ...updates } : applicant
    )
  );

  // Persist to Supabase
  supabase
    .from('applicants')
    .update(updates)
    .eq('id', id)
    .then(({ data, error }) => {
      // If the DB actually returns data, sync it for best accuracy
      if (data && data[0]) {
        setApplicants(prev =>
          prev.map(applicant =>
            applicant.id === id ? data[0] : applicant
          )
        );
      }
      // Optionally handle error here (rollback on error)
      if (error) {
        alert("Update failed: " + error.message);
        // Optionally: reload from DB to resync or show notification
      }
    });
};


  const handleDeleteApplicant = (id: string) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      supabase
        .from('applicants')
        .delete()
        .eq('id', id)
        .then(() => setApplicants(prev => prev.filter(app => app.id !== id)));
    }
  };

  // Progress bar component
  const progress =
    applicants.length > 0
      ? Math.round(
          100 * applicants.filter(a => a.cheque_lodged).length / applicants.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary-800">Trip Organizer's Helper</h1>
            <p className="text-slate-500 mt-1">Manage your trip participants with ease.</p>
          </div>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
          >
            {isFormVisible ? 'Close Form' : 'Add Applicant'}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isFormVisible && (
          <div className="mb-8">
            <ApplicantForm onAddApplicant={handleAddApplicant} />
          </div>
        )}

        <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, address, or eircode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Search applicants"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {FILTERS.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${activeFilter === filter ? 'bg-primary-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {applicants.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div>Progress: {progress}%</div>
            <div style={{ width: "100%", background: "#ddd", borderRadius: 5, height: 10 }}>
              <div style={{
                width: `${progress}%`,
                background: "#10B981", height: 10, borderRadius: 5
              }} />
            </div>
          </div>
        )}

        <ApplicantList
          applicants={filteredAndSortedApplicants}
          onUpdate={handleUpdateApplicant}
          onDelete={handleDeleteApplicant}
        />
      </main>
      <footer className="text-center py-4 text-slate-400 text-sm">
        <p>Built for efficiency.</p>
      </footer>
    </div>
  );
};

export default App;
