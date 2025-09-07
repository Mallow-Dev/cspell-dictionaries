
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const word = document.getElementById('word').value;

  fetch('/add-word', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ word })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    document.getElementById('word').value = '';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while submitting the word.');
  });
});
