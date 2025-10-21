// Get title and content elements
const title = document.getElementById('title');
const content = document.getElementById('content');

// Get note ID from URL (if editing)
const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get('id');

// Load existing note data when editing
window.onload = async () => {
  if (noteId) {
    try {
      const response = await fetch(`/notes/${noteId}`);
      if (!response.ok) throw new Error('Note not found');
      const note = await response.json();

      title.value = note.title;
      content.value = note.content;
    } catch (err) {
      console.error('Error fetching note:', err);
      alert('Failed to load note for editing.');
    }
  }
};

// Save note (create or update)
async function saveNote() {
  const noteTitle = title.value.trim();
  const noteContent = content.value.trim();

  // Validation
  if (!noteTitle) {
    alert('Please enter title');
    return;
  }

  try {
    const method = noteId ? 'PUT' : 'POST';
    const endpoint = noteId ? `/notes/${noteId}` : '/post';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: noteTitle, content: noteContent })
    });

    if (!response.ok) throw new Error('Save failed');

    const data = await response.text();
    console.log('Server response:', data);

    // Go back to homepage after saving
    window.location.href = '/';
  } catch (error) {
    console.error('Error saving note:', error);
    alert('Failed to save note.');
  }
}

document.getElementById('submit').addEventListener('click', saveNote);
