const ADMIN_API_URL =
    import.meta.env.VITE_ADMIN_API_URL || "/api/admin";
const ADMIN_TOKEN_KEY = "portfolio-admin-token";
const LOCAL_ADMIN_PASSWORD = "admin123";

function createLocalAdminToken() {
    const payload = {
        exp: Date.now() + 1000 * 60 * 60 * 4,
        role: "admin"
    };

    return `${window.btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")}.local`;
}

function canUseLocalAdminFallback(password) {
    return import.meta.env.DEV && password === LOCAL_ADMIN_PASSWORD;
}

function saveLocalAdminSession() {
    const token = createLocalAdminToken();
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    return token;
}

export function getAdminToken() {
    return window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function isAdminAuthenticated() {
    const token = getAdminToken();

    if (!token || !token.includes(".")) {
        return false;
    }

    try {
        const [encodedPayload] = token.split(".");
        const normalizedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = normalizedPayload.padEnd(
            normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
            "="
        );
        const payload = JSON.parse(window.atob(paddedPayload));

        if (Number(payload.exp) > Date.now()) {
            return true;
        }
    } catch (_error) {
        // Invalid token stored in the browser.
    }

    logoutAdmin();
    return false;
}

export function logoutAdmin() {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function loginAdmin(password) {
    let response;

    try {
        response = await fetch(`${ADMIN_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });
    } catch (error) {
        if (canUseLocalAdminFallback(password)) {
            return saveLocalAdminSession();
        }

        throw new Error("API admin indisponible.");
    }

    if (!response.ok) {
        let errorPayload = null;

        try {
            errorPayload = await response.json();
        } catch (_error) {
            errorPayload = null;
        }

        if (canUseLocalAdminFallback(password) && (response.status >= 500 || !errorPayload)) {
            return saveLocalAdminSession();
        }

        throw new Error(errorPayload?.message || "Connexion admin impossible.");
    }

    const payload = await response.json();
    window.localStorage.setItem(ADMIN_TOKEN_KEY, payload.token);
    return payload.token;
}
