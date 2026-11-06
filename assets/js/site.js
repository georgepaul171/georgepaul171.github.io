// Shared behaviour for every page: the light/dark toggle and the contact form.

(function () {
    const root = document.documentElement;
    const toggle = document.querySelector('.theme-toggle');

    function currentTheme() {
        if (root.dataset.theme) {
            return root.dataset.theme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateLabel() {
        if (toggle) {
            toggle.textContent = currentTheme() === 'dark' ? 'Light' : 'Dark';
        }
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.dataset.theme = next;
            try {
                localStorage.setItem('theme', next);
            } catch (e) {
                // Storage can be blocked (private windows); the toggle still works for this page.
            }
            updateLabel();
        });
        updateLabel();
    }

    // Contact form: send to Formspree without leaving the page
    const form = document.querySelector('#contact-form');
    if (form) {
        const status = document.querySelector('#form-status');
        const button = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            button.disabled = true;
            status.textContent = 'Sending…';
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                });
                if (response.ok) {
                    form.reset();
                    status.textContent = 'Message sent. Thank you.';
                } else {
                    status.textContent = 'There was an error. Please try again, or email me directly.';
                }
            } catch (err) {
                status.textContent = 'Sending failed. Please check your connection, or email me directly.';
            }
            button.disabled = false;
        });
    }
})();
