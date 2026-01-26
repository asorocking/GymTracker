
import React, { useState, useEffect } from 'react';
import { TrackerRecord } from './types.ts';
import TrackerItem from './components/TrackerItem.tsx';
import RecordModal from './components/RecordModal.tsx';

const App: React.FC = () => {
  const [records, setRecords] = useState<TrackerRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrackerRecord | undefined>(undefined);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isPWA, setIsPWA] = useState(false);

  // Загрузка данных и проверка PWA
  useEffect(() => {
    const saved = localStorage.getItem('tracker_data');
    if (saved) {
      setRecords(JSON.parse(saved));
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWA(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Сохранение данных
  useEffect(() => {
    localStorage.setItem('tracker_data', JSON.stringify(records));
  }, [records]);

  const handleAddOrUpdate = (data: Omit<TrackerRecord, 'id' | 'createdAt'>) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => 
        r.id === editingRecord.id ? { ...r, ...data } : r
      ));
    } else {
      const newRecord: TrackerRecord = {
        ...data,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      setRecords(prev => [newRecord, ...prev]);
    }
    setIsModalOpen(false);
    setEditingRecord(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту запись?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleValueChange = (id: string, field: 'val1' | 'val2' | 'val3', value: string) => {
    setRecords(prev => prev.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-slate-200">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-5 pt-8 rounded-b-[2rem] shadow-lg sticky top-0 z-30">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-black tracking-tight">Мой Трекер</h1>
          <div className="flex items-center gap-2">
            {installPrompt && !isPWA && (
              <button 
                onClick={handleInstallClick}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Установить"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </div>
        </div>
        <p className="text-indigo-100 text-xs opacity-80 uppercase tracking-widest font-bold">
          {records.length} {records.length === 1 ? 'запись' : 'записей'}
        </p>
      </header>

      {/* List Container */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto space-y-3">
        {records.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">Список пуст. Нажмите +, чтобы добавить.</p>
          </div>
        ) : (
          records.map(record => (
            <TrackerItem 
              key={record.id}
              record={record}
              onDelete={handleDelete}
              onValueChange={handleValueChange}
              onEdit={(r) => {
                setEditingRecord(r);
                setIsModalOpen(true);
              }}
            />
          ))
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => {
          setEditingRecord(undefined);
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Footer Info */}
      <footer className="p-4 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
          Offline Ready PWA • v1.1
        </p>
      </footer>

      {/* Modals */}
      {isModalOpen && (
        <RecordModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrUpdate}
          initialData={editingRecord}
        />
      )}
    </div>
  );
};

export default App;
