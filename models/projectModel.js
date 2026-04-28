import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: [true, "L'identifiant du projet est obligatoire."],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-z0-9-]+$/,
                "L'identifiant doit contenir uniquement lettres, chiffres et tirets."
            ]
        },
        title: {
            type: String,
            required: [true, "Le titre est obligatoire."],
            trim: true
        },
        image: {
            type: String,
            default: "/images/projet1.jpg",
            trim: true
        },
        kind: {
            type: String,
            default: "Projet web",
            trim: true
        },
        stack: {
            type: [String],
            default: []
        },
        description: {
            type: String,
            required: [true, "La description est obligatoire."],
            trim: true
        },
        link: {
            type: String,
            default: "#",
            trim: true
        },
        points: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_document, returnedObject) => {
                returnedObject.id = returnedObject.slug;
                delete returnedObject._id;
                delete returnedObject.__v;
                delete returnedObject.slug;
                return returnedObject;
            }
        }
    }
);

projectSchema.index({
    title: "text",
    description: "text",
    kind: "text",
    stack: "text"
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
