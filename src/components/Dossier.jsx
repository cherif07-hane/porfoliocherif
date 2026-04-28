import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AjouterProjet from "./AjouterProjet";
import DetaillerProjet from "./DetaillerProjet";
import Projet from "./Projet";
import {
    createProject,
    deleteProject,
    fetchProjects,
    updateProject
} from "../services/projectsApi";

function Dossier({ selectedProjectId }) {
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
                        "Impossible de contacter l'API Express. Lance npm run api puis recharge la page."
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

    const selectedProject =
        projects.find((project) => project.id === selectedProjectId) || null;

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
        } catch (loadError) {
            setStatus("error");
            setError("Le rechargement des projets a echoue.");
        }
    }

    function handleStartEdit(project) {
        setEditingProject(project);
        document
            .getElementById("project-form-panel")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleCancelEdit() {
        setEditingProject(null);
    }

    async function handleSubmitProject(formData) {
        setSaving(true);

        try {
            if (editingProject) {
                const updated = await updateProject(editingProject.id, formData);
                setProjects((current) =>
                    current.map((project) =>
                        project.id === updated.id ? updated : project
                    )
                );
                setEditingProject(updated);
                setNotice("Projet modifie avec succes.");
                navigate(`/projets/${updated.id}`);
            } else {
                const created = await createProject(formData);
                setProjects((current) => [created, ...current]);
                setNotice("Projet ajoute avec succes.");
                navigate(`/projets/${created.id}`);
            }
        } catch (saveError) {
            setError("L'enregistrement du projet a echoue.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteProject(project) {
        const confirmed = window.confirm(
            `Supprimer le projet "${project.title}" du portfolio ?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(project.id);
            setProjects((current) =>
                current.filter((item) => item.id !== project.id)
            );
            setNotice("Projet supprime avec succes.");

            if (selectedProjectId === project.id) {
                navigate("/projets");
            }

            if (editingProject?.id === project.id) {
                setEditingProject(null);
            }
        } catch (deleteError) {
            setError("La suppression a echoue.");
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

    return (
        <section className="workspace">
            <div className="hero-panel">
                <p className="eyebrow">Dossier</p>
                <h1>Gestionnaire React du portfolio</h1>
                <p>
                    Le composant <strong>Dossier</strong> stocke, ajoute, recherche,
                    supprime, recharge et orchestre l'affichage detaille des projets.
                </p>
            </div>

            <div className="stats-row">
                <article className="stat-card">
                    <strong>{projects.length}</strong>
                    <span>projets total</span>
                </article>
                <article className="stat-card">
                    <strong>{visibleProjects.length}</strong>
                    <span>resultats visibles</span>
                </article>
                <article className="stat-card">
                    <strong>{categories.length - 1}</strong>
                    <span>categories</span>
                </article>
            </div>

            <div className="toolbar">
                <label>
                    Recherche
                    <input
                        onChange={handleSearchChange}
                        placeholder="Rechercher un projet"
                        value={search}
                    />
                </label>

                <label>
                    Filtre
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
                    Recharger
                </button>
            </div>

            {error ? <p className="feedback error">{error}</p> : null}
            {notice ? <p className="feedback success">{notice}</p> : null}

            <div className="workspace-grid">
                <section className="panel projects-panel">
                    <div className="panel-heading">
                        <p className="eyebrow">Projet</p>
                        <h2>Liste des projets</h2>
                        <p>
                            Chaque libelle de projet est une ancre React Router qui
                            ouvre le detail complet.
                        </p>
                    </div>

                    {status === "loading" ? <p>Chargement des projets...</p> : null}

                    {status === "ready" && visibleProjects.length === 0 ? (
                        <p>Aucun projet ne correspond a la recherche.</p>
                    ) : null}

                    <div className="projects-grid">
                        {visibleProjects.map((project) => (
                            <Projet
                                key={project.id}
                                onDelete={handleDeleteProject}
                                onEdit={handleStartEdit}
                                project={project}
                            />
                        ))}
                    </div>
                </section>

                <div className="side-column">
                    <AjouterProjet
                        busy={saving}
                        mode={editingProject ? "edit" : "create"}
                        onCancelEdit={handleCancelEdit}
                        onSubmit={handleSubmitProject}
                        project={editingProject}
                    />

                    <DetaillerProjet
                        missingProjectId={selectedProjectId}
                        onEdit={handleStartEdit}
                        project={selectedProject}
                    />
                </div>
            </div>
        </section>
    );
}

export default Dossier;
