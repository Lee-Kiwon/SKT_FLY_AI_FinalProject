const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const port = 3000;
const flutterIp = '172.23.240.202'; // IP 주소를 '172.23.240.202'로 설정합니다.

// JSON 형태의 본문을 해석할 수 있도록 설정
app.use(bodyParser.json());

app.post('/send-message', (req, res) => {
  const message = req.body.message;
  const clientIp = req.ip; // 클라이언트의 IP 주소를 가져옵니다.
  console.log('Received message:', message);
  console.log('Received message from IP:', clientIp); // 클라이언트의 IP 주소를 출력합니다.

  const flutterEndpoint = `http://${flutterIp}:4000/receive-message`;
  const postData = JSON.stringify({ message: message });

  const options = {
    hostname: flutterIp,
    port: 4000,
    path: '/receive-message',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const request = http.request(options, (response) => {
    console.log(`Message sent to Flutter with status code: ${response.statusCode}`);
    res.status(200).send('Message received and forwarded successfully');
  });

  request.on('error', (error) => {
    console.error('Error while sending message to Flutter:', error);
    res.status(500).send('Error while forwarding message to Flutter');
  });

  request.write(postData);
  request.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
