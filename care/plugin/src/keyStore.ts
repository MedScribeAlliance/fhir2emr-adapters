// The callback opens in a new tab, so the private key lives in IndexedDB, which every tab shares.
const DB_NAME = "care_vaarta";
const STORE = "keys";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  mode: IDBTransactionMode,
  op: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = op(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export const putKey = (kid: string, key: CryptoKey) =>
  run("readwrite", (store) => store.put(key, kid));

export const getKey = (kid: string): Promise<CryptoKey | undefined> =>
  run("readonly", (store) => store.get(kid));

export const deleteKey = (kid: string) =>
  run("readwrite", (store) => store.delete(kid));
