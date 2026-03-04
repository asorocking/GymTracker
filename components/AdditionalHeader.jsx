import React from 'react';

const AdditionalHeader = (props) => {
    return (
        <div className="px-4 pb-1">
            <div className="flex items-center justify-between bg-white/60 rounded-xl p-0.5 border border-slate-200/50 shadow-sm min-h-[40px]">
                {props.mode === 'gym' || props.mode === 'pressure' ? (
                    <React.Fragment>
                        <div className="w-10 flex justify-center"><button onClick={() => props.changeDate(-1)} className="nav-btn shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button></div>
                        {props.mode === 'gym' ? (
                            <div className="flex-1 flex justify-center"><button onPointerDown={props.onStartPointerDown} onPointerUp={props.onStartPointerUp} onPointerLeave={() => clearTimeout(props.longPressTimer.current)} onContextMenu={(e) => e.preventDefault()} className={`px-3 py-1 text-[8px] font-black uppercase tracking-tighter rounded-md transition-all duration-300 select-none ${props.sSA ? 'bg-emerald-600 text-white shadow-md' : props.sP ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 active:bg-slate-900 active:text-white'}`}>{props.sP ? props.t.start : props.t.start}</button></div>
                        ) : (
                            <div className="flex-1 flex justify-center"><span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{props.t.pressureName}</span></div>
                        )}
                        <div onClick={() => props.setIsCalendarOpen(true)} className="flex flex-col items-center justify-center cursor-pointer px-1 shrink-0 min-w-[80px] hover:bg-slate-100 rounded-lg active:scale-95 transition-all"><span className="text-[10px] font-black text-slate-900 tabular-nums leading-none whitespace-nowrap mb-0.5">{props.displayDate}</span>{props.currentSessionDuration && props.mode === 'gym' && (<div className="flex flex-col items-center gap-0"><span className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{props.t.workoutTime}</span><span className={`text-[10px] font-black tabular-nums leading-none ${props.sP ? 'text-slate-400' : 'text-slate-600'}`}>{props.currentSessionDuration}</span></div>)}</div>
                        {props.mode === 'gym' ? (
                            <div className="flex-1 flex justify-center"><button onClick={props.handleFinishSession} className={`px-3 py-1 text-[8px] font-black uppercase tracking-tighter rounded-md transition-all duration-300 ${props.sP ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 active:bg-slate-900 active:text-white'}`}>{props.t.finish}</button></div>
                        ) : (
                            <div className="flex-1"></div>
                        )}
                        <div className="w-10 flex justify-center"><button onClick={() => props.changeDate(1)} className="nav-btn shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button></div>
                    </React.Fragment>
                ) : props.mode === 'shop' ? (
                    <React.Fragment>
                        <button onClick={() => props.changeShopList(-1)} className="nav-btn shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
                        <div className="flex items-center flex-1 px-1 gap-1.5 min-w-0 transition-all">
                            <div className="shrink-0"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" /></svg></div>
                            <input type="text" value={props.shopListName} onChange={(e) => props.setShopListName(e.target.value)} placeholder={props.t.defaultListName} className={`flex-1 bg-transparent border-none outline-none text-sm font-black focus:ring-0 p-0 m-0 overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${props.allShopListsNames.includes(props.shopListName.trim()) ? 'text-slate-900' : 'text-slate-400'}`} />
                        </div>
                        <button onClick={() => props.changeShopList(1)} className="nav-btn shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
                        <button onClick={props.handleDeleteCurrentShopList} className={`nav-btn shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-300 ${props.isListDeleteConfirming ? 'text-red-600 bg-red-50 rounded-lg scale-110' : 'text-slate-400'}`} title={props.t.deleteListConfirm}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{props.isListDeleteConfirming ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />)}</svg></button>
                    </React.Fragment>
                ) : props.mode === 'cook' ? (
                    <div className="flex-1 flex items-center px-3 gap-2">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                            <input type="text" value={props.cookSearchQuery} onChange={(e) => props.setCookSearchQuery(e.target.value)} placeholder={props.t.cookSearchPlaceholder} className="block w-full pl-7 bg-slate-100/50 border-none rounded-lg py-1.5 text-xs font-black text-slate-900 focus:ring-0 placeholder:text-slate-300 transition-all" />
                            {props.cookSearchQuery && (<button onClick={() => props.setCookSearchQuery('')} className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 active:text-slate-900"><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>)}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-between px-3 gap-2 overflow-hidden">
                        <button
                            onClick={props.calculateKbzhuTotals}
                            className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg active:scale-95 transition-all shadow-sm shrink-0"
                        >
                            {props.t.calculate}
                        </button>
                        {props.kbzhuResults && (
                            <div className="flex gap-2 text-xs text-slate-700 text-right">
                                <span className="text-grey-400">Б: </span><span className="font-black">{props.kbzhuResults.b};</span>
                                <span className="text-grey-400">Ж: </span><span className="font-black">{props.kbzhuResults.j};</span>
                                <span className="text-grey-400">У: </span><span className="font-black">{props.kbzhuResults.u};</span>
                                <span className="text-grey-400">К: </span><span className="font-black text-red-600">{props.kbzhuResults.k};</span>
                                <span className="text-grey-400">Вес: </span><span className="font-black text-red-600">{props.kbzhuResults.w}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdditionalHeader;