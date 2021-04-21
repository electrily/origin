module.exports = {
    exchangeRestClient: {
        input: {
            target: './src/schema.yaml'
        },
        output: {
            client: 'react-query',
            mode: 'tags',
            target: 'src/reactQuery/client',
            // schemas: './reactQuery/schemas',
            override: {
                mutator: {
                    path: 'src/reactQuery/mutator/customInstance.ts',
                    name: 'customInstance'
                }
            }
        }
    }
};
