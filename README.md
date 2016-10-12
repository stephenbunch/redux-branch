# Redux Branch

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]

## Table of Contents
* [Introduction](#introduction)
* [`branch(storeFactory, [localActions])`](#branchstorefactory-localactions)

## Introduction
One of the [biggest sources of confusion](https://github.com/reactjs/redux/issues/1385) when learning to use Redux is knowing when to use the component's local state versus the global Redux state. Although there are [many advantages](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux) to using a single store, there are also some disadvantages:

* Dynamically structured state is impossible.
* [Global variables are bad](http://c2.com/cgi/wiki?GlobalVariablesAreBad).
* Performance suffers as your state tree gets larger.

We can get around these limitations by using "branches". A branch is just a local store whose state is merged on top of the parent. This allows each component to have its own Redux store while still being able to interact with the parent store. (Note: It's important that the structure of the global Redux state is an object.)

By default, dispatched actions are passed through to the parent store. To handle an action in the local store, specify the action type in the `localActions` parameter when calling `branch()`.

## `branch(storeFactory, [localActions])`
```js
import React from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { branch } from 'redux-branch';

import counterReducer from './counterReducer';

const provide = branch(
  // Specify a factory for creating our local store.
  () => createStore(counterReducer),

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
