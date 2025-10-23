// src/controllers/noteController.js
import Note from "../models/Note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    // Optional: sort pinned first, then newest
    const notes = await Note.find().sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) { next(err); }
};

export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) { next(err); }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, pinned } = req.body;
    const note = await Note.create({ title, content, pinned });
    res.status(201).json(note);
  } catch (err) { next(err); }
};

export const updateNote = async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteNote = async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) { next(err); }
};

export const togglePin = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.pinned = !note.pinned; // Toggle pinned
    await note.save();
    res.json(note);
  } catch (err) {
    next(err);
  }
};
