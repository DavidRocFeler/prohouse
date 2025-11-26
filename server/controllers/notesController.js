const asyncErrorHandler = require('../middlewares/helpers/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

// In-memory storage for notes
let notes = [];
let currentId = 1;

// Get all notes
exports.getAllNotes = asyncErrorHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
    });
});

// Get single note by ID
exports.getNoteById = asyncErrorHandler(async (req, res, next) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    
    if (!note) {
        return next(new ErrorHandler('Note not found', 404));
    }

    res.status(200).json({
        success: true,
        data: note
    });
});

// Create new note
exports.createNote = asyncErrorHandler(async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return next(new ErrorHandler('Title and content are required', 400));
    }

    const newNote = {
        id: currentId++,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    notes.push(newNote);

    res.status(201).json({
        success: true,
        data: newNote
    });
});

// Update note
exports.updateNote = asyncErrorHandler(async (req, res, next) => {
    const { title, content } = req.body;
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));

    if (noteIndex === -1) {
        return next(new ErrorHandler('Note not found', 404));
    }

    notes[noteIndex] = {
        ...notes[noteIndex],
        title: title || notes[noteIndex].title,
        content: content || notes[noteIndex].content,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json({
        success: true,
        data: notes[noteIndex]
    });
});

// Delete note
exports.deleteNote = asyncErrorHandler(async (req, res, next) => {
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));

    if (noteIndex === -1) {
        return next(new ErrorHandler('Note not found', 404));
    }

    const deletedNote = notes.splice(noteIndex, 1);

    res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
        data: deletedNote[0]
    });
});