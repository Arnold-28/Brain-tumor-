const http = require('http');
const { readFileSync } = require('fs');
const { join } = require('path');

const PORT = process.env.PORT || 3000;
const dataPath = join(__dirname, 'data', 'tumor_types.json');
const tumorData = JSON.parse(readFileSync(dataPath, 'utf8'));

const server = http.createServer((req, res) => {
  if (req.url === '/api/tumors' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count: tumorData.length, data: tumorData }, null, 2));
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify(
        {
          message: 'Brain Tumor Mini Project API',
          endpoints: {
            tumors: '/api/tumors'
          }
        },
        null,
        2
      )
    );
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
