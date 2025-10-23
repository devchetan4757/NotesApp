const API_URL = "/api/notes";
let editingId = null; // Track which note is being edited

// Load and render notes
async function loadNotes() {
  try {
    const res = await fetch(API_URL);
    const notes = await res.json();

    const notesDiv = document.getElementById("notes");
    notesDiv.innerHTML = "";

    notes.forEach(note => {
      const card = document.createElement("div");
      card.classList.add("note-card");
      if (note.pinned) card.classList.add("pinned");
      if (note._id === editingId) card.classList.add("editing");

      card.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p>${note.content}</p>
        <div class="btn-group">
          <button class="pin-btn">${note.pinned ? "Unpin" : "Pin"}</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // Pin/unpin
      card.querySelector(".pin-btn").addEventListener("click", () => togglePin(note._id));

      // Delete
      card.querySelector(".delete-btn").addEventListener("click", () => deleteNote(note._id));

      // Edit on title click
      card.querySelector(".note-title").addEventListener("click", () => editNote(note));

      notesDiv.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading notes:", err);
  }
}

// Create or update note
async function createOrUpdateNote() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  if (!title || !content) return alert("Please fill out both fields");

  try {
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      editingId = null;
      document.getElementById("addBtn").textContent = "Add";
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    loadNotes();
  } catch (err) {
    console.error("Error creating/updating note:", err);
  }
}

// Edit note
function editNote(note) {
  document.getElementById("title").value = note.title;
  document.getElementById("content").value = note.content;
  editingId = note._id;
  document.getElementById("addBtn").textContent = "Save";
  document.getElementById("title").focus();
}

// Delete note
async function deleteNote(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (editingId === id) {
      document.getElementById("title").value = "";
      document.getElementById("content").value = "";
      editingId = null;
      document.getElementById("addBtn").textContent = "Add";
    }
    loadNotes();
  } catch (err) {
    console.error("Error deleting note:", err);
  }
}

// Toggle pin
async function togglePin(id) {
  try {
    await fetch(`${API_URL}/${id}/pin`, { method: "PATCH" });
    loadNotes();
  } catch (err) {
    console.error("Error toggling pin:", err);
  }
}

// Event listeners
document.getElementById("addBtn").addEventListener("click", createOrUpdateNote);
document.addEventListener("DOMContentLoaded", loadNotes);
