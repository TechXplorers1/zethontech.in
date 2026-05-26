import { ref, get } from "firebase/database";
import { database } from '../../../../firebase';

// --- IndexedDB Helper (Solves the 5MB Quota Limit) ---
export const IDB_CONFIG = { name: 'AppCacheDB', version: 1, store: 'firebase_cache' };

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_CONFIG.name, IDB_CONFIG.version);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_CONFIG.store)) {
        db.createObjectStore(IDB_CONFIG.store);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbGet = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readonly');
    const request = transaction.objectStore(IDB_CONFIG.store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbSet = async (key, val) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readwrite');
    const request = transaction.objectStore(IDB_CONFIG.store).put(val, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getCachedData = async (dbPath, storageKey, durationMinutes = 10) => {
  try {
    const cached = await dbGet(storageKey);

    if (cached) {
      const { data, timestamp } = cached;
      const isFresh = (new Date().getTime() - timestamp) < (durationMinutes * 5 * 1000);
      if (isFresh) {
        console.log(`Using cached data (IDB) for ${storageKey}`);
        return data;
      }
    }

    console.log(`Fetching fresh data for ${dbPath}...`);
    const snapshot = await get(ref(database, dbPath));
    const data = snapshot.exists() ? snapshot.val() : null;

    if (data) {
      await dbSet(storageKey, {
        data,
        timestamp: new Date().getTime()
      });
    }
    return data;
  } catch (err) {
    console.error("Cache Error:", err);
    return null;
  }
};

export const updateLocalClientCache = async (clientKey, regKey, field, updatedData) => {
  try {
    const cachedWrapper = await dbGet('cache_clients_full');
    if (cachedWrapper && cachedWrapper.data && cachedWrapper.data[clientKey]) {
      if (regKey && cachedWrapper.data[clientKey].serviceRegistrations &&
        cachedWrapper.data[clientKey].serviceRegistrations[regKey]) {

        if (field === null) {
          cachedWrapper.data[clientKey].serviceRegistrations[regKey] = {
            ...cachedWrapper.data[clientKey].serviceRegistrations[regKey],
            ...updatedData
          };
        } else {
          cachedWrapper.data[clientKey].serviceRegistrations[regKey][field] = updatedData;
        }
      }
      else if (!regKey) {
        cachedWrapper.data[clientKey][field] = updatedData;
      }
      await dbSet('cache_clients_full', cachedWrapper);
      console.log(`Local IDB cache updated.`);
    }
  } catch (e) {
    console.error("Error updating local cache:", e);
  }
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return { date: 'N/A', time: 'N/A' };
  try {
    const date = new Date(timestamp);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return { date: formattedDate, time: formattedTime };
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    return { date: 'Invalid Date', time: 'N/A' };
  }
};

export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }
      return dateString;
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + (parts[parts.length - 1].charAt(0) || '')).toUpperCase();
};

export const normalizeResumeItem = (item) => {
  if (!item) return null;
  if (typeof item === 'string') {
    const fileName = item.split('/').pop().split('?')[0] || 'Resume';
    return { name: fileName, url: item };
  }
  return item;
};
