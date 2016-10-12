import React from 'react';

import StoreBranch from './StoreBranch';
import storeShape from './storeShape';

const defaultReducer = (upstream, local) => ({ ...upstream, ...local });

export default function branch(storeFactory, handledActions = []) {
  return Component => {
    const { contextTypes, propTypes, childContextTypes, ...statics } = Component;
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
            handledActions,
            defaultReducer
          );
        } else {
          this.store = storeFactory();
        }
      }

      getChildContext() {
        return {
          store: this.store,
        };
      }

      render() {
        return React.createElement(Component, this.props);
      }
    }
    Object.assign(Branch, statics);
    return Branch;
  };
}
