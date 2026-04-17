import { Link } from "react-router-dom";

function Projet({ project, onDelete, onEdit }) {
    return (
        <article className="project-card">
            <img src={project.image} alt={project.title} />

            <div className="project-card-top">
                <span className="pill">{project.kind}</span>
                <span className="project-id">{project.id}</span>
            </div>

            <div className="project-card-body">
                <h3>
                    <Link to={`/projets/${project.id}`}>{project.title}</Link>
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
                <Link className="button button-ghost" to={`/projets/${project.id}`}>
                    Detail
                </Link>
                <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => onEdit(project)}
                >
                    Editer
                </button>
                <button
                    className="button button-danger"
                    type="button"
                    onClick={() => onDelete(project)}
                >
                    Supprimer
                </button>
            </div>
        </article>
    );
}

export default Projet;
