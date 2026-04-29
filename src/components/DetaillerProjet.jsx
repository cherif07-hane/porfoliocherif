import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";

function DetaillerProjet({
    backPath = "/projets",
    isAdmin = false,
    project,
    missingProjectId,
    onEdit
}) {
    const navigate = useNavigate();

    if (!project && !missingProjectId) {
        return (
            <aside className="panel detail-panel">
                <p className="eyebrow">Detail</p>
                <h2>Selectionne un projet</h2>
            </aside>
        );
    }

    if (!project && missingProjectId) {
        return (
            <aside className="panel detail-panel">
                <p className="eyebrow">Projet introuvable</p>
                <h2>{missingProjectId}</h2>
                <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => navigate(backPath)}
                >
                    <ArrowLeft size={17} />
                    Annuler
                </button>
            </aside>
        );
    }

    return (
        <aside className="panel detail-panel">
            <p className="eyebrow">Detail</p>
            <div className="detail-cover">
                <img className="detail-image" src={project.image} alt={project.title} />
                <div className="detail-meta">
                    <span className="pill">{project.kind}</span>
                    <span className="project-id">{project.id}</span>
                </div>
            </div>
            <h2>{project.title}</h2>
            <p className="detail-summary">{project.description}</p>

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
                <h3>Points cles</h3>
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
                    onClick={() => navigate(backPath)}
                >
                    <ArrowLeft size={17} />
                    Annuler
                </button>
                {isAdmin ? (
                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={() => onEdit(project)}
                    >
                        <Pencil size={17} />
                        Editer
                    </button>
                ) : null}
                {project.link && project.link !== "#" ? (
                    <a
                        className="button button-primary"
                        href={project.link}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <ExternalLink size={17} />
                        Ouvrir
                    </a>
                ) : null}
            </div>
        </aside>
    );
}

export default DetaillerProjet;
