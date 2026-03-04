import React from 'react';

const HeaderButtons = (props) => {
    return (
        <div className="px-4 flex justify-between items-center mb-0.5 overflow-visible h-9">
            <div className="relative flex-1 min-w-0 h-full flex items-center">
                <button onClick={() => props.mode === 'shop' && props.setIsListDropdownOpen(!props.isListDropdownOpen)}
                  className={`flex items-center gap-1.5 text-[15px] font-black text-slate-900 tracking-tight transition-all truncate pr-2 
                    ${props.mode === 'shop' ? 'hover:opacity-60 active:scale-95' : 'cursor-default'}`}
                >
                  {props.mode === 'gym' ? props.t.appName :
                      props.mode === 'shop' ? props.t.shopName :
                          props.mode === 'pressure' ? props.t.pressureName :
                              props.mode === 'cook' ? props.t.cookName :
                                  props.t.kbzhuName
                  }
                  {props.mode === 'shop' && (
                      <svg className={`w-3 h-3 text-slate-400 transition-transform ${props.isListDropdownOpen ? 'rotate-180' : ''}`}
                           fill="none" stroke="currentColor"
                           viewBox="0 0 24 24"
                      >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                      </svg>)
                  }
                </button>
                {props.isListDropdownOpen && props.mode === 'shop' && (
                    <React.Fragment>
                        <div className="fixed inset-0 z-40"
                             onClick={() => props.setIsListDropdownOpen(false)}
                        >
                        </div>
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden fade-in py-1">
                            <div className="max-h-64 overflow-y-auto no-scrollbar">
                                {props.allShopListsNames.length > 0 ? props.allShopListsNames.map(name => (
                                    <button key={name} onClick={(e) => {
                                            e.stopPropagation();
                                            props.setShopListName(name);
                                            props.setIsListDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3.5 text-xs font-black transition-colors flex items-center justify-between border-b border-slate-50 last:border-0 
                                            ${props.shopListName === name ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <span className="truncate flex-1 pr-2">
                                            {name}
                                        </span>
                                        {props.shopListName === name && <
                                            svg className="w-4 h-4 text-emerald-500 shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                        </svg>}
                                    </button>))
                                    : (<div className="px-4 py-5 text-[9px] font-black text-slate-400 italic text-center uppercase tracking-widest">
                                        {props.t.libraryEmpty}
                                    </div>)}
                            </div>
                        </div>
                    </React.Fragment>)}
            </div>
            {props.mode === 'gym' && (<div className="flex items-center gap-1 bg-slate-200/50 rounded-lg px-1.5 py-0.5 mx-1 shrink-0"><span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">{props.t.weight}</span><input type="text" inputMode="decimal" maxLength={5} value={props.currentWeight} onChange={(e) => props.handleWeightChange(e.target.value)} placeholder="--" className="w-8 bg-transparent border-none text-center text-xs font-black text-slate-900 focus:outline-none placeholder:text-slate-400" /><span className="text-[7px] font-bold text-slate-400">{props.t.kg}</span></div>)}
            <div className="flex items-center gap-0 shrink-0">
                {props.mode === 'gym' && (<button onClick={() => props.setIsStatsOpen(true)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-125 transition-transform" title={props.t.stats}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></button>)}
                <button onClick={() => props.setIsSettingsOpen(true)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-125 transition-transform" title={props.t.settings}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg></button>
                <input type="file" ref={props.importFileRef} onChange={props.importJSON} accept=".json" className="hidden" /><button onClick={props.triggerImport} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-125 transition-transform" title={props.t.import}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v8" /></svg></button>
                <button onClick={props.exportJSON} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-125 transition-transform" title={props.t.export}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 8l4 4m0 0l4-4m-4 4V4" /></svg></button>
                <button onClick={props.handleManualSave} className="w-6 h-6 flex items-center justify-center text-slate-900 hover:text-slate-900 active:scale-125 transition-transform" title={props.t.save}><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></button>
            </div>
        </div>
    );
};

export default HeaderButtons;