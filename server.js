/********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Patel Vansh Maheshkumar   Student ID: 129544243   Date: 2025-11-07
*  Published URL: https://web322-a2-tan.vercel.app
********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));

const HTTP_PORT = process.env.PORT || 8080;

// data module
const projectData = require("./modules/projects");

// setup EJS and static files
app.set("view engine", "ejs");
app.use(express.static("public"));

// -------------------- STATIC PAGES --------------------
app.get("/", (req, res) => {
  res.render("home", { title: "Climate Solutions" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// -------------------- PROJECT ROUTES --------------------
app.get("/solutions/projects", async (req, res) => {
  const sector = req.query.sector;

  try {
    if (sector) {
      const projects = await projectData.getProjectsBySector(sector);
      if (!projects.length) {
        return res.status(404).render("404", {
          title: "Not Found",
          message: `No projects found for sector: ${sector}`,
        });
      }

      return res.render("projects", {
        title: `Projects – ${sector}`,
        projects,
        sector,
      });
    }

    // show all projects
    const projects = await projectData.getAllProjects();
    return res.render("projects", {
      title: "All Projects",
      projects,
      sector: "All",
    });
  } catch (err) {
    console.error("[/solutions/projects] error:", err);
    return res
      .status(500)
      .render("404", { title: "Error", message: String(err) });
  }
});

// project details
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id);
    res.render("project", { title: project.title, project });
  } catch (err) {
    res
      .status(404)
      .render("404", { title: "Not Found", message: String(err) });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Not Found",
    message: "Sorry, we couldn't find what you're looking for.",
  });
});

// initialize and start server
projectData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () =>
      console.log(`Server running on port ${HTTP_PORT}`)
    );
  })
  .catch((err) => console.log(err));
