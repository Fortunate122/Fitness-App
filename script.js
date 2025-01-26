const checkbox = document.getElementById('checkbox');

// Toggle theme and store preference in local storage
checkbox.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  console.log('Theme toggled:', document.body.classList.contains('dark') ? 'Dark mode' : 'Light mode');

  // Store theme preference in local storage
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', JSON.stringify({ theme }));
});

// Load theme preference from local storage
const savedTheme = JSON.parse(localStorage.getItem('theme'));
if (savedTheme && savedTheme.theme === 'dark') {
  document.body.classList.add('dark');
  checkbox.checked = true;
  console.log('Loaded saved theme: Dark mode');
} else {
  console.log('Loaded saved theme: Light mode');
}

const form = document.getElementById('signup-form');
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const email = document.getElementById('email').value.trim();
  const errorElement = document.getElementById('error');

  errorElement.textContent = '';

  // Check for empty fields
  if (!username || !password || !email) {
    errorElement.textContent = 'Please complete the form.';
    console.log('Form submission failed: Incomplete fields');
    return;
  }

  // Store form data in local storage as JSON
  const formData = { username, password, email };
  localStorage.setItem('formData', JSON.stringify(formData));
  console.log('Form submitted successfully');
  console.log('Saved data:', formData);

  // Clear form inputs
  form.reset();
});

// Retrieve and log stored form data (if any)
const savedFormData = JSON.parse(localStorage.getItem('formData'));
if (savedFormData) {
  console.log('Retrieved saved form data:', savedFormData);
}
