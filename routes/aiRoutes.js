const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const aiController = require('../controllers/aiControllers');

router.post('/summarize/:noteId', authMiddleware, aiController.summarize_note);

module.exports = router;
