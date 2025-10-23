
import express from "express";
import {
  getAllNotes, getNote, createNote, updateNote, deleteNote, togglePin
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/pin", togglePin);

export default router;
