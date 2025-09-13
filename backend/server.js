const app = require('./src/app');
const { testConnection } = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('Failed to connect to database. Server starting anyway...');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`CORS enabled for: ${process.env.CLIENT_URL}`);
  });
};

startServer();

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});