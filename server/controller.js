const { Skill, GithubProject, initializeDatabase } = require('./db');

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills data', error: error.message });
  }
};

const getGithubProjects = async (req, res) => {
  try {
    const githubProjects = await GithubProject.find({});
    res.status(200).json(githubProjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GitHub projects data', error: error.message });
  }
};

const getAllData = async (req, res) => {
  try {
    const skills = await Skill.find({});
    const githubProjects = await GithubProject.find({});
    
    const allData = {
      skills,
      githubProjects
    };
    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

const resetDatabase = async (req, res) => {
  try {
    const result = await initializeDatabase();
    
    if (result.success) {
      res.status(200).json({ message: 'Database reset successful' });
    } else {
      res.status(500).json({ message: 'Failed to reset database', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error resetting database', error: error.message });
  }
};

module.exports = {
  getSkills,
  getGithubProjects,
  getAllData,
  resetDatabase
};
