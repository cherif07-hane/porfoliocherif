import express from "express";
import { createAdminToken, validateAdminPassword } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", (req, res) => {
    const password = String(req.body?.password || "");

    if (!validateAdminPassword(password)) {
        return res.status(401).json({
            message: "Mot de passe admin incorrect."
        });
    }

    return res.status(200).json({
        token: createAdminToken()
    });
});

export default router;
