const https = require('https');

const url = 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec';

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers location:', res.headers.location);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Body length:', body.length);
    console.log('Body preview:', body.slice(0, 300));
  });
}).on('error', err => console.error('Error:', err));
