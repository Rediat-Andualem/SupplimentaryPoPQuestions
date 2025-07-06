'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models dynamically
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Debug loaded models
console.log("✅ Loaded models:", Object.keys(db));

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize references
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sequential sync function with debug
db.syncTablesInOrder = async () => {
  try {
    if (!db.Courses || !db.Instructor || !db.QuestionAndAnswerTable) {
      console.error("❌ One or more models missing. Check your model exports and naming.");
      console.log("Available models in db object:", Object.keys(db));
      throw new Error("Missing required models for syncing.");
    }

    await db.Courses.sync({ alter: true });
    await db.Instructor.sync({ alter: true });
    await db.QuestionAndAnswerTable.sync({ alter: true });
    console.log('✅ Tables created in order successfully');
  } catch (error) {
    console.error('❌ Error syncing tables:', error);
  }
};

module.exports = db;
