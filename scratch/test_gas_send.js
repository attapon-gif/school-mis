const https = require('https');

const token = '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=';

const payload = encodeURIComponent(JSON.stringify({
  token: token,
  message: '🔔 ทดสอบการแจ้งเตือนจากระบบวิชาการผ่าน GAS'
}));

const targetUrl = 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec?action=sendLineNotify&payload=' + payload;

function fetchUrl(u) {
  https.get(u, (res) => {
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirect to:', res.headers.location);
      fetchUrl(res.headers.location);
      return;
    }
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Response body:', body.slice(0, 500));
    });
  }).on('error', err => console.error('Error:', err));
}

fetchUrl(targetUrl);
