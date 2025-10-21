const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

// MongoDB connection
mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.log('MongoDB connection error:', err));

// Schema and model
const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

// Create note
app.post('/post', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    await note.save();
    res.json({ message: 'Note saved successfully!', note });
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).json({ error: 'Failed to save note.' });
  }
});

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// Get one note
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching note' });
  }
});

// Update note
app.put('/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note updated successfully', updatedNote });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
app.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle pin
app.put('/notes/:id/pin', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    note.pinned = !note.pinned;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to pin note' });
  }
});

// 404 fallback
app.use((req, res) => res.status(404).send('404 - Page not found'));

app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
