import React, { Suspense } from "react";
import routes from "./routes/index";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { renderRoutes } from "react-router-config";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Suspense fallback={<h1>loading</h1>}>{renderRoutes(routes)}</Suspense>
      </div>
    );
  }
}

export default App;
