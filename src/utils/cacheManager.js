const cache = require('../config/cache');

const cleanupCache = () => {
    const keys = cache.keys();
    const now = Date.now();
    
    keys.forEach(key => {
        const value = cache.get(key);
        if (value && now - value.timestamp > 3600000) { // 1 hora
            cache.del(key);
        }
    });
};

// Executar limpeza a cada 30 minutos
setInterval(cleanupCache, 1800000);

module.exports = { cleanupCache }; 