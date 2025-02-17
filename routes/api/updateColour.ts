import { Handlers } from "$fresh/server.ts";
import { BLACK } from "../../global/constants.ts";

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("pixelDB", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("settings")) {
                db.createObjectStore("settings", { keyPath: "key" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getColourFromDB(db: IDBDatabase): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("settings", "readonly");
        const store = transaction.objectStore("settings");
        const req = store.get("colour");
        req.onsuccess = () => {
            resolve(req.result ? req.result.value : null);
        };
        req.onerror = () => reject(req.error);
    });
}

function setColourInDB(db: IDBDatabase, colour: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("settings", "readwrite");
        const store = transaction.objectStore("settings");
        const req = store.put({ key: "colour", value: colour });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

export const handler: Handlers = {
    async GET(_req, _ctx) {
        try {
            const db = await openDatabase();
            let colour = await getColourFromDB(db);
            if (!colour) {
                await setColourInDB(db, BLACK);
                colour = BLACK;
            }
            return new Response(JSON.stringify(colour), { status: 200 });
        } catch (error) {
            console.error("IndexedDB GET error:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    },

    async POST(req, _ctx) {
        try {
            const { colour } = await req.json();
            if (typeof colour !== "string") {
                return new Response("Colour must be a string", { status: 400 });
            }
            const db = await openDatabase();
            await setColourInDB(db, colour);
            console.log(`Colour set to ${colour}`);
            return new Response("Colour set successfully", { status: 200 });
        } catch (error) {
            console.error("IndexedDB POST error:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
};