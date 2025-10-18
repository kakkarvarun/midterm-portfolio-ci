
pipeline {
  agent any
  tools { nodejs "node20" }  // Jenkins Tools: NodeJS 20.x (LTS)

  environment {
    REGISTRY = "ghcr.io"
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Install") {
      steps {
        // Use single-quoted multiline so $ is not treated as Groovy interpolation
        sh '''
          echo "Node location: $(which node)"
          node -v
          npm -v
          npm ci
        '''
      }
    }

    stage("Build") {
      steps { sh 'npm run build' }
    }

    stage("Test") {
      steps { sh 'npm test' }  // Jenkins fails here if any test fails
    }

    stage("Docker Login (GHCR)") {
      when { branch "main" }
      steps {
        // Pass env vars to shell; avoid Groovy interpolation with single quotes
        withCredentials([usernamePassword(credentialsId: "ghcr", usernameVariable: "GH_USER", passwordVariable: "GH_PAT")]) {
          sh 'echo $GH_PAT | docker login ghcr.io -u $GH_USER --password-stdin'
        }
      }
    }

    stage("Build & Push Image") {
      when { branch "main" }
      steps {
        script {
          // Derive owner/repo from the git remote (lowercased)
          def owner = sh(script: "git config --get remote.origin.url | sed -E 's#(git@|https://)github.com[:/]|.git##g' | cut -d/ -f1 | tr '[:upper:]' '[:lower:]'", returnStdout: true).trim()
          def repo  = sh(script: "git config --get remote.origin.url | sed -E 's#.*/([^/]+)(\\\\.git)?#\\1#' | tr '[:upper:]' '[:lower:]'", returnStdout: true).trim()
          def image = "${REGISTRY}/${owner}/${repo}"
          def sha   = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()

          // Here we DO want Groovy interpolation for ${image} and ${sha}
          sh """
            docker build -t ${image}:latest -t ${image}:${sha} .
            docker push ${image}:latest
            docker push ${image}:${sha}
          """
        }
      }
    }
  }

  post {
    always { echo "Jenkins pipeline finished." }
  }
}


