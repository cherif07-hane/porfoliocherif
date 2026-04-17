const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/projets";

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

function normalizeProject(project) {
    return {
        ...project,
        image: project.image || "/images/projet1.jpg",
        link: project.link || "#",
        kind: project.kind || "Projet web",
        stack: normalizeList(project.stack),
        points: normalizeMultilineList(project.points)
    };
}

async function request(endpoint = "", options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    if (!response.ok) {
        throw new Error("La reponse du serveur est invalide.");
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
