const mongoose = require('mongoose');
const { skills, githubProjects } = require('./data');

const MONGODB_URI = 'mongodb+srv://bharadwajreddy1463:reddy1406@cluster0.3w1xb.mongodb.net/webOS';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const skillSchema = new mongoose.Schema({
  skill: String,
  percent: Number,
  value: Number
});

const githubProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String],
  url: String
});

// Create models
const Skill = mongoose.model('Skill', skillSchema);
const GithubProject = mongoose.model('GithubProject', githubProjectSchema);

// Function to initialize database with data from data.js
const initializeDatabase = async () => {
  try {
    // Clear existing data
    await Skill.deleteMany({});
    await GithubProject.deleteMany({});

    // Insert new data
    await Skill.insertMany(skills);
    await GithubProject.insertMany(githubProjects);

    console.log('Database initialized with data from data.js');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  Skill,
  GithubProject,
  initializeDatabase,
  mongoose
};
