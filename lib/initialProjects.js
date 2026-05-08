export const initialProjects = [
    {
        id: "dockerisation-portfolio",
        title: "Dockerisation du portfolio full-stack",
        image: "/images/projet-docker-portfolio.svg",
        kind: "Projet DevOps",
        stack: ["Docker", "Docker Compose", "Docker Hub", "Node.js", "React", "MongoDB"],
        description:
            "Conteneurisation du portfolio avec un frontend React/Vite, une API Express et une base MongoDB orchestres avec Docker Compose.",
        link: "#",
        points: [
            "Creation d'un Dockerfile pour construire l'image Node.js du projet",
            "Orchestration de trois services avec Docker Compose: frontend, API et MongoDB",
            "Ajout de volumes pour conserver les donnees MongoDB et isoler node_modules",
            "Configuration des ports, variables d'environnement et healthchecks",
            "Preparation des images pour une publication sur Docker Hub"
        ]
    },
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

export function cloneInitialProjects() {
    return initialProjects.map((project) => ({
        ...project,
        stack: [...project.stack],
        points: [...project.points]
    }));
}
