const noteControllers = require('../controllers/noteControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { createNoteSchema, searchQuerySchema } = require('../validators/noteSchemas');
const router = require('express').Router();

router.post('/add-note', authMiddleware, validate(createNoteSchema), noteControllers.add_note);
router.get('/get-notes',authMiddleware, noteControllers.get_notes);
router.delete('/delete-note/:id',authMiddleware, noteControllers.delete_note);
// router.get('/search-notes', authMiddleware, validate(searchQuerySchema, 'query'), noteControllers.search_notes);

module.exports = router;