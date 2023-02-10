import React from "react";
import { render } from "react-dom";

const App: React.FC = () => <h3>Hello, World</h3>;

render(<App />, document.querySelector("#dashboard-app"));
