class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    background: #007bff;
                    color: white;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background: #0056b3;
                }
            </style>
            <form id="note-form">
                <input type="text" id="title" placeholder="Judul catatan..." required>
                <textarea id="body" placeholder="Isi catatan..." required></textarea>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;
  }

  addEventListeners() {
    const form = this.shadowRoot.getElementById("note-form");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.shadowRoot.getElementById("title").value;
      const body = this.shadowRoot.getElementById("body").value;

      this.dispatchEvent(
        new CustomEvent("submitNote", {
          detail: { title, body },
          bubbles: true,
          composed: true,
        }),
      );

      // Kosongkan form setelah dikirim
      form.reset();
    });
  }
}

customElements.define("note-form", NoteForm);
