//import required packages
const express = require('express');
const cors = require('cors');

//create express app
const app = express();

//middleware
app.use(cors()); // lets frontend make requests
app.use(express.json()); // allows json parsing in requests

// hardcoded project data (only for now)
const projects = [
  {
    id: 1,
    title: "portfolio website",
    description: "a full stack portfolio site with blog functionality",
    techStack: ["React", "Node.js", "PostgreSQL"]
  },
  {
    id: 2,
    title: "Weather App",
    description: "real time weather app with geolocation",
    techStack: ["React", "Openweather API", "CSS"]
  }
];

// routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:${PORT}');
});


