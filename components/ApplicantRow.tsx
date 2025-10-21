
import React from 'react';
import type { Applicant } from '../types';

interface ApplicantRowProps {
  applicant: Applicant;
  onUpdate: (id: string, updates: Partial<Omit<Applicant, 'id'>>) => void;
  onDelete: (id: string) => void;
}

const formatDate = (timestamp: number | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-IE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const CustomCheckbox: React.FC<{ checked: boolean; onChange: () => void; label: string; id: string; timestamp: number | null; }> = ({ checked, onChange, label, id, timestamp }) => (
    <div>
        <div className="flex items-center">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-slate-700">{label}</label>
        </div>
        {checked && timestamp && (
            <p className="text-xs text-slate-500 ml-6" aria-label={`${label} timestamp`}>
                {formatDate(timestamp)}
            </p>
        )}
    </div>
);


const ApplicantRow: React.FC<ApplicantRowProps> = ({ applicant, onUpdate, onDelete }) => {
    const progress = (
        (applicant.applicationSent ? 1 : 0) +
        (applicant.applicationReturned ? 1 : 0) +
        (applicant.chequeLodged ? 1 : 0)
    );
    const progressPercentage = (progress / 3) * 100;

    const progressColor = () => {
        if (progress === 3) return 'bg-green-500';
        if (progress === 2) return 'bg-primary-500';
        if (progress === 1) return 'bg-yellow-500';
        return 'bg-slate-300';
    };
    
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{applicant.name}</div>
                <div className="text-sm text-slate-500">{applicant.phone}</div>
                <div className="text-xs text-slate-400 mt-1" aria-label="Creation date">
                    Added: {formatDate(applicant.createdAt)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-800">{applicant.address}</div>
                <div className="text-sm text-slate-500">{applicant.eircode}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div className="space-y-2">
                    <CustomCheckbox
                        id={`sent-${applicant.id}`}
                        label="Application Sent"
                        checked={applicant.applicationSent}
                        onChange={() => onUpdate(applicant.id, { applicationSent: !applicant.applicationSent })}
                        timestamp={applicant.applicationSentAt}
                    />
                    <CustomCheckbox
                        id={`returned-${applicant.id}`}
                        label="Application Returned"
                        checked={applicant.applicationReturned}
                        onChange={() => onUpdate(applicant.id, { applicationReturned: !applicant.applicationReturned })}
                        timestamp={applicant.applicationReturnedAt}
                    />
                    <CustomCheckbox
                        id={`lodged-${applicant.id}`}
                        label="Cheque Lodged"
                        checked={applicant.chequeLodged}
                        onChange={() => onUpdate(applicant.id, { chequeLodged: !applicant.chequeLodged })}
                        timestamp={applicant.chequeLodgedAt}
                    />
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center">
                    <span className="text-sm text-slate-600 w-8">{`${progress}/3`}</span>
                    <div className="w-24 bg-slate-200 rounded-full h-2.5 ml-2">
                        <div className={`${progressColor()} h-2.5 rounded-full`} style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                    onClick={() => onDelete(applicant.id)} 
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="Delete applicant"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default ApplicantRow;
