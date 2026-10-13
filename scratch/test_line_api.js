const https = require('https');

const token = '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=';

const reqData = JSON.stringify({
  messages: [{ type: 'text', text: 'ทดสอบการส่งข้อความจาก Node.js' }]
});

const req = https.request({
  hostname: 'api.line.me',
  path: '/v2/bot/message/broadcast',
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
    console.log('Status code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', body);
  });
});

req.on('error', (err) => console.error('Error:', err));
req.write(reqData);
req.end();
