import mongoose from "mongoose";

let cachedConnection = null;

export async function connectServerlessDb() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI est manquante.");
    }

    cachedConnection = await mongoose.connect(mongoUri);
    return cachedConnection;
}
