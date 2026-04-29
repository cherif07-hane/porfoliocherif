import express from "express";
import {
    createProject,
    deleteProject,
    getProjectById,
    getProjects,
    updateProject
} from "../controllers/projectController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
    const cleanId = String(id || "").trim().toLowerCase();

    if (!cleanId) {
        return res
            .type("application/json")
            .status(400)
            .json({ message: "Parametre de route id invalide." });
    }

    req.projectSlug = cleanId;
    return next();
});

router.route("/").get(getProjects).post(requireAdmin, createProject);
router
    .route("/:id")
    .get(getProjectById)
    .put(requireAdmin, updateProject)
    .patch(requireAdmin, updateProject)
    .delete(requireAdmin, deleteProject);

export default router;
