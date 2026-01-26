
import React from 'react';
import { TrackerRecord } from '../types';

interface TrackerItemProps {
  record: TrackerRecord;
  onDelete: (id: string) => void;
  onEdit: (record: TrackerRecord) => void;
  onValueChange: (id: string, field: 'val1' | 'val2' | 'val3', value: string) => void;
}

const TrackerItem: React.FC<TrackerItemProps> = ({ record, onDelete, onEdit, onValueChange }) => {
  const handleInputChange = (field: 'val1' | 'val2' | 'val3', e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 2);
    onValueChange(record.id, field, val);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors group">
      {/* Left section: Descriptions */}
      <div 
        className="flex-1 cursor-pointer pr-4" 
        onClick={() => onEdit(record)}
      >
        <div className="text-xs font-semibold text-slate-800 break-words leading-tight uppercase tracking-wide">
          {record.line1 || 'Без названия'}
        </div>
        <div className="text-[10px] text-slate-500 break-words leading-tight mt-0.5">
          {record.line2 || '...'}
        </div>
      </div>

      {/* Middle section: Inputs */}
      <div className="flex items-center gap-1.5 shrink-0">
        <input 
          type="text" 
          value={record.val1}
          onChange={(e) => handleInputChange('val1', e)}
          className="w-10 h-8 text-center border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50"
          placeholder="00"
          maxLength={2}
        />
        <input 
          type="text" 
          value={record.val2}
          onChange={(e) => handleInputChange('val2', e)}
          className="w-10 h-8 text-center border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50"
          placeholder="00"
          maxLength={2}
        />
        <input 
          type="text" 
          value={record.val3}
          onChange={(e) => handleInputChange('val3', e)}
          className="w-10 h-8 text-center border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50"
          placeholder="00"
          maxLength={2}
        />
      </div>

      {/* Right section: Delete button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(record.id);
        }}
        className="ml-3 text-slate-300 hover:text-red-500 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TrackerItem;
