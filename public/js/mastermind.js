export function setupMastermindForm() {
  const mastermindForm = document.getElementById('mastermindForm');
  if (!mastermindForm) return;

  mastermindForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(mastermindForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/submit-mentes-maestras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.text();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: result,
          confirmButtonColor: '#6D9A2B'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result,
          confirmButtonColor: '#6D9A2B'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar el mensaje. Inténtalo más tarde.',
        confirmButtonColor: '#6D9A2B'
      });
    }
  });
}
