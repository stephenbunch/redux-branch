/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* global it expect */

import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { mount } from 'enzyme';

import branch from './branch';

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

const globalStoreFactory = () => createStore(combineReducers({ count: counterReducer }));
const storeFactory = () => createStore(combineReducers({ localCount: counterReducer }));
const mapStateToProps = state => state;

const createFixture = (...args) => {
  const store = globalStoreFactory();
  let Counter = props => <div>{props.children} {props.count}/{props.localCount}</div>;
  Counter.propTypes = {
    count: PropTypes.number,
    localCount: PropTypes.number,
    children: PropTypes.node,
  };
  const provide = branch(...args);
  Counter = provide(connect(mapStateToProps)(Counter));
  let counter;
  const wrapper = mount(
    <Provider store={store}>
      <Counter
        ref={comp => {
          counter = comp;
        }}
      >
        test
      </Counter>
    </Provider>
  );
  return { store, counter, wrapper };
};

it('should merge with the upstream state', () => {
  const { wrapper, store } = createFixture(storeFactory);
  expect(wrapper.text()).toBe('test 0/0');
  store.dispatch({ type: 'INCREMENT' });
  expect(wrapper.text()).toBe('test 1/0');
  wrapper.unmount();
});

it('should handle local actions', () => {
  const { wrapper, store, counter } = createFixture(storeFactory, ['INCREMENT']);
  store.dispatch({ type: 'INCREMENT' });
  counter.store.dispatch({ type: 'INCREMENT' });
  expect(wrapper.text()).toBe('test 1/1');
  wrapper.unmount();
});

it('should not handle global actions', () => {
  const { wrapper, store, counter } = createFixture(storeFactory);
  store.dispatch({ type: 'INCREMENT' });
  counter.store.dispatch({ type: 'INCREMENT' });
  expect(wrapper.text()).toBe('test 2/0');
  wrapper.unmount();
});

it('should hoist statics', () => {
  let Counter = () => null;
  Counter.foo = 2;
  const provide = branch(storeFactory);
  Counter = provide(connect(mapStateToProps)(Counter));
  expect(Counter.foo).toBe(2);
});

it('should work without a parent store', () => {
  let Counter = props => <div>{props.localCount}</div>;
  Counter.propTypes = {
    localCount: PropTypes.number,
  };
  const provide = branch(storeFactory);
  Counter = provide(connect(mapStateToProps)(Counter));
  const wrapper = mount(<Counter />);
  expect(wrapper.text()).toBe('0');
  wrapper.instance().store.dispatch({ type: 'INCREMENT' });
  expect(wrapper.text()).toBe('1');
  wrapper.unmount();
});
