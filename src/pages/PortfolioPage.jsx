import { useParams } from "react-router-dom";
import Dossier from "../components/Dossier";

function PortfolioPage({ isAdmin = false, view = "list" }) {
    const { projectId } = useParams();

    return <Dossier isAdmin={isAdmin} selectedProjectId={projectId || ""} view={view} />;
}

export default PortfolioPage;
