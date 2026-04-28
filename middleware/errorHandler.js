export function notFound(req, res, _next) {
    return res.type("application/json").status(404).json({
        message: `Route introuvable: ${req.originalUrl}`
    });
}

export function errorHandler(error, _req, res, _next) {
    const statusCode =
        error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;

    const details =
        error.name === "ValidationError"
            ? Object.values(error.errors).map((item) => item.message)
            : undefined;

    return res.type("application/json").status(statusCode).json({
        message:
            statusCode === 500
                ? "Erreur interne du serveur."
                : error.message || "Erreur de requete.",
        details
    });
}
