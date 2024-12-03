# hyprnz

## Getting Started

1. Install Docker (and [Windows Subsystem for Linux](https://docs.docker.com/desktop/wsl/) if on Windows)
2. Install latest Node.js LTS
3. If using VSCode, install the Devcontainers extension
4. Once cloned, open the command pallete in VSCode and select 'Open Folder in Container'
5. If not using VSCode, you can open and login to the dev container via the package.json scripts

## Run Locally

1. Clone the repository:
    ```bash
    git clone git@github.com:hyprnz/seed_nx_service.git
    ```
2. Set environment variables:

    - For each app, use the `.env.development.template` files as a guide. Copy the template and rename it to `.env.development`.

3. Start the development container:
    ```bash
    npm run docker:dev:up
    ```
4. Log into the development container:
    ```bash
    npm run docker:dev:connect
    ```
5. Install dependencies
    ```bash
    npm install
    ```
6. When finished, you can tear down your docker container by doing the following

    ```bash
    exit # exit current container
    npm run docker:dev:down

    ```

## Run tasks (from within container)

To run the dev server for your app, use:

```sh
npx nx serve hyprnz
```

To create a production bundle:

```sh
npx nx build hyprnz
```

To run a security check:

```sh
npx nx static:security hyprnz
```

To run linting:

```sh
npx nx lint hyprnz
```

To see all available targets to run for a project, run:

```sh
npx nx show project hyprnz
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Security

This repository uses the following patterns for tackling security vulnerabilities

1. **npm audit** runs as part of the build and will fail if any medium or higher vulnerabilities are found
2. **Github's dependabot** will create pull requests for major dependency upgrades weekly
3. **Github's dependabot** will create security alerts for significant vulnerabilities here - https://github.com//hyprnz/seed_nx_service/security/dependabot

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

-   [Learn more about this workspace setup](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
-   [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
-   [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
-   [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

-   [Discord](https://go.nx.dev/community)
-   [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
-   [Our Youtube channel](https://www.youtube.com/@nxdevtools)
-   [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
