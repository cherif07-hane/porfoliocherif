import { useNavigate } from "react-router-dom";

function DetaillerProjet({ project, missingProjectId, onEdit }) {
    const navigate = useNavigate();

    if (!project && !missingProjectId) {
        return (
            <aside className="panel detail-panel">
                <p className="eyebrow">DetaillerProjet</p>
                <h2>Selectionne un projet</h2>
                <p>
                    Clique sur le libelle d'un projet pour afficher ses informations
                    completes dans le composant detail.
                </p>
            </aside>
        );
    }

    if (!project && missingProjectId) {
        return (
            <aside className="panel detail-panel">
                <p className="eyebrow">Projet introuvable</p>
                <h2>Aucun projet ne correspond a {missingProjectId}</h2>
                <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => navigate("/projets")}
                >
                    Annuler
                </button>
            </aside>
        );
    }

    return (
        <aside className="panel detail-panel">
            <p className="eyebrow">DetaillerProjet</p>
            <img className="detail-image" src={project.image} alt={project.title} />
            <h2>{project.title}</h2>
            <p className="detail-summary">{project.description}</p>

            <div className="detail-meta">
                <span className="pill">{project.kind}</span>
                <span className="project-id">{project.id}</span>
            </div>

            <section>
                <h3>Technologies</h3>
                <div className="tag-list">
                    {project.stack.map((item) => (
                        <span className="tag" key={`${project.id}-detail-${item}`}>
                            {item}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h3>Informations completes</h3>
                <ul className="detail-list">
                    {project.points.map((point) => (
                        <li key={`${project.id}-${point}`}>{point}</li>
                    ))}
                </ul>
            </section>

            <div className="card-actions">
                <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => navigate("/projets")}
                >
                    Annuler
                </button>
                <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => onEdit(project)}
                >
                    Editer
                </button>
                {project.link && project.link !== "#" ? (
                    <a
                        className="button button-primary"
                        href={project.link}
                        rel="noreferrer"
                        target="_blank"
                    >
                        Ouvrir
                    </a>
                ) : null}
            </div>
        </aside>
    );
}

export default DetaillerProjet;
