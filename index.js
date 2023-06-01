const core = require('@actions/core');
const { exec } = require('child_process');
const path = require('path');


const installActionsCore = async () => {
  const options = {
    cwd: path.resolve(__dirname),
    shell: true
  };
  await executeCommand('npm install --save @actions/core', options);
};


const run = async () => {
  try {
    // Install actions/core if it is not installed
    if (!actionsCore) {
      await installActionsCore();
    }

    // Install Dependencies
    {
      const options = {
        cwd: path.resolve(__dirname),
        shell: true
      };
      await executeCommand('npm ci --only=prod', options);
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
};

const executeCommand = async (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

run().catch(console.error);
