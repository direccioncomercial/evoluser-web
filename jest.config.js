module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['./jest-setup.js'],
  transformIgnorePatterns: [
    "/node_modules/(?!(@exodus|parse5|jsdom|html-encoding-sniffer|whatwg-url|whatwg-mimetype)/)"
  ]
};
