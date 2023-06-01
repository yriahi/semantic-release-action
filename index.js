const core = require('@actions/core');
const { execSync } = require('child_process');
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
        stdio: 'pipe',
      };
      await executeCommand('npm ci --only=prod', options);
    }
    
    // Install extra plugins if specified
    if (extraPlugins) {
      const plugins = extraPlugins.split('\n');
      for (const plugin of plugins) {
        const options = {
          cwd: path.resolve(__dirname),
          stdio: 'pipe',
        };
        await executeCommand(`npm install --save-dev ${plugin}`, options);
      }
    }

    // Perform semantic release actions
    {
      const options = {
        cwd: path.resolve(__dirname),
        stdio: 'inherit',
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
    try {
      execSync(command, options);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

run().catch(console.error);
