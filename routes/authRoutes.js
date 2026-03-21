const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { authLimiter, registerLimiter } = require('../middlewares/rateLimiter');
const { loginSchema, registerSchema } = require('../validators/authSchemas');

router.post('/user-login', authLimiter, validate(loginSchema), authControllers.user_login);
router.post('/admin-login', authLimiter, validate(loginSchema), authControllers.admin_login);
router.post('/user-register', registerLimiter, validate(registerSchema), authControllers.user_register);
router.get('/get-user', authMiddleware, authControllers.get_user);
router.get('/logout', authMiddleware, authControllers.logout);

module.exports = router;