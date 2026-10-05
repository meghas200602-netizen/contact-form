const form = document.getElementById('contactForm');
const btn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');
const msg = document.getElementById('message');
const count = document.getElementById('count');

msg.addEventListener('input', () => { count.textContent = msg.value.length; });

function setError(id, text) {
  const input = document.getElementById(id);
  document.getElementById(id + 'Err').textContent = text;
  input.closest('.field').classList.toggle('invalid', Boolean(text));
  return !text;
}

function validate() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const okName = setError('name', name.length < 2 ? 'Enter your name (at least 2 characters).' : '');
  const okEmail = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email, like you@example.com.');
  const okMsg = setError('message', message.length < 5 ? 'Write a message of at least 5 characters.' : '');
  return okName && okEmail && okMsg;
}

function show(type, text) {
  statusEl.className = type;
  statusEl.textContent = text;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  show('', '');
  if (!validate()) return;

  btn.disabled = true;
  btn.querySelector('.label').textContent = 'Sending...';
  btn.querySelector('.spinner').hidden = false;

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
    show('ok', 'Message saved. Thank you, ' + form.name.value.trim() + '!');
    form.reset();
    count.textContent = '0';
  } catch (err) {
    show('fail', err.message);
  } finally {
    btn.disabled = false;
    btn.querySelector('.label').textContent = 'Send message';
    btn.querySelector('.spinner').hidden = true;
  }
});
