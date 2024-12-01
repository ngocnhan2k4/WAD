const notification = (req, res, next) => {
    res.locals.notification = req.session.notification || null;
    req.session.notification = null; // Xóa thông báo sau khi sử dụng
    next();
};

module.exports = notification;