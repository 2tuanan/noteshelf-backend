const authControllers = require('../controllers/authControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authLimiter, registerLimiter } = require('../middlewares/rateLimiter');
const router = require('express').Router();

router.post('/admin-login', authLimiter, authControllers.admin_login);
router.post('/user-login', authLimiter, authControllers.user_login);
router.get('/get-user', authMiddleware, authControllers.get_user);
router.post('/user-register', registerLimiter, authControllers.user_register);
router.get('/logout', authMiddleware, authControllers.logout);

module.exports = router;