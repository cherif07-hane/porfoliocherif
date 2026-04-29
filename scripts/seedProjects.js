import "dotenv/config";
import mongoose from "mongoose";
import connectdb from "../config/connectdb.js";
import Project from "../models/projectModel.js";

const initialProjects = [
    {
        id: "migration-aws-2026",
        title: "Migration d'une infrastructure On-Premise vers AWS",
        image: "/images/projet-aws-migration.svg",
        kind: "Projet cloud",
        stack: ["AWS", "EC2", "RDS", "S3", "VPC", "IAM"],
        description:
            "Conception d'une architecture cloud multi-tiers avec reseau securise, services AWS et strategie de disponibilite.",
        link: "#",
        points: [
            "Architecture multi-tiers avec EC2, RDS et S3",
            "Mise en place d'un reseau securise avec VPC et IAM",
            "Sauvegarde et haute disponibilite"
        ]
    },
    {
        id: "active-directory-2026",
        title: "Infrastructure Windows Server avec Active Directory",
        image: "/images/projet-active-directory.svg",
        kind: "Projet systeme",
        stack: ["Windows Server 2022", "AD DS", "DNS", "GPO", "IIS", "HTTPS"],
        description:
            "Deploiement d'un domaine Windows Server avec gestion des utilisateurs, politiques de securite et serveur web IIS securise.",
        link: "#",
        points: [
            "Deploiement Active Directory Domain Services",
            "Configuration DNS, GPO, utilisateurs et groupes",
            "Mise en place de profils itinerants et politiques de securite",
            "Deploiement d'un serveur Web IIS securise en HTTPS"
        ]
    },
    {
        id: "deploiement-windows-11-mdt",
        title: "Deploiement automatise Windows 11 avec MDT",
        image: "/images/projet-mdt-windows11.svg",
        kind: "Projet systeme",
        stack: ["Windows 11", "MDT", "Images systeme", "Deploiement"],
        description:
            "Automatisation du deploiement de postes Windows 11 avec creation et gestion d'images systeme.",
        link: "#",
        points: [
            "Automatisation du deploiement de postes",
            "Creation et gestion d'images systeme",
            "Standardisation de la configuration des postes"
        ]
    },
    {
        id: "infrastructure-reseau-securite",
        title: "Infrastructure reseau et securite",
        image: "/images/projet-reseau-securite.svg",
        kind: "Projet reseau",
        stack: ["LAN", "WAN", "VPN", "Routeurs", "WiFi", "Securite"],
        description:
            "Mise en place d'une infrastructure LAN/WAN avec VPN securise, configuration routeurs et reseaux WiFi.",
        link: "#",
        points: [
            "Mise en place de reseaux LAN/WAN",
            "Configuration VPN securise pour acces distant",
            "Configuration routeurs et reseaux WiFi",
            "Application de bonnes pratiques de securite"
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
