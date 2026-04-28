import Project from "../models/projectModel.js";

function sendJson(res, statusCode, payload) {
    return res.type("application/json").status(statusCode).json(payload);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeList(value) {
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

function buildProjectPayload(body, options = {}) {
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

function getRouteSlug(req) {
    return req.projectSlug || slugify(req.params.id);
}

export async function getProjects(req, res, next) {
    try {
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
    } catch (error) {
        return next(error);
    }
}

export async function getProjectById(req, res, next) {
    try {
        const project = await Project.findOne({ slug: getRouteSlug(req) });

        if (!project) {
            return sendJson(res, 404, { message: "Projet introuvable." });
        }

        return sendJson(res, 200, project);
    } catch (error) {
        return next(error);
    }
}

export async function createProject(req, res, next) {
    try {
        const payload = buildProjectPayload(req.body);

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
    } catch (error) {
        return next(error);
    }
}

export async function updateProject(req, res, next) {
    try {
        const payload = buildProjectPayload(req.body, { partial: true });
        const project = await Project.findOneAndUpdate(
            { slug: getRouteSlug(req) },
            payload,
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return sendJson(res, 404, { message: "Projet introuvable." });
        }

        return sendJson(res, 200, project);
    } catch (error) {
        return next(error);
    }
}

export async function deleteProject(req, res, next) {
    try {
        const project = await Project.findOneAndDelete({ slug: getRouteSlug(req) });

        if (!project) {
            return sendJson(res, 404, { message: "Projet introuvable." });
        }

        return sendJson(res, 200, {
            message: "Projet supprime avec succes.",
            project
        });
    } catch (error) {
        return next(error);
    }
}
