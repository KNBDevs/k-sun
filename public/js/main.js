document.addEventListener('DOMContentLoaded', async () => {
    console.log('Document loaded');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');
    const rewardsContainer = document.getElementById('rewards-container');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const linkspan = document.querySelector('.linkspan');
    const footerParagraph = document.querySelector('footer p.change-color');
    const mastermindForm = document.getElementById('mastermindForm');
    const scrollUpButton = document.getElementById('scrollUpButton'); // Botón de scroll-up

    const showRewards = () => {
        if (rewardsContainer) {
            rewardsContainer.style.display = 'block';
        }
    };

    const hideRewards = () => {
        if (rewardsContainer) {
            rewardsContainer.style.display = 'none';
        }
    };

    const isLoggedIn = () => {
        return !!localStorage.getItem('user');
    };

    const updateUI = () => {
        const loginSection = document.querySelector('.login-section');
        const registerSection = document.querySelector('.register-section');
        const logoutSection = document.querySelector('.logout-section');

        if (isLoggedIn()) {
            if (loginSection) loginSection.style.display = 'none';
            if (registerSection) registerSection.style.display = 'none';
            if (logoutSection) logoutSection.style.display = 'flex';
            showRewards();
        } else {
            if (loginSection) loginSection.style.display = 'flex';
            if (registerSection) registerSection.style.display = 'flex';
            if (logoutSection) logoutSection.style.display = 'none';
            hideRewards();
        }
    };

    // Cargar recompensas desde el servidor
    const loadRewards = async (rewards) => {
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
                        <img src="path/to/image.jpg" alt="${reward.name} Image"> <!-- Cambia "path/to/image.jpg" por la ruta real de la imagen -->
                        <p>Recompensa: $${amount.toFixed(2)}</p>
                        <p>Disponible: ${reward.quantity}</p>
                        <form class="contribute-form" data-reward-id="${reward.id}">
                            <input type="number" name="amount" min="0" max="${reward.quantity}" value="0" ${!isAvailable ? 'disabled' : ''}>
                            <button type="submit" class="contributeButton" disabled ${!isAvailable ? 'disabled' : ''}>${isAvailable ? 'Contribuir' : 'Todas canjeadas'}</button>
                        </form>
                    </div>
                `;
            }).join('');

            // Añadir manejo del formulario de contribución
            document.querySelectorAll('.contribute-form').forEach(form => {
                const inputAmount = form.querySelector('input[name="amount"]');
                const submitButton = form.querySelector('button[type="submit"]');

                inputAmount.addEventListener('input', () => {
                    submitButton.disabled = inputAmount.value <= 0;
                });

                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const rewardId = form.getAttribute('data-reward-id');
                    const amount = form.querySelector('input[name="amount"]').value;

                    try {
                        const response = await fetch('/contribute', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ rewardId, amount }),
                            credentials: 'include'
                        });

                        const result = await response.text();

                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: 'Contribución registrada',
                                confirmButtonColor: '#6D9A2B'
                            });
                            const updatedRewards = await fetch('/rewards');
                            const rewardsData = await updatedRewards.json();
                            loadRewards(rewardsData);
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
                            text: 'Error al registrar la contribución',
                            confirmButtonColor: '#6D9A2B'
                        });
                    }
                });
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar recompensas',
                confirmButtonColor: '#6D9A2B'
            });
        }
    };

    // Manejo del formulario mentes maestras:
    if (mastermindForm) {
        mastermindForm.addEventListener('submit', async function (event) {
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
                    text: 'Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
                    confirmButtonColor: '#6D9A2B'
                });
            }
        });
    }

    // Manejo de envío del formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Las contraseñas no coinciden.',
                    confirmButtonColor: '#6D9A2B'
                });
                return;
            } else if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La contraseña debe tener al menos 8 caracteres, incluir un número y una mayúscula.',
                    confirmButtonColor: '#6D9A2B'
                });
                return;
            }

            const remember = registerForm.rememberRegister.checked;

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const result = await response.text();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Registro exitoso, verifica tu email antes de hacer login.',
                        confirmButtonColor: '#6D9A2B'
                    });
                    localStorage.setItem('user', email);
                    if (remember) {
                        localStorage.setItem('remember', true);
                    }
                    updateUI();
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
                    text: 'Error al registrar el usuario',
                    confirmButtonColor: '#6D9A2B'
                });
            }
        });
    }

    // Manejo de envío del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = loginForm.loginEmail.value;
            const password = loginForm.loginPassword.value;
            const remember = loginForm.rememberLogin.checked;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ loginEmail: email, loginPassword: password }),
                    credentials: 'include'
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Login exitoso',
                        confirmButtonColor: '#6D9A2B'
                    });
                    localStorage.setItem('user', email);
                    if (remember) {
                        localStorage.setItem('remember', true);
                    }
                    updateUI();
                    loadRewards(result.rewards);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message || 'Error al iniciar sesión',
                        confirmButtonColor: '#6D9A2B'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al iniciar sesión',
                    confirmButtonColor: '#6D9A2B'
                });
            }
        });
    }

    // Manejo de desconexión
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('remember');
            updateUI();
        });
    }

    // Manejo de redimensionado de la ventana
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 769) {
            console.log("Window resized to large screen");
            navLinks.classList.remove('active'); // Ocultar el menú en pantallas grandes
            menuToggle.classList.remove('toggle'); // Restablecer el icono del menú
        }
    });

    // Manejo de eventos de hover en los enlaces del footer
    if (linkspan && footerParagraph) {
        linkspan.addEventListener('mouseover', function () {
            this.style.color = 'white';
            footerParagraph.classList.add('change-color');
        });

        linkspan.addEventListener('mouseout', function () {
            this.style.color = '#61dced';
            footerParagraph.classList.remove('change-color');
        });
    }

    // Mostrar el botón cuando el usuario se desplaza hacia abajo
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollUpButton.style.display = 'block';
        } else {
            scrollUpButton.style.display = 'none';
        }
    });

    // Desplazamiento suave hacia arriba cuando se hace clic en el botón
    scrollUpButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Actualizar la interfaz y cargar recompensas al cargar la página
    updateUI();
    if (isLoggedIn()) {
        try {
            const response = await fetch('/rewards');
            const rewards = await response.json();
            loadRewards(rewards);
        } catch (error) {
            console.log(error);
        }
    }
});
