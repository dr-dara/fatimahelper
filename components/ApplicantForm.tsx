
import React, { useState } from 'react';
import type { Applicant } from '../types';

interface ApplicantFormProps {
  onAddApplicant: (applicant: Omit<Applicant, 'id' | 'createdAt' | 'applicationSent' | 'applicationReturned' | 'chequeLodged' | 'applicationSentAt' | 'applicationReturnedAt' | 'chequeLodgedAt'>) => void;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ onAddApplicant }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [eircode, setEircode] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) {
        alert("Please fill in Name, Address, and Phone.");
        return;
    }
    onAddApplicant({ name, address, eircode, phone });
    setName('');
    setAddress('');
    setEircode('');
    setPhone('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Add New Applicant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-600">Telephone</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., 087 123 4567"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                />
            </div>
        </div>
        <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-600">Address</label>
            <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 123 Main Street, Anytown"
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
            />
        </div>
        <div>
            <label htmlFor="eircode" className="block text-sm font-medium text-slate-600">Eircode / Postcode</label>
            <input
                id="eircode"
                type="text"
                value={eircode}
                onChange={(e) => setEircode(e.target.value)}
                placeholder="e.g., A65 F4E2"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
        </div>
        <div className="flex justify-end">
            <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
                Add Applicant
            </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicantForm;
