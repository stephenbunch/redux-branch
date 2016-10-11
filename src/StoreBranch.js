export default class StoreBranch {
  constructor(upstream, branch, reducer, actionTypes) {
    this._upstream = upstream;
    this._branch = branch;
    this._actionTypes = actionTypes;
    this._reducer = reducer;
    this._state = this._reducer(upstream.getState(), local.getState());
    this._state = {
      ...upstream.getState(),
      ...branch.getState(),
    };
  }

  getState() {
    return this._state;
  }

  dispatch(action) {
    if (this._actionTypes.indexOf(action.type) > -1) {
      this._branch.dispatch(action);
    } else {
      this._upstream.dispatch(action);
    }
  }

  subscribe(listener) {
    const update = () => {
      this._state = this._reducer(upstream.getState(), local.getState());
    };
    const unsubscribeFromUpstream = this._upstream.subscribe(update);
    const unsubscribeFromBranch = this._branch.subscribe(update);
    return () => {
      unsubscribeFromUpstream();
      unsubscribeFromBranch();
    };
  }
}
