const authMiddleware = (req, res, next) => {
    if (req.session && req.session.ngoId) {
        next();
    } else {
        res.redirect('/ngo/login');
    }
};

module.exports = authMiddleware;
