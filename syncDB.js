const sequelize = require('./sequelize');

async function syncDatabase() {
  try {
    // Use force: true only in development to drop and recreate tables
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();