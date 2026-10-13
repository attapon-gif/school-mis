const https = require('https');

const token = '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=';

const reqData = JSON.stringify({
  messages: [{ type: 'text', text: 'ทดสอบผ่าน CORS Proxy' }]
});

// Test corsproxy.io
const targetUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://api.line.me/v2/bot/message/broadcast');

const u = new URL(targetUrl);
const req = https.request({
  hostname: u.hostname,
  path: u.pathname + u.search,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(reqData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('corsproxy.io status:', res.statusCode);
    console.log('corsproxy.io body:', body);
  });
});

req.on('error', (err) => console.error('corsproxy.io error:', err.message));
req.write(reqData);
req.end();
