export function apiKeyAuth(req, res, next) {
  const clientKey = req.headers["x-api-key"];
  const serverKey = process.env.HONEY_POT_API_KEY;

  if (!clientKey) {
    return res.status(401).json({
      status: "error",
      message: "API key missing"
    });
  }

  if (clientKey !== serverKey) {
    return res.status(403).json({
      status: "error",
      message: "Invalid API key"
    });
  }

  next();
}
