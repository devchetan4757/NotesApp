// Hide/Unhide functions
function hide(id) {
  const el =document.getElementById(id)
  if(el) el.style.display = 'none';
}
function unhide(id) {
  const el = document.getElementById(id)
  if(el) el.style.display = '';
}

// Notes Loader
async function loadNotes() {
  try {
    const response = await fetch('/notes');
    const notes = await response.json();
    const container = document.getElementById('notesContainer');
    container.innerHTML = ''; // clear old notes

    const blank = document.getElementById('blank');
    const saved = document.getElementById('saved');

    if (!notes || notes.length === 0) {
      container.innerHTML='';
      unhide('blank');
      hide('saved');
      return;
    }

    unhide('saved');
    hide('blank');

    notes.forEach(note => {
      const noteCard = document.createElement('div');
      noteCard.className = 'note-card';

      // Content
      const title = document.createElement('h3');
      title.textContent = note.title;
      title.addEventListener('click', ()=>{updateNote(note._id);
      })

      const content = document.createElement('p');
      content.textContent = note.content;

      const hr = document.createElement('hr');

      // Pin button
      const pinBtn = document.createElement('button');
      pinBtn.className = 'pin';
      pinBtn.innerHTML = note.pinned
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
      pinBtn.onclick = () => pinnedNote(note._id);
      pinBtn.style.cursor = 'pointer';

    // Format date nicely
    // Timestamp
const timeStamp = document.createElement('div');
timeStamp.className = 'timestamp';

// Format: "5:42 PM Â· Oct 20, 2025"
const date = new Date(note.createdAt);
const formattedTime = date.toLocaleString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});
const formattedDate = date.toLocaleString('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
timeStamp.textContent = `${formattedTime} ,  ${formattedDate}`;

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'delete';
      delBtn.textContent = '×';
      delBtn.style.cursor = 'pointer';
      delBtn.onclick = () => deleteNote(note._id);

      // Append
      noteCard.append(title, content, hr, pinBtn, delBtn,timeStamp);
      container.appendChild(noteCard);
    });

  } catch (err) {
    console.error('Error loading notes:', err);
  }
}

// Pin note
async function pinnedNote(id) {
  try {
    const res = await fetch(`/notes/${id}/pin`, { method: 'PUT' });
    if (!res.ok) throw new Error('Pin failed');
    await loadNotes();
  } catch (err) {
    console.error(err);
  }
}
//Update note
async function updateNote(id) {
  window.location.href=`create.html?id=${id}`;
}

// Delete note
async function deleteNote(id) {
  console.log('Deleting note:', id);
  try {
    const res = await fetch(`/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    await loadNotes();
  } catch (err) {
    console.error(err);
  }
}

window.onload = loadNotes;
