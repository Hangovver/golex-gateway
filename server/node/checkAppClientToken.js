// server/node/checkAppClientToken.js
module.exports = function checkAppClientToken(expected) {
  return function (req, res, next) {
    // Pass preflight
    if (req.method === 'OPTIONS') return next();
    const path = req.path || req.url || '';
    // Public paths
    if (path === '/health' || path === '/') return next();

    const token = req.get('x-golex-client') || '';
    if (expected && token !== expected) {
      return res.status(403).json({ ok:false, error: 'unauthorized' });
    }
    next();
  };
};
