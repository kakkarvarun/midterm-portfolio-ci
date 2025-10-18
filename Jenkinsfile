
pipeline {
  agent any
  tools { nodejs "node20" }  // Jenkins Tools: NodeJS 20.x LTS

  environment {
    IMAGE = "ghcr.io/kakkarvarun/midterm-portfolio-ci"
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Install") {
      steps {
        // Single-quoted shell block so $ / $(...) are not Groovy-interpolated
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

    // Make sure we compare with the *latest* origin/main
    stage("Ensure origin/main ref") {
      steps {
        sh '''
          git fetch --no-tags origin +refs/heads/main:refs/remotes/origin/main
          echo "HEAD:        $(git rev-parse HEAD)"
          echo "origin/main: $(git rev-parse origin/main)"
          git branch -vv || true
        '''
      }
    }

    // Only publish when the build's commit equals origin/main (Fix A)
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
          def sha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          sh """
            docker build -t ${IMAGE}:latest -t ${IMAGE}:${sha} .
            docker push ${IMAGE}:latest
            docker push ${IMAGE}:${sha}
          """
        }
      }
    }
  }

  post {
    always { echo "Jenkins pipeline finished." }
  }
}

