document.addEventListener('DOMContentLoaded', function () {
	console.log('Gyaan-Daan scripts loaded');

	const apiBase = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
	const form = document.getElementById('volunteer-form');
	const status = document.getElementById('form-status');
	const loginForm = document.getElementById('login-form');
	const loginStatus = document.getElementById('login-status');

	if (form && status) {
		form.addEventListener('submit', async function (event) {
			event.preventDefault();
			status.textContent = 'Submitting...';

			const payload = {
				name: form.name.value.trim(),
				email: form.email.value.trim(),
				role: form.role.value,
				message: form.message.value.trim()
			};

			try {
				const response = await fetch(`${apiBase}/api/volunteer`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});

				const data = await response.json();
				status.textContent = data.message || 'Thank you for reaching out.';
				if (response.ok) {
					form.reset();
				}
			} catch (error) {
				status.textContent = 'Unable to submit right now. Please try again later.';
				console.error(error);
			}
		});
	}

	if (loginForm && loginStatus) {
		loginForm.addEventListener('submit', async function (event) {
			event.preventDefault();
			loginStatus.textContent = 'Signing in...';

			try {
				const response = await fetch(`${apiBase}/api/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: loginForm.email.value.trim(),
						password: loginForm.password.value
					})
				});

				const data = await response.json().catch(() => ({}));
				if (!response.ok) {
					loginStatus.textContent = data.error || 'Login failed. Please try again.';
					return;
				}
				loginStatus.textContent = data.message || 'Login completed.';
			} catch (error) {
				loginStatus.textContent = 'Unable to reach the server. Please start the backend and try again.';
				console.error(error);
			}
		});
	}
});
