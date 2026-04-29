import crypto from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

function base64UrlEncode(value) {
    return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
    return Buffer.from(value, "base64url").toString("utf8");
}

function getAdminSecret() {
    return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "local-admin-secret";
}

function signPayload(encodedPayload) {
    return crypto
        .createHmac("sha256", getAdminSecret())
        .update(encodedPayload)
        .digest("base64url");
}

function getConfiguredPassword() {
    if (process.env.ADMIN_PASSWORD) {
        return process.env.ADMIN_PASSWORD;
    }

    if (process.env.NODE_ENV === "production") {
        return "";
    }

    return "admin123";
}

function constantTimeEquals(firstValue, secondValue) {
    const first = Buffer.from(String(firstValue));
    const second = Buffer.from(String(secondValue));

    if (first.length !== second.length) {
        return false;
    }

    return crypto.timingSafeEqual(first, second);
}

export function validateAdminPassword(password) {
    const configuredPassword = getConfiguredPassword();

    if (!configuredPassword) {
        return false;
    }

    return constantTimeEquals(password, configuredPassword);
}

export function createAdminToken() {
    const payload = {
        exp: Date.now() + TOKEN_TTL_MS,
        role: "admin"
    };
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = signPayload(encodedPayload);

    return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token) {
    if (!token || !token.includes(".")) {
        return false;
    }

    const [encodedPayload, signature] = token.split(".");
    const expectedSignature = signPayload(encodedPayload);

    if (!constantTimeEquals(signature, expectedSignature)) {
        return false;
    }

    try {
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        return payload.role === "admin" && Number(payload.exp) > Date.now();
    } catch (_error) {
        return false;
    }
}

export function requireAdmin(req, res, next) {
    const authorization = req.get("authorization") || "";
    const token = authorization.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : "";

    if (!verifyAdminToken(token)) {
        return res.status(401).json({
            message: "Acces admin requis."
        });
    }

    return next();
}
