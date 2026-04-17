import { useEffect, useState } from "react";

const EMPTY_FORM = {
    id: "",
    title: "",
    image: "/images/projet1.jpg",
    kind: "Projet web",
    stack: "",
    description: "",
    link: "#",
    points: ""
};

function toFormState(project) {
    if (!project) {
        return EMPTY_FORM;
    }

    return {
        id: project.id,
        title: project.title,
        image: project.image,
        kind: project.kind,
        stack: project.stack.join(", "),
        description: project.description,
        link: project.link,
        points: project.points.join("\n")
    };
}

function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function AjouterProjet({ mode, project, onCancelEdit, onSubmit, busy }) {
    const [formState, setFormState] = useState(EMPTY_FORM);

    useEffect(() => {
        setFormState(toFormState(project));
    }, [project]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormState((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const generatedId = formState.id || slugify(formState.title);
        const payload = {
            ...formState,
            id: generatedId || `projet-${Date.now()}`,
            stack: formState.stack,
            points: formState.points
        };

        await onSubmit(payload);

        if (mode === "create") {
            setFormState(EMPTY_FORM);
        }
    }

    const isEditing = mode === "edit";

    return (
        <section className="panel form-panel" id="project-form-panel">
            <div className="panel-heading">
                <p className="eyebrow">{isEditing ? "Edition" : "AjouterProjet"}</p>
                <h2>{isEditing ? "Modifier un projet" : "Ajouter un projet"}</h2>
                <p>
                    Le composant <strong>AjouterProjet</strong> gere les champs du
                    formulaire et transmet les donnees au composant Dossier.
                </p>
            </div>

            <form className="project-form" onSubmit={handleSubmit}>
                <label>
                    Identifiant
                    <input
                        disabled={isEditing}
                        name="id"
                        onChange={handleChange}
                        placeholder="portfolio-react"
                        value={formState.id}
                    />
                </label>

                <label>
                    Libelle
                    <input
                        required
                        name="title"
                        onChange={handleChange}
                        placeholder="Refonte du portfolio React"
                        value={formState.title}
                    />
                </label>

                <label>
                    Image
                    <input
                        name="image"
                        onChange={handleChange}
                        placeholder="/images/projet1.jpg"
                        value={formState.image}
                    />
                </label>

                <label>
                    Type
                    <select name="kind" onChange={handleChange} value={formState.kind}>
                        <option value="Projet web">Projet web</option>
                        <option value="Projet academique">Projet academique</option>
                        <option value="Projet systeme">Projet systeme</option>
                        <option value="Projet reseau">Projet reseau</option>
                    </select>
                </label>

                <label className="full-span">
                    Stack
                    <input
                        name="stack"
                        onChange={handleChange}
                        placeholder="React, Router, json-server"
                        value={formState.stack}
                    />
                </label>

                <label className="full-span">
                    Description
                    <textarea
                        required
                        name="description"
                        onChange={handleChange}
                        placeholder="Description du projet"
                        rows="4"
                        value={formState.description}
                    />
                </label>

                <label>
                    Lien
                    <input
                        name="link"
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                        value={formState.link}
                    />
                </label>

                <label className="full-span">
                    Points forts
                    <textarea
                        name="points"
                        onChange={handleChange}
                        placeholder={"Prototype de l'application\nCreation des composants\nConnexion HTTP"}
                        rows="4"
                        value={formState.points}
                    />
                </label>

                <div className="form-actions full-span">
                    <button className="button button-primary" disabled={busy} type="submit">
                        {busy ? "Enregistrement..." : isEditing ? "Mettre a jour" : "Ajouter"}
                    </button>

                    {isEditing ? (
                        <button
                            className="button button-ghost"
                            type="button"
                            onClick={onCancelEdit}
                        >
                            Annuler l'edition
                        </button>
                    ) : null}
                </div>
            </form>
        </section>
    );
}

export default AjouterProjet;
