const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/projets";

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (!value) {
        return [];
    }

    return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeMultilineList(value) {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (!value) {
        return [];
    }

    return String(value)
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeImage(value) {
    if (!value) {
        return "/images/projet1.jpg";
    }

    if (
        value.startsWith("/") ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:image/")
    ) {
        return value;
    }

    return `/${value.replace(/^\.?\//, "")}`;
}

function normalizeProject(project) {
    return {
        ...project,
        image: normalizeImage(project.image),
        link: project.link || "#",
        kind: project.kind || "Projet web",
        stack: normalizeList(project.stack),
        points: normalizeMultilineList(project.points)
    };
}

async function request(endpoint = "", options = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        });
    } catch (error) {
        throw new Error(
            "Impossible de contacter l'API Express. Lance `npm run api` puis recharge la page."
        );
    }

    if (!response.ok) {
        let errorPayload = null;

        try {
            errorPayload = await response.json();
        } catch (_error) {
            errorPayload = null;
        }

        if (response.status === 413) {
            throw new Error(
                "L'image est trop lourde pour la base locale. Choisis une photo plus legere."
            );
        }

        if (errorPayload?.message) {
            throw new Error(errorPayload.message);
        }

        throw new Error(`Le serveur a refuse la requete (${response.status}).`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function fetchProjects() {
    const projects = await request();
    return projects.map(normalizeProject);
}

export async function createProject(payload) {
    const project = await request("", {
        method: "POST",
        body: JSON.stringify(normalizeProject(payload))
    });

    return normalizeProject(project);
}

export async function updateProject(id, payload) {
    const project = await request(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(normalizeProject(payload))
    });

    return normalizeProject(project);
}

export async function deleteProject(id) {
    await request(`/${id}`, {
        method: "DELETE"
    });
}
