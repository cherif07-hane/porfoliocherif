import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

function Projet({ detailBasePath = "/projets", isAdmin = false, project, onDelete, onEdit }) {
    const detailPath = `${detailBasePath}/${project.id}`;

    return (
        <article className="project-card">
            <div className="project-card-media">
                <img src={project.image} alt={project.title} />
                <div className="project-card-top">
                    <span className="pill">{project.kind}</span>
                    <span className="project-id">{project.id}</span>
                </div>
            </div>

            <div className="project-card-body">
                <h3>
                    <Link to={detailPath}>{project.title}</Link>
                </h3>
                <p>{project.description}</p>
            </div>

            <div className="tag-list">
                {project.stack.map((item) => (
                    <span className="tag" key={`${project.id}-${item}`}>
                        {item}
                    </span>
                ))}
            </div>

            <div className="card-actions">
                <Link className="button button-ghost" to={detailPath}>
                    <Eye size={17} />
                    Details
                </Link>
                {isAdmin ? (
                    <>
                        <button
                            className="button button-secondary"
                            type="button"
                            onClick={() => onEdit(project)}
                        >
                            <Pencil size={17} />
                            Modifier
                        </button>
                        <button
                            className="button button-danger"
                            type="button"
                            onClick={() => onDelete(project)}
                        >
                            <Trash2 size={17} />
                            Supprimer
                        </button>
                    </>
                ) : null}
            </div>
        </article>
    );
}

export default Projet;
