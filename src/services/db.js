const DB_NAME = 'TrackerDB';
const DB_VERSION = 5;

export const STORES = {
    RECORDS: 'records',
    WEIGHTS: 'weights',
    SESSIONS: 'sessions'
};

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORES.RECORDS)) {
                db.createObjectStore(STORES.RECORDS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.WEIGHTS)) {
                db.createObjectStore(STORES.WEIGHTS, { keyPath: 'dateKey' });
            }
            if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
                db.createObjectStore(STORES.SESSIONS, { keyPath: 'dateKey' });
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const saveToDB = async (records, forceEmpty = false) => {
    if (!records) return;

    // ПРОВЕРКА: Если массив пуст и мы НЕ заставляем базу тереться специально — выходим.
    if (records.length === 0 && !forceEmpty) {
        return;
    }

    const db = await initDB();
    const tx = db.transaction(STORES.RECORDS, 'readwrite');
    const store = tx.objectStore(STORES.RECORDS);

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

export const loadFromDB = async () => {
    const db = await initDB();
    const tx = db.transaction(STORES.RECORDS, 'readonly');
    const store = tx.objectStore(STORES.RECORDS);
    return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const results = request.result || [];
            const sorted = results.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
            resolve(sorted);
        };
    });
};

export const saveWeightToDB = async (dateKey, weight) => {
    const db = await initDB();
    const tx = db.transaction(STORES.WEIGHTS, 'readwrite');
    const store = tx.objectStore(STORES.WEIGHTS);
    return new Promise((resolve, reject) => {
        store.put({ dateKey, weight });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};
export const loadWeightsFromDB = async () => {
    const db = await initDB();
    const tx = db.transaction(STORES.WEIGHTS, 'readonly');
    const store = tx.objectStore(STORES.WEIGHTS);
    return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const weightsMap = {};
            request.result.forEach(item => { weightsMap[item.dateKey] = item.weight; });
            resolve(weightsMap);
        };
    });
};
export const saveSessionToDB = async (dateKey, session) => {
    const db = await initDB();
    const tx = db.transaction(STORES.SESSIONS, 'readwrite');
    const store = tx.objectStore(STORES.SESSIONS);
    return new Promise((resolve, reject) => {
        store.put({ dateKey, ...session });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};
export const loadSessionsFromDB = async () => {
    const db = await initDB();
    const tx = db.transaction(STORES.SESSIONS, 'readonly');
    const store = tx.objectStore(STORES.SESSIONS);
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