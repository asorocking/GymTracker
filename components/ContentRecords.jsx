import React, { useState, useEffect, useRef, useMemo } from 'react';

const TrackerItem = ({ record, index, onDelete, onUpdate, onDragStart, onDragOver, onDragEnd, isDragging, uiSettings, mode, knownItems, t }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const textRef = useRef(null);
    const notesAreaRef = useRef(null);
    const confirmTimeout = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        if (record.isNew && textRef.current && mode !== 'pressure') {
            textRef.current.focus();
            onUpdate(record.id, 'isNew', false);
        }
    }, []);

    const filteredSuggestions = useMemo(() => {
        if (!record.description || record.description.length < 1) return [];
        const query = record.description.toLowerCase().trim();

        if (mode === 'kbzhu') {
            return knownItems.filter(item => item.name.toLowerCase().includes(query) && item.name.toLowerCase() !== query).slice(0, 5);
        }
        return knownItems.filter(item => item.toLowerCase().includes(query) && item.toLowerCase() !== query).slice(0, 5);
    }, [record.description, knownItems, mode]);

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isConfirming) { onDelete(record.id); } else {
            setIsConfirming(true);
            if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
            confirmTimeout.current = setTimeout(() => setIsConfirming(false), 3000);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (mode === 'kbzhu') {
            onUpdate(record.id, 'description', suggestion.name);
            onUpdate(record.id, 'val1', suggestion.k || '0');
            onUpdate(record.id, 'val2', suggestion.b || '0');
            onUpdate(record.id, 'val3', suggestion.j || '0');
            onUpdate(record.id, 'val4', suggestion.u || '0');
        } else {
            onUpdate(record.id, 'description', suggestion);
        }
        setShowSuggestions(false);
    };

    const handleBlur = (field) => {
        setTimeout(() => setShowSuggestions(false), 200);
        const finalVal = (record[field] || "").trim();
        if (finalVal !== record[field]) {
            onUpdate(record.id, field, finalVal);
        }
    };

    const handleWeightInput = (val) => {
        const cleaned = val.replace(',', '.').replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
        onUpdate(record.id, 'weight', finalVal.slice(0, 4));
    };

    const toggleExpanded = () => { if (mode === 'cook') setIsExpanded(!isExpanded); };

    const hasSuggestions = showSuggestions && filteredSuggestions.length > 0;

    const itemStyles = {
        height: isExpanded ? 'auto' : `${uiSettings.itemHeight + (mode === 'pressure' ? 12 : 0)}px`,
        width: `${uiSettings.itemWidth}%`,
        marginBottom: `${uiSettings.itemSpacing}px`,
        backgroundColor: 'white',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        zIndex: hasSuggestions ? 500 : (isExpanded ? 10 : 1),
        overflow: hasSuggestions ? 'visible' : 'hidden',
        position: 'relative',
        paddingBottom: isExpanded ? '12px' : '0px'
    };

    if (record.isCompleted && record.isHighlighted && (mode === 'gym' || mode === 'cook' || mode === 'kbzhu')) {
        itemStyles.backgroundColor = uiSettings.completedColor;
        itemStyles.borderColor = uiSettings.highlightColor;
        itemStyles.boxShadow = `0 0 0 2px ${uiSettings.highlightColor} inset`;
    } else if (record.isCompleted) {
        itemStyles.backgroundColor = uiSettings.completedColor;
        itemStyles.borderColor = '#cbd5e1';
    } else if (record.isHighlighted && (mode === 'gym' || mode === 'cook' || mode === 'kbzhu')) {
        itemStyles.backgroundColor = uiSettings.highlightColor;
        itemStyles.borderColor = '#cbd5e1';
    }

    const formattedTime = record.createdAt ? new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';

    return (
        <div draggable={mode !== 'cook' && mode !== 'kbzhu'} onDragStart={mode !== 'cook' && mode !== 'kbzhu' ? (e) => onDragStart(e, index) : null} onDragOver={mode !== 'cook' && mode !== 'kbzhu' ? (e) => onDragOver(e, index) : null} onDragEnd={mode !== 'cook' && mode !== 'kbzhu' ? onDragEnd : null} style={itemStyles} onClick={toggleExpanded} className={`rounded-lg px-0.5 flex flex-col shadow-sm fade-in tracker-item transition-all duration-200 self-center ${isDragging ? 'dragging' : ''}`}>
            <div className="flex items-center w-full" style={{ height: `${uiSettings.itemHeight}px` }}>
                {mode !== 'cook' && mode !== 'kbzhu' ? (
                    <div className="flex items-center drag-handle px-0.5 shrink-0 h-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-0.5 opacity-20">
                            {[1, 2, 3].map(i => (<div key={i} className="flex gap-0.5"><div className="w-0.5 h-0.5 bg-slate-900 rounded-full"></div><div className="w-0.5 h-0.5 bg-slate-900 rounded-full"></div></div>))}
                        </div>
                    </div>
                ) : mode === 'cook' ? (
                    <div className="shrink-0 pl-1 pr-1 text-slate-400">
                        <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                ) : (
                    <div className="shrink-0 w-1"></div>
                )}

                <div className="flex-col items-center gap-0.5 shrink-0 px-0.5 py-0.5 flex" onClick={(e) => e.stopPropagation()}>
                    {(mode === 'gym') && (
                        <button onClick={() => onUpdate(record.id, 'isHighlighted', !record.isHighlighted)} className={`p-0.5 transition-all active:scale-90 ${record.isHighlighted ? 'text-slate-700' : 'text-slate-300'}`}>
                            <svg className="w-3.5 h-3.5" fill={record.isHighlighted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="4" /></svg>
                        </button>
                    )}
                    {mode !== 'pressure' && mode !== 'cook' && (
                        <button onClick={() => onUpdate(record.id, 'isCompleted', !record.isCompleted)} className={`transition-all active:scale-90 ${mode === 'shop' ? 'p-1.5' : 'p-0.5'} ${record.isCompleted ? 'text-emerald-600' : 'text-slate-300'}`}>
                            <svg className={mode === 'shop' ? "w-5 h-5" : "w-3.5 h-3.5"} fill={record.isCompleted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={6} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    )}
                </div>

                <div className="flex-1 min-w-0 h-full flex flex-col justify-center gap-0 ml-1 relative">
                    {mode === 'gym' ? (
                        <React.Fragment>
                            <div className="flex items-center gap-1.5 pr-1">
                                <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
                                    <input ref={textRef} type="text" value={record.description} onFocus={() => setShowSuggestions(true)} onBlur={() => handleBlur('description')} onChange={(e) => { onUpdate(record.id, 'description', e.target.value); setShowSuggestions(true); }} placeholder={t.recordPlaceholder} style={{ fontSize: `${uiSettings.fontSize || 12}px` }} className={`font-black bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 w-full p-0 m-0 leading-tight truncate ${(record.isHighlighted && mode === 'gym') || record.isCompleted ? 'text-black' : 'text-slate-800'} ${record.isCompleted ? 'opacity-50' : ''}`} />
                                    {hasSuggestions && (<div className="suggestions-list" ref={suggestionsRef}>{filteredSuggestions.map(s => (<div key={s} onMouseDown={() => handleSuggestionClick(s)} className="suggestion-item">{s}</div>))}</div>)}
                                </div>
                                <div className="shrink-0 flex items-center bg-slate-100/30 rounded px-1 border border-slate-200/50" onClick={(e) => e.stopPropagation()}>
                                    <input type="text" inputMode="decimal" maxLength={4} value={record.weight || ''} onChange={(e) => handleWeightInput(e.target.value)} placeholder={t.weightPlaceholder} style={{ fontSize: `${(uiSettings.fontSize || 12) - 1}px`, color: uiSettings.weightColor || '#475569' }} className="w-9 text-center bg-transparent border-none outline-none focus:ring-0 p-0 m-0 font-bold placeholder:text-slate-300 tabular-nums" />
                                </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <input type="text" value={record.notes || ''} onBlur={() => handleBlur('notes')} onChange={(e) => onUpdate(record.id, 'notes', e.target.value)} placeholder={t.notesPlaceholder} style={{ fontSize: `${uiSettings.fontSize || 12}px` }} className={`font-black bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 w-full p-0 m-0 leading-tight truncate ${record.isCompleted ? 'opacity-40' : 'opacity-60 text-slate-500'}`} />
                            </div>
                        </React.Fragment>
                    ) : mode === 'shop' ? (
                        <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                            <textarea ref={textRef} rows={uiSettings.lineCount || 2} value={record.description} onFocus={() => setShowSuggestions(true)} onBlur={() => handleBlur('description')} onChange={(e) => { onUpdate(record.id, 'description', e.target.value); setShowSuggestions(true); }} placeholder={t.shopPlaceholder} style={{ fontSize: `${uiSettings.fontSize || 12}px` }} className={`font-semibold bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 w-full p-0 m-0 leading-tight resize-none ${record.isCompleted ? 'opacity-50 strike-through text-slate-400' : 'text-slate-700'}`} />
                            {hasSuggestions && (<div className="suggestions-list" ref={suggestionsRef}>{filteredSuggestions.map(s => (<div key={s} onMouseDown={() => handleSuggestionClick(s)} className="suggestion-item">{s}</div>))}</div>)}
                        </div>
                    ) : (mode === 'cook' || mode === 'kbzhu') ? (
                        <div className="flex items-center gap-2 pr-1">
                            <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
                                <input ref={textRef} type="text" value={record.description} onFocus={() => setShowSuggestions(true)} onBlur={() => handleBlur('description')} onChange={(e) => { onUpdate(record.id, 'description', e.target.value); setShowSuggestions(true); }} placeholder={mode === 'cook' ? t.cookPlaceholder : t.kbzhuPlaceholder} style={{ fontSize: `${uiSettings.fontSize || 14}px` }} className={`font-black bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 w-full p-0 m-0 leading-tight truncate ${record.isCompleted ? 'opacity-50' : 'text-slate-800'}`} />
                                {hasSuggestions && (<div className="suggestions-list" ref={suggestionsRef}>{filteredSuggestions.map(s => (<div key={s} onMouseDown={() => handleSuggestionClick(s)} className="suggestion-item">{mode === 'kbzhu' ? s.name : s}</div>))}</div>)}
                            </div>
                            {mode === 'kbzhu' && (
                                <div className="shrink-0 flex items-center gap-1">
                                    <div className="flex pt-0.5 gap-0.5 items-center bg-slate-100/30 rounded px-1 border border-slate-200/50" onClick={(e) => e.stopPropagation()}>
                                        {['val1', 'val2', 'val3', 'val4'].map((f, i) => {
                                            const isMacro = i > 0;
                                            return (
                                                <div key={f} className="flex flex-col items-center">
                                                    <span className="text-[6px] font-black text-slate-400 leading-none uppercase">{['к','б','ж','у'][i]}</span>
                                                    <input type="text" inputMode={isMacro ? "decimal" : "numeric"} maxLength={isMacro ? 5 : 4} value={record[f] || ''} onChange={(e) => { let val = e.target.value; if (isMacro) { val = val.replace(',', '.').replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = `${parts[0]}.${parts.slice(1).join('')}`; onUpdate(record.id, f, val.slice(0, 5)); } else { onUpdate(record.id, f, val.replace(/\D/g, '').slice(0, 4)); } }} className={`${isMacro ? 'w-7' : 'w-6'} h-5 text-center bg-transparent border-none outline-none p-0 text-[10px] font-black text-slate-900 focus:ring-0`} placeholder="0" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="shrink-0 pt-0.5 flex flex-col items-center bg-slate-100/30 rounded px-1 border border-slate-200/50" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-[6px] font-black text-slate-400 leading-none uppercase">Вес</span>
                                        <input type="text" inputMode="decimal" maxLength={4} value={record.weight || ''} onChange={(e) => handleWeightInput(e.target.value)} placeholder={t.weightPlaceholder} style={{ fontSize: `${(uiSettings.fontSize || 12)}px` }} className="w-9 text-center bg-transparent border-none outline-none focus:ring-0 p-0 m-0 font-black placeholder:text-slate-300 tabular-nums text-slate-900" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-0 w-full pr-1" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5 w-full">
                                <div className="flex flex-col items-start gap-0.5 mr-1"><span className="text-[8px] font-black uppercase text-slate-400 leading-none">{t.timeLabel}</span><span className="text-[11px] font-black text-slate-600 tabular-nums leading-none">{formattedTime}</span></div>
                                <div className="flex-1 flex gap-1.5 items-center justify-between">
                                    <div className="flex items-center gap-1 min-w-0"><span className="text-[7px] font-black uppercase text-slate-400 leading-none">{t.upperLabel}</span><input type="text" inputMode="numeric" maxLength={3} value={record.val1 || ''} onChange={(e) => onUpdate(record.id, 'val1', e.target.value.replace(/\D/g, '').slice(0, 3))} className="w-9 h-7 text-center bg-slate-50/50 border border-slate-100 rounded p-0 text-sm font-black text-slate-900 focus:outline-none focus:border-slate-300" placeholder="0" /></div>
                                    <div className="flex items-center gap-1 min-w-0"><span className="text-[7px] font-black uppercase text-slate-400 leading-none">{t.lowerLabel}</span><input type="text" inputMode="numeric" maxLength={3} value={record.val2 || ''} onChange={(e) => onUpdate(record.id, 'val2', e.target.value.replace(/\D/g, '').slice(0, 3))} className="w-9 h-7 text-center bg-slate-50/50 border border-slate-100 rounded p-0 text-sm font-black text-slate-900 focus:outline-none focus:border-slate-300" placeholder="0" /></div>
                                    <div className="flex items-center gap-1 min-w-0"><span className="text-[7px] font-black uppercase text-slate-400 leading-none">{t.pulseLabel}</span><input type="text" inputMode="numeric" maxLength={3} value={record.val3 || ''} onChange={(e) => onUpdate(record.id, 'val3', e.target.value.replace(/\D/g, '').slice(0, 3))} className="w-9 h-7 text-center bg-slate-50/50 border border-slate-100 rounded p-0 text-sm font-black text-slate-900 focus:outline-none focus:border-slate-300" placeholder="0" /></div>
                                </div>
                            </div>
                            <div className="pl-1 -mt-0.5"><input type="text" value={record.notes || ''} onBlur={() => handleBlur('notes')} onChange={(e) => onUpdate(record.id, 'notes', e.target.value)} placeholder={t.commentPlaceholder} style={{ fontSize: `${(uiSettings.fontSize || 12) - 3}px` }} className="font-black bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 w-full p-0 m-0 leading-tight opacity-50 text-slate-500 truncate" /></div>
                        </div>
                    )}
                </div>

                {mode === 'gym' && (
                    <div className="flex items-center gap-0.5 shrink-0 px-0.5" onClick={(e) => e.stopPropagation()}>
                        {['val1', 'val2', 'val3'].map((f) => (<input key={f} type="text" inputMode="numeric" value={record[f] || ''} onChange={(e) => onUpdate(record.id, f, e.target.value.replace(/\D/g, '').slice(0, 3))} className={`w-6 h-6 text-center border border-slate-100 rounded-md text-[11px] font-bold focus:outline-none focus:border-slate-400 bg-slate-50/50 shadow-inner p-0 ${record.isHighlighted || record.isCompleted ? 'text-black' : 'text-slate-900'}`} placeholder="0" />))}
                    </div>
                )}
                <button onClick={handleDeleteClick} className={`w-7 h-7 shrink-0 flex items-center justify-center transition-all ${isConfirming ? 'delete-btn-active' : 'text-slate-900'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
            {mode === 'cook' && (
                <div className={`expanded-content px-2 ${isExpanded ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <textarea ref={notesAreaRef} value={record.notes || ''} onChange={(e) => onUpdate(record.id, 'notes', e.target.value)} onBlur={() => handleBlur('notes')} placeholder={t.recipeContentPlaceholder} rows={8} style={{ fontSize: `${(uiSettings.fontSize || 12) - 1}px` }} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-3 font-bold text-slate-700 focus:outline-none focus:border-slate-300 placeholder:text-slate-300" />
                </div>
            )}
        </div>
    );
};

const ContentRecords = (props) => {
    return (
        <div className="w-full flex flex-col gap-0 items-center">
            {props.currentRecords.map((r, idx) => (
                <TrackerItem
                    key={r.id}
                    record={r}
                    index={idx}
                    onDelete={props.deleteRecord}
                    onUpdate={props.updateRecord}
                    onDragStart={props.handleDragStart}
                    onDragOver={props.handleDragOver}
                    onDragEnd={props.handleDragEnd}
                    isDragging={props.draggedIdx === idx}
                    uiSettings={props.uiSettings[props.mode] || {}}
                    mode={props.mode}
                    knownItems={props.mode === 'gym' ? props.knownExercises :
                        props.mode === 'shop' ? props.knownShopItems :
                            props.mode === 'cook' ? props.knownCookItems :
                                props.mode === 'kbzhu' ? props.knownKbzhuItems : []}
                    t={props.t}
                />
                ))
            }
        </div>
    );
};

export default ContentRecords;