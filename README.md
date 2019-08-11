# gulp-config-v1
gulp configuration - TypeScript, SASS, Pug, BEMIT Methodology (CSS/SCSS)

## Commands
Build and open project in browser:
```
$ npm run dev
```
> use watcher, available on: http://127.0.0.1:8080

Build with mode production and open project in browser:
```
$ npm run prod
```
> use watcher, available on: http://127.0.0.1:8080

Build project:
```
$ npm run build
```

Run server api:
```
$ npm run api
```
> run express server available on: http://127.0.0.1:8181

Build JS diagrams:
```
$ npm run diagrams
```
> Visualises JavaScript, TypeScript and Flow codebases as meaningful and committable architecture diagrams and saves in arkit.svg

## DevDependencies

- @babel/core: ^7.3.4,
- autoprefixer: ^9.4.10,
- axios: ^0.18.0,
- babel-loader: ^8.0.5,
- babel-preset-env: ^1.7.0,
- copy-webpack-plugin: ^5.0.0,
- cors: ^2.8.5,
- css-loader: ^2.1.0,
- express: ^4.17.0,
- file-loader: ^3.0.1,
- fork-ts-checker-webpack-plugin: ^1.0.0,
- html-loader: ^0.5.5,
- html-webpack-plugin: ^3.2.0,
- mini-css-extract-plugin: ^0.5.0,
- node-sass: ^4.11.0,
- postcss-loader: ^3.0.0,
- pug: ^2.0.3,
- pug-html-loader: ^1.1.5,
- sass-loader: ^7.1.0,
- style-loader: ^0.23.1,
- ts-loader: ^5.3.3,
- typescript: ^3.3.3333,
- url-loader: ^1.1.2,
- webpack: ^4.29.6,
- webpack-cli: ^3.2.3,
- webpack-dev-server: ^3.2.1

## Releases
- v1.0.0 -- Initial release
- v1.0.1 -- hotfix: when create file with extension not '.pug' in 'pages' folder, files processed by the wrong loader