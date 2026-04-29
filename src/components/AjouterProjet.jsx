import { useEffect, useRef, useState } from "react";
import { RotateCcw, Save, X } from "lucide-react";

const DEFAULT_IMAGE = "/images/projet1.jpg";
const MAX_IMAGE_BYTES = 75 * 1024;
const EMPTY_FORM = {
    id: "",
    title: "",
    image: DEFAULT_IMAGE,
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

function isDataImage(value) {
    return typeof value === "string" && value.startsWith("data:image/");
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Impossible de lire cette image."));
        image.src = src;
    });
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                reject(new Error("Impossible de charger cette image."));
                return;
            }

            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(new Error("Impossible de charger cette image."));
        };

        reader.readAsDataURL(file);
    });
}

async function compressImage(file) {
    const source = await readFileAsDataUrl(file);
    const image = await loadImage(source);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Le navigateur ne peut pas compresser cette image.");
    }

    let width = image.naturalWidth || image.width;
    let height = image.naturalHeight || image.height;
    const maxDimension = 1280;

    if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.max(1, Math.round(width * ratio));
        height = Math.max(1, Math.round(height * ratio));
    }

    for (let scale = 1; scale >= 0.45; scale -= 0.15) {
        const scaledWidth = Math.max(1, Math.round(width * scale));
        const scaledHeight = Math.max(1, Math.round(height * scale));

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, scaledWidth, scaledHeight);
        context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

        for (let quality = 0.82; quality >= 0.45; quality -= 0.12) {
            const dataUrl = canvas.toDataURL("image/jpeg", quality);

            if (dataUrl.length <= MAX_IMAGE_BYTES) {
                return dataUrl;
            }
        }
    }

    throw new Error(
        "Image trop lourde pour la base locale. Choisis une photo plus legere."
    );
}

function AjouterProjet({ mode, project, onCancelEdit, onSubmit, busy }) {
    const [formState, setFormState] = useState(EMPTY_FORM);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        setFormState(toFormState(project));
        setUploadError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [project]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormState((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleImagePick(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setUploadError("Choisis un fichier image valide.");
            event.target.value = "";
            return;
        }

        try {
            const compressedImage = await compressImage(file);
            setFormState((current) => ({
                ...current,
                image: compressedImage
            }));
            setUploadError("");
        } catch (error) {
            setUploadError(error.message || "Impossible de charger cette image.");
            event.target.value = "";
        }
    }

    function handleResetImage() {
        setFormState((current) => ({
            ...current,
            image: DEFAULT_IMAGE
        }));
        setUploadError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
            setUploadError("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    const isEditing = mode === "edit";

    return (
        <section className="panel form-panel" id="project-form-panel">
            <div className="panel-heading">
                <p className="eyebrow">{isEditing ? "Edition" : "Nouveau"}</p>
                <h2>Infos projet</h2>
            </div>

            <form className="project-form" onSubmit={handleSubmit}>
                <label>
                    ID
                    <input
                        disabled={isEditing}
                        name="id"
                        onChange={handleChange}
                        placeholder="portfolio-thierno"
                        value={formState.id}
                    />
                </label>

                <label>
                    Titre
                    <input
                        required
                        name="title"
                        onChange={handleChange}
                        placeholder="Refonte du portfolio"
                        value={formState.title}
                    />
                </label>

                <label>
                    Image importee
                    <input
                        accept="image/*"
                        ref={fileInputRef}
                        type="file"
                        onChange={handleImagePick}
                    />
                </label>

                <label>
                    Chemin image
                    <input
                        name="image"
                        onChange={handleChange}
                        placeholder="/images/projet1.jpg ou image importee"
                        value={isDataImage(formState.image) ? "" : formState.image}
                    />
                </label>

                <div className="image-picker-preview full-span">
                    <img src={formState.image || DEFAULT_IMAGE} alt="Apercu du projet" />
                    <div className="image-picker-copy">
                        <strong>Apercu</strong>
                        {isDataImage(formState.image) ? (
                            <p>Photo importee.</p>
                        ) : null}
                        {uploadError ? <p className="feedback error">{uploadError}</p> : null}
                        <button
                            className="button button-ghost"
                            type="button"
                            onClick={handleResetImage}
                        >
                            <RotateCcw size={17} />
                            Image par defaut
                        </button>
                    </div>
                </div>

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
                        placeholder="React, Express, Mongo DB"
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
                    Points cles
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
                        <Save size={18} />
                        {busy ? "Enregistrement..." : isEditing ? "Enregistrer" : "Ajouter"}
                    </button>

                    {isEditing ? (
                        <button
                            className="button button-ghost"
                            type="button"
                            onClick={onCancelEdit}
                        >
                            <X size={18} />
                            Annuler
                        </button>
                    ) : null}
                </div>
            </form>
        </section>
    );
}

export default AjouterProjet;
