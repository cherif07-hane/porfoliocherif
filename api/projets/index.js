import { cloneInitialProjects } from "../../lib/initialProjects.js";
import { connectServerlessDb, hasServerlessDbUri } from "../../lib/serverlessDb.js";
import {
    buildProjectPayload,
    escapeRegExp,
    handleServerlessError,
    readJsonBody,
    requireAdminToken,
    sendJson
} from "../../lib/serverlessUtils.js";
import Project from "../../models/projectModel.js";

function getStaticProjects(req) {
    const { kind, q, limit = "50" } = req.query;
    let projects = cloneInitialProjects();

    if (kind) {
        projects = projects.filter((project) => project.kind === String(kind).trim());
    }

    if (q) {
        const search = new RegExp(escapeRegExp(String(q).trim()), "i");
        projects = projects.filter((project) =>
            [
                project.title,
                project.description,
                project.kind,
                ...(project.stack || [])
            ].some((value) => search.test(String(value)))
        );
    }

    const safeLimit = Math.min(Number.parseInt(limit, 10) || 50, 100);
    return projects.slice(0, safeLimit);
}

async function getProjects(req, res) {
    const { kind, q, limit = "50", sort = "-createdAt" } = req.query;
    const filter = {};

    if (kind) {
        filter.kind = String(kind).trim();
    }

    if (q) {
        const search = new RegExp(escapeRegExp(String(q).trim()), "i");
        filter.$or = [
            { title: search },
            { description: search },
            { kind: search },
            { stack: search }
        ];
    }

    const safeLimit = Math.min(Number.parseInt(limit, 10) || 50, 100);
    const projects = await Project.find(filter).sort(sort).limit(safeLimit);

    return sendJson(res, 200, projects);
}

async function createProject(req, res) {
    if (!requireAdminToken(req, res)) {
        return undefined;
    }

    const body = await readJsonBody(req);
    const payload = buildProjectPayload(body);

    if (!payload.slug || !payload.title || !payload.description) {
        return sendJson(res, 400, {
            message: "Les champs id/title et description sont obligatoires."
        });
    }

    const existingProject = await Project.findOne({ slug: payload.slug });

    if (existingProject) {
        return sendJson(res, 409, {
            message: "Un projet avec cet identifiant existe deja."
        });
    }

    const project = await Project.create(payload);
    return sendJson(res, 201, project);
}

export default async function handler(req, res) {
    try {
        if (!hasServerlessDbUri()) {
            if (req.method === "GET") {
                return sendJson(res, 200, getStaticProjects(req));
            }

            return sendJson(res, 503, {
                message:
                    "Base MongoDB non configuree. Ajoute MONGO_URI sur Vercel pour activer l'ecriture."
            });
        }

        await connectServerlessDb();

        if (req.method === "GET") {
            return getProjects(req, res);
        }

        if (req.method === "POST") {
            return createProject(req, res);
        }

        res.setHeader("Allow", "GET, POST");
        return sendJson(res, 405, {
            message: "Methode non autorisee."
        });
    } catch (error) {
        return handleServerlessError(res, error);
    }
}
