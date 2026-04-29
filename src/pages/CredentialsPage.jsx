import { Award, Building2, Calendar, GraduationCap } from "lucide-react";
import { certifications, diplomas } from "../content/siteContent";

const pageConfig = {
    certifications: {
        eyebrow: "Certifications",
        icon: Award,
        items: certifications,
        title: "Mes certifications"
    },
    diplomes: {
        eyebrow: "Diplomes",
        icon: GraduationCap,
        items: diplomas,
        title: "Mes diplomes"
    }
};

function CredentialsPage({ type = "diplomes" }) {
    const config = pageConfig[type] || pageConfig.diplomes;
    const Icon = config.icon;

    return (
        <section className="credentials-page">
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">{config.eyebrow}</p>
                    <h1>{config.title}</h1>
                </div>
                <span className="title-icon">
                    <Icon size={28} />
                </span>
            </div>

            <div className="credential-grid">
                {config.items.map((item) => (
                    <article className="credential-card reveal-card" key={item.id}>
                        <span className="credential-icon">
                            <Icon size={24} />
                        </span>
                        <div>
                            <h2>{item.title}</h2>
                            <div className="credential-meta">
                                <span>
                                    <Building2 size={16} />
                                    {item.school || item.issuer}
                                </span>
                                <span>
                                    <Calendar size={16} />
                                    {item.period}
                                </span>
                            </div>
                            <p>{item.description}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default CredentialsPage;
