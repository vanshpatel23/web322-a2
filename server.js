/********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Patel Vansh Maheshkumar   Student ID: 129544243   Date: (fill)
*  Published URL: (add after Vercel deploy)
********************************************************************************/

const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// A1 data module
const projectData = require("./modules/projects");

// view engine + static
app.set("view engine", "ejs");
app.use(express.static("public"));

// -------------------- STATIC VIEWS --------------------
app.get("/", (req, res) => {
  res.render("home", { title: "Climate Solutions" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// -------------------- DYNAMIC VIEWS --------------------
// list by sector (or all)
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
    // no sector -> show all
    projectData
      .getAllProjects()
      .then((projects) => res.render("projects", { title: "All Projects", projects, sector: "All" }))
      .catch((err) =>
        res.status(500).render("404", { title: "Error", message: err })
      );
  }
});

// details by id
app.get("/solutions/projects/:id", (req, res) => {
  projectData
    .getProjectById(req.params.id)
    .then((project) => res.render("project", { title: project.title, project }))
    .catch((err) =>
      res.status(404).render("404", { title: "Not Found", message: err })
    );
});

// 404 catch-all
app.use((req, res) => {
  res
    .status(404)
    .render("404", { title: "Not Found", message: "Sorry, we couldn't find what you're looking for." });
});

// init then start
projectData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
