export const isAdmin = (req, res, next) => {
  if (req.user.email !== "admin@gmail.com") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};