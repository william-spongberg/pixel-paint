import { BLACK, DATABASE, STORE } from "./constants.ts";

export function getColourFromDB(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE, "readonly");
      const store = transaction.objectStore(STORE);
      const getRequest = store.get("colour");

      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          console.error("No colour found in IndexedDB, defaulting to black");
          resolve(BLACK);
        } else {
          resolve(getRequest.result);
        }
      };

      getRequest.onerror = (error: any) => {
        console.error("Error getting data from IndexedDB:", error);
        reject(error);
      };
    };

    request.onerror = (error: any) => {
      console.error("Error opening IndexedDB:", error);
      reject(error);
    };
  });
}

export function setColourInDB(colour: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE, "readwrite");
      const store = transaction.objectStore(STORE);
      store.put(colour, "colour");

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (error: any) => {
        console.error("Error storing data in IndexedDB:", error);
        reject(error);
      };
    };

    request.onerror = (error: any) => {
      console.error("Error opening IndexedDB:", error);
      reject(error);
    };
  });
}
