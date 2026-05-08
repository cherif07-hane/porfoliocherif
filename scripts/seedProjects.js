import "dotenv/config";
import mongoose from "mongoose";
import connectdb from "../config/connectdb.js";
import { initialProjects } from "../lib/initialProjects.js";
import Project from "../models/projectModel.js";

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (!value) {
        return [];
    }

    return String(value)
        .split(/,|\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

async function seedProjects() {
    await connectdb();

    const operations = initialProjects.map((project) => {
        const slug = slugify(project.id || project.title);

        return {
            updateOne: {
                filter: { slug },
                update: {
                    $set: {
                        slug,
                        title: project.title,
                        image: project.image || "/images/projet1.jpg",
                        kind: project.kind || "Projet web",
                        stack: normalizeList(project.stack),
                        description: project.description,
                        link: project.link || "#",
                        points: normalizeList(project.points)
                    }
                },
                upsert: true
            }
        };
    });

    if (operations.length > 0) {
        const result = await Project.bulkWrite(operations, {
            ordered: false
        });

        console.log(
            `${result.upsertedCount + result.modifiedCount} projets importes ou mis a jour.`
        );
    } else {
        console.log("Aucun projet a importer.");
    }

    await mongoose.connection.close();
}

seedProjects().catch(async (error) => {
    console.error("Import impossible:", error.message);
    await mongoose.connection.close();
    process.exit(1);
});
