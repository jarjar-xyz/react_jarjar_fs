import "./Home.css";
import { Header } from "./Header";
import { Toaster } from "react-hot-toast";
import { Dropzone } from "./Dropzone";
import { Library } from "../Library/Library";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export const Home = () => {
  return (
    <div className="container">
      <Toaster />
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Dropzone />
          </Route>
          <Route path="/library">
            <Library />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
