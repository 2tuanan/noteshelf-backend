const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const aiController = require('../controllers/aiControllers');
const { chatMessageSchema } = require('../validators/aiSchemas');

router.post('/summarize/:noteId', authMiddleware, aiController.summarize_note);
router.post('/chat', authMiddleware, validate(chatMessageSchema), aiController.chat);

module.exports = router;
