
const path = require("path");
const express = require("express");
const app = express();

// Serve the portfolio
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/profile", (_req, res) => {
  // grouped skills for rich data
  const skills_groups = {
    esri: ["ArcGIS Enterprise 10.9–11.x", "Portal", "ArcGIS Server", "Data Store", "ArcGIS Pro/Online", "ArcGIS Monitor"],
    cloud_devops: ["AWS (EC2/VPC/ALB)", "Azure (VMs/VNets)", "Terraform", "Chef", "Ansible", "GitHub Actions", "Jenkins"],
    security_identity: ["SAML 2.0 SSO (Entra ID/Okta/ADFS)", "RBAC", "governance"],
    data_qaqc: ["schemas/domains", "versioning", "validation", "backup/restore"],
    scripting: ["Python (ArcGIS API/REST)", "PowerShell", "Bash"],
    databases: ["PostgreSQL/PostGIS", "SQL Server", "Oracle"]
  };

  // flat array for backward compatibility with tests
  const skills = Object.values(skills_groups).flat();

  res.status(200).json({
    name: "Varun Kakkar",
    title: "Cloud & DevOps Engineer • GIS SME",
    location: "Ontario, Canada",
    phone: "+1 437-878-5461",
    email: "kakkar.varun67@gmail.com",
    linkedin: "https://www.linkedin.com/in/varun-kakkar-659b7a134/",
    github: "https://github.com/kakkarvarun",
    summary:
      "Subject Matter Expert in GIS with 4+ years designing and operating ArcGIS Enterprise (10.9–11.x) on-prem and in AWS/Azure; automation with Python/PowerShell/Chef; SAML/RBAC; ArcGIS Monitor-driven reliability (≥99.9% uptime, RTO ≤4h, RPO ≤30m).",
    skills,          // <-- flat array so Array.isArray(...) === true
    skills_groups,   // <-- keep the detailed grouping too
    education: [
      { school: "Conestoga College", program: "PG Diploma – Cloud Development & Operations (DevOps)", status: "In progress" },
      { school: "Conestoga College", program: "PG Diploma – Virtualization & Cloud Computing", graduation: "Apr 2025" },
      { school: "Pillai HOC College of Engineering & Technology", program: "B.E. Computer Engineering", graduation: "Oct 2020" },
      { school: "Vidyalankar Polytechnic", program: "Diploma in Computer Engineering", graduation: "Jun 2016" }
    ],
    certifications: [
      "AWS Academy Graduate – AWS Academy Cloud Architecting",
      "Google Cloud Essentials"
    ],
    highlights: [
      "Architected & migrated 8+ ArcGIS Enterprise envs on AWS/Azure with ≥99.9% uptime",
      "Automated installs/upgrades/backups (Chef/Python/PowerShell) cutting deploy effort ~8h → ~2h (−75%)",
      "Enabled observability with ArcGIS Monitor; MTTR ~4.0h → ~1.5h (−62%) and fewer P1/P2 incidents",
      "Hardened SAML SSO + RBAC; 0 critical auth findings and ~−40% access-admin tickets"
    ]
  });
});

// Projects JSON (links to your public GitHub repos)
app.get("/api/projects", (_req, res) => {
  res.status(200).json([
    { name: "CondorMatics-S25-VK", url: "https://github.com/kakkarvarun/CondorMatics-S25-VK", tags: ["infra","SaaS"] },
    { name: "Terraform-Advanced-Features-in-Action", url: "https://github.com/kakkarvarun/Terraform-Advanced-Features-in-Action", tags: ["terraform","modules"] },
    { name: "vkterraform-ci-cd", url: "https://github.com/kakkarvarun/vkterraform-ci-cd", tags: ["terraform","ci/cd"] },
    { name: "java-telemetry-demo", url: "https://github.com/kakkarvarun/java-telemetry-demo", tags: ["java","observability","prometheus"] },
    { name: "automated-data-pipeline-dbautomation-", url: "https://github.com/kakkarvarun/automated-data-pipeline-dbautomation-", tags: ["python","data"] },
    { name: "containerization-compose-lab", url: "https://github.com/kakkarvarun/containerization-compose-lab", tags: ["docker","compose"] }
  ]);
});

// 404 JSON
app.use((_req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;

