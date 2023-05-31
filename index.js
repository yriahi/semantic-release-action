const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    // Get inputs from the workflow file
    const extraPlugins = core.getInput('extra_plugins');
    const githubToken = core.getInput('GITHUB_TOKEN');
    const npmToken = core.getInput('NPM_TOKEN');
    
    // Install Dependencies
    {
      const { stdout, stderr } = await exec('npm --loglevel error ci --only=prod', {
        cwd: path.resolve(__dirname)
      });
      console.log(stdout);
      if (stderr) {
        return Promise.reject(stderr);
      }
    }
    
    // Install extra plugins if specified
    if (extraPlugins) {
      const plugins = extraPlugins.split('\n');
      for (const plugin of plugins) {
        await exec.exec('npm', ['install', '--save-dev', plugin]);
      }
    }

    // Perform semantic release actions
    await exec.exec('npx', ['semantic-release'], {
      env: {
        GITHUB_TOKEN: githubToken,
        NPM_TOKEN: npmToken,
      },
    });

    // Set the outputs
    core.setOutput('new_release_published', 'true');
    // Set other outputs based on the release process

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
