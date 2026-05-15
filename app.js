import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectdb from "./config/connectdb.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

if (allowedOrigins.length > 0) {
    app.use(cors({ origin: allowedOrigins }));
} else {
    app.use(cors());
}

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

if (process.env.NODE_ENV !== "production") {
    app.get("/", (_req, res) => {
        return res
            .type("text/plain")
            .status(200)
            .send("API REST Portfolio avec Express JS, Mongo DB et Mongoose.");
    });
}

app.get("/api/health", (_req, res) => {
    return res.type("application/json").status(200).json({
        status: "ok",
        service: "portfolio-api"
    });
});

app.use("/api/projets", projectRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(distPath));
    app.get(/^(?!\/api).*/, (_req, res) => {
        return res.sendFile(path.join(distPath, "index.html"));
    });
}

app.use(notFound);
app.use(errorHandler);

async function startServer() {
    try {
        await connectdb();
        app.listen(PORT, () => {
            console.log(`Serveur Express lance sur http://localhost:${PORT}`);
        });
    } catch (_error) {
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== "test") {
    startServer();
}

export default app;
