const adminControllers = require('../controllers/adminControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const router = require('express').Router();

router.use(authMiddleware, requireRole('admin'));

router.get('/get-users', adminControllers.get_users);
router.delete('/reset-user/:id', adminControllers.reset_user);
router.delete('/delete-user/:id', adminControllers.delete_user);

module.exports = router;