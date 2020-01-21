const path     = require('path')
require('dotenv').config({path: path.join(__dirname, '.env')})

const tracker  = require('pivotaltracker');
const Octokit  = require('@octokit/rest');
const { exec } = require('child_process');
const client   = new tracker.Client(process.env.PIVOTAL_KEY);
const octokit  = new Octokit({
  auth: process.env.GITHUB_KEY
});

let pullNumber;
let branchName;
let storyId;

function getPullNumber() {
  exec("git ls-remote origin 'pull/*/head' | grep -F -f <(git rev-parse HEAD) | awk -F'/' '{print $3}'", { shell: "/bin/bash" }, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    setPullNumber(stdout)
  })
}

getPullNumber()

function setPullNumber(number) {
  pullNumber = number
  getBranch(pullNumber)
}

function getBranch(prNumber) {
  exec("git rev-parse --abbrev-ref HEAD", { shell: "/bin/bash" }, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    setBranch(stdout, prNumber)
  })
}


function setBranch(name, prNumber) {
  branchName = name
  setStoryId(branchName, prNumber)
}

function setStoryId(branchname, prNumber) {
  storyId = Number(branchname.split('_')[0])
  postComment(storyId, prNumber)
}

function postComment(storyId, prNumber) {
  client.project(process.env.PROJECT_ID).story(storyId).get((error, story) => {
    if (error) {
      throw error;
    }

    const { url, description, name } = story;
    const commentBody = `## Pivotal Tracker Information:
  ### [${name}](${url})
  ${description}`

    const sha = octokit.pulls.listCommits({
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO,
      pull_number: prNumber,
    }).then(response => response.data[0].sha)
    octokit.issues.createComment({
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO,
      issue_number: pullNumber,
      body: commentBody,
    }).then(response => (response.status >= 200 && response.status < 300) ? console.log(`Successfully posted comment: ${response.data.url}`) : console.log('Uh Oh, something went wrong!')).catch(err => console.log(err));
  });
}
