import React, {useState} from 'react';

const FooterButtons = (props) => {
    const addNewRecord = () => {
        let ln = props.shopListName;
        if (props.mode === 'shop') {
            if (!ln) {
                ln = props.t.defaultListName;
                props.setShopListName(ln);
            }
            if (ln && !props.allShopListsNames.includes(ln))
                props.setShopListRegistry(p => [...p, { name: ln, enabled: false }]);
        }

        const nr = {
            id: String(Date.now() + Math.random()),
            description: '',
            weight: '',
            notes: '',
            val1: '',
            val2: '',
            val3: '',
            val4: '',
            isNew: true,
            isHighlighted: false,
            isCompleted: false,
            createdAt: Date.now(),
            dateKey: (props.mode === 'cook' || props.mode === 'kbzhu') ? null : props.viewDateKey,
            mode: props.mode,
            listName: props.mode === 'shop' ? ln : null,
            sortOrder: props.records.length
        };
        props.setRecords(p => [...p, nr]);
    };
    const deleteAllForCurrentContext = () => {
        if (isClearConfirming) {
            if (props.mode === 'gym')
                props.setRecords(p => p.filter(r => !(r.dateKey === props.viewDateKey && (r.mode === 'gym' || !r.mode))));
            else if (props.mode === 'shop')
                props.setRecords(p => p.filter(r => !(r.mode === 'shop' && r.listName === (props.shopListName || props.t.defaultListName))));
            else if (props.mode === 'pressure')
                props.setRecords(p => p.filter(r => !(r.dateKey === props.viewDateKey && r.mode === 'pressure')));
            else if (props.mode === 'cook')
                props.setRecords(p => p.filter(r => r.mode !== 'cook'));
            else if (props.mode === 'kbzhu')
                props.setRecords(p => p.filter(r => r.mode !== 'kbzhu'));
            setIsClearConfirming(false);
            props.showToast(props.t.clearedToast, true);
        } else {
            setIsClearConfirming(true);
            if (props.clearConfirmTimeout.current)
                clearTimeout(props.clearConfirmTimeout.current);
            props.clearConfirmTimeout.current = setTimeout(() => setIsClearConfirming(false),
                3000);
        }
    };
    const [isClearConfirming, setIsClearConfirming] = useState(false);
    const copyFromLastWorkout = () => {
        if (props.mode === 'gym') {
            const f = props.records.filter(r => r.mode === 'gym' || !r.mode);
            const pd = [...new Set(f.map(r => r.dateKey))]
                .filter(dk => dk < props.viewDateKey)
                .sort();
            const ld = pd.pop();
            if (!ld) { props.showToast(props.t.noPastData, true);
                return;
            }
            const tc = f.filter(r => r.dateKey === ld);
            const cl = tc.map((r, i) => ({
                ...r,
                id: String(Date.now() + Math.random() + i),
                dateKey: props.viewDateKey,
                weight: r.weight,
                notes: r.notes,
                val1: '',
                val2: '',
                val3: '',
                isNew: false,
                isHighlighted: r.isHighlighted,
                isCompleted: false,
                createdAt: Date.now(),
                mode: 'gym',
                sortOrder: props.records.length + i
            }));
            props.setRecords(p => [...p, ...cl]);
            props.showToast(`${props.t.copySuccess} ${ld} 📋`, true);
        } else props.showToast(props.t.noPastData, true);
    };

    const getDynamicButtonText = () => {
        // 1. Получаем индекс (0-6)
        const dayIndex = new Date(props.viewDateKey.replace(/-/g, '/')).getDay();

        // 2. Берем нужное слово из словаря переводов
        // props.t.pastDays[dayIndex] вернет "прошлую среду" или "last Wednesday"
        const dayText = props.t.pastDays[dayIndex];

        return `${props.t.repeatLabel} ${dayText}`;
    };

    const getShortDayName = (dateStr) => {
        if (!dateStr) return '';
        // Превращаем строку YYYY-MM-DD в локальную дату
        const date = new Date(dateStr.replace(/-/g, '/'));
        // 'ru-RU' — язык, 'weekday: short' — короткое название (пн, вт, ср...)
        return date.toLocaleDateString('ru-RU', { weekday: 'long' });
    };

    const test = () => {
        // 1. Вспомогательная функция для получения дня недели (0-6) без ошибок часового пояса
        const getDayIndex = (dateStr) => {
            if (!dateStr) return null;
            // Заменяем "-" на "/", чтобы JS интерпретировал дату как локальную, а не UTC
            return new Date(dateStr.replace(/-/g, '/')).getDay();
        };

        if (props.mode === 'gym') {
            // 2. Берем индекс дня недели текущей даты (например, 4 для четверга)
            const currentDayOfWeek = getDayIndex(props.viewDateKey);
            const dayName = getShortDayName(props.viewDateKey);

            // 3. Получаем список уникальных дат из истории тренировок
            const pastDates = [...new Set(props.records
                .filter(r => r.mode === 'gym' || !r.mode)
                .map(r => r.dateKey))]
                // Оставляем только те, что раньше СЕГОДНЯ и имеют ТОТ ЖЕ день недели
                .filter(dk => dk < props.viewDateKey && getDayIndex(dk) === currentDayOfWeek)
                .sort(); // Сортировка YYYY-MM-DD работает "из коробки"

            // 4. Берем самую свежую дату из найденных (предыдущий такой же день недели)
            const lastDate = pastDates.pop();

            if (!lastDate) {
                props.showToast(`${props.t.noPastData} (день недели: ${dayName})`, true);
                return;
            }

            // 5. Находим записи за ту дату и готовим их к копированию
            const toCopy = props.records.filter(r => r.dateKey === lastDate && (r.mode === 'gym' || !r.mode));

            const copiedList = toCopy.map((record, i) => ({
                ...record,
                id: String(Date.now() + Math.random() + i), // Новый уникальный ID
                dateKey: props.viewDateKey,               // Устанавливаем текущую дату
                val1: '',                                 // Обнуляем подходы
                val2: '',
                val3: '',
                val4: '',
                isNew: false,
                isCompleted: false,                       // Тренировка еще не выполнена
                createdAt: Date.now(),
                mode: 'gym',
                sortOrder: props.records.length + i       // Ставим в конец текущего списка
            }));

            // 6. Обновляем состояние записей
            props.setRecords(prev => [...prev, ...copiedList]);
            const pastDayName = getShortDayName(lastDate);
            props.showToast(`${props.t.copySuccess} за ${lastDate} (${pastDayName}) 📋`, true);

        } else {
            props.showToast(props.t.noPastData, true);
        }
    };

    const copyFromLastSameWeekDayWorkout = () => {
        if (props.mode === 'gym') {
            const filteredGymRecords = props.records.filter(record => record.mode === 'gym' || !record.mode);
            const pastDates = [...new Set(filteredGymRecords.map(record => record.dateKey))]
                .filter(dateKey => dateKey < props.viewDateKey)
                .sort();
            const lastDate = pastDates.pop();
            if (!lastDate) { props.showToast(props.t.noPastData, true);
                return;
            }
            const toCopy = filteredGymRecords.filter(record => record.dateKey === lastDate);
            const copiedList = toCopy.map((record, i) => ({
                ...record, // Взять существующую запись и заменить в ней значения, указанные ниже
                id: String(Date.now() + Math.random() + i),
                dateKey: props.viewDateKey,
                weight: record.weight,
                notes: record.notes,
                val1: '',
                val2: '',
                val3: '',
                isNew: false,
                isHighlighted: record.isHighlighted,
                isCompleted: false,
                createdAt: Date.now(),
                mode: 'gym',
                sortOrder: props.records.length + i
            }));
            // Возьми существующие записи из existingRecords, разверни их в новый массив и добавь к ним записи из copiedList
            props.setRecords(existingRecords => [...existingRecords, ...copiedList]);
            props.showToast(`${props.t.copySuccess} ${lastDate} 📋`, true);
        } else props.showToast(props.t.noPastData, true);
    };

    const dayOfWeek = props.viewDate.toLocaleDateString(props.language === 'ru' ? 'ru-RU' : 'en-US', {
        weekday: 'short'
    });

    return (
        <div className="flex flex-col gap-3 mt-1.5 w-full max-w-[95%]">
            <button onClick={addNewRecord}
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
                <button onClick={copyFromLastWorkout}
                        className="action-button w-full h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg mb-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm font-bold">
                        {props.t.repeatLast}
                    </span>
                </button>)
            }
            {props.currentRecords.length === 0 && props.mode === 'gym' && (
                <button onClick={test}
                        className="action-button w-full h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg mb-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm font-bold">
                        {getDynamicButtonText()}
                    </span>
                </button>)
            }
            {props.currentRecords.length > 0 && (
                <button onClick={deleteAllForCurrentContext}
                        className={`action-button w-full h-11 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all 
                            ${isClearConfirming ? 'bg-red-500 text-white scale-[1.02]' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isClearConfirming ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />) :
                            (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />)
                        }
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {isClearConfirming ? props.t.clearConfirm : props.t.clearBtn}
                    </span>
                </button>)
            }
        </div>
    );
};

export default FooterButtons;