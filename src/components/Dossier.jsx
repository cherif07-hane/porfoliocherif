import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCw, Search } from "lucide-react";
import AjouterProjet from "./AjouterProjet";
import DetaillerProjet from "./DetaillerProjet";
import Projet from "./Projet";
import {
    createProject,
    deleteProject,
    fetchProjects,
    updateProject
} from "../services/projectsApi";

function Dossier({ isAdmin = false, selectedProjectId, view = "list" }) {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [filterKind, setFilterKind] = useState("Tous");
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [notice, setNotice] = useState("");
    const deferredSearch = useDeferredValue(search);
    const isFormView = view === "form";
    const listPath = isAdmin ? "/admin/projets" : "/projets";
    const formPath = "/admin/ajout-projet";

    useEffect(() => {
        let active = true;

        async function loadProjects() {
            try {
                setStatus("loading");
                setError("");
                const data = await fetchProjects();

                if (active) {
                    setProjects(data);
                    setStatus("ready");
                }
            } catch (loadError) {
                if (active) {
                    setError(
                        loadError.message ||
                            "Impossible de charger les projets. Lance npm run api."
                    );
                    setStatus("error");
                }
            }
        }

        loadProjects();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!notice) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setNotice("");
        }, 2600);

        return () => window.clearTimeout(timer);
    }, [notice]);

    useEffect(() => {
        if (!isFormView) {
            return;
        }

        if (!selectedProjectId) {
            setEditingProject(null);
            return;
        }

        if (status !== "ready") {
            return;
        }

        const projectToEdit =
            projects.find((project) => project.id === selectedProjectId) || null;

        setEditingProject(projectToEdit);

        if (!projectToEdit) {
            setError(`Projet "${selectedProjectId}" introuvable.`);
        }
    }, [isFormView, projects, selectedProjectId, status]);

    const selectedProject =
        !isFormView && selectedProjectId
            ? projects.find((project) => project.id === selectedProjectId) || null
            : null;

    const visibleProjects = projects.filter((project) => {
        const text = `${project.title} ${project.description} ${project.kind} ${project.stack.join(" ")}`.toLowerCase();
        const matchesSearch = text.includes(deferredSearch.trim().toLowerCase());
        const matchesKind = filterKind === "Tous" || project.kind === filterKind;
        return matchesSearch && matchesKind;
    });

    const categories = ["Tous", ...new Set(projects.map((project) => project.kind))];

    async function reloadProjects() {
        try {
            setStatus("loading");
            setError("");
            const data = await fetchProjects();
            setProjects(data);
            setStatus("ready");
            return data;
        } catch (loadError) {
            setStatus("error");
            setError(loadError.message || "Le rechargement des projets a echoue.");
            return [];
        }
    }

    function handleStartEdit(project) {
        setEditingProject(project);
        navigate(`${formPath}/${project.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelEdit() {
        setEditingProject(null);
        navigate(formPath);
    }

    async function handleSubmitProject(formData) {
        setSaving(true);
        setError("");

        try {
            if (editingProject) {
                const updated = await updateProject(editingProject.id, formData);
                await reloadProjects();
                setEditingProject(null);
                setNotice("Projet modifie.");
                navigate(`${listPath}/${updated.id}`);
            } else {
                const created = await createProject(formData);
                await reloadProjects();
                setNotice("Projet ajoute.");
                navigate(`${listPath}/${created.id}`);
            }
        } catch (saveError) {
            setError(
                saveError.message ||
                    "Enregistrement impossible. Verifie que npm run api est actif."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteProject(project) {
        const confirmed = window.confirm(`Supprimer "${project.title}" ?`);

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(project.id);
            await reloadProjects();
            setNotice("Projet supprime.");

            if (selectedProjectId === project.id) {
                navigate(listPath);
            }

            if (editingProject?.id === project.id) {
                setEditingProject(null);
                navigate(formPath);
            }
        } catch (deleteError) {
            setError(deleteError.message || "Suppression impossible.");
        }
    }

    function handleSearchChange(event) {
        const value = event.target.value;
        startTransition(() => {
            setSearch(value);
        });
    }

    function handleKindChange(event) {
        startTransition(() => {
            setFilterKind(event.target.value);
        });
    }

    if (isFormView) {
        const isLoadingEdit = selectedProjectId && status === "loading";
        const isMissingEdit = selectedProjectId && status === "ready" && !editingProject;

        if (!isAdmin) {
            return (
                <section className="workspace">
                    <div className="admin-required reveal-card">
                        <p className="eyebrow">Admin</p>
                        <h1>Connexion requise</h1>
                        <p>Seul l'administrateur peut ajouter ou modifier les projets.</p>
                        <Link className="button button-primary" to="/admin">
                            Connexion admin
                        </Link>
                    </div>
                </section>
            );
        }

        return (
            <section className="workspace workspace-form">
                <div className="page-title-row">
                    <div>
                        <p className="eyebrow">Ajout Projet</p>
                        <h1>
                            {editingProject || selectedProjectId
                                ? "Modifier le projet"
                                : "Ajouter un projet"}
                        </h1>
                    </div>

                    <Link className="button button-secondary" to={listPath}>
                        <ArrowLeft size={18} />
                        Liste projet
                    </Link>
                </div>

                {error ? <p className="feedback error">{error}</p> : null}
                {notice ? <p className="feedback success">{notice}</p> : null}

                {isLoadingEdit ? <div className="panel">Chargement...</div> : null}

                {isMissingEdit ? (
                    <div className="empty-state">
                        <h2>Projet introuvable</h2>
                        <Link className="button button-primary" to={listPath}>
                            <ArrowLeft size={18} />
                            Retour liste
                        </Link>
                    </div>
                ) : null}

                {!isLoadingEdit && !isMissingEdit ? (
                    <AjouterProjet
                        busy={saving}
                        mode={editingProject ? "edit" : "create"}
                        onCancelEdit={handleCancelEdit}
                        onSubmit={handleSubmitProject}
                        project={editingProject}
                    />
                ) : null}
            </section>
        );
    }

    return (
        <section className="workspace">
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Liste projet</p>
                    <h1>{isAdmin ? "Gestion des projets" : "Projets realises"}</h1>
                </div>

                {isAdmin ? (
                    <Link className="button button-primary" to={formPath}>
                        <Plus size={18} />
                        Ajouter
                    </Link>
                ) : null}
            </div>

            <div className="toolbar">
                <label>
                    Recherche
                    <span className="field-with-icon">
                        <Search size={18} />
                        <input
                            onChange={handleSearchChange}
                            placeholder="Nom, techno, type..."
                            value={search}
                        />
                    </span>
                </label>

                <label>
                    Type
                    <select onChange={handleKindChange} value={filterKind}>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>

                <button
                    className="button button-secondary"
                    onClick={reloadProjects}
                    type="button"
                >
                    <RefreshCw size={18} />
                    Recharger
                </button>
            </div>

            {error ? <p className="feedback error">{error}</p> : null}
            {notice ? <p className="feedback success">{notice}</p> : null}

            <div className="workspace-grid">
                <section className="panel projects-panel">
                    <div className="panel-heading">
                        <h2>Liste des projets</h2>
                    </div>

                    {status === "loading" ? <p>Chargement...</p> : null}

                    {status === "ready" && visibleProjects.length === 0 ? (
                        <div className="empty-state">
                            <h2>Aucun projet</h2>
                            {isAdmin ? (
                                <Link className="button button-primary" to={formPath}>
                                    <Plus size={18} />
                                    Ajouter un projet
                                </Link>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="projects-grid">
                        {visibleProjects.map((project) => (
                            <Projet
                                key={project.id}
                                onDelete={handleDeleteProject}
                                onEdit={handleStartEdit}
                                project={project}
                                detailBasePath={listPath}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                </section>

                <DetaillerProjet
                    backPath={listPath}
                    isAdmin={isAdmin}
                    missingProjectId={selectedProjectId}
                    onEdit={handleStartEdit}
                    project={selectedProject}
                />
            </div>
        </section>
    );
}

export default Dossier;
