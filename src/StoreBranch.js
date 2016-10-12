export default class StoreBranch {
  constructor(upstream, local, handleActions, reducer) {
    this.upstream = upstream;
    this.local = local;
    this.handleActions = handleActions;
    this.reducer = reducer;
    this.state = undefined;
    this.listeners = [];
    this.unsubscribe = null;
  }

  observeState() {
    this.state = this.reducer(this.upstream.getState(), this.local.getState());
  }

  getState() {
    if (this.listeners.length === 0) {
      this.observeState();
    }
    return this.state;
  }

  dispatch(action) {
    if (this.handleActions.indexOf(action.type) > -1) {
      this.local.dispatch(action);
    } else {
      this.upstream.dispatch(action);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    if (this.listeners.length === 1) {
      const handleChange = () => {
        this.observeState();
        const listeners = this.listeners.slice();
        for (const listener of listeners) {
          listener();
        }
      };
      const unsubscribeFromUpstream = this.upstream.subscribe(handleChange);
      const unsubscribeFromBranch = this.local.subscribe(handleChange);
      this.unsubscribe = () => {
        unsubscribeFromUpstream();
        unsubscribeFromBranch();
      };
      this.observeState();
    }
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
        if (this.listeners.length === 0) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }
    };
  }
}
