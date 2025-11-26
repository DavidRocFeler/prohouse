const express = require('express');
const router = express.Router();
const {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/notesController');

router.route('/notes')
    .get(getAllNotes)
    .post(createNote);

router.route('/notes/:id')
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;