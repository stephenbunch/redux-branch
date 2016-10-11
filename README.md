# Redux Branch

## Table of Contents
* [Introduction](#introduction)
* [`branch(storeFactory, reducer, actionTypes)`](#branchstorefactory-reducer-actiontypes)

## Introduction
One of the [biggest sources of confusion](https://github.com/reactjs/redux/issues/1385) when learning to use Redux is knowing when to use the component's local state versus the global Redux state. This is because Redux assumes a single store for the entire app. Although there are [many advantages](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux) to using a single store, there are also some disadvantages:

* Dynamically structured state is impossible. A piece of state cannot have an identity of its own. A component must know the full path to a given piece of state in order to use it.
* Changes in the structure of your app require changes in the structure of your store.
* State cannot be thrown away. Once a component initializes some state, it lives on indefinitely even after the component has been unmounted.
* Not all state is meant to be shared. This makes it difficult to look at a reducer and know who might be using it.

We can get around these limitations by using "branches". A branch is just another tree of Redux state. This allows each component to have its own Redux store while still being able to interact with its parent store. This also allows us to reuse reducers anywhere in the tree.

## `branch(storeFactory, reducer, actionTypes)`
```js
import React from 'react';
import { createStore } from 'redux';
import { branch } from 'redux-branch';

import someReducer from './someReducer';

const branchedComponentFactory = branch(
  // Specify a factory for creating our local store.
  () => createStore(someReducer),

  // Optionally subscribe to the parent store and merge its state into our local
  // store whenever the parent store's state changes.
  (local, upstream) => { ...upstream, ...local },

  // By default, all actions are dispatched upstream. To handle actions with our
  // local store, we must specify the action types we want to capture.
  ['DO_SOMETHING_LOCAL']
);

// Build our redux component like normal.
const ReduxComponent = connect(mapStateToProps)(MyComponent);

// Then wrap it with another component to provide our branched store.
const BranchedComponent = branchedComponentFactory(ReduxComponent);

export default BranchedComponent;
```
