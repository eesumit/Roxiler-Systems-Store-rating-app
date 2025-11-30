import app from './app.js';
import { sequelize, syncDatabase } from './models/index.js';
import { testConnection } from './config/database.js';
import emailService from './services/emailService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testConnection();
        await syncDatabase();
        await emailService.testConnection();

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════╗
║  🚀 Server running on port ${PORT}       ║
║  📝 Environment: ${process.env.NODE_ENV || 'development'}          ║
║  🌐 API: http://localhost:${PORT}/api    ║
╚═══════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
// Start the server
startServer();