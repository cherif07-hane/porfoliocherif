import { verifyAdminToken } from "../middleware/adminAuth.js";

export function sendJson(res, statusCode, payload) {
    return res.status(statusCode).json(payload);
}

export async function readJsonBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }

    if (typeof req.body === "string") {
        try {
            return JSON.parse(req.body);
        } catch (_error) {
            return {};
        }
    }

    return {};
}

export function requireAdminToken(req, res) {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : "";

    if (!verifyAdminToken(token)) {
        sendJson(res, 401, {
            message: "Acces admin requis."
        });
        return false;
    }

    return true;
}

export function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function normalizeList(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (!value) {
        return [];
    }

    return String(value)
        .split(/,|\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export function buildProjectPayload(body, options = {}) {
    const payload = {};
    const partial = options.partial === true;

    if (!partial) {
        payload.slug = slugify(body.id || body.slug || body.title);
    }

    if (body.title !== undefined) {
        payload.title = String(body.title).trim();
    }

    if (body.image !== undefined) {
        payload.image = String(body.image || "/images/projet1.jpg").trim();
    }

    if (body.kind !== undefined) {
        payload.kind = String(body.kind || "Projet web").trim();
    }

    if (body.stack !== undefined) {
        payload.stack = normalizeList(body.stack);
    }

    if (body.description !== undefined) {
        payload.description = String(body.description).trim();
    }

    if (body.link !== undefined) {
        payload.link = String(body.link || "#").trim();
    }

    if (body.points !== undefined) {
        payload.points = normalizeList(body.points);
    }

    return payload;
}

export function handleServerlessError(res, error) {
    return sendJson(res, 500, {
        message: error.message || "Erreur serveur."
    });
}
