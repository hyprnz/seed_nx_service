const common = {
    loader: ['./cucumberLoader.js'],
    import: ['src/socialTests/config/**/*.ts', 'src/socialTests/contexts/*.ts', 'src/socialTests/steps/**/*.ts'],
    tags: ['@social'],
    paths: ['src/socialTests/features/**/*.feature']
};

export default { ...common };
