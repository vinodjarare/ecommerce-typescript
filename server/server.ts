import 'module-alias/register';
import app from './app';
import http from 'http';
import connectDatabase from './config/db';

connectDatabase();

const server = http.createServer(app);

const port = process.env.PORT || 8000;

//Handling uncaught exception
process.on('uncaughtException', err => {
  console.log(`Error:${err.message}`);
  console.log(`Shuting down the server due to Uncaught Exception`);
  process.exit(1);
});

server.listen(port, () => console.log('Server is running on port 5000'));

//Unhandled promise rejection
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error:${err.message}`);
  console.log(`Shuting down the server due to Unhandled Promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});

// if for any reason server crashed we can know the reason behind this
process.on('SIGTERM', () => {
  // logger.info('SIGTERM is received');
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
