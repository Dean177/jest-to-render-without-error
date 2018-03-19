# jest-to-render-without-error

[![CircleCI](https://circleci.com/gh/Dean177/jest-to-render-without-error.svg?style=shield)](https://circleci.com/gh/Dean177/jest-to-render-without-error)
[![codecov](https://codecov.io/gh/Dean177/jest-to-render-without-error/branch/master/graph/badge.svg)](https://codecov.io/gh/Dean177/jest-to-render-without-error)
[![Greenkeeper badge](https://badges.greenkeeper.io/Dean177/jest-to-render-without-error.svg)](https://greenkeeper.io/)
[![Npm](https://badge.fury.io/js/jest-to-render-without-error.svg)](https://www.npmjs.com/package/jest-to-render-without-error)


A [Jest matcher](https://facebook.github.io/jest/docs/en/using-matchers.html) to verify the render method of a [React](https://reactjs.org) component


## Installation

`jest-to-render-without-error` depends on [Enzyme](https://github.com/airbnb/enzyme#installation) being installed as a peer dependency, please ensure enzyme is configured and available in your test environment.

```bash
yarn add jest-to-render-without-error --dev
```

```bash
npm install jest-to-render-without-error --save-dev
```

In your setupTestEnvironment.js

```javascript
// src/setupTestEnvironment.js

require('jest-to-render-without-error')
```

Then in the "jest" section of your package.json add the following:

`"setupTestFrameworkScriptFile": "<rootDir>/src/setupTestEnvironment.js"`

## Usage

```javascript
expect(<MyCustomComponent propA={'A'} propB={true} />).toRenderWithoutError()
```

## Test environment

`jest-to-render-without-error` behaves slightly differently depending on wether a DOM (such as JSDOM) is available at test time.

Without a DOM (the default) *only the immediate components render method* is tested, any errors or warnings in child components will not be reported.

## Motivation

This matcher provides an easy way to ensure that the render method of your component will not cause any errors or warnings to be logged and returns without causing an exception.

This provides a lot of confidence that refactoring elsewhere in your codebase hasn't unintentionally broken your components.
