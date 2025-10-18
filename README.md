# Midterm CI Pipeline — Varun Kakkar

Repository: https://github.com/kakkarvarun/midterm-portfolio-ci

## Structure of the repository

public/ # portfolio (index.html, styles.css)
src/app.js # Express app (API + static hosting)
tests/app.test.js # 6 Jest tests (>=5 required)
Dockerfile # container image
.dockerignore
.github/workflows/ci.yml # GitHub Actions CI
Jenkinsfile # (bonus) Jenkins pipeline
index.js # server entrypoint
package.json
README.md


## How to build and run the application (local)
```powershell
npm ci
npm start
# open http://localhost:3000/
API endpoints:

GET /api/profile

GET /api/projects

Steps to test the CI pipeline (GitHub Actions)

Push a commit to main (or open a PR).

GitHub → Actions → open the run.

Confirm stages: checkout → Node 20 → install deps → build → jest tests (pipeline fails if any test fails) → login to GHCR → build & push image.

To demonstrate failure, temporarily break one test and push a branch/PR; the workflow should turn red in the tests step. Revert and push to pass.

How to pull the Docker image from the registry

GitHub Container Registry (GHCR):

docker pull ghcr.io/kakkarvarun/midterm-portfolio-ci:latest
docker rm -f midterm-portfolio 2>$null
docker run -d --name midterm-portfolio -p 3000:3000 ghcr.io/kakkarvarun/midterm-portfolio-ci:latest
# PowerShell health check
(Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).StatusCode

To run a specific build:

docker pull ghcr.io/kakkarvarun/midterm-portfolio-ci:<short-sha>

Docker Hub :

docker pull docker.io/kakkarvarun/midterm-portfolio-ci:latest
docker run -d -p 3000:3000 docker.io/kakkarvarun/midterm-portfolio-ci:latest


How to run the Jenkins pipeline

Jenkins runs in Docker; NodeJS + Docker Pipeline plugins installed; Node tool node20.

A GitHub PAT (write:packages) is stored in Jenkins Credentials (ID: ghcr).

Job pulls this repo (main) and runs stages: checkout → install → build → test → (if at tip of main) docker login → build & push (latest, <sha>).

Start Jenkins locally (example):

docker run -d --name jenkins -p 8080:8080 -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts



