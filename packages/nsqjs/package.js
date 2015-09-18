Package.describe({
  name: 'nwdev:nsqjs',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Wrapper for Node "NSQJS" package',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('meteorhacks:npm', 'server');
  api.use(['npm-container', 'mongo'], 'server');
  api.use('mongo', 'client');
  api.addFiles('lib/lib.js', ['server', 'client']);
  api.addFiles('server/nsqjs.js', 'server');
  api.addFiles('client/client.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('nwdev:nsqjs');
  api.addFiles('nsqjs-tests.js');
});
