import { getAdminToken, isAdminAuthenticated } from "./adminAuth";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/projets";
const LOCAL_STORAGE_KEY = "portfolio-projects-local";
const initialProjects = [
    {
        id: "2023-2024",
        title: "Deploiement automatise de Windows 11",
        image: "/images/projet1.jpg",
        kind: "Projet academique",
        stack: ["Windows 11", "Deploiement", "Configuration systeme"],
        description:
            "Installation automatisee de Windows 11 avec creation d'images systeme.",
        link: "#",
        points: [
            "Installation automatisee",
            "Configuration standardisee",
            "Image systeme reutilisable"
        ]
    },
    {
        id: "2024-2025",
        title: "Serveur de messagerie",
        image: "/images/projet2.jpg",
        kind: "Projet academique",
        stack: ["Exchange", "Roundcube", "DNS", "SMTP", "SSL/TLS"],
        description:
            "Configuration d'un serveur mail avec DNS, SMTP, IMAP et securisation.",
        link: "#",
        points: ["Serveur mail", "Services DNS et SMTP", "Securisation SSL/TLS"]
    },
    {
        id: "2024-2025-voip",
        title: "Systeme VoIP avec Asterisk",
        image: "/images/Projet3.jpg",
        kind: "Projet academique",
        stack: ["Asterisk", "VoIP", "SIP"],
        description: "Infrastructure VoIP avec comptes SIP et routage des appels.",
        link: "#",
        points: ["Infrastructure VoIP", "Comptes SIP", "Routage des appels"]
    }
];

function createNetworkError() {
    const error = new Error(
        "API Express indisponible. Les projets passent en mode local."
    );
    error.code = "NETWORK";
    return error;
}

function isNetworkError(error) {
    return error?.code === "NETWORK";
}

function canUseLocalStorage() {
    return typeof window !== "undefined" && window.localStorage;
}

function readLocalProjects() {
    if (!canUseLocalStorage()) {
        return initialProjects.map(normalizeProject);
    }

    const savedProjects = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (savedProjects) {
        try {
            const parsedProjects = JSON.parse(savedProjects);

            if (Array.isArray(parsedProjects)) {
                return parsedProjects.map(normalizeProject);
            }
        } catch (_error) {
            window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }

    const projects = initialProjects.map(normalizeProject);
    writeLocalProjects(projects);
    return projects;
}

function writeLocalProjects(projects) {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

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
    const { admin = false, ...fetchOptions } = options;
    const adminToken = admin ? getAdminToken() : "";
    const headers = {
        "Content-Type": "application/json",
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        ...(fetchOptions.headers || {})
    };

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...fetchOptions,
            headers
        });
    } catch (error) {
        throw createNetworkError();
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
    try {
        const projects = await request();
        return projects.map(normalizeProject);
    } catch (error) {
        if (isNetworkError(error)) {
            return readLocalProjects();
        }

        throw error;
    }
}

export async function createProject(payload) {
    try {
        const project = await request("", {
            admin: true,
            method: "POST",
            body: JSON.stringify(normalizeProject(payload))
        });

        return normalizeProject(project);
    } catch (error) {
        if (!isNetworkError(error)) {
            throw error;
        }

        if (!isAdminAuthenticated()) {
            throw new Error("Connexion admin requise.");
        }

        const projects = readLocalProjects();
        const project = normalizeProject(payload);
        const exists = projects.some((item) => item.id === project.id);

        if (exists) {
            throw new Error("Un projet avec cet identifiant existe deja.");
        }

        const nextProjects = [project, ...projects];
        writeLocalProjects(nextProjects);
        return project;
    }
}

export async function updateProject(id, payload) {
    try {
        const project = await request(`/${id}`, {
            admin: true,
            method: "PUT",
            body: JSON.stringify(normalizeProject(payload))
        });

        return normalizeProject(project);
    } catch (error) {
        if (!isNetworkError(error)) {
            throw error;
        }

        if (!isAdminAuthenticated()) {
            throw new Error("Connexion admin requise.");
        }

        const projects = readLocalProjects();
        const projectIndex = projects.findIndex((project) => project.id === id);

        if (projectIndex === -1) {
            throw new Error("Projet introuvable.");
        }

        const updatedProject = normalizeProject({
            ...projects[projectIndex],
            ...payload,
            id
        });
        const nextProjects = projects.map((project, index) =>
            index === projectIndex ? updatedProject : project
        );

        writeLocalProjects(nextProjects);
        return updatedProject;
    }
}

export async function deleteProject(id) {
    try {
        await request(`/${id}`, {
            admin: true,
            method: "DELETE"
        });
    } catch (error) {
        if (!isNetworkError(error)) {
            throw error;
        }

        if (!isAdminAuthenticated()) {
            throw new Error("Connexion admin requise.");
        }

        const projects = readLocalProjects();
        const nextProjects = projects.filter((project) => project.id !== id);

        if (nextProjects.length === projects.length) {
            throw new Error("Projet introuvable.");
        }

        writeLocalProjects(nextProjects);
    }
}
