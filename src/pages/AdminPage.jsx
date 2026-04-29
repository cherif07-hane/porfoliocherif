import { Link } from "react-router-dom";
import { FolderKanban, Lock, LogOut, PlusCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

function AdminPage({ isAdmin, onLogin, onLogout }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setBusy(true);
        setError("");

        try {
            await onLogin(password);
            setPassword("");
        } catch (loginError) {
            setError(loginError.message || "Connexion impossible.");
        } finally {
            setBusy(false);
        }
    }

    if (isAdmin) {
        return (
            <section className="admin-page">
                <div className="admin-hero">
                    <div>
                        <p className="eyebrow">Admin</p>
                        <h1>Espace de gestion</h1>
                        <p>Tu peux ajouter, modifier et supprimer les projets du portfolio.</p>
                    </div>
                    <span className="admin-shield">
                        <ShieldCheck size={38} />
                    </span>
                </div>

                <div className="admin-actions">
                    <Link className="admin-action-card reveal-card" to="/admin/projets">
                        <FolderKanban size={28} />
                        <span>Gerer les projets</span>
                    </Link>
                    <Link className="admin-action-card reveal-card" to="/admin/ajout-projet">
                        <PlusCircle size={28} />
                        <span>Ajouter un projet</span>
                    </Link>
                    <button className="admin-action-card reveal-card" type="button" onClick={onLogout}>
                        <LogOut size={28} />
                        <span>Deconnexion</span>
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="admin-page">
            <div className="login-card reveal-card">
                <span className="login-icon">
                    <Lock size={28} />
                </span>
                <div>
                    <p className="eyebrow">Admin</p>
                    <h1>Connexion privee</h1>
                    <p>Cette zone est reservee au proprietaire du portfolio.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Mot de passe
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Mot de passe admin"
                        />
                    </label>

                    {error ? <p className="feedback error">{error}</p> : null}

                    <button className="button button-primary" disabled={busy} type="submit">
                        <ShieldCheck size={18} />
                        {busy ? "Connexion..." : "Entrer"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AdminPage;
