class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["id", "title", "body", "created", "archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.applyDarkMode();

    // Pastikan event listener hanya ditambahkan sekali
    document.removeEventListener("toggleDarkMode", this.applyDarkMode);
    document.addEventListener("toggleDarkMode", () => this.applyDarkMode());
  }

  render() {
    if (!this.shadowRoot) {
      console.error("Shadow DOM belum dibuat!");
      return;
    }

    const id = this.getAttribute("id") || "unknown";
    const title = this.getAttribute("title") || "Tanpa Judul";
    const body = this.getAttribute("body") || "Tidak ada isi.";
    const created = new Date(
      this.getAttribute("created") || Date.now(),
    ).toLocaleString();
    const archived = this.getAttribute("archived") === "true";

    this.shadowRoot.innerHTML = `
            <style>
                .note {
                    border: 1px solid var(--border-color, #ccc);
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 8px;
                    background: var(--bg-color, white);
                    color: var(--text-color, black);
                    transition: 0.3s;
                }
                .note h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .note p {
                    margin: 5px 0;
                }
                .note small {
                    display: block;
                    margin-bottom: 10px;
                    color: var(--text-light-color, gray);
                }
                .note button {
                    margin-right: 5px;
                    padding: 5px 10px;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: 0.2s;
                }
                .delete-btn {
                    background: red;
                    color: white;
                }
                .archive-btn {
                    background: ${archived ? "green" : "blue"};
                    color: white;
                }
                .note button:hover {
                    opacity: 0.8;
                }
            </style>
            <div class="note">
                <h2>${title}</h2>
                <p>${body}</p>
                <small>Dibuat pada: ${created}</small>
                <button class="delete-btn">Hapus</button>
                <button class="archive-btn">${archived ? "Kembalikan" : "Arsipkan"}</button>
            </div>
        `;

    this.shadowRoot
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete", { detail: id, bubbles: true }),
        );
      });

    this.shadowRoot
      .querySelector(".archive-btn")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("toggleArchive", { detail: id, bubbles: true }),
        );
      });
  }

  applyDarkMode() {
    const darkMode = localStorage.getItem("darkMode") === "enabled";
    this.shadowRoot.host.style.setProperty(
      "--bg-color",
      darkMode ? "#222" : "white",
    );
    this.shadowRoot.host.style.setProperty(
      "--text-color",
      darkMode ? "#fff" : "black",
    );
    this.shadowRoot.host.style.setProperty(
      "--border-color",
      darkMode ? "#444" : "#ccc",
    );
    this.shadowRoot.host.style.setProperty(
      "--text-light-color",
      darkMode ? "#bbb" : "gray",
    );
  }
}

customElements.define("note-item", NoteItem);
