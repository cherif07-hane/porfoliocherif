import { Link } from "react-router-dom";
import { Award, FolderKanban, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { focusAreas, journey, profile } from "../content/siteContent";

function HomePage() {
    return (
        <section className="home-page">
            <section className="home-hero">
                <div className="hero-copy">
                    <p className="eyebrow">{profile.name}</p>
                    <h1>{profile.title}</h1>
                    <p className="hero-text">{profile.summary}</p>

                    <div className="hero-actions">
                        <Link className="button button-primary" to="/projets">
                            <FolderKanban size={18} />
                            Voir mes projets
                        </Link>
                        <Link className="button button-secondary" to="/diplomes">
                            <GraduationCap size={18} />
                            Diplomes
                        </Link>
                        <Link className="button button-ghost" to="/certifications">
                            <Award size={18} />
                            Certifications
                        </Link>
                    </div>
                </div>

                <img
                    className="hero-image"
                    src="/images/logo.jpg"
                    alt="Thierno Cherif HANE"
                />
            </section>

            <section className="home-about reveal-card">
                <div className="about-main">
                    <p className="eyebrow">Parcours</p>
                    <h2>Mon parcours</h2>
                    <p>{profile.about}</p>
                    <div className="focus-list">
                        {focusAreas.map((area) => (
                            <span key={area}>
                                <Sparkles size={15} />
                                {area}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="about-stats">
                    {profile.stats.map((item) => (
                        <article key={item.label}>
                            <strong>{item.value}</strong>
                            <span>{item.label}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="journey-section">
                <div className="panel-heading">
                    <p className="eyebrow">Evolution</p>
                    <h2>Formation et pratique</h2>
                </div>

                <div className="journey-list">
                    {journey.map((item) => (
                        <article className="journey-card reveal-card" key={item.id}>
                            <span className="journey-dot">
                                <MapPin size={18} />
                            </span>
                            <div>
                                <span className="journey-period">{item.period}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel compact-panel">
                <div className="panel-heading">
                    <h2>Competences</h2>
                </div>

                <div className="info-grid">
                    {profile.competencies.map((item) => (
                        <article className="info-card" key={item.id}>
                            <span className="info-index">{item.id}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    );
}

export default HomePage;
