export function renderNotes(notes) {
  const notesContainer = document.getElementById("notes-container");
  if (!notesContainer) {
    console.error("❌ Container catatan tidak ditemukan!");
    return;
  }

  notesContainer.innerHTML = ""; // 🔥 Hapus data lama sebelum menampilkan yang baru

  notes.forEach((note) => {
    const noteElement = document.createElement("note-item");
    noteElement.setAttribute("id", note.id);
    noteElement.setAttribute("title", note.title);
    noteElement.setAttribute("body", note.body);
    noteElement.setAttribute("archived", note.archived);
    noteElement.setAttribute("created", note.createdAt);

    notesContainer.appendChild(noteElement);
  });

  console.log("✅ UI diperbarui dengan catatan baru.");
}
