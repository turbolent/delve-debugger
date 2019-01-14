import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { Provider } from "react-redux";
import createStore from "./store";
import { parseQuestion, setQuestion, parseActionCreator } from "./actions";
import { getSavedState } from "./history";
import { Parse } from "./types";

const store = createStore();
const root = document.getElementById("root") as HTMLElement;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
);

registerServiceWorker();

function loadState(state: any) {
  const { question: savedQuestion, parse: savedParse } = getSavedState();

  const question = (state && state.question) || savedQuestion;
  if (question) {
    store.dispatch(setQuestion(question));
  }

  if (savedParse) {
    const parse = Parse.decode(savedParse);
    store.dispatch(parseActionCreator.succeeded(parse));
  } else if (question) {
    store.dispatch(parseQuestion(question, false));
  }
}

window.addEventListener("load", () => {
  loadState(history.state);
});

window.addEventListener("popstate", (event: PopStateEvent) => {
  loadState(event.state);
});
