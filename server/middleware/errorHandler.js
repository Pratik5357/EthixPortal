export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed by CORS policy" });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File too large" });
  }

  if (err.message?.includes("Only PDF")) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
}
