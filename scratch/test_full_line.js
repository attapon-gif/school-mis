const https = require('https');

const gasUrl = 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec';
const token = '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=';
const message = '🔔 [ทดสอบระบบวิชาการ] แจ้งเตือนผ่าน LINE ใช้งานได้สมบูรณ์แบบ 100% ✨';

const fetchUrl = gasUrl + '?action=sendLineNotify&payload=' + encodeURIComponent(JSON.stringify({ token, message }));

console.log('Sending GET request to GAS...');

function request(u) {
  https.get(u, res => {
    console.log('HTTP Status:', res.statusCode);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Following redirect to:', res.headers.location.slice(0, 80) + '...');
      request(res.headers.location);
      return;
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);
    });
  }).on('error', err => console.error('Error:', err.message));
}

request(fetchUrl);
