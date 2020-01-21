### Description:
The purpose of this project is to use Pivotal Tracker's API to grab story titles and descriptions and post them as comments on Github issues or pull requests via Github's API.

### Requirements:
- NPM v6.9.0 or greater
- NodeJS v12.6.0 or greater

### Setup:
1. Clone this repo onto your local machine.
2. cd into the directory
3. run command `npm install`
4. Create a `.env` file in the root directory of the project.
5. Add the following environment variables to `.env` file:

```config
PIVOTAL_KEY=your_pivotal_api_key
GITHUB_KEY=your_github_api_key
PROJECT_ID=your_pivotal_project_id
REPO=your_repo_name
REPO_OWNER=your_repos_owner_name
```

### Usage:
For this script to work, several things must have been done prior to usage:

* You must have already made a pull request to github.
* The pull request must be made on a branch that has the Pivotal Tracker story ID at the beginning of the name (without an octothorpe):
  * `123456789_your_branch_name`
* A pivotal tracker story with the ID in your branch name must exist for the project specified by your `.env PROJECT_ID` environment variable.
* The Github repository specified by the `REPO` environment variable must exist.

### Optional:
You can optionally create a bash function or alias to call this script:

`function prcomment() { node path_to/the_repo/index.js }`

Make sure you source your `.bashrc` or `.bash_profile` (where ever you put the alias) in order to use it.