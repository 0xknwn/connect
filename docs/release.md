# Release a new version

search for all the packages.json in the repository and update the "version" tag
to the numlber you want to release; then

- reinstall all the packages to make sure it is working:

```shell
rm -rf package-lock.json node_modules
npm install --ignore-scripts -ws
````

-  rebuild the projects that needs to be released

```shell
npm run build -w @0xknwn/connect-api
npm run build -w @0xknwn/connect-ui
npm run build -w @0xknwn/connect-core
```

- publish the projects

```shell
npm publish --access=public -w @0xknwn/connect-api
npm publish --access=public -w @0xknwn/connect-ui
npm publish --access=public -w @0xknwn/connect-core
```
