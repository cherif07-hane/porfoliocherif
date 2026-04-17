import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";

function App() {
    function getNavClass({ isActive }) {
        return isActive ? "active-nav" : undefined;
    }

    return (
        <div className="app-shell">
            <header className="site-header">
                <NavLink className="brand" to="/">
                    <img src="/images/logo.jpg" alt="Logo de Thierno Cherif HANE" />
                    <div>
                        <span className="eyebrow">Portfolio React</span>
                        <strong>Thierno Cherif HANE</strong>
                    </div>
                </NavLink>

                <nav className="site-nav" aria-label="Navigation principale">
                    <NavLink className={getNavClass} to="/">
                        Accueil
                    </NavLink>
                    <NavLink className={getNavClass} to="/projets">
                        Gestion portfolio
                    </NavLink>
                </nav>
            </header>

            <main className="page-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projets" element={<PortfolioPage />} />
                    <Route path="/projets/:projectId" element={<PortfolioPage />} />
                </Routes>
            </main>

            <footer className="site-footer">
                <div>
                    <p className="eyebrow">SPA React</p>
                    <h2>Gestion de portfolio</h2>
                    <p>
                        Demonstration React JS avec composants, props, etat local,
                        routage et communication HTTP.
                    </p>
                </div>

                <div className="footer-contact">
                    <a href="mailto:richef360@gmail.com">richef360@gmail.com</a>
                    <a href="tel:+221783299663">+221 78 329 96 63</a>
                    <span>Dakar, Senegal</span>
                </div>
            </footer>
        </div>
    );
}

export default App;
