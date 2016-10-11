import React from 'react';

import StoreBranch from './StoreBranch';
import storeShape from './storeShape';

export defualt function branch(storeFactory, actionTypes) {
  class Branch extends React.Component {
    static contextTypes = {
      store: storeShape,
    };

    static childContextTypes = {
      store: storeShape,
    };

    constructor(props, context) {
      this.store = new StoreBranch(
        context.store,
        storeFactory(),
        (upstream, local) => ({ ...upstream, ...local }),
        actionTypes
      );
    }

    getChildContext() {
      return {
        store: this.store,
      };
    }

    render() {
      return this.props.children || null;
    }
  }
}
