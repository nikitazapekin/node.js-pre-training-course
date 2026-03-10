const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

 
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
 
app.get('/data', (req, res) => {
  res.json([
    { id: 1, name: 'Item 1', description: 'First item' },
    { id: 2, name: 'Item 2', description: 'Second item' },
    { id: 3, name: 'Item 3', description: 'Third item' }
  ]);
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
