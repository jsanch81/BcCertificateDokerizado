pipeline {
  agent any
  stages {
    stage('Launch testrpc') {
      steps {
        sh '''#!/bin/bash
        testrpc &
        sleep 2s'''
      }
    }
    stage('Test Smart Contracts') {
      steps {
        sh '''#!/bin/bash
        rm truffle.js
        mv truffle-jenkins.js truffle.js
        truffle test
        exit 0'''
      }
    }
    stage('Publish Test Results') {
      steps {
        junit(testResults: 'test-results.xml', allowEmptyResults: true)
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deployment........'
      }
    }
  }
}
