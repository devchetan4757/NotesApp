
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Note", NoteSchema);
