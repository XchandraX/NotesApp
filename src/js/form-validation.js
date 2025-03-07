export const customValidationUsernameHandler = (event) => {
  const input = event.target;
  const errorMessageEl = document.getElementById(
    input.getAttribute("aria-describedby"),
  );

  // Reset error message
  input.setCustomValidity("");

  if (input.validity.valueMissing) {
    input.setCustomValidity("Judul wajib diisi.");
  } else if (input.validity.tooShort) {
    input.setCustomValidity("Judul minimal 6 karakter.");
  } else if (input.validity.patternMismatch) {
    input.setCustomValidity("Judul tidak boleh diawali simbol atau spasi.");
  }

  // Tampilkan pesan kesalahan jika ada
  if (errorMessageEl) {
    errorMessageEl.textContent = input.validationMessage;
  }
};
