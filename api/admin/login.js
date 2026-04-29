import { createAdminToken, validateAdminPassword } from "../../middleware/adminAuth.js";
import { readJsonBody, sendJson } from "../../lib/serverlessUtils.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return sendJson(res, 405, {
            message: "Methode non autorisee."
        });
    }

    const body = await readJsonBody(req);
    const password = String(body.password || "");

    if (!validateAdminPassword(password)) {
        return sendJson(res, 401, {
            message: "Mot de passe admin incorrect."
        });
    }

    return sendJson(res, 200, {
        token: createAdminToken()
    });
}
