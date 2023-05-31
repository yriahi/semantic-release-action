module.exports = {
    branches: ['master'],
    preset: 'angular',
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/github',
    ],
  };
  