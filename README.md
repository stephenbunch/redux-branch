# Redux Branch

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]

## Table of Contents
* [Introduction](#introduction)
* [`branch(storeFactory, [handleActions])`](#branchstorefactory-handleactions)

## Introduction
One of the [biggest sources of confusion](https://github.com/reactjs/redux/issues/1385) when learning to use Redux is knowing when to use the component's local state versus the global Redux state. This is because Redux assumes a single store for the entire app. Although there are [many advantages](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux) to using a single store, there are also some disadvantages:

* Dynamically structured state is impossible.
* [Global variables are bad](http://c2.com/cgi/wiki?GlobalVariablesAreBad).

We can get around these limitations by using "branches". A branch is just another tree of Redux state. This allows each component to have its own Redux store while still being able to interact with the parent store.

## `branch(storeFactory, [handleActions])`
```js
import React from 'react';
import { createStore } from 'redux';
import { branch } from 'redux-branch';

import localReducer from './localReducer';

const provide = branch(
  // Specify a factory for creating our local store.
  () => createStore(localReducer),

  // By default, all actions pass through to the parent store (assuming a parent
  // store exists.) To handle actions within our local store, we must specify
  // the action types that we want to capture.
  ['INCREMENT', 'DECREMENT']
);

export default provide(connect(mapStateToProps)(MyComponent));
```

[npm-image]: https://img.shields.io/npm/v/redux-branch.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/redux-branch
[travis-image]: https://img.shields.io/travis/stephenbunch/redux-branch.svg?style=flat-square
[travis-url]: https://travis-ci.org/stephenbunch/redux-branch
[codecov-image]: https://img.shields.io/codecov/c/github/stephenbunch/redux-branch.svg?style=flat-square
[codecov-url]: https://codecov.io/github/stephenbunch/redux-branch
