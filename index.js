const core = require('@actions/core');
// const exec = require('@actions/exec');
const { exec } = require('child_process');
const path = require('path');

async function run() {
  try {
    // Get inputs from the workflow file
    const extraPlugins = core.getInput('extra_plugins');
    const githubToken = core.getInput('GITHUB_TOKEN');
    const npmToken = core.getInput('NPM_TOKEN');
    
   // Install Dependencies
   {
    const options = {
      cwd: path.resolve(__dirname),
      shell: true
    };
    await executeCommand('npm ci --only=prod', options);
  }
    
    // Install extra plugins if specified
    if (extraPlugins) {
      const plugins = extraPlugins.split('\n');
      for (const plugin of plugins) {
        await exec.exec('npm', ['install', '--save-dev', plugin]);
      }
    }

    // Perform semantic release actions
    {
      const options = {
        cwd: path.resolve(__dirname),
        shell: true
      };
      await executeCommand('npx semantic-release', options);
    }


    // Set the outputs
    core.setOutput('new_release_published', 'true');
    // Set other outputs based on the release process

  } catch (error) {
    core.setFailed(error.message);
  }
}


const executeCommand = async (command, options) => {
  return new Promise((resolve, reject) => {
    childProcessExec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};


run().catch(console.error);
