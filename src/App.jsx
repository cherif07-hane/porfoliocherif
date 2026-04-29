import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import {
    Award,
    FolderKanban,
    GraduationCap,
    Home,
    LayoutDashboard,
    Menu,
    PlusCircle
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { useState } from "react";
import AdminPage from "./pages/AdminPage";
import CredentialsPage from "./pages/CredentialsPage";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin
} from "./services/adminAuth";

function App() {
    const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function getNavClass({ isActive }) {
        return isActive ? "active-nav" : undefined;
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    async function handleAdminLogin(password) {
        await loginAdmin(password);
        setIsAdmin(true);
    }

    function handleAdminLogout() {
        logoutAdmin();
        setIsAdmin(false);
    }

    return (
        <div className="app-shell">
            <header className="site-header">
                <NavLink className="brand" to="/">
                    <img src="/images/logo.jpg" alt="Logo de Thierno Cherif HANE" />
                    <div>
                        <span className="eyebrow">Portfolio</span>
                        <strong>Thierno Cherif HANE</strong>
                    </div>
                </NavLink>

                <button
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-controls="main-navigation"
                    aria-expanded={isMenuOpen}
                    className="menu-toggle"
                    type="button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <Menu size={20} />
                    <span>Menu</span>
                </button>

                <nav
                    className={`site-nav ${isMenuOpen ? "is-open" : ""}`}
                    id="main-navigation"
                    aria-label="Navigation principale"
                >
                    <NavLink className={getNavClass} to="/" onClick={closeMenu}>
                        <Home size={18} />
                        Accueil
                    </NavLink>
                    <NavLink className={getNavClass} to="/diplomes" onClick={closeMenu}>
                        <GraduationCap size={18} />
                        Diplomes
                    </NavLink>
                    <NavLink
                        className={getNavClass}
                        to="/certifications"
                        onClick={closeMenu}
                    >
                        <Award size={18} />
                        Certifications
                    </NavLink>
                    <NavLink className={getNavClass} to="/projets" onClick={closeMenu}>
                        <FolderKanban size={18} />
                        Projets
                    </NavLink>
                    <NavLink className={getNavClass} to="/admin" onClick={closeMenu}>
                        <LayoutDashboard size={18} />
                        Admin
                    </NavLink>
                    {isAdmin ? (
                        <NavLink
                            className={getNavClass}
                            to="/admin/ajout-projet"
                            onClick={closeMenu}
                        >
                            <PlusCircle size={18} />
                            Ajouter
                        </NavLink>
                    ) : null}
                </nav>
            </header>

            <main className="page-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/diplomes" element={<CredentialsPage type="diplomes" />} />
                    <Route
                        path="/certifications"
                        element={<CredentialsPage type="certifications" />}
                    />
                    <Route
                        path="/projets"
                        element={<PortfolioPage isAdmin={false} view="list" />}
                    />
                    <Route
                        path="/projets/:projectId"
                        element={<PortfolioPage isAdmin={false} view="list" />}
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminPage
                                isAdmin={isAdmin}
                                onLogin={handleAdminLogin}
                                onLogout={handleAdminLogout}
                            />
                        }
                    />
                    <Route
                        path="/admin/projets"
                        element={
                            isAdmin ? (
                                <PortfolioPage isAdmin view="list" />
                            ) : (
                                <AdminPage
                                    isAdmin={isAdmin}
                                    onLogin={handleAdminLogin}
                                    onLogout={handleAdminLogout}
                                />
                            )
                        }
                    />
                    <Route
                        path="/admin/projets/:projectId"
                        element={
                            isAdmin ? (
                                <PortfolioPage isAdmin view="list" />
                            ) : (
                                <AdminPage
                                    isAdmin={isAdmin}
                                    onLogin={handleAdminLogin}
                                    onLogout={handleAdminLogout}
                                />
                            )
                        }
                    />
                    <Route
                        path="/admin/ajout-projet"
                        element={<PortfolioPage isAdmin={isAdmin} view="form" />}
                    />
                    <Route
                        path="/admin/ajout-projet/:projectId"
                        element={<PortfolioPage isAdmin={isAdmin} view="form" />}
                    />
                    <Route path="/ajout-projet" element={<Navigate replace to="/admin/ajout-projet" />} />
                    <Route
                        path="/ajout-projet/:projectId"
                        element={<Navigate replace to="/admin/ajout-projet" />}
                    />
                </Routes>
            </main>

            <footer className="site-footer">
                <div className="footer-brand">
                    <img src="/images/logo.jpg" alt="Logo de Thierno Cherif HANE" />
                    <div>
                        <span className="eyebrow">Portfolio</span>
                        <strong>Thierno Cherif HANE</strong>
                        <span>Systemes, reseaux et developpement web.</span>
                    </div>
                </div>

                <div className="footer-right">
                    <div className="social-links" aria-label="Reseaux sociaux">
                        <a
                            className="social-link linkedin"
                            href="https://www.linkedin.com/in/thierno-cherif-h-382947234/"
                            aria-label="LinkedIn"
                            rel="noreferrer"
                            target="_blank"
                            title="LinkedIn"
                        >
                            <FaLinkedinIn />
                        </a>
                        <a
                            className="social-link twitter"
                            href="https://x.com/HaneCherif07"
                            aria-label="Twitter"
                            rel="noreferrer"
                            target="_blank"
                            title="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            className="social-link instagram"
                            href="https://www.instagram.com/netrif10/"
                            aria-label="Instagram"
                            rel="noreferrer"
                            target="_blank"
                            title="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            className="social-link facebook"
                            href="https://www.facebook.com/cherif.hane.79"
                            aria-label="Facebook"
                            rel="noreferrer"
                            target="_blank"
                            title="Facebook"
                        >
                            <FaFacebookF />
                        </a>
                    </div>

                    <div className="footer-contact">
                        <a href="mailto:richef360@gmail.com">richef360@gmail.com</a>
                        <a href="tel:+221783299663">+221 78 329 96 63</a>
                        <span>Dakar, Senegal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
