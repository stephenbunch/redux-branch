# Redux Branch

## Table of Contents
* [Introduction](#introduction)
* [`branch(storeFactory, mergeReducer)`](#branchstorefactory-mergereducer)

## Introduction
One of the [biggest sources of confusion](https://github.com/reactjs/redux/issues/1385) when learning to use Redux is knowing when to use the component's local state versus the global Redux state. This is because Redux assumes a single store for the entire app. Although there are [many advantages](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux) to using a single store, there are also some disadvantages:

* Dynamically structured state is impossible. A piece of state cannot have an identity of its own. A component must know the full path to a given piece of state in order to use it.
* Changes in the structure of your app require changes in the structure of your store.
* State cannot be thrown away. Once a component initializes some state, it lives on indefinitely even after the component has been unmounted.
* Not all state is meant to be shared. This makes it difficult to look at a reducer and know who might be using it.

We can get around these limitations by using "branches". A branch is just another tree of Redux state. This allows each component to have its own Redux state while still being able to share state and dispatch actions with its parents. This also allows us to reuse reducers at different levels in the tree.

## `branch(storeFactory, mergeReducer)`
```js
import React from 'react';
import { createStore } from 'redux';

import localReducer from './localReducer';

function Subview(props) {
  const { local, upstream } = props;
  return (
    <div>
      {local.get('welcome')} {upstream.get('user')}!
    </div>
  );
}

function mapStateToProps(state) {
  return {
    local: state,
    upstream: state.get('upstream')
  };
}

export default branch(
  () => createStore(localReducer),
  (local, upstream) => local.merge({ upstream })
)(connect(mapStateToProps))(Subview);
```
