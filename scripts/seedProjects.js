import "dotenv/config";
import mongoose from "mongoose";
import connectdb from "../config/connectdb.js";
import Project from "../models/projectModel.js";

const initialProjects = [
    {
        id: "2023-2024",
        title: "Deploiement automatise de Windows 11",
        image: "/images/projet1.jpg",
        kind: "Projet academique",
        stack: ["Windows 11", "Deploiement", "Configuration systeme"],
        description:
            "Installation automatisee et configuration de Windows 11 avec creation d'images systeme pour accelerer le deploiement et standardiser les postes de travail.",
        link: "#",
        points: [
            "Installation automatisee du systeme",
            "Configuration initiale standardisee",
            "Creation d'images systeme reutilisables"
        ]
    },
    {
        id: "2024-2025",
        title: "Serveur de messagerie avec Exchange et Roundcube",
        image: "/images/projet2.jpg",
        kind: "Projet academique",
        stack: ["Exchange", "Roundcube", "DNS", "SMTP", "IMAP", "SSL/TLS"],
        description:
            "Installation et configuration d'un serveur de messagerie avec mise en place des services DNS, SMTP et IMAP, puis securisation des echanges via SSL/TLS.",
        link: "#",
        points: [
            "Installation du serveur de messagerie",
            "Configuration DNS, SMTP et IMAP",
            "Securisation avec SSL/TLS"
        ]
    },
    {
        id: "2024-2025-voip",
        title: "Systeme VoIP avec Asterisk",
        image: "/images/Projet3.jpg",
        kind: "Projet academique",
        stack: ["Asterisk", "VoIP", "SIP", "Messagerie vocale"],
        description:
            "Deploiement d'une infrastructure VoIP avec configuration des comptes SIP, de la messagerie vocale et du routage des appels.",
        link: "#",
        points: [
            "Mise en place d'une infrastructure VoIP",
            "Configuration SIP et messagerie vocale",
            "Routage des appels"
        ]
    },
    {
        id: "2026",
        title: "Refactoring d'un portfolio avec React",
        image: "/images/projet1.jpg",
        kind: "Projet web",
        stack: ["HTML", "CSS", "React", "Responsive Design"],
        description:
            "Refonte complete d'un site portfolio avec amelioration du design, de la structure visuelle et du comportement responsive sur differents ecrans.",
        link: "#",
        points: [
            "Refonte visuelle complete",
            "Amelioration du responsive design",
            "Mise en page plus claire et moderne"
        ]
    }
];

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
