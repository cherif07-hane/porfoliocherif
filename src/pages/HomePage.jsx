import { Link } from "react-router-dom";
import { profile } from "../content/siteContent";

function HomePage() {
    return (
        <section className="home-page">
            <div className="hero-grid">
                <section className="hero-copy">
                    <p className="eyebrow">Presentation de React JS</p>
                    <h1>{profile.title}</h1>
                    <p className="hero-text">{profile.summary}</p>

                    <div className="hero-actions">
                        <Link className="button button-primary" to="/projets">
                            Voir la demo
                        </Link>
                        <a className="button button-ghost" href="#concepts">
                            Concepts React
                        </a>
                    </div>

                    <div className="stats-row">
                        {profile.stats.map((item) => (
                            <article className="stat-card" key={item.label}>
                                <strong>{item.value}</strong>
                                <span>{item.label}</span>
                            </article>
                        ))}
                    </div>
                </section>

                <aside className="hero-panel">
                    <p className="eyebrow">Points forts</p>
                    <ul className="feature-list">
                        {profile.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </aside>
            </div>

            <section className="panel" id="concepts">
                <div className="panel-heading">
                    <p className="eyebrow">Concepts</p>
                    <h2>Decomposition de l'application</h2>
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
