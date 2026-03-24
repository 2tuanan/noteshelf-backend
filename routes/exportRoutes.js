const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const exportController = require('../controllers/exportControllers');

router.get('/:noteId', authMiddleware, exportController.export_note);

module.exports = router;
