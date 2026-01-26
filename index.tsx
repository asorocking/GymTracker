
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
interface TrackerRecord {
  id: string;
  line1: string;
  line2: string;
  val1: string;
  val2: string;
  val3: string;
  createdAt: number;
}

// --- Components ---
const TrackerItem: React.FC<{
  record: TrackerRecord;
  onDelete: (id: string) => void;
  onEdit: (record: TrackerRecord) => void;
  onValueChange: (id: string, field: 'val1' | 'val2' | 'val3', value: string) => void;
}> = ({ record, onDelete, onEdit, onValueChange }) => {
  const handleInputChange = (field: 'val1' | 'val2' | 'val3', e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(record.id, field, e.target.value.slice(0, 2));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm active:border-indigo-300 transition-colors">
      <div className="flex-1 cursor-pointer pr-4" onClick={() => onEdit(record)}>
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate w-32">
          {record.line1 || 'Без названия'}
        </div>
        <div className="text-[10px] text-slate-500 truncate w-32 mt-0.5">
          {record.line2 || '...'}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {['val1', 'val2', 'val3'].map((f) => (
          <input 
            key={f}
            type="text" 
            inputMode="numeric"
            value={record[f as keyof TrackerRecord] as string}
            onChange={(e) => handleInputChange(f as any, e)}
            className="w-10 h-9 text-center border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
            placeholder="0"
          />
        ))}
      </div>

      <button 
        onClick={() => onDelete(record.id)}
        className="ml-3 text-slate-300 hover:text-red-500 p-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

const RecordModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: TrackerRecord;
}> = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    line1: initialData?.line1 || '',
    line2: initialData?.line2 || '',
    val1: initialData?.val1 || '',
    val2: initialData?.val2 || '',
    val3: initialData?.val3 || '',
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
        <h2 className="text-xl font-black text-slate-900 mb-6">
          {initialData ? 'Изменить' : 'Добавить запись'}
        </h2>
        <div className="space-y-4">
          <input 
            autoFocus
            className="w-full border-b-2 border-slate-100 p-2 text-base focus:border-indigo-500 outline-none transition-colors"
            placeholder="Название (например: Приседания)"
            value={form.line1}
            onChange={e => setForm({...form, line1: e.target.value})}
          />
          <input 
            className="w-full border-b-2 border-slate-100 p-2 text-sm focus:border-indigo-500 outline-none transition-colors"
            placeholder="Описание или заметка"
            value={form.line2}
            onChange={e => setForm({...form, line2: e.target.value})}
          />
          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 py-3 text-slate-400 font-bold uppercase text-xs tracking-widest">Отмена</button>
            <button 
              onClick={() => onSubmit(form)}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [records, setRecords] = useState<TrackerRecord[]>(() => {
    const saved = localStorage.getItem('tracker_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [modal, setModal] = useState<{open: boolean, data?: TrackerRecord}>({open: false});

  useEffect(() => {
    localStorage.setItem('tracker_v2', JSON.stringify(records));
  }, [records]);

  const handleSave = (formData: any) => {
    if (modal.data) {
      setRecords(prev => prev.map(r => r.id === modal.data!.id ? { ...r, ...formData } : r));
    } else {
      setRecords(prev => [{ ...formData, id: Date.now().toString(), createdAt: Date.now() }, ...prev]);
    }
    setModal({open: false});
  };

  const handleValueChange = (id: string, field: string, value: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <header className="bg-white p-6 pb-4 border-b border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">TRACKER</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Daily Activity Log</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {records.map(r => (
          <TrackerItem 
            key={r.id} 
            record={r} 
            onDelete={id => setRecords(prev => prev.filter(x => x.id !== id))}
            onEdit={data => setModal({open: true, data})}
            onValueChange={handleValueChange}
          />
        ))}
        {records.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 pt-20">
            <div className="w-20 h-20 border-4 border-dashed border-slate-400 rounded-full mb-4"></div>
            <p className="font-bold uppercase text-xs tracking-widest">Пусто</p>
          </div>
        )}
      </main>

      <button 
        onClick={() => setModal({open: true})}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {modal.open && (
        <RecordModal 
          initialData={modal.data}
          onClose={() => setModal({open: false})}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
