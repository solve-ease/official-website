import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

// const userName = "Harry Bhai! "
// const elem = <h1>Hello World {userName} </h1>;

// const myelement = (
//   <table>
//     <tr>
//       <th>Name</th>
//     </tr>
//     <tr>
//       <td>John</td>
//     </tr>
//     <tr>
//       <td>Elsa</td>
//     </tr>
//   </table>
// );

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(<App />);

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);


