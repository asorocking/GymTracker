
import React, { useState, useEffect } from 'react';
import { TrackerRecord } from '../types';

interface RecordModalProps {
  onClose: () => void;
  onSubmit: (record: Omit<TrackerRecord, 'id' | 'createdAt'>) => void;
  initialData?: TrackerRecord;
}

const RecordModal: React.FC<RecordModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [line1, setLine1] = useState(initialData?.line1 || '');
  const [line2, setLine2] = useState(initialData?.line2 || '');
  const [val1, setVal1] = useState(initialData?.val1 || '');
  const [val2, setVal2] = useState(initialData?.val2 || '');
  const [val3, setVal3] = useState(initialData?.val3 || '');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ line1, line2, val1, val2, val3 });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {initialData ? 'Редактировать запись' : 'Новая запись'}
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Строка 1 (Заголовок)</label>
              <input 
                type="text" 
                autoFocus
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Что отслеживаем?"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Строка 2 (Описание)</label>
              <textarea 
                rows={2}
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                placeholder="Дополнительные детали..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1 text-center">Знач. 1</label>
                <input 
                  type="text" 
                  maxLength={2}
                  value={val1}
                  onChange={(e) => setVal1(e.target.value.slice(0, 2))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1 text-center">Знач. 2</label>
                <input 
                  type="text" 
                  maxLength={2}
                  value={val2}
                  onChange={(e) => setVal2(e.target.value.slice(0, 2))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1 text-center">Знач. 3</label>
                <input 
                  type="text" 
                  maxLength={2}
                  value={val3}
                  onChange={(e) => setVal3(e.target.value.slice(0, 2))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="00"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-95 transition-all"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordModal;
