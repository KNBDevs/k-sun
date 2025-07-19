export async function loadRewards(rewards, containerId = 'rewards-container') {
  const rewardsContainer = document.getElementById(containerId);
  if (!rewardsContainer) return;

  try {
    rewardsContainer.innerHTML = rewards.map((reward, index) => {
      const amount = Number(reward.amount);
      const isAvailable = reward.quantity > 0;
      const positionClass = (index === 30) ? 'special-position' : '';

      return `
        <div class="reward-item ${positionClass}">
          <h3>${reward.name}</h3>
          <p>${reward.description}</p>
          <img src="path/to/image.jpg" alt="${reward.name} Image"> <!-- Sustituye con ruta real -->
          <p>Recompensa: $${amount.toFixed(2)}</p>
          <p>Disponible: ${reward.quantity}</p>
          <form class="contribute-form" data-reward-id="${reward.id}">
            <input type="number" name="amount" min="0" max="${reward.quantity}" value="0" ${!isAvailable ? 'disabled' : ''}>
            <button type="submit" class="contributeButton" disabled ${!isAvailable ? 'disabled' : ''}>
              ${isAvailable ? 'Contribuir' : 'Todas canjeadas'}
            </button>
          </form>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.contribute-form').forEach(form => {
      const inputAmount = form.querySelector('input[name="amount"]');
      const submitButton = form.querySelector('button[type="submit"]');

      inputAmount.addEventListener('input', () => {
        submitButton.disabled = inputAmount.value <= 0;
      });

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const rewardId = form.getAttribute('data-reward-id');
        const amount = inputAmount.value;

        try {
          const response = await fetch('/contribute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rewardId, amount }),
            credentials: 'include'
          });

          const result = await response.text();

          if (response.ok) {
            Swal.fire({ icon: 'success', title: 'Éxito', text: 'Contribución registrada', confirmButtonColor: '#6D9A2B' });

            const updated = await fetch('/rewards');
            const newRewards = await updated.json();
            loadRewards(newRewards); // Recarga recompensas
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: result, confirmButtonColor: '#6D9A2B' });
          }
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Error al registrar la contribución', confirmButtonColor: '#6D9A2B' });
        }
      });
    });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar recompensas', confirmButtonColor: '#6D9A2B' });
  }
}

export async function loadRewardsIfLoggedIn() {
  const user = localStorage.getItem('user');
  if (!user) return;

  try {
    const response = await fetch('/rewards');
    const rewards = await response.json();
    loadRewards(rewards);
  } catch (error) {
    console.error('Error loading rewards:', error);
  }
}
