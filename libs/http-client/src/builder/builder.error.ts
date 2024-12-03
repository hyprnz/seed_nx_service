class HttpClientBuilderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HttpClientBuilderError';
    }
}

export { HttpClientBuilderError };
