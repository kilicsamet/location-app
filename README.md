
# `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


ection about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

# `Building Location-App.UI`

Get the project's build using Makefile.

```
make build-ui
```

Then, bring up the container.

```
make run-dev
```

Location-App.UI will be accessible at `http://localhost:3000`.


# `GitHub Actions`

This project uses GitHub Actions to automate continuous integration and deployment processes. When code changes are made, the application is automatically tested and built. After successful builds, the application is automatically deployed.

## `Version Tagging and Pushing`



### `Create a New Version Tag`

When creating a new version for the project, you should update version tags only after pushing your code changes. Follow these steps to tag and push versions.
```
 git tag v1.0.1

```

This command tags the current commit as v1.0.1. Tags are used to mark specific points in the repository's history, typically after changes have been made.

### `Push the Tags to the Remote Repository`

```
git push --tags 
 
```
This command pushes the created tags to the remote repository

**Note:** Version tags should be created only after code changes have been pushed and tags must always differ from the previous version.
