class FilterForm extends HTMLElement {
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
                select {
                    padding: 5px;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
            </style>
            <select id="filter-status">
                <option value="all">Semua</option>
                <option value="active">Aktif</option>
                <option value="archived">Arsip</option>
            </select>
        `;
  }

  addEventListeners() {
    const filterSelect = this.shadowRoot.getElementById("filter-status");

    if (!filterSelect) {
      console.error("❌ Elemen filter tidak ditemukan!");
      return;
    }

    filterSelect.addEventListener("change", () => {
      console.log("✅ Event filterNote dikirim:", filterSelect.value);

      this.dispatchEvent(
        new CustomEvent("filterNote", {
          detail: filterSelect.value,
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

customElements.define("filter-form", FilterForm);
