// =====================================================
// ADMIN MIDDLEWARE
// =====================================================
// Must run AFTER authMiddleware (protect), so req.user
// already holds the decoded JWT payload.
// Blocks any request from a non-admin user, even if
// they somehow reached an /admin/* URL directly
// (Postman, curl, editing localStorage, etc.).
// This is what makes admin routes actually secure —
// the frontend redirect alone is not real protection.
// =====================================================

const isAdmin = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "admin"
    ) {

        return res.status(403).json({
            message: "Access denied. Admins only."
        });

    }

    next();

};

module.exports = isAdmin;
