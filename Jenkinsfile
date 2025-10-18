
pipeline {
  agent any
  tools { nodejs "node20" }  // Jenkins Tools: NodeJS 20.x LTS

  environment {
    REGISTRY = "ghcr.io"
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Install") {
      steps {
        // Single-quoted block avoids Groovy interpolating $ or $(...)
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
      steps { sh 'npm test' }  // Pipeline fails here if any test fails
    }

    // Ensure the local ref for origin/main exists and is fresh
    stage("Ensure origin/main ref") {
      steps {
        sh '''
          git fetch --no-tags origin +refs/heads/main:refs/remotes/origin/main
          echo "HEAD:        $(git rev-parse HEAD)"
          echo "origin/main: $(git rev-parse origin/main)"
          echo "Branch refs:"
          git branch -vv || true
        '''
      }
    }

    // ---- Docker stages run ONLY when this commit == origin/main ----
    stage("Docker Login (GHCR)") {
      when {
        expression {
          sh(returnStatus: true, script: 'test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"') == 0
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: "ghcr", usernameVariable: "GH_USER", passwordVariable: "GH_PAT")]) {
          sh 'echo $GH_PAT | docker login ghcr.io -u $GH_USER --password-stdin'
        }
      }
    }

    stage("Build & Push Image") {
      when {
        expression {
          sh(returnStatus: true, script: 'test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"') == 0
        }
      }
      steps {
        script {
          // Derive owner/repo from remote URL (lowercased)
          def owner = sh(script: "git config --get remote.origin.url | sed -E 's#(git@|https://)github.com[:/]|.git##g' | cut -d/ -f1 | tr '[:upper:]' '[:lower:]'", returnStdout: true).trim()
          def repo  = sh(script: "git config --get remote.origin.url | sed -E 's#.*/([^/]+)(\\\\.git)?#\\1#' | tr '[:upper:]' '[:lower:]'", returnStdout: true).trim()
          def image = "${REGISTRY}/${owner}/${repo}"
          def sha   = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()

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

