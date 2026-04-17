import { useParams } from "react-router-dom";
import Dossier from "../components/Dossier";

function PortfolioPage() {
    const { projectId } = useParams();

    return <Dossier selectedProjectId={projectId || ""} />;
}

export default PortfolioPage;
