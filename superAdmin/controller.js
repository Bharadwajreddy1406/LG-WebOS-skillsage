const data = require('./Data.js');
// const projects = data.githubProjects;

const getProjects =  (req, res) => {
  try {
    const projects = data.githubProjects;
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    getProjects
}