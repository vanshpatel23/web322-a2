/********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Patel Vansh Maheshkumar   Student ID: 129544243   Date: 2025-11-07
*  Published URL: https://<your-vercel-url>
********************************************************************************/

const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const projectData = require("./modules/projects");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", { title: "Climate Solutions" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});


app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  if (sector) {
    projectData
      .getProjectsBySector(sector)
      .then((projects) => {
        if (projects.length === 0) {
          return res
            .status(404)
            .render("404", { title: "Not Found", message: `No projects found for sector: ${sector}` });
        }
        res.render("projects", { title: `Projects – ${sector}`, projects, sector });
      })
      .catch((err) =>
        res.status(404).render("404", { title: "Not Found", message: err })
      );
  } else {
    projectData
      .getAllProjects()
      .then((projects) =>
        res.render("projects", { title: "All Projects", projects, sector: "All" })
      )
      .catch((err) =>
        res.status(500).render("404", { title: "Error", message: err })
      );
  }
});


app.get("/solutions/projects/:id", (req, res) => {
  projectData
    .getProjectById(req.params.id)
    .then((project) => res.render("project", { title: project.title, project }))
    .catch((err) =>
      res.status(404).render("404", { title: "Not Found", message: err })
    );
});


app.use((req, res) => {
  res
    .status(404)
    .render("404", { title: "Not Found", message: "Sorry, we couldn't find what you're looking for." });
});


projectData
  .initialize()
  .then(() => {
    if (require.main === module) {
      // Local run
      app.listen(HTTP_PORT, () =>
        console.log(`Server running on port ${HTTP_PORT}`)
      );
    } else {
      // Vercel serverless export
      module.exports = app;
    }
  })
  .catch((err) => {
    console.log(err);
  });
