import express from "express";
import {
    createProject,
    deleteProject,
    getProjectById,
    getProjects,
    updateProject
} from "../controllers/projectController.js";

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

router.route("/").get(getProjects).post(createProject);
router
    .route("/:id")
    .get(getProjectById)
    .put(updateProject)
    .patch(updateProject)
    .delete(deleteProject);

export default router;
