// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');


const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
        console.log('Token recebido:', token); // Adicionado para depuração
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado:', decoded); // Adicionado para depuração
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token Verification Error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        console.log('Token não fornecido ou formato incorreto'); // Adicionado para depuração
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


module.exports = protect;
