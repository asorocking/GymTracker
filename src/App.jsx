import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '@/components/Header'
import HeaderButtons from "@/components/HeaderButtons.jsx";
import AdditionalHeader from "@/components/AdditionalHeader.jsx";
import ContentRecords from "@/components/ContentRecords.jsx";
import FooterButtons from "@/components/FooterButtons.jsx";
import SettingsModal from "@/components/Settings/SettingsModal.jsx";

function App() {
    const DB_NAME = 'TrackerDB';
    const STORE_RECORDS = 'records';
    const STORE_WEIGHTS = 'weights';
    const STORE_SESSIONS = 'sessions';
    const DB_VERSION = 5;

    const i18n = {
        ru: {
            appName: "GymTracker",
            shopName: "ShopTracker",
            pressureName: "120/80",
            cookName: "Cook",
            kbzhuName: "КБЖУ",
            calculate: "Расчитать",
            weight: "Вес",
            kg: "кг",
            gr: "гр.",
            stats: "Статистика",
            export: "Экспорт",
            import: "Импорт",
            save: "Сохранить",
            progress: "Статистика",
            bodyWeight: "Вес тела",
            exerciseStats: "Упражнения",
            selectExercise: "Выбрать упражнение",
            noData: "Недостаточно данных",
            close: "Закрыть",
            recordPlaceholder: "Упражнение...",
            weightPlaceholder: "Вес",
            notesPlaceholder: "Пометки...",
            shopPlaceholder: "Купить...",
            cookPlaceholder: "Название рецепта...",
            kbzhuPlaceholder: "Продукт...",
            recipeContentPlaceholder: "Ингредиенты и способ приготовления...",
            cookSearchPlaceholder: "Поиск рецепта...",
            savedToast: "Сохранено 💾",
            errorToast: "Ошибка ⚠️",
            exportToast: "Экспорт 📤",
            importToast: "Импортировано ✅",
            addExercise: "Добавить упражнение",
            addItem: "Добавить в список",
            addPressure: "Новое измерение",
            addRecipe: "Новый рецепт",
            addKbzhu: "Добавить запись",
            repeatLast: "Повторить прошлую тренировку",
            repeatLabel: "Повторить тренировку за",
            pastDays: {
                0: "прошлое воскресенье",
                1: "прошлый понедельник",
                2: "прошлый вторник",
                3: "прошлую среду",
                4: "прошлый четверг",
                5: "прошлую пятницу",
                6: "прошлую субботу"
            },
            noPastData: "Нет данных 🤷‍♂️",
            copySuccess: "Копия:",
            clearConfirm: "Подтвердите удаление?",
            clearBtn: "Удалить все записи",
            clearedToast: "Очищено 🗑️",
            settings: "Настройки",
            language: "Язык",
            russian: "Русский",
            english: "English",
            uiSettings: "Внешний вид",
            uiSettingsGym: "Вид: Тренировка",
            uiSettingsShop: "Вид: Магазин",
            uiSettingsPressure: "Вид: Давление",
            uiSettingsCook: "Вид: Рецепты",
            uiSettingsKbzhu: "Вид: КБЖУ",
            itemHeight: "Высота записи",
            itemWidth: "Ширина записи",
            itemSpacing: "Интервал между записями",
            colorHighlight: "Сет/Акцент",
            colorCompleted: "Выполненное",
            bgColor: "Цвет фона",
            weightColor: "Цвет шрифта веса",
            fontSize: "Размер шрифта",
            lineCount: "Число строк в записи",
            modeSwitched: "Переключено на ",
            exerciseLibrary: "Библиотека упражнений",
            shopLibrary: "Библиотека товаров",
            cookLibrary: "Библиотека рецептов",
            kbzhuLibrary: "Библиотека КБЖУ",
            libraryEmpty: "Список пуст. Добавьте запись.",
            count: "раз",
            start: "Начать",
            finish: "Закончить",
            resetToast: "Время сброшено ⏱️",
            workoutTime: "Время тренировки",
            listNameLabel: "Название",
            defaultListName: "Новый список",
            deleteEmptyLists: "Очистить пустые списки",
            addItemToLibrary: "Добавить в библиотеку",
            editItemPlaceholder: "Название...",
            alreadyExists: "Уже в списке!",
            toastDurationLabel: "Длительность уведомлений (сек)",
            maxWorkoutTimeLabel: "Лимит времени тренировки (час)",
            enableToastsLabel: "Показывать уведомления",
            deleteListConfirm: "Удалить этот список и все его записи?",
            listDeletedToast: "Список удален 🗑️",
            tabGeneral: "Общие",
            tabLibraryGym: "Упражнения",
            tabLibraryShop: "Товары",
            tabLibraryCook: "Рецепты",
            tabLibraryKbzhu: "КБЖУ",
            tabLists: "Списки",
            listManagement: "Управление списками",
            dragToReorder: "Перетащите для сортировки",
            renameListPlaceholder: "Переименовать...",
            enableSuggestionsLabel: "Подсказки из библиотеки",
            upperLabel: "Верхнее",
            lowerLabel: "Нижнее",
            pulseLabel: "Пульс",
            timeLabel: "Time",
            dateLabel: "Date",
            commentPlaceholder: "Комментарий...",
            calendarTitle: "Календарь тренировок",
            daysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
        },
        en: {
            appName: "GymTracker",
            shopName: "ShopTracker",
            pressureName: "120/80",
            cookName: "Cook",
            kbzhuName: "Macros",
            calculate: "Calculate",
            weight: "Weight",
            kg: "kg",
            gr: "g.",
            stats: "Stats",
            export: "Export",
            import: "Import",
            save: "Save",
            progress: "Statistics",
            bodyWeight: "Body Weight",
            exerciseStats: "Exercises",
            selectExercise: "Select exercise",
            noData: "Not enough data",
            close: "Close",
            recordPlaceholder: "Exercise...",
            weightPlaceholder: "Wgt",
            notesPlaceholder: "Notes...",
            shopPlaceholder: "Buy...",
            cookPlaceholder: "Recipe title...",
            kbzhuPlaceholder: "Product...",
            recipeContentPlaceholder: "Ingredients and instructions...",
            cookSearchPlaceholder: "Search recipe...",
            savedToast: "Saved 💾",
            errorToast: "Error ⚠️",
            exportToast: "Exported 📤",
            importToast: "Imported ✅",
            addExercise: "Add Exercise",
            addItem: "Add to List",
            addPressure: "New Measurement",
            addRecipe: "New Recipe",
            addKbzhu: "Add Record",
            repeatLast: "Repeat last workout",
            repeatLabel: "Repeat workout for",
            pastDays: {
                0: "last Sunday",
                1: "last Monday",
                2: "last Tuesday",
                3: "last Wednesday",
                4: "last Thursday",
                5: "last Friday",
                6: "last Saturday"
            },
            noPastData: "No data 🤷‍♂️",
            copySuccess: "Copied:",
            clearConfirm: "Confirm clear?",
            clearBtn: "Delete all records",
            clearedToast: "Cleared 🗑️",
            settings: "Settings",
            language: "Language",
            russian: "Russian",
            english: "English",
            uiSettings: "Appearance",
            uiSettingsGym: "UI: Gym Mode",
            uiSettingsShop: "UI: Shop Mode",
            uiSettingsPressure: "UI: 120/80 Mode",
            uiSettingsCook: "UI: Cook Mode",
            uiSettingsKbzhu: "UI: Macros Mode",
            itemHeight: "Item Height",
            itemWidth: "Item Width",
            itemSpacing: "Item Spacing",
            colorHighlight: "Set Color",
            colorCompleted: "Done Color",
            bgColor: "Background Color",
            weightColor: "Weight font color",
            fontSize: "Font Size",
            lineCount: "Number of Lines",
            modeSwitched: "Switched to ",
            exerciseLibrary: "Exercise Library",
            shopLibrary: "Shop Library",
            cookLibrary: "Recipe Library",
            kbzhuLibrary: "Macros Library",
            libraryEmpty: "Library is empty. Add items.",
            count: "times",
            start: "Start",
            finish: "Finish",
            resetToast: "Timer reset ⏱️",
            workoutTime: "Workout Time",
            listNameLabel: "List Name",
            defaultListName: "New List",
            deleteEmptyLists: "Clear empty lists",
            addItemToLibrary: "Add to library",
            editItemPlaceholder: "Name...",
            alreadyExists: "Already exists!",
            toastDurationLabel: "Toast duration (sec)",
            maxWorkoutTimeLabel: "Workout time limit (hrs)",
            enableToastsLabel: "Show notifications",
            deleteListConfirm: "Delete this list and all its items?",
            listDeletedToast: "List deleted 🗑️",
            tabGeneral: "General",
            tabLibraryGym: "Exercises",
            tabLibraryShop: "Items",
            tabLibraryCook: "Recipes",
            tabLibraryKbzhu: "Macros",
            tabLists: "Lists",
            listManagement: "Manage Lists",
            dragToReorder: "Drag to reorder",
            renameListPlaceholder: "Rename...",
            enableSuggestionsLabel: "Library suggestions",
            upperLabel: "Upper",
            lowerLabel: "Lower",
            pulseLabel: "Pulse",
            timeLabel: "Time",
            dateLabel: "Date",
            commentPlaceholder: "Comment...",
            calendarTitle: "Workout Calendar",
            daysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    };
    const initDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_RECORDS)) {
                    db.createObjectStore(STORE_RECORDS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORE_WEIGHTS)) {
                    db.createObjectStore(STORE_WEIGHTS, { keyPath: 'dateKey' });
                }
                if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
                    db.createObjectStore(STORE_SESSIONS, { keyPath: 'dateKey' });
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    };
    const saveToDB = async (records, forceEmpty = false) => {
        if (!records) return;

        // ПРОВЕРКА: Если массив пуст и мы НЕ заставляем базу тереться специально — выходим.
        if (records.length === 0 && !forceEmpty) {
            return;
        }

        const db = await initDB();
        const tx = db.transaction(STORE_RECORDS, 'readwrite');
        const store = tx.objectStore(STORE_RECORDS);

        return new Promise((resolve, reject) => {
            const clearReq = store.clear();
            clearReq.onsuccess = () => {
                if (records.length === 0) {
                    resolve();
                    return;
                }
                records.forEach((r, index) => {
                    store.put({ ...r, sortOrder: index });
                });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            };
        });
    };
    const loadFromDB = async () => {
        const db = await initDB();
        const tx = db.transaction(STORE_RECORDS, 'readonly');
        const store = tx.objectStore(STORE_RECORDS);
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result || [];
                const sorted = results.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                resolve(sorted);
            };
        });
    };
    const saveWeightToDB = async (dateKey, weight) => {
        const db = await initDB();
        const tx = db.transaction(STORE_WEIGHTS, 'readwrite');
        const store = tx.objectStore(STORE_WEIGHTS);
        return new Promise((resolve, reject) => {
            store.put({ dateKey, weight });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    };
    const loadWeightsFromDB = async () => {
        const db = await initDB();
        const tx = db.transaction(STORE_WEIGHTS, 'readonly');
        const store = tx.objectStore(STORE_WEIGHTS);
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const weightsMap = {};
                request.result.forEach(item => { weightsMap[item.dateKey] = item.weight; });
                resolve(weightsMap);
            };
        });
    };
    const saveSessionToDB = async (dateKey, session) => {
        const db = await initDB();
        const tx = db.transaction(STORE_SESSIONS, 'readwrite');
        const store = tx.objectStore(STORE_SESSIONS);
        return new Promise((resolve, reject) => {
            store.put({ dateKey, ...session });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    };
    const loadSessionsFromDB = async () => {
        const db = await initDB();
        const tx = db.transaction(STORE_SESSIONS, 'readonly');
        const store = tx.objectStore(STORE_SESSIONS);
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const sessionsMap = {};
                request.result.forEach(item => {
                    const { dateKey, ...rest } = item;
                    sessionsMap[dateKey] = rest;
                });
                resolve(sessionsMap);
            };
        });
    };
    const getDateKey = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const CalendarModal = ({ isOpen, onClose, selectedDate, setSelectedDate, records = [], t }) => {
        // 1. Инициализируем месяц только ОДИН РАЗ при открытии, чтобы не было рендер-петли
        const [currentMonth, setCurrentMonth] = useState(null);

        useEffect(() => {
            if (isOpen && selectedDate) {
                setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
            }
        }, [isOpen]); // Срабатывает только при изменении видимости

        if (!isOpen || !currentMonth) return null;

        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();

        // Безопасный расчет дней месяца
        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Понедельник как первый день (Пн=0...Вс=6)
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const changeMonth = (offset) => {
            setCurrentMonth(new Date(year, month + offset, 1));
        };

        // Генерируем массив дней
        const days = [];
        // Пустые ячейки в начале
        for (let i = 0; i < startDay; i++) {
            days.push({ day: null });
        }
        // Числа месяца
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            days.push({ day: i, month, year });
        }

        return (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                    {/* Шапка */}
                    <div className="p-6 flex justify-between items-center border-b">
                        <h2 className="text-lg font-black text-slate-900">{t.calendarTitle}</h2>
                        <button onClick={onClose} className="p-2 text-slate-400">✕</button>
                    </div>

                    <div className="p-6">
                        {/* Управление месяцем */}
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={() => changeMonth(-1)} className="p-2">←</button>
                            <span className="font-black uppercase tracking-widest text-sm">
                    {t.months[month]} {year}
                  </span>
                            <button onClick={() => changeMonth(1)} className="p-2">→</button>
                        </div>

                        {/* Сетка */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {t.daysShort.map(d => (
                                <div key={d}
                                     className="text-[10px] font-bold text-slate-400 pb-2"
                                >{d}</div>
                            ))}
                            {days.map((d, idx) => {
                                if (d.day === null) return <div key={`empty-${idx}`} />;
                                const isSelected = selectedDate.getDate() === d.day &&
                                    selectedDate.getMonth() === d.month &&
                                    selectedDate.getFullYear() === d.year;

                                // 1. Создаем объект даты для текущей ячейки
                                const dateObj = new Date(d.year, d.month, d.day);

                                // 2. Генерируем ключ (строку) для этой ячейки
                                const key = getDateKey(dateObj);

                                // 3. Создаем ключ для "сегодня" прямо здесь (безопасно)
                                const todayKey = getDateKey(new Date());

                                const isToday = key === todayKey;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setSelectedDate(new Date(d.year, d.month, d.day));
                                            onClose();
                                        }}
                                        className={`py-2 text-sm font-bold rounded-lg cursor-pointer transition-all
                                          ${isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}
                                          ${isToday ? '!text-red-600 font-black' : ''}
                                        `}
                                    >
                                        {d.day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Футер */}
                    <div className="p-6 pt-0">
                        <button
                            onClick={() => { setSelectedDate(new Date()); onClose(); }}
                            className="w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl mb-2"
                        >
                            {t.today || 'Сегодня'}
                        </button>
                        <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl">
                            {t.close}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    const LibraryEditor = ({ items, onAdd, onDelete, onEdit, t, placeholder, mode }) => {
        const [newItem, setNewItem] = useState(mode === 'kbzhu' ? { name: '', k: '', b: '', j: '', u: '' } : '');

        const handleAdd = () => {
            if (mode === 'kbzhu') {
                if (!newItem.name.trim()) return;
                onAdd({ ...newItem, name: newItem.name.trim() });
                setNewItem({ name: '', k: '', b: '', j: '', u: '' });
            } else {
                if (!newItem.trim()) return;
                if (items.includes(newItem.trim())) {
                    alert(t.alreadyExists);
                    return;
                }
                onAdd(newItem.trim());
                setNewItem('');
            }
        };

        const updateNewKbzhu = (field, val) => {
            setNewItem(prev => ({ ...prev, [field]: val }));
        };

        const updateExistingKbzhu = (index, field, val) => {
            const updated = { ...items[index], [field]: val };
            onEdit(index, updated);
        };

        return (
            <div className="flex flex-col gap-3">
                {mode === 'kbzhu' ? (
                    <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) => updateNewKbzhu('name', e.target.value)}
                                placeholder={t.kbzhuPlaceholder}
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
                            />
                            <button onClick={handleAdd} className="p-2 bg-slate-900 text-white rounded-lg active:scale-95 transition-transform">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {['k', 'b', 'j', 'u'].map((f, i) => (
                                <div key={f} className="flex flex-col gap-0.5">
                                    <span className="text-[7px] font-black text-slate-400 uppercase text-center leading-none">{['к','б','ж','у'][i]}</span>
                                    <input
                                        type="text" inputMode="decimal"
                                        value={newItem[f]}
                                        onChange={(e) => updateNewKbzhu(f, e.target.value.replace(',', '.').replace(/[^0-9.]/g, ''))}
                                        className="w-full bg-white border border-slate-200 rounded-lg py-1 text-[10px] font-black text-center focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            placeholder={placeholder || t.addItemToLibrary}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                        />
                        <button onClick={handleAdd} className="p-2.5 bg-slate-900 text-white rounded-xl active:scale-95 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" /></svg>
                        </button>
                    </div>
                )}

                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden max-h-[300px] overflow-y-auto">
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <div key={index} className="flex flex-col px-4 py-3 border-b border-slate-100 last:border-0 gap-2 group">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={mode === 'kbzhu' ? item.name : item}
                                        onChange={(e) => onEdit(index, mode === 'kbzhu' ? { ...item, name: e.target.value } : e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-700 focus:text-slate-900 p-0"
                                    />
                                    <button onClick={() => onDelete(index)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                {mode === 'kbzhu' && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {['k', 'b', 'j', 'u'].map((f, i) => (
                                            <div key={f} className="flex flex-col gap-0.5">
                                                <span className="text-[6px] font-black text-slate-400 uppercase text-center leading-none">{['к','б','ж','у'][i]}</span>
                                                <input
                                                    type="text" inputMode="decimal"
                                                    value={item[f] || ''}
                                                    onChange={(e) => updateExistingKbzhu(index, f, e.target.value.replace(',', '.').replace(/[^0-9.]/g, ''))}
                                                    className="w-full bg-white/50 border border-slate-100 rounded-lg py-0.5 text-[10px] font-black text-center focus:outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-xs font-bold text-slate-400 italic">
                            {t.libraryEmpty}
                        </div>
                    )}
                </div>
            </div>
        );
    };
    const ListManagementTab = ({ shopListRegistry, setShopListRegistry, onRenameList, t }) => {
        const [draggedIdx, setDraggedIdx] = useState(null);

        const handleDragStart = (e, index) => {
            setDraggedIdx(index);
            e.dataTransfer.effectAllowed = 'move';
        };

        const handleDragOver = (e, index) => {
            e.preventDefault();
            if (draggedIdx === null || draggedIdx === index) return;
            const newList = [...shopListRegistry];
            const [removed] = newList.splice(draggedIdx, 1);
            newList.splice(index, 0, removed);
            setShopListRegistry(newList);
            setDraggedIdx(index);
        };

        const handleDragEnd = () => setDraggedIdx(null);

        const handleDelete = (index) => {
            if (confirm(t.deleteListConfirm)) {
                setShopListRegistry(prev => prev.filter((_, i) => i !== index));
            }
        };

        const toggleEnabled = (index) => {
            setShopListRegistry(prev => prev.map((item, i) => i === index ? { ...item, enabled: !item.enabled } : item));
        };

        return (
            <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">{t.dragToReorder}</p>
                <div className="flex flex-col gap-2">
                    {shopListRegistry.map((listItem, idx) => (
                        <div
                            key={listItem.name}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center gap-3 px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl transition-all ${draggedIdx === idx ? 'opacity-40 scale-95 shadow-inner' : 'hover:border-slate-300'}`}
                        >
                            <div className="shrink-0 flex flex-col gap-0.5 opacity-20 cursor-grab px-1">
                                <div className="flex gap-0.5"><div className="w-0.5 h-0.5 bg-slate-900 rounded-full"></div><div className="w-0.5 h-0.5 bg-slate-900 rounded-full"></div></div>
                                <div className="flex gap-0.5"><div className="w-0.5 h-0.5 bg-slate-900 rounded-full"></div><div className="w-0.5 h-0.5 bg-slate-900 rounded-full"></div></div>
                            </div>

                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                                <input
                                    type="text"
                                    value={listItem.name}
                                    onChange={(e) => onRenameList(listItem.name, e.target.value)}
                                    className="w-full bg-transparent border-none outline-none text-sm font-black text-slate-800"
                                    placeholder={t.renameListPlaceholder}
                                />
                                <div className="flex items-center gap-2">
                                    <label className="switch scale-75 origin-left">
                                        <input type="checkbox" checked={!!listItem.enabled} onChange={() => toggleEnabled(idx)} />
                                        <span className="slider"></span>
                                    </label>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{t.enableSuggestionsLabel}</span>
                                </div>
                            </div>

                            <button onClick={() => handleDelete(idx)} className="p-1 text-slate-300 hover:text-red-500 transition-colors shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    {shopListRegistry.length === 0 && (
                        <div className="p-8 text-center text-xs font-bold text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            {t.libraryEmpty}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    const StatsModal = ({ isOpen, onClose, weights, records, knownExercises, t }) => {
        const [activeTab, setActiveTab] = useState('body');
        const [selectedExercise, setSelectedExercise] = useState('');
        const canvasRef = useRef(null);
        const chartInstance = useRef(null);

        useEffect(() => {
            if (!selectedExercise && knownExercises.length > 0) {
                setSelectedExercise(knownExercises[0]);
            }
        }, [knownExercises]);

        useEffect(() => {
            if (isOpen && canvasRef.current) {
                let labels = [];
                let data = [];
                let labelText = '';

                if (activeTab === 'body') {
                    const sortedEntries = Object.entries(weights)
                        .filter(([_, val]) => val !== '' && val !== null)
                        .sort((a, b) => new Date(a[0]) - new Date(b[0]));

                    if (sortedEntries.length > 0) {
                        labels = sortedEntries.map(([date]) => {
                            const d = new Date(date);
                            return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                        });
                        data = sortedEntries.map(([_, val]) => parseFloat(val));
                        labelText = t.weight;
                    }
                } else {
                    if (selectedExercise) {
                        const exerciseRecords = records.filter(r => r.description.trim() === selectedExercise);
                        const groupedByDate = {};

                        exerciseRecords.forEach(r => {
                            const vals = [parseFloat(r.val1), parseFloat(r.val2), parseFloat(r.val3)].filter(v => !isNaN(v));
                            if (vals.length > 0) {
                                const maxVal = Math.max(...vals);
                                if (!groupedByDate[r.dateKey] || maxVal > groupedByDate[r.dateKey]) {
                                    groupedByDate[r.dateKey] = maxVal;
                                }
                            }
                        });

                        const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
                        labels = sortedDates.map(date => {
                            const d = new Date(date);
                            return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                        });
                        data = sortedDates.map(date => groupedByDate[date]);
                        labelText = selectedExercise;
                    }
                }

                if (chartInstance.current) { chartInstance.current.destroy(); }

                if (data.length > 0) {
                    const ctx = canvasRef.current.getContext('2d');
                    chartInstance.current = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels,
                            datasets: [{
                                label: labelText,
                                data,
                                borderColor: '#0f172a',
                                backgroundColor: 'rgba(15, 23, 42, 0.05)',
                                borderWidth: 3,
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#0f172a',
                                pointRadius: 4,
                                pointHoverRadius: 6
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: false, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
                                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                            }
                        }
                    });
                }
            }
        }, [isOpen, weights, records, activeTab, selectedExercise, t]);

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 modal-backdrop fade-in">
                <div className="bg-white w-full max-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="px-6 pt-6 pb-2 flex justify-between items-center border-b border-slate-50">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.progress}</h2>
                        <button onClick={onClose} className="p-2 -mr-2 text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('body')} className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'body' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{t.bodyWeight}</button>
                            <button onClick={() => setActiveTab('exercises')} className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'exercises' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{t.exerciseStats}</button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-[350px]">
                        {activeTab === 'exercises' && (
                            <div className="p-6 pb-0">
                                <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 custom-select focus:ring-2 focus:ring-slate-900 focus:outline-none">
                                    <option value="" disabled>{t.selectExercise}</option>
                                    {knownExercises.map(ex => (<option key={ex} value={ex}>{ex}</option>))}
                                </select>
                            </div>
                        )}
                        <div className="flex-1 relative p-6">
                            {(activeTab === 'body' ? Object.keys(weights).filter(k => weights[k] !== '' && weights[k] !== null).length > 0 : (selectedExercise && records.some(r => r.description.trim() === selectedExercise && (r.val1 || r.val2 || r.val3)))) ? (
                                <canvas ref={canvasRef}></canvas>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                    <p className="text-sm font-bold uppercase tracking-widest text-center">{t.noData}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                        <button onClick={onClose} className="w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl active:scale-95">{t.close}</button>
                    </div>
                </div>
            </div>
        );
    };


    const showToast = (message, force = false) => { const s = uiSettings[mode] || {}; if (!force && s.enableToasts === false) return; setToast({ show: true, message }); setTimeout(() => setToast({ show: false, message: '' }), (s.toastDuration || 3) * 1000); };
    const changeDate = (offset) => { setViewDate(prev => { const n = new Date(prev); n.setDate(n.getDate() + offset); return n; }); };
    const changeShopList = (offset) => { const l = allShopListsNames; const ci = l.indexOf(shopListName); if (offset === 1) { if (ci === -1) setShopListName(l.length > 0 ? l[0] : ""); else if (ci === l.length - 1) setShopListName(""); else setShopListName(l[ci + 1]); } else { if (ci === -1) setShopListName(l.length > 0 ? l[l.length - 1] : ""); else if (ci === 0) setShopListName(""); else setShopListName(l[ci - 1]); } };
    const toggleMode = () => { const mArr = ['gym', 'shop', 'pressure', 'cook', 'kbzhu']; const ni = (mArr.indexOf(mode) + 1) % mArr.length; setMode(mArr[ni]); setCookSearchQuery(""); setKbzhuResults(null); setIsListDropdownOpen(false); };
    const handleManualSave = async () => { try { if (mode === 'shop' && shopListName.trim() && !allShopListsNames.includes(shopListName.trim())) setShopListRegistry(prev => [...prev, { name: shopListName.trim(), enabled: false }]); await Promise.all([saveToDB(records), saveWeightToDB(viewDateKey, currentWeight)]); showToast(t.savedToast, true); } catch (err) { showToast(t.errorToast, true); } };
    const handleWeightChange = (val) => { let c = val.replace(',', '.').replace(/[^0-9.]/g, ''); const p = c.split('.'); if (p.length > 2) c = `${p[0]}.${p.slice(1).join('')}`; const f = c.slice(0, 5); setWeights(prev => ({ ...prev, [viewDateKey]: f })); saveWeightToDB(viewDateKey, f).catch(console.error); };
    const exportJSON = () => { const s = JSON.stringify({ records, weights, uiSettings, mode, sessions, shopListRegistry, exerciseRegistry, shopRegistry, cookRegistry, kbzhuRegistry, exportedAt: new Date().toISOString() }, null, 2); const b = new Blob([s], { type: 'application/json' }); const u = URL.createObjectURL(b); const l = document.createElement('a'); l.href = u; l.download = `tracker-export-${new Date().toISOString().split('T')[0]}.json`; l.click(); URL.revokeObjectURL(u); showToast(t.exportToast, true); };
    const importJSON = (ev) => { const f = ev.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = async (e) => { try { const d = JSON.parse(e.target.result); if (d.records) setRecords(d.records); if (d.weights) setWeights(d.weights); if (d.uiSettings) setUiSettings(p => ({ ...p, ...d.uiSettings })); if (d.mode) setMode(d.mode); if (d.sessions) setSessions(d.sessions); if (d.shopListRegistry) setShopListRegistry(d.shopListRegistry.map(it => typeof it === 'string' ? { name: it, enabled: false } : it)); if (d.exerciseRegistry) setExerciseRegistry(d.exerciseRegistry); if (d.shopRegistry) setShopRegistry(d.shopRegistry); if (d.cookRegistry) setCookRegistry(d.cookRegistry); if (d.kbzhuRegistry) setKbzhuRegistry(d.kbzhuRegistry.map(it => typeof it === 'string' ? { name: it, k: '0', b: '0', j: '0', u: '0' } : it)); if (d.records) await saveToDB(d.records); if (d.weights) for (const [dk, w] of Object.entries(d.weights)) await saveWeightToDB(dk, w); if (d.sessions) for (const [dk, s] of Object.entries(d.sessions)) await saveSessionToDB(dk, s); showToast(t.importToast, true); ev.target.value = ''; } catch (err) { showToast(t.errorToast, true); } }; r.readAsText(f); };
    const triggerImport = () => importFileRef.current.click();

    const calculateKbzhuTotals = () => {
        if (mode !== 'kbzhu') return;
        let tK=0, tB=0, tJ=0, tU=0, tW=0;
        currentRecords.filter(r => r.isCompleted).
        forEach(r => {
            const w = parseFloat(r.weight)||0;
            tK += ((parseFloat(r.val1)||0)*w)/100;
            tB += ((parseFloat(r.val2)||0)*w)/100;
            tJ += ((parseFloat(r.val3)||0)*w)/100;
            tU += ((parseFloat(r.val4)||0)*w)/100;
            tW += w;
        });
        if (tW > 0) setKbzhuResults({
            k: ((tK/tW)*100).toFixed(1),
            b: ((tB/tW)*100).toFixed(1),
            j: ((tJ/tW)*100).toFixed(1),
            u: ((tU/tW)*100).toFixed(1),
            w: tW
        }); else {
            setKbzhuResults(null);
            showToast(t.noData, true);
        }
    };

    const handleDeleteCurrentShopList = () => { if (!shopListName) return; if (isListDeleteConfirming) { const lt = shopListName; setRecords(p => p.filter(r => !(r.mode === 'shop' && r.listName === lt))); setShopListRegistry(p => p.filter(l => l.name !== lt)); const la = allShopListsNames.filter(l => l !== lt); setShopListName(la.length > 0 ? la[0] : ""); setIsListDeleteConfirming(false); showToast(t.listDeletedToast, true); } else { setIsListDeleteConfirming(true); if (listDeleteConfirmTimeout.current) clearTimeout(listDeleteConfirmTimeout.current); listDeleteConfirmTimeout.current = setTimeout(() => setIsListDeleteConfirming(false), 3000); } };
    const onRenameShopList = (on, nn) => { if (!nn.trim() || on === nn) return; setShopListRegistry(p => p.map(l => l.name === on ? { ...l, name: nn.trim() } : l)); setRecords(p => p.map(r => (r.mode === 'shop' && r.listName === on) ? { ...r, listName: nn.trim() } : r)); if (shopListName === on) setShopListName(nn.trim()); };
    const clearRegistryOfEmptyLists = () => { const u = new Set(records.filter(r => r.mode === 'shop').map(r => r.listName)); setShopListRegistry(p => p.filter(l => u.has(l.name))); showToast(t.clearedToast, true); };
    const updateRecord = (id, f, v) => setRecords(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
    const deleteRecord = (id) => setRecords(p => p.filter(r => r.id !== id));
    const handleStartSession = () => { const cs = sessions[viewDateKey]; let ns = Date.now(); if (!cs || !cs.start) ns = Date.now(); else if (cs.end) ns = Date.now() - (cs.end - cs.start); else return; const nS = { start: ns, end: null }; setSessions(p => ({ ...p, [viewDateKey]: nS })); saveSessionToDB(viewDateKey, nS).catch(console.error); setNow(Date.now()); };
    const handleResetSession = () => { const ns = { start: null, end: null }; setSessions(p => ({ ...p, [viewDateKey]: ns })); saveSessionToDB(viewDateKey, ns).catch(console.error); showToast(t.resetToast); if (window.navigator.vibrate) window.navigator.vibrate(50); };
    const onStartPointerDown = () => { isLongPressActive.current = false; longPressTimer.current = setTimeout(() => { isLongPressActive.current = true; handleResetSession(); }, 600); };
    const onStartPointerUp = () => { clearTimeout(longPressTimer.current); if (!isLongPressActive.current) handleStartSession(); };
    const handleFinishSession = () => { const cs = sessions[viewDateKey]; if (!cs || !cs.start || cs.end) return; const nS = { ...cs, end: Date.now() }; setSessions(p => ({ ...p, [viewDateKey]: nS })); saveSessionToDB(viewDateKey, nS).catch(console.error); setNow(Date.now()); };
    const handleDragStart = (e, i) => { setDraggedIdx(i); setIsDraggingInProgress(true); if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; if (e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX && e.clientX > 0) ? (e.clientX - r.left) : (r.width / 2); const y = (e.clientY && e.clientY > 0) ? (e.clientY - r.top) : (r.height / 2); e.dataTransfer.setDragImage(e.currentTarget, x, y); } } };
    const handleDragOver = (e, i) => { e.preventDefault(); if (draggedIdx === null || draggedIdx === i) return; const im = currentRecords[draggedIdx]; const ti = currentRecords[i]; if (!im || !ti) return; setRecords(p => { const n = [...p]; const iM = n.findIndex(r => r.id === im.id); const iT = n.findIndex(r => r.id === ti.id); if (iM === -1 || iT === -1) return p; const [rem] = n.splice(iM, 1); n.splice(iT, 0, rem); return n.map((r, idx) => ({ ...r, sortOrder: idx })); }); setDraggedIdx(i); };
    const handleDragEnd = () => { setDraggedIdx(null); setIsDraggingInProgress(false); };

    const [records, setRecords] = useState([]);
    const [weights, setWeights] = useState({});
    const [sessions, setSessions] = useState({});
    const [language, setLanguage] = useState(localStorage.getItem('gt_lang') || 'ru');
    const [mode, setMode] = useState(localStorage.getItem('gt_mode') || 'gym');

    const [exerciseRegistry, setExerciseRegistry] = useState(() => { const saved = localStorage.getItem('gt_exercise_registry'); return saved ? JSON.parse(saved) : []; });
    const [shopRegistry, setShopRegistry] = useState(() => { const saved = localStorage.getItem('gt_shop_registry'); return saved ? JSON.parse(saved) : []; });
    const [cookRegistry, setCookRegistry] = useState(() => { const saved = localStorage.getItem('gt_cook_registry'); return saved ? JSON.parse(saved) : []; });
    const [kbzhuRegistry, setKbzhuRegistry] = useState(() => {
        const saved = localStorage.getItem('gt_kbzhu_registry');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            return parsed.map(item => typeof item === 'string' ? { name: item, k: '0', b: '0', j: '0', u: '0' } : item);
        } catch(e) { return []; }
    });

    const [shopListRegistry, setShopListRegistry] = useState(() => { const saved = localStorage.getItem('gt_shop_list_registry'); if (!saved) return []; try { const parsed = JSON.parse(saved); return parsed.map(item => typeof item === 'string' ? { name: item, enabled: false } : item); } catch(e) { return []; } });

    const t = useMemo(() => i18n[language], [language]);

    const [shopListName, setShopListName] = useState(localStorage.getItem('gt_shop_list_name') || "");
    const [cookSearchQuery, setCookSearchQuery] = useState("");
    const [kbzhuResults, setKbzhuResults] = useState(null);

    const [uiSettings, setUiSettings] = useState(() => {
        const saved = localStorage.getItem('gt_ui_settings_v7');
        if (saved) return JSON.parse(saved);
        return {
            gym: { itemHeight: 48, itemWidth: 100, itemSpacing: 12, backgroundColor: '#f8fafc', highlightColor: '#f1f5f9', completedColor: '#ecfdf5', weightColor: '#475569', fontSize: 13, lineCount: 2, toastDuration: 3, maxWorkoutTime: 4, enableToasts: true },
            shop: { itemHeight: 40, itemWidth: 95, itemSpacing: 8, backgroundColor: '#f0f0ff', highlightColor: '#f1f5f9', completedColor: '#fef2f2', fontSize: 14, lineCount: 1, toastDuration: 3, enableToasts: true },
            pressure: { itemHeight: 44, itemWidth: 100, itemSpacing: 10, backgroundColor: '#f0f9ff', highlightColor: '#f1f5f9', completedColor: '#f8fafc', fontSize: 13, lineCount: 1, toastDuration: 3, enableToasts: true },
            cook: { itemHeight: 48, itemWidth: 100, itemSpacing: 12, backgroundColor: '#fffbeb', highlightColor: '#fef3c7', completedColor: '#fffbeb', fontSize: 14, lineCount: 1, toastDuration: 3, enableToasts: true },
            kbzhu: { itemHeight: 48, itemWidth: 100, itemSpacing: 10, backgroundColor: '#f0fdf4', highlightColor: '#dcfce7', completedColor: '#f0fdf4', fontSize: 14, lineCount: 1, toastDuration: 3, enableToasts: true }
        };
    });
    const [viewDate, setViewDate] = useState(new Date());
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
    const [draggedIdx, setDraggedIdx] = useState(null);
    const [isDraggingInProgress, setIsDraggingInProgress] = useState(false);
    const [isListDeleteConfirming, setIsListDeleteConfirming] = useState(false);
    const clearConfirmTimeout = useRef(null);
    const listDeleteConfirmTimeout = useRef(null);
    const importFileRef = useRef(null);
    const [now, setNow] = useState(Date.now());
    const longPressTimer = useRef(null);
    const isLongPressActive = useRef(false);

    const viewDateKey = useMemo(() => getDateKey(viewDate), [viewDate]);
    const knownExercises = useMemo(() => Array.from(new Set(exerciseRegistry)).sort((a,b) => a.localeCompare(b)), [exerciseRegistry]);
    const knownShopItems = useMemo(() => { const currentListConfig = shopListRegistry.find(l => l.name === shopListName); if (currentListConfig && currentListConfig.enabled) return Array.from(new Set(shopRegistry)).sort((a,b) => a.localeCompare(b)); return []; }, [shopRegistry, shopListRegistry, shopListName]);
    const knownCookItems = useMemo(() => Array.from(new Set(cookRegistry)).sort((a,b) => a.localeCompare(b)), [cookRegistry]);
    const knownKbzhuItems = useMemo(() => Array.from(new Set(kbzhuRegistry)).sort((a,b) => a.name.localeCompare(b.name)), [kbzhuRegistry]);
    const allShopListsNames = useMemo(() => shopListRegistry.map(l => l.name), [shopListRegistry]);

    const currentRecords = useMemo(() => {
        if (mode === 'gym') return records.filter(r => r.dateKey === viewDateKey && (r.mode === 'gym' || !r.mode));
        if (mode === 'shop') return records.filter(r => r.mode === 'shop' && r.listName === (shopListName || ""));
        if (mode === 'pressure') return records.filter(r => r.dateKey === viewDateKey && r.mode === 'pressure');
        if (mode === 'cook') { let f = records.filter(r => r.mode === 'cook'); if (cookSearchQuery.trim()) { const q = cookSearchQuery.toLowerCase(); f = f.filter(r => r.description.toLowerCase().includes(q)); } return f.sort((a, b) => (a.description || "").localeCompare(b.description || "", language === 'ru' ? 'ru' : 'en')); }
        if (mode === 'kbzhu') return records.filter(r => r.mode === 'kbzhu');
        return [];
    }, [records, viewDateKey, mode, shopListName, cookSearchQuery, language]);
    const [activeTab, setActiveTab] = useState('general');
    const currentSessionDuration = useMemo(() => {
        const sess = sessions[viewDateKey];
        if (!sess || !sess.start) return null;
        const endTime = sess.end || now;
        const diffMs = endTime - sess.start;
        const maxMs = (uiSettings.gym?.maxWorkoutTime || 4) * 3600000;
        const effectiveMs = Math.max(0, Math.min(diffMs, maxMs));
        const h = Math.floor(effectiveMs / 3600000);
        const m = Math.floor((effectiveMs % 3600000) / 60000);
        const s = Math.floor((effectiveMs % 60000) / 1000);
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, [sessions, viewDateKey, now, uiSettings.gym?.maxWorkoutTime]);



    useEffect(() => { localStorage.setItem('gt_lang', language); }, [language]);
    useEffect(() => { localStorage.setItem('gt_mode', mode); }, [mode]);
    useEffect(() => { localStorage.setItem('gt_ui_settings_v7', JSON.stringify(uiSettings)); }, [uiSettings]);
    useEffect(() => { localStorage.setItem('gt_shop_list_name', shopListName); }, [shopListName]);
    useEffect(() => { localStorage.setItem('gt_shop_list_registry', JSON.stringify(shopListRegistry)); }, [shopListRegistry]);
    useEffect(() => { localStorage.setItem('gt_exercise_registry', JSON.stringify(exerciseRegistry)); }, [exerciseRegistry]);
    useEffect(() => { localStorage.setItem('gt_shop_registry', JSON.stringify(shopRegistry)); }, [shopRegistry]);
    useEffect(() => { localStorage.setItem('gt_cook_registry', JSON.stringify(cookRegistry)); }, [cookRegistry]);
    useEffect(() => { localStorage.setItem('gt_kbzhu_registry', JSON.stringify(kbzhuRegistry)); }, [kbzhuRegistry]);

    const [accentColor, setAccentColor] = useState('#94a3b8'); // Цвет по умолчанию (slate-400)
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
    useEffect(() => {
        const init = async () => {
            try {
                const [savedRecords, savedWeights, savedSessions] = await Promise.all([
                    loadFromDB(), loadWeightsFromDB(), loadSessionsFromDB()
                ]);
                if (savedRecords && savedRecords.length > 0) {
                    const updated = savedRecords.map(r => r.dateKey ? r
                        : { ...r, dateKey: getDateKey(r.createdAt || Date.now()) });
                    setRecords(updated);
                }

                if (savedWeights) setWeights(savedWeights);
                if (savedSessions) setSessions(savedSessions);

                // Сначала говорим, что данные в стейте, потом разрешаем работу
                setIsLoaded(true);
                setTimeout(() => setIsInitialLoadDone(true), 100);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
                setIsLoaded(true);
                setIsInitialLoadDone(true);

            }
        };
        init();
    }, []);

    useEffect(() => {
        if (isInitialLoadDone && isLoaded && !isDraggingInProgress) {
            // Мы вызываем сохранение, но внутри saveToDB теперь есть защита
            saveToDB(records).catch(console.error);
        }
    }, [records, isLoaded, isDraggingInProgress, isInitialLoadDone]);

    const currentWeight = weights[viewDateKey] || '';
    const displayDate = viewDate.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        weekday: 'short'
    });

    useEffect(() => { if (mode === 'gym') { const s = sessions[viewDateKey]; if (s && s.start && !s.end) { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); } } }, [sessions, viewDateKey, mode]);


    useEffect(() => {
        // Регистрацию SW лучше делать здесь, при загрузке компонента
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW error', err));
            });
        }
    }, []);

    if (!isLoaded) return null;
    const sSA = !!sessions[viewDateKey]?.start && !sessions[viewDateKey]?.end;
    const sP = !!sessions[viewDateKey]?.start && !!sessions[viewDateKey]?.end;
    const cAB = uiSettings[mode]?.backgroundColor || '#f8fafc';

    const changeMode = (newMode) => {
        setMode(newMode);
        setCookSearchQuery(""); // Сбрасываем поиск
        setKbzhuResults(null);  // Сбрасываем расчеты КБЖУ
        setIsListDropdownOpen(false); // Закрываем меню списков
        localStorage.setItem('gt_mode', newMode); // Сохраняем выбор
    };
    const currentUI = uiSettings[mode] || {};

    return (
        <div className="App">
            <div className="min-h-screen max-w-md mx-auto flex flex-col relative pb-10 transition-colors duration-500"
                 style={{ backgroundColor: currentUI.backgroundColor || '#f8fafc' }}
            >
                <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
                <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} weights={weights} records={records} knownExercises={knownExercises} t={t} />
                <CalendarModal
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    selectedDate={viewDate}
                    setSelectedDate={setViewDate}
                    records={records}
                    t={t}
                />
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} language={language} setLanguage={setLanguage}
                  uiSettings={uiSettings} setUiSettings={setUiSettings} activeMode={mode} exerciseRegistry={exerciseRegistry}
                  setExerciseRegistry={setExerciseRegistry} shopRegistry={shopRegistry} setShopRegistry={setShopRegistry}
                  cookRegistry={cookRegistry} setCookRegistry={setCookRegistry} kbzhuRegistry={kbzhuRegistry}
                  setKbzhuRegistry={setKbzhuRegistry} shopListRegistry={shopListRegistry} setShopListRegistry={setShopListRegistry}
                  onRenameShopList={onRenameShopList} clearRegistry={clearRegistryOfEmptyLists} t={t} setActiveTab={setActiveTab} activeTab={activeTab}
                  LibraryEditor={LibraryEditor} ListManagementTab={ListManagementTab}
                />

                <header className="sticky top-0 z-40 border-b border-slate-100/50 backdrop-blur-md" style={{ backgroundColor: `${cAB}f2` }}>
                    <Header mode={mode} changeMode={changeMode} />
                    <HeaderButtons mode={mode} t={t} isListDropdownOpen={isListDropdownOpen} currentWeight={currentWeight} setIsStatsOpen={setIsStatsOpen}
                      setIsSettingsOpen={setIsSettingsOpen} importFileRef={importFileRef} triggerImport={triggerImport} exportJSON={exportJSON}
                      handleManualSave={handleManualSave} handleWeightChange={handleWeightChange} setIsListDropdownOpen={setIsListDropdownOpen}
                      setShopListName={setShopListName} allShopListsNames={allShopListsNames} shopListName={shopListName} importJSON={importJSON}
                    />
                    <AdditionalHeader mode={mode} currentSessionDuration={currentSessionDuration} t={t} sP={sP} sSA={sSA} displayDate={displayDate}
                      allShopListsNames={allShopListsNames} shopListName={shopListName} language={language} viewDate={viewDate}
                      changeDate={changeDate} onStartPointerDown={onStartPointerDown} onStartPointerUp={onStartPointerUp}
                      handleFinishSession={handleFinishSession} setIsCalendarOpen={setIsCalendarOpen} changeShopList={changeShopList}
                      handleDeleteCurrentShopList={handleDeleteCurrentShopList} isListDeleteConfirming={isListDeleteConfirming}
                      cookSearchQuery={cookSearchQuery} setCookSearchQuery={setCookSearchQuery} calculateKbzhuTotals={calculateKbzhuTotals}
                      kbzhuResults={kbzhuResults} setShopListName={setShopListName} longPressTimer={longPressTimer} getDateKey={getDateKey}
                    />
                </header>

                <main className="px-4 pb-12 pt-1.5 flex flex-col items-center">
                    <ContentRecords mode={mode} currentRecords={currentRecords} deleteRecord={deleteRecord} updateRecord={updateRecord}
                      handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDragEnd={handleDragEnd} draggedIdx={draggedIdx}
                      uiSettings={uiSettings} knownExercises={knownExercises} knownShopItems={knownShopItems} knownCookItems={knownCookItems}
                      knownKbzhuItems={knownKbzhuItems} t={t}
                    />
                    <FooterButtons mode={mode} t={t} currentRecords={currentRecords} viewDate={viewDate} language={language}
                      setRecords={setRecords} viewDateKey={viewDateKey} shopListName={shopListName} showToast={showToast}
                      clearConfirmTimeout={clearConfirmTimeout} clearTimeout={clearTimeout} setShopListName={setShopListName}
                      records={records} allShopListsNames={allShopListsNames} setShopListRegistry={setShopListRegistry}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
