module.exports = {
  originBackendApiClient: {
    output: {
      mode: 'tags',
      target: '.',
      client: 'react-query',
      override: {
        mutator: {
          path: '../mutator/custom-mutator.ts',
          name: 'customMutator',
        },
        title: (title) => {
          return `${title}Api`;
        },
      },
    },
    input: {
      target: './origin-backend-api-client.yaml',
    },
  },
};
