import React from 'react';

const Header = (props) => {
    return (
        <div className="px-4 pt-1.5 pb-1">
            <div className="grid grid-cols-5 gap-1 bg-slate-200/40 p-0.5 rounded-lg">
                {['gym', 'shop', 'pressure', 'cook', 'kbzhu'].map((m) => (
                <button key={m}
                    onClick={() => {
                        props.changeMode(m);
                    }}
                    className={`py-1.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all active:scale-95
                        ${props.mode === m ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {m === 'gym' ? 'Gym' : m === 'shop' ? 'Shop' : m === 'pressure' ? '120/80' : m === 'cook' ? 'Cook' : 'КБЖУ'}
                </button>))}
            </div>
        </div>
    );
};

export default Header;