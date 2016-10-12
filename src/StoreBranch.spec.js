/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* global it expect */

import StoreBranch from './StoreBranch';
import { createStore } from 'redux';

const counterReducer = (count = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return count + 1;
    case 'DECREMENT':
      return count - 1;
    default:
      return count;
  }
};

const mergeReducer = (upstream, local) => upstream * local;

it('should only be subscribed when there are listeners', () => {
  const upstream = createStore(counterReducer);
  const local = createStore(counterReducer);
  const branch = new StoreBranch(upstream, local, [], mergeReducer);
  expect(branch.unsubscribe).toBe(null);
});

it('should render the current state when getting the state with no listeners attached', () => {
  const upstream = createStore(counterReducer);
  const local = createStore(counterReducer);
  const branch = new StoreBranch(upstream, local, [], mergeReducer);
  expect(branch.getState()).toBe(0);
  upstream.dispatch({ type: 'INCREMENT' });
  upstream.dispatch({ type: 'INCREMENT' });
  upstream.dispatch({ type: 'INCREMENT' });
  local.dispatch({ type: 'INCREMENT' });
  local.dispatch({ type: 'INCREMENT' });
  local.dispatch({ type: 'INCREMENT' });
  expect(branch.getState()).toBe(9);
});

it('unsubscribe can be called multiple times with no effect', () => {
  const upstream = createStore(counterReducer);
  const local = createStore(counterReducer);
  const branch = new StoreBranch(upstream, local, [], mergeReducer);
  const unsubscribe = branch.subscribe(() => {});
  expect(branch.unsubscribe !== null).toBe(true);
  unsubscribe();
  expect(branch.unsubscribe).toBe(null);
  unsubscribe();
});
