class SearchForm extends HTMLElement {
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
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }
            </style>
            <input type="text" id="search-note" placeholder="Cari catatan..." />
        `;
  }

  addEventListeners() {
    const searchInput = this.shadowRoot.getElementById("search-note");

    searchInput.addEventListener("input", () => {
      const searchQuery = searchInput.value;

      console.log("🔎 Pencarian diketik:", searchQuery);

      document.dispatchEvent(
        new CustomEvent("searchNote", {
          detail: searchQuery,
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

customElements.define("search-form", SearchForm);
