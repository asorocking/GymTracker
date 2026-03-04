import React from 'react';

const FooterButtons = (props) => {
    return (
        <div className="flex flex-col gap-3 mt-1.5 w-full max-w-[95%]">
            <button onClick={props.addNewRecord}
                    className="action-button w-full h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" />
                </svg>
                <span className="text-sm font-bold">
                    {props.mode === 'gym' ? props.t.addExercise :
                        props.mode === 'shop' ? props.t.addItem :
                            props.mode === 'pressure' ? props.t.addPressure :
                                props.mode === 'cook' ? props.t.addRecipe :
                                    props.t.addKbzhu}
                </span>
            </button>
            {props.currentRecords.length === 0 && props.mode === 'gym' && (
                <button onClick={props.copyFromLastWorkout}
                        className="action-button w-full h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg mb-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm font-bold">
                        {props.t.repeatLast}
                    </span>
                </button>)
            }
            {props.currentRecords.length > 0 && (
                <button onClick={props.deleteAllForCurrentContext}
                        className={`action-button w-full h-11 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all 
                            ${props.isClearConfirming ? 'bg-red-500 text-white scale-[1.02]' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {props.isClearConfirming ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />) :
                            (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />)
                        }
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {props.isClearConfirming ? props.t.clearConfirm : props.t.clearBtn}
                    </span>
                </button>)
            }
        </div>
    );
};

export default FooterButtons;