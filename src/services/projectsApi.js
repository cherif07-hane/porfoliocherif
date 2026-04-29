import { getAdminToken, isAdminAuthenticated } from "./adminAuth";

const API_URL =
    import.meta.env.VITE_API_URL || "/api/projets";
const LOCAL_STORAGE_KEY = "portfolio-projects-local";
const initialProjects = [
    {
        id: "migration-aws-2026",
        title: "Migration d'une infrastructure On-Premise vers AWS",
        image: "/images/projet-aws-migration.svg",
        kind: "Projet cloud",
        stack: ["AWS", "EC2", "RDS", "S3", "VPC", "IAM"],
        description:
            "Conception d'une architecture cloud multi-tiers avec reseau securise, services AWS et strategie de disponibilite.",
        link: "#",
        points: [
            "Architecture multi-tiers avec EC2, RDS et S3",
            "Mise en place d'un reseau securise avec VPC et IAM",
            "Sauvegarde et haute disponibilite"
        ]
    },
    {
        id: "active-directory-2026",
        title: "Infrastructure Windows Server avec Active Directory",
        image: "/images/projet-active-directory.svg",
        kind: "Projet systeme",
        stack: ["Windows Server 2022", "AD DS", "DNS", "GPO", "IIS", "HTTPS"],
        description:
            "Deploiement d'un domaine Windows Server avec gestion des utilisateurs, politiques de securite et serveur web IIS securise.",
        link: "#",
        points: [
            "Deploiement Active Directory Domain Services",
            "Configuration DNS, GPO, utilisateurs et groupes",
            "Mise en place de profils itinerants et politiques de securite",
            "Deploiement d'un serveur Web IIS securise en HTTPS"
        ]
    },
    {
        id: "deploiement-windows-11-mdt",
        title: "Deploiement automatise Windows 11 avec MDT",
        image: "/images/projet-mdt-windows11.svg",
        kind: "Projet systeme",
        stack: ["Windows 11", "MDT", "Images systeme", "Deploiement"],
        description:
            "Automatisation du deploiement de postes Windows 11 avec creation et gestion d'images systeme.",
        link: "#",
        points: [
            "Automatisation du deploiement de postes",
            "Creation et gestion d'images systeme",
            "Standardisation de la configuration des postes"
        ]
    },
    {
        id: "infrastructure-reseau-securite",
        title: "Infrastructure reseau et securite",
        image: "/images/projet-reseau-securite.svg",
        kind: "Projet reseau",
        stack: ["LAN", "WAN", "VPN", "Routeurs", "WiFi", "Securite"],
        description:
            "Mise en place d'une infrastructure LAN/WAN avec VPN securise, configuration routeurs et reseaux WiFi.",
        link: "#",
        points: [
            "Mise en place de reseaux LAN/WAN",
            "Configuration VPN securise pour acces distant",
            "Configuration routeurs et reseaux WiFi",
            "Application de bonnes pratiques de securite"
        ]
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
                const projects = mergeInitialProjects(parsedProjects.map(normalizeProject));
                writeLocalProjects(projects);
                return projects;
            }
        } catch (_error) {
            window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }

    const projects = initialProjects.map(normalizeProject);
    writeLocalProjects(projects);
    return projects;
}

function mergeInitialProjects(projects) {
    const projectMap = new Map(projects.map((project) => [project.id, project]));
    const mergedProjects = [];

    for (const project of initialProjects.map(normalizeProject)) {
        mergedProjects.push(projectMap.get(project.id) || project);
        projectMap.delete(project.id);
    }

    return [...mergedProjects, ...projectMap.values()];
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
