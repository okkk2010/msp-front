import { useSyncExternalStore } from "react";

export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  function setState(updater) {
    const nextState =
      typeof updater === "function"
        ? updater(state)
        : {
            ...state,
            ...updater,
          };

    state = nextState;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getState() {
    return state;
  }

  function useStore(selector = (snapshot) => snapshot) {
    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(state),
    );
  }

  return {
    getState,
    setState,
    subscribe,
    useStore,
  };
}
