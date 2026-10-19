document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const date = form.elements.date;
  const today = new Date();
  date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const status = document.getElementById('contact-status');
  const button = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Inquiry failed');
      status.textContent = 'Thank you for reaching out. We’ll be in touch soon.';
      form.reset();
    } catch {
      status.append('Your inquiry could not be sent. Please try again or email ');
      const email = document.createElement('a');
      email.href = 'mailto:chefdonsmith@gmail.com';
      email.textContent = 'chefdonsmith@gmail.com';
      status.append(email, '.');
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.innerHTML = 'Enter the inner table <span aria-hidden="true">+</span>';
    }
  });
});
