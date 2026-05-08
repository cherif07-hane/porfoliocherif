import { cloneInitialProjects } from "../../lib/initialProjects.js";
import { connectServerlessDb, hasServerlessDbUri } from "../../lib/serverlessDb.js";
import {
    buildProjectPayload,
    handleServerlessError,
    readJsonBody,
    requireAdminToken,
    sendJson,
    slugify
} from "../../lib/serverlessUtils.js";
import Project from "../../models/projectModel.js";

function getRouteSlug(req) {
    return slugify(req.query.id);
}

function getStaticProject(req) {
    const routeSlug = getRouteSlug(req);
    return cloneInitialProjects().find((project) => slugify(project.id) === routeSlug);
}

async function getProjectById(req, res) {
    const project = await Project.findOne({ slug: getRouteSlug(req) });

    if (!project) {
        return sendJson(res, 404, {
            message: "Projet introuvable."
        });
    }

    return sendJson(res, 200, project);
}

async function updateProject(req, res) {
    if (!requireAdminToken(req, res)) {
        return undefined;
    }

    const body = await readJsonBody(req);
    const payload = buildProjectPayload(body, { partial: true });
    const project = await Project.findOneAndUpdate({ slug: getRouteSlug(req) }, payload, {
        new: true,
        runValidators: true
    });

    if (!project) {
        return sendJson(res, 404, {
            message: "Projet introuvable."
        });
    }

    return sendJson(res, 200, project);
}

async function deleteProject(req, res) {
    if (!requireAdminToken(req, res)) {
        return undefined;
    }

    const project = await Project.findOneAndDelete({ slug: getRouteSlug(req) });

    if (!project) {
        return sendJson(res, 404, {
            message: "Projet introuvable."
        });
    }

    return sendJson(res, 200, {
        message: "Projet supprime avec succes.",
        project
    });
}

export default async function handler(req, res) {
    try {
        if (!hasServerlessDbUri()) {
            if (req.method === "GET") {
                const project = getStaticProject(req);

                if (!project) {
                    return sendJson(res, 404, {
                        message: "Projet introuvable."
                    });
                }

                return sendJson(res, 200, project);
            }

            return sendJson(res, 503, {
                message:
                    "Base MongoDB non configuree. Ajoute MONGO_URI sur Vercel pour activer l'ecriture."
            });
        }

        await connectServerlessDb();

        if (req.method === "GET") {
            return getProjectById(req, res);
        }

        if (req.method === "PUT" || req.method === "PATCH") {
            return updateProject(req, res);
        }

        if (req.method === "DELETE") {
            return deleteProject(req, res);
        }

        res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
        return sendJson(res, 405, {
            message: "Methode non autorisee."
        });
    } catch (error) {
        return handleServerlessError(res, error);
    }
}
