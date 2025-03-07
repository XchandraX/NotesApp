import "./styles/style.css";
import "./js/note-form.js";
import "./js/search-form.js";
import "./js/filter-form.js";
import "./js/note-item.js";
import { renderNotes } from "./js/renderNotes.js";
import anime from "animejs";
import Swal from "sweetalert2";

// Fungsi Loading
function showLoading(isLoading) {
  document.getElementById("loading").style.display = isLoading
    ? "block"
    : "none";
}

const filterForm = document.querySelector("filter-form");
let currentFilter = "all"; // Default ke "Semua"

if (filterForm && filterForm.shadowRoot) {
  const filterStatus = filterForm.shadowRoot.getElementById("filter-status");
  if (filterStatus) {
    currentFilter = filterStatus.value;
  }
}

fetchNotes(currentFilter === "archived"); // 🔥 Tetap di filter yang sama setelah hapus

// Ambil Catatan dari API
async function fetchNotes(isArchived = false) {
  try {
    showLoading(true);

    const endpoint = isArchived
      ? "https://notes-api.dicoding.dev/v2/notes/archived"
      : "https://notes-api.dicoding.dev/v2/notes";

    console.log("🔗 Mengambil catatan dari:", endpoint);

    const response = await fetch(endpoint);
    if (!response.ok)
      throw new Error(`Gagal mengambil data! Status: ${response.status}`);

    const { data } = await response.json();
    console.log("📌 Data catatan diperoleh:", data);

    renderNotes(data);
    return data; // 🔥 Pastikan mengembalikan data agar bisa digunakan oleh displayNotes()
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    return []; // 🔥 Pastikan selalu mengembalikan array agar tidak undefined
  } finally {
    showLoading(false);
  }
}

// Tambah Catatan
async function addNote(title, body) {
  try {
    showLoading(true);
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    if (!response.ok) throw new Error("Gagal menambahkan catatan!");

    Swal.fire("Berhasil!", "Catatan berhasil ditambahkan!", "success");
    await fetchNotes();
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  } finally {
    showLoading(false);
  }
}

