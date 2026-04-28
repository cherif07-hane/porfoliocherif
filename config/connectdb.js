import mongoose from "mongoose";

async function connectdb() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI est manquante dans le fichier .env.");
    }

    try {
        const connection = await mongoose.connect(mongoUri);
        console.log(`Mongo DB connecte: ${connection.connection.host}`);
    } catch (error) {
        console.error("Erreur de connexion a Mongo DB:", error.message);
        throw error;
    }
}

export default connectdb;
