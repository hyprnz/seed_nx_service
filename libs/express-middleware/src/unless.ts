/**
 * Use this to decide which paths can ignore authentication
 *
 * e.g. don't validation or verify JWT tokens when calling a liveness (healthcheck) probe
 *
 * const unAuthenticatedRoutes = [`${options.path}/livenessProbe`]
 * expressApp.use(unless(unAuthenticatedRoutes, jwtMiddleware))
 *
 * @param paths
 * @param middleware
 */
const unless = (paths: Array<string>, middleware: any) => {
    return (req: any, res: any, next: any) => {
        return paths.find((x) => x === req.path) ? next() : middleware(req, res, next);
    };
};

export { unless };