// Hapus Catatan
async function deleteNote(id) {
  try {
    // 🔥 Konfirmasi sebelum menghapus catatan
    const confirmDelete = await Swal.fire({
      title: "Hapus Catatan?",
      text: "Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirmDelete.isConfirmed) {
      console.log("❌ Penghapusan dibatalkan");
      return;
    }

    showLoading(true);
    console.log("📌 ID yang akan dihapus:", id);

    const noteElement = document.querySelector(`note-item[id="${id}"]`);
    if (noteElement) {
      console.log("🎭 Menjalankan animasi hapus...");
      noteElement.style.transition = "opacity 0.3s ease-out";
      noteElement.style.opacity = "0";

      // Tunggu animasi selesai sebelum menghapus dari API
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // 🔥 Tampilkan loading Swal saat proses penghapusan
    Swal.fire({
      title: "Menghapus Catatan...",
      text: "Silakan tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) throw new Error("Gagal menghapus catatan!");

    console.log(`✅ Catatan dengan ID ${id} berhasil dihapus`);

    // 🔥 Ambil ulang catatan sesuai filter yang sedang aktif
    await new Promise((resolve) => setTimeout(resolve, 500)); // Delay agar UI lebih smooth

    const filterForm = document.querySelector("filter-form");
    let currentFilter = "all"; // Default ke "Semua"

    if (filterForm && filterForm.shadowRoot) {
      const filterStatus =
        filterForm.shadowRoot.getElementById("filter-status");
      if (filterStatus) {
        currentFilter = filterStatus.value;
      }
    }

    await fetchNotes(currentFilter === "archived"); // 🔥 Ambil data sesuai filter

    // 🔥 Tampilkan notifikasi sukses setelah penghapusan
    Swal.fire({
      title: "Berhasil!",
      text: "Catatan telah dihapus.",
      icon: "success",
    });
  } catch (error) {
    console.error("❌ Error Hapus Catatan:", error);
    Swal.fire("Error", error.message, "error");
  } finally {
    showLoading(false);
  }
}

// Arsipkan/Kembalikan Catatan
async function toggleArchive(id, isArchived) {
  try {
    showLoading(true);

    console.log("📌 ID yang dikirim untuk arsip:", id);
    console.log(
      "📌 Status sebelum diubah:",
      isArchived ? "Kembalikan ke Aktif" : "Arsipkan",
    );

    // 🔥 Tampilkan loading Swal
    Swal.fire({
      title: isArchived
        ? "Mengembalikan Catatan..."
        : "Mengarsipkan Catatan...",
      text: "Silakan tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const endpoint = isArchived
      ? `https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`
      : `https://notes-api.dicoding.dev/v2/notes/${id}/archive`;

    console.log("🔗 Mengakses API:", endpoint);

    const response = await fetch(endpoint, { method: "POST" });
    const responseData = await response.json();
    console.log("📌 API Response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Gagal mengubah status arsip!");
    }

    console.log(
      `✅ Catatan dengan ID ${id} telah ${isArchived ? "dikembalikan" : "diarsipkan"}`,
    );

    // 🔥 Perbarui UI setelah API berhasil
    await new Promise((resolve) => setTimeout(resolve, 500)); // Delay agar UI lebih smooth

    const filterForm = document.querySelector("filter-form");
    let currentFilter = "all"; // Default ke "Semua"

    if (filterForm && filterForm.shadowRoot) {
      const filterStatus =
        filterForm.shadowRoot.getElementById("filter-status");
      if (filterStatus) {
        currentFilter = filterStatus.value;
      }
    }

    await fetchNotes(currentFilter === "archived"); // 🔥 Ambil data sesuai filter yang aktif

    // 🔥 Tampilkan notifikasi sukses setelah perubahan
    Swal.fire({
      title: "Berhasil!",
      text: `Catatan telah ${isArchived ? "dikembalikan ke daftar aktif" : "dipindahkan ke arsip"}.`,
      icon: "success",
    });
  } catch (error) {
    console.error("❌ Error Toggle Archive:", error);
    Swal.fire("Error", error.message, "error");
  } finally {
    showLoading(false);
  }
}

// cari data
async function displayNotes(searchQuery, isArchived) {
    try {
      console.log(
        `🔍 Mencari catatan dengan kata kunci: "${searchQuery}", Arsip: ${isArchived}`,
      );
  
      const notes = await fetchNotes(isArchived); // 🔥 Tunggu hasil dari fetchNotes()
  
      if (!notes || notes.length === 0) {
        console.log("❌ Tidak ada catatan ditemukan!");
        renderNotes([]); // Kosongkan UI jika tidak ada hasil
        return;
      }
  
      const filteredNotes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.body.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  
      console.log("📌 Hasil pencarian:", filteredNotes);
      renderNotes(filteredNotes);
    } catch (error) {
      console.error("❌ Error dalam pencarian:", error);
      Swal.fire("Error", "Gagal mencari catatan!", "error");
    }
  }
  
  

// Animasi Catatan
function animateNotes() {
  anime({
    targets: ".note",
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 500,
    easing: "easeOutExpo",
    delay: anime.stagger(100),
  });
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Halaman dimuat, mengambil catatan aktif...");
  fetchNotes(false); // Ambil catatan aktif saat pertama kali masuk
});

document.addEventListener("submitNote", (event) => {
  const { title, body } = event.detail;
  addNote(title, body);
});

document.addEventListener("delete", (event) => deleteNote(event.detail));

document.addEventListener("toggleArchive", (event) => {
  const noteElement = document.querySelector(`note-item[id='${event.detail}']`);
  const isArchived = noteElement.getAttribute("archived") === "true";
  toggleArchive(event.detail, isArchived);
});

document.addEventListener("filterNote", (event) => {
  const filterValue = event.detail;
  console.log("📌 Filter yang dipilih:", filterValue);

  if (filterValue === "all" || filterValue === "active") {
    fetchNotes(false); // 🔥 Ambil catatan aktif
  } else if (filterValue === "archived") {
    fetchNotes(true); // 🔥 Ambil catatan arsip
  }
});

document.addEventListener("searchNote", (event) => {
  const searchQuery = event.detail;

  // 🔥 Pastikan kita membaca filter saat ini (aktif atau arsip)
  const filterForm = document.querySelector("filter-form");
  let isArchived = false;

  if (filterForm && filterForm.shadowRoot) {
    const filterStatus = filterForm.shadowRoot.getElementById("filter-status");
    if (filterStatus) {
      isArchived = filterStatus.value === "archived";
    }
  }

  displayNotes(searchQuery, isArchived);
});

const toggleDarkMode = () => {
  const darkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");

  Swal.fire(
    "Mode Berubah!",
    darkMode ? "Mode Gelap Diaktifkan" : "Mode Terang Diaktifkan",
    "success",
  );

  updateDarkModeButton();
  document.dispatchEvent(new CustomEvent("toggleDarkMode"));
};

// Perbarui teks tombol sesuai mode saat ini
const updateDarkModeButton = () => {
  document.getElementById("toggle-dark-mode").textContent =
    document.body.classList.contains("dark-mode")
      ? "☀ Mode Terang"
      : "🌙 Mode Gelap";
};

// Tambahkan event listener setelah halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle-dark-mode");

  if (toggleButton) {
    toggleButton.addEventListener("click", toggleDarkMode);
  } else {
    console.error("❌ Tombol Mode Gelap tidak ditemukan di HTML!");
  }

  // Aktifkan mode gelap jika sebelumnya sudah disimpan di localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  updateDarkModeButton();
});
