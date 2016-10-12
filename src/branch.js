import React from 'react';

import StoreBranch from './StoreBranch';
import storeShape from './storeShape';

const defaultReducer = (upstream, local) => Object.assign({}, upstream, local);

export default function branch(storeFactory, localActions = []) {
  return Component => {
    class Branch extends React.Component {
      static contextTypes = {
        store: storeShape,
      };

      static propTypes = {
        store: storeShape,
      };

      static childContextTypes = {
        store: storeShape,
      };

      constructor(props, context) {
        super(props, context);
        if (props.store || context.store) {
          this.store = new StoreBranch(
            props.store || context.store,
            storeFactory(),
            localActions,
            defaultReducer
          );
        } else {
          this.store = storeFactory();
        }
        this.setInstance = ::this.setInstance;
      }

      getChildContext() {
        return {
          store: this.store,
        };
      }

      setInstance(comp) {
        if (!this.instance) {
          this.instance = comp;
        }
      }

      render() {
        return React.createElement(Component, {
          ...this.props,
          ref: this.setInstance,
        });
      }
    }
    const statics = Object.assign({}, Component);
    delete statics.propTypes;
    delete statics.contextTypes;
    delete statics.childContextTypes;
    Object.assign(Branch, statics);
    return Branch;
  };
}
