import React, { useState, useEffect, useRef, useMemo } from 'react';

const StatsModal = ({ isOpen, onClose, weights, records, knownExercises, t }) => {
    const [activeTab, setActiveTab] = useState('body');
    const [selectedExercise, setSelectedExercise] = useState('');
    // Стейт теперь хранит объект с массивами для веса и объема
    const [chartData, setChartData] = useState({
        labels: [],
        weights: [],
        volumes: [],
        averageWeightChangeResult: []
    });

    const canvasRef = useRef(null);
    const chartInstance = useRef(null);

    // Установка первого упражнения по умолчанию
    useEffect(() => {
        if (!selectedExercise && knownExercises.length > 0) {
            setSelectedExercise(knownExercises[0]);
        }
    }, [knownExercises, selectedExercise]);

    useEffect(callbackfn => {
        if (!isOpen) return;

        let labels = [];
        let weightValues = [];
        let volumeValues = [];
        let labelText = '';
        let averageWeightChangeResult = [];

        const parseNum = (val) => {
            if (val === null || val === undefined || val === '') return 0;
            const normalized = typeof val === 'string' ? val.replace(',', '.') : val;
            const result = parseFloat(normalized);
            return isNaN(result) ? 0 : result; // Гарантируем, что всегда вернется число
        };

        if (activeTab === 'body') {
            const sortedEntries = Object.entries(weights)
                .filter(([_, val]) => val !== '' && val !== null)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]));

            if (sortedEntries.length > 0) {
                labels = sortedEntries.map(([date]) => {
                    const d = new Date(date);
                    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                });
                weightValues = sortedEntries.map(([_, val]) => parseNum(val));
                labelText = t.weight;
            }
        } else if (activeTab === 'exercises' && selectedExercise) {
            const exerciseRecords = records.filter(r =>
                r.description &&
                r.description.trim().toLowerCase() === selectedExercise.trim().toLowerCase() &&
                !r.isStandBy // Игнорируем записи в режиме ожидания
            );

            const groupedByDate = {};

            exerciseRecords.forEach(r => {
                const actualDate = r.dateKey || r.date;
                if (!actualDate || actualDate === "undefined") return; // Пропускаем битые записи

                const w = parseNum(r.weight); // Дополнительный вес (блин на поясе)
                const reps = parseNum(r.val1) + parseNum(r.val2) + parseNum(r.val3);

                // Ищем вес тела на эту дату в объекте weights
                // Если на конкретную дату записи нет, берем 80 (твой текущий вес) как дефолт
                const bodyWeightAtDate = parseNum(weights[actualDate]) || 80;

                let totalWeight;
                if (w > 0) {
                    // Если есть доп. вес (например, +10кг), прибавляем его к весу тела
                    totalWeight = bodyWeightAtDate + w;
                } else {
                    // Если доп. веса нет (0), используем просто вес тела
                    totalWeight = bodyWeightAtDate;
                }

                const vol = totalWeight * reps; // Формула: (ВесТела + ДопВес) * Повторы

                if (!groupedByDate[actualDate] || vol > groupedByDate[actualDate].vol) {
                    groupedByDate[actualDate] = {
                        weight: w > 0 ? w : bodyWeightAtDate, // Показываем на красном графике либо доп.вес, либо вес тела
                        vol: vol
                    };
                }
            });

            const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));

            if (sortedDates.length > 0) {
                labels = sortedDates.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                });
                weightValues = sortedDates.map(date => groupedByDate[date].weight);
                volumeValues = sortedDates.map(date => groupedByDate[date].vol);
                labelText = selectedExercise;
            }
        }  else if (activeTab === 'averageWeightChange') {
            const sortedEntries = Object.entries(weights)
                .filter(([_, val]) => val !== '' && val !== null)
                .sort((a, b) => new Date(b[0]) - new Date(a[0]));

            if (sortedEntries.length > 0) {
                labels = sortedEntries.map(([date]) => {
                    const d = new Date(date);
                    return d.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit'});
                });
                weightValues = sortedEntries.map(([_, val]) => parseNum(val));

                const zeroValuesWeight = weightValues.filter(r => r === 0);
                if (zeroValuesWeight.length === 0) {
                    let result = weightValues.slice(7, 14)
                        .reverse()
                        .reduce((acc, curr) => {
                            acc.sum += curr;
                            acc.explanation += `${curr} + `;
                            return acc;
                        }, {sum: 0, explanation: ''});
                    const weekBeforeLastAverageWeight = result.sum / 7;
                    const weekBeforeLastAverageWeightResult = `${result.explanation.slice(0, -2)} (= ${(result.sum / 7).toFixed(2)})`;

                    result = weightValues.slice(0, 7)
                        .reverse()
                        .reduce((acc, curr) => {
                            acc.sum += curr;
                            acc.explanation += `${curr} + `;
                            return acc;
                        }, {sum: 0, explanation: ''});
                    const lastWeekAverageWeight = result.sum / 7;
                    const lastWeekAverageWeightResult = `${result.explanation.slice(0, -2)} (= ${(result.sum / 7).toFixed(2)})`;

                    const averageWeightChangeValue = [];
                    averageWeightChangeValue['weight'] =
                        weekBeforeLastAverageWeight - lastWeekAverageWeight;
                    averageWeightChangeResult['explanation'] = `${weekBeforeLastAverageWeightResult}  -  ${lastWeekAverageWeightResult}  =  ${averageWeightChangeValue['weight'].toFixed(2)}`;

                    if (averageWeightChangeValue['weight'] < 0) {
                        averageWeightChangeResult['result'] =
                            `Вы сбросили ${Math.abs(averageWeightChangeValue['weight']).toFixed(2)} кг.`;
                    }
                    if (averageWeightChangeValue['weight'] > 0) {
                        averageWeightChangeResult['result'] =
                            `Вы набрали ${Math.abs(averageWeightChangeValue['weight']).toFixed(2)} кг.`;
                    }
                    if (averageWeightChangeValue['weight'] === 0) {
                        averageWeightChangeResult['result'] = `Ваш вес не изменился`;
                    }
                } else {
                    averageWeightChangeResult['result'] = t.zeroWeightValuesWereDetected;
                }

                // 1. Получаем только числа веса, отсортированные от новых к старым
                const weightValuesOnly = Object.entries(weights)
                    .filter(([_, val]) => val !== '' && val !== null)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0])) // от новых к старым
                    .map(([_, val]) => parseNum(val));

                // 2. Считаем динамику
                const dynamics = weightValuesOnly.reduce((acc, _, ind, arr) => {
                    if (ind + 14 <= arr.length) {
                        const week1 = arr.slice(ind, ind + 7).reduce((s, v) => s + v, 0) / 7;
                        const week2 = arr.slice(ind + 7, ind + 14).reduce((s, v) => s + v, 0) / 7;
                        acc.push(Number((week1 - week2).toFixed(2)));
                    }
                    return acc;
                }, []);

                // 3. Подготавливаем метки дат (берем даты первых 7-дневок)
                const dynamicLabels = Object.entries(weights)
                    .filter(([_, val]) => val !== '' && val !== null)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .slice(0, dynamics.length) // столько же, сколько результатов
                    .map(([date]) => {
                        const d = new Date(date);
                        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                    });

                // Разворачиваем обратно для графика (чтобы время шло слева направо)
                labels = dynamicLabels.reverse();
                weightValues = dynamics.reverse();
            }
        }

        setChartData({ labels, weights: weightValues, volumes: volumeValues, averageWeightChangeResult });

        const timer = setTimeout(() => {
            if (canvasRef.current && (weightValues.length > 0 || volumeValues.length > 0)) {
                const ctx = canvasRef.current.getContext('2d');
                if (chartInstance.current) { chartInstance.current.destroy(); }

                const datasets = [];
                const scales = {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        grid: { color: '#f1f5f9' },
                        ticks: {
                            font: { size: 10, weight: 'bold' },
                            color: '#ef4444' // Красный цвет для левой оси (Вес)
                        },
                        title: {
                            display: true,
                            text: 'КГ',
                            color: '#ef4444',
                            font: { size: 10, weight: 'black' }
                        }
                    }
                };

                // Добавляем основной график Веса (Красный)
                datasets.push({
                    label: activeTab === 'body' ? t.weight : 'Вес (кг)',
                    data: weightValues,
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    yAxisID: 'y',
                    tension: 0.3,
                    pointRadius: 4
                });

                // Если это упражнения, добавляем второй график Объема (Черный)
                if (activeTab === 'exercises' && volumeValues.length > 0) {
                    datasets.push({
                        label: 'Всего повторов (кг*повт)',
                        data: volumeValues,
                        borderColor: '#0f172a',
                        backgroundColor: 'rgba(15, 23, 42, 0.05)',
                        borderWidth: 2,
                        yAxisID: 'y1', // Вторая ось Y
                        tension: 0.3,
                        fill: true,
                        borderDash: [5, 5]
                    });

                    // Настройка правой оси для объема
                    scales.y1 = {
                        type: 'linear',
                        position: 'right',
                        display: true,
                        grid: { drawOnChartArea: false },
                        ticks: { font: { size: 10 } }
                    };
                }

                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: { labels, datasets },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } },
                        scales: scales
                    }
                });
            }
        }, 0);

        return () => {
            clearTimeout(timer);
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [isOpen, weights, records, activeTab, selectedExercise, t]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 modal-backdrop fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 pt-6 pb-2 flex justify-between items-center border-b border-slate-50">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.progress}</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4">
                    <div className="bg-slate-100 p-1 rounded-xl">
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setActiveTab('body')}
                                    className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'body' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{t.bodyWeight}</button>
                            <button onClick={() => setActiveTab('exercises')} className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'exercises' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{t.exerciseStats}</button>
                        </div>
                        <button onClick={() => setActiveTab('averageWeightChange')}
                                className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all mt-1
                                ${activeTab === 'averageWeightChange' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                        >
                            {t.averageWeightChange}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-[380px]">
                    {activeTab === 'exercises' && (
                        <div className="p-6 pb-0">
                            <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 focus:outline-none appearance-none">
                                <option value="" disabled>{t.selectExercise}</option>
                                {knownExercises.map(ex => (<option key={ex} value={ex}>{ex}</option>))}
                            </select>
                        </div>
                    )}
                    {activeTab === "averageWeightChange" && (
                        <div className="max-w-[500px] h-full flex flex-col mt-10 mx-10 text-slate-300 gap-4">
                            <div className="block items-center justify-center">
                                {chartData.averageWeightChangeResult['explanation']}
                            </div>
                            <div className="block items-center justify-center">
                                {chartData.averageWeightChangeResult['result']}
                            </div>
                        </div>
                    )}
                    {activeTab && (
                        <div className="flex-1 relative p-6">
                            {chartData.labels.length > 0 ? (
                                <canvas ref={canvasRef}></canvas>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-center">{t.noData}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 pt-2">
                    <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl active:scale-95 transition-transform">{t.close}</button>
                </div>
            </div>
        </div>
    );
};

export default StatsModal;