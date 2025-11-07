const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = projectData.map((proj) => {
        const sector = sectorData.find((s) => s.id === proj.sector_id);
        return { ...proj, sector: sector ? sector.sector_name : "Unknown" };
      });
      resolve();
    } catch (err) {
      reject("Unable to initialize projects: " + err);
    }
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) resolve(projects);
    else reject("No projects available");
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const found = projects.find((p) => p.id == projectId);
    if (found) resolve(found);
    else reject(`Unable to find project with id: ${projectId}`);
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const match = projects.filter((p) =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );
    if (match.length > 0) resolve(match);
    else reject(`Unable to find projects for sector: ${sector}`);
  });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
