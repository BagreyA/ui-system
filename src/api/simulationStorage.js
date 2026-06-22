import { openDB } from "idb";

const dbPromise = openDB("scheduler-db", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("simulations")) {
            db.createObjectStore("simulations");
        }
    },
});

export async function saveSimulation(runId, data) {
    const db = await dbPromise;
    await db.put("simulations", data, runId);
}

export async function loadSimulation(runId) {
    const db = await dbPromise;
    return await db.get("simulations", runId);
}

export async function deleteSimulation(runId) {
    const db = await dbPromise;
    await db.delete("simulations", runId);
}

export async function getAllSimulationIds() {
    const db = await dbPromise;
    return await db.getAllKeys("simulations");
}