import React from 'react';
import { HexColorPicker } from "react-colorful";

const SettingsModal = ({
       isOpen, onClose, language, setLanguage, uiSettings, setUiSettings,
       activeMode, exerciseRegistry, setExerciseRegistry, shopRegistry, setShopRegistry,
       cookRegistry, setCookRegistry, kbzhuRegistry, setKbzhuRegistry,
       shopListRegistry, setShopListRegistry, onRenameShopList,
       clearRegistry, t, LibraryEditor, ListManagementTab, activeTab, setActiveTab
   }) => {

    if (!isOpen) return null;

    const currentUISettings = uiSettings[activeMode] || {};

    const updateUI = (key, val) => {
        setUiSettings(prev => ({
            ...prev,
            [activeMode]: {
                ...prev[activeMode],
                [key]: val
            }
        }));
    };

    const getRegistryConfig = () => {
        if (activeMode === 'gym') return { items: exerciseRegistry, setter: setExerciseRegistry, title: t.exerciseLibrary };
        if (activeMode === 'shop') return { items: shopRegistry, setter: setShopRegistry, title: t.shopLibrary };
        if (activeMode === 'cook') return { items: cookRegistry, setter: setCookRegistry, title: t.cookLibrary };
        if (activeMode === 'kbzhu') return { items: kbzhuRegistry, setter: setKbzhuRegistry, title: t.kbzhuLibrary };
        return null;
    };

    const registryConfig = getRegistryConfig();

    const handleAdd = (val) => {
        if (activeMode === 'kbzhu') {
            registryConfig.setter(prev => [...prev, val].sort((a,b) => a.name.localeCompare(b.name)));
        } else {
            registryConfig.setter(prev => [...prev, val].sort((a,b) => a.localeCompare(b)));
        }
    };
    const handleDelete = (index) => registryConfig.setter(prev => prev.filter((_, i) => i !== index));
    const handleEdit = (index, val) => registryConfig.setter(prev => {
        const next = [...prev];
        next[index] = val;
        return next;
    });

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 fade-in">
            <div className="bg-white w-full max-w-[400px] rounded-[2px] border shadow-2xl overflow-y-auto max-h-[85vh] flex flex-col">
                <div className="px-6 pt-6 pb-2 flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.settings}</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 pt-4 flex border-b border-slate-50 bg-white sticky top-[68px] z-10">
                    <button onClick={() => setActiveTab('general')}
                            className={`flex-1 pb-3 px-1 text-[10px] font-black uppercase tracking-widest text-center transition-all border-b-2 
                                ${activeTab === 'general' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
                    >
                        {t.tabGeneral}
                    </button>
                    {activeMode !== 'pressure' && (<button onClick={() => setActiveTab('library')} className={`flex-1 pb-3 px-1 text-[10px] font-black uppercase tracking-widest text-center transition-all border-b-2 ${activeTab === 'library' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>{activeMode === 'gym' ? t.tabLibraryGym : activeMode === 'shop' ? t.tabLibraryShop : activeMode === 'cook' ? t.tabLibraryCook : t.tabLibraryKbzhu}</button>)}
                    {activeMode === 'shop' && (<button onClick={() => setActiveTab('lists')} className={`flex-1 pb-3 px-1 text-[10px] font-black uppercase tracking-widest text-center transition-all border-b-2 ${activeTab === 'lists' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>{t.tabLists}</button>)}
                </div>

                <div className="p-6 flex flex-col gap-8">
                    {activeTab === 'general' && (
                        <React.Fragment>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t.language}</label>
                                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                                    <button onClick={() => setLanguage('ru')} className={`py-2 rounded-lg text-xs font-bold transition-all ${language === 'ru' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{t.russian}</button>
                                    <button onClick={() => setLanguage('en')} className={`py-2 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{t.english}</button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {activeMode === 'gym' ? t.uiSettingsGym : activeMode === 'shop' ? t.uiSettingsShop : activeMode === 'pressure' ? t.uiSettingsPressure : activeMode === 'cook' ? t.uiSettingsCook : t.uiSettingsKbzhu}
                                </label>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-slate-600">{t.enableToastsLabel}</span>
                                        <label className="switch"><input type="checkbox" checked={currentUISettings.enableToasts !== false} onChange={(e) => updateUI('enableToasts', e.target.checked)} /><span className="slider"></span></label>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.toastDurationLabel}</span><span>{currentUISettings.toastDuration || 3}с</span></div>
                                        <input type="range" min="1" max="15" step="1" value={currentUISettings.toastDuration || 3} onChange={(e) => updateUI('toastDuration', parseInt(e.target.value))} />
                                    </div>
                                    {activeMode === 'gym' && (
                                        <div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.maxWorkoutTimeLabel}</span><span>{currentUISettings.maxWorkoutTime || 4}ч</span></div>
                                            <input type="range" min="1" max="24" step="1" value={currentUISettings.maxWorkoutTime || 4} onChange={(e) => updateUI('maxWorkoutTime', parseInt(e.target.value))} />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.fontSize}</span><span>{currentUISettings.fontSize}px</span></div>
                                        <input type="range" min="8" max="24" step="1" value={currentUISettings.fontSize} onChange={(e) => updateUI('fontSize', parseInt(e.target.value))} />
                                    </div>
                                    {(activeMode === 'shop' || activeMode === 'cook' || activeMode === 'kbzhu') && (
                                        <div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.lineCount}</span><span>{currentUISettings.lineCount}</span></div>
                                            <input type="range" min="1" max="6" step="1" value={currentUISettings.lineCount} onChange={(e) => updateUI('lineCount', parseInt(e.target.value))} />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.itemHeight}</span><span>{currentUISettings.itemHeight}px</span></div>
                                        <input type="range" min="30" max="150" step="2" value={currentUISettings.itemHeight} onChange={(e) => updateUI('itemHeight', parseInt(e.target.value))} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.itemWidth}</span><span>{currentUISettings.itemWidth}%</span></div>
                                        <input type="range" min="70" max="100" step="1" value={currentUISettings.itemWidth} onChange={(e) => updateUI('itemWidth', parseInt(e.target.value))} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1"><span>{t.itemSpacing}</span><span>{currentUISettings.itemSpacing}px</span></div>
                                        <input type="range" min="0" max="32" step="2" value={currentUISettings.itemSpacing} onChange={(e) => updateUI('itemSpacing', parseInt(e.target.value))} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-4 border-t border-slate-50">
                                        <div className="flex flex-col gap-1">
                                            <label className="flex flex-col items-center gap-1">
                                                <div className="color-picker-wrapper rounded-sm" style={{ backgroundColor: currentUISettings.backgroundColor || '#f8fafc' }}>
                                                    <input type="color" value={currentUISettings.backgroundColor || '#f8fafc'} />
                                                </div>
                                            </label>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                                                {t.bgColor}
                                            </label>
                                            <div className="flex justify-center">
                                                <HexColorPicker
                                                    color={currentUISettings.backgroundColor || '#f8fafc'}
                                                    onChange={(newColor) => updateUI('backgroundColor', newColor)}
                                                />
                                            </div>
                                        </div>


                                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                                            <div className="color-picker-wrapper" style={{ backgroundColor: currentUISettings.completedColor }}>
                                                <input type="color" value={currentUISettings.completedColor} onChange={(e) => updateUI('completedColor', e.target.value)} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase text-center">{t.colorCompleted}</span>
                                        </label>

                                        {(activeMode === 'gym' || activeMode === 'cook' || activeMode === 'kbzhu') && (
                                            <label className="flex flex-col items-center gap-2 cursor-pointer">
                                                <div className="color-picker-wrapper" style={{ backgroundColor: currentUISettings.highlightColor }}>
                                                    <input type="color" value={currentUISettings.highlightColor} onChange={(e) => updateUI('highlightColor', e.target.value)} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase text-center">{t.colorHighlight}</span>
                                            </label>
                                        )}

                                        {activeMode === 'gym' && (
                                            <label className="flex flex-col items-center gap-2 cursor-pointer">
                                                <div className="color-picker-wrapper" style={{ backgroundColor: currentUISettings.weightColor }}>
                                                    <input type="color" value={currentUISettings.weightColor} onChange={(e) => updateUI('weightColor', e.target.value)} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase text-center">{t.weightColor}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )}

                    {activeTab === 'library' && registryConfig && (
                        <div className="flex flex-col gap-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{registryConfig.title}</label>
                            <LibraryEditor items={registryConfig.items} onAdd={handleAdd} onDelete={handleDelete} onEdit={handleEdit} t={t} placeholder={t.editItemPlaceholder} mode={activeMode} />
                        </div>
                    )}

                    {activeTab === 'lists' && activeMode === 'shop' && (
                        <div className="flex flex-col gap-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.listManagement}</label>
                            <ListManagementTab shopListRegistry={shopListRegistry} setShopListRegistry={setShopListRegistry} onRenameList={onRenameShopList} t={t} />
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 pt-2 sticky bottom-0 bg-white shadow-[0_-10px_10px_-5px_rgba(255,255,255,1)]">
                    <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl active:scale-95">{t.close}</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;