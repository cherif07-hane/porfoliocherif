import { hasServerlessDbUri } from "../lib/serverlessDb.js";
import { sendJson } from "../lib/serverlessUtils.js";

export default function handler(_req, res) {
    return sendJson(res, 200, {
        status: "ok",
        service: "portfolio-api",
        database: hasServerlessDbUri() ? "configured" : "static-readonly"
    });
}
