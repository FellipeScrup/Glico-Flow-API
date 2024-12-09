const setCacheControl = (req, res, next) => {
    // Cache para recursos estáticos
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300'); // 5 minutos
    } else {
        res.set('Cache-Control', 'no-store');
    }
    next();
};

module.exports = setCacheControl; 