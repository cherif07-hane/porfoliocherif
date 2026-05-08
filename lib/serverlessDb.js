import mongoose from "mongoose";

let cachedConnection = null;

export function getServerlessMongoUri() {
    return process.env.MONGO_URI || process.env.MONGODB_URI || "";
}

export function hasServerlessDbUri() {
    return Boolean(getServerlessMongoUri());
}

export async function connectServerlessDb() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const mongoUri = getServerlessMongoUri();

    if (!mongoUri) {
        throw new Error("MONGO_URI est manquante.");
    }

    cachedConnection = await mongoose.connect(mongoUri);
    return cachedConnection;
}
