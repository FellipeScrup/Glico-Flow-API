const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obter o token do header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Verificar formato do token (Bearer token)
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2) {
            return res.status(401).json({ message: 'Erro no formato do token' });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        // Verificar token
        jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }

            req.user = decoded;
            return next();
        });
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = authMiddleware; 