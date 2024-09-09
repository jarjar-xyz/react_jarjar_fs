import "./Home.css";
import { Header } from "./Header";
import { Toaster } from "react-hot-toast";
import { Dropzone } from "./Dropzone";
import { NeuromorphicProgressBar } from "@/components/ui/progressBar";
import { NeuromorphicButton } from "@/components/ui/neuromorphicButton";
import { useServices } from "@/domain/core/services";
import { OpenInSuiVision } from "./OpenInSuiVision";
import { Library } from "../Library/Library";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export const Home = () => {
  const { moveTxService } = useServices();

  return (
    <div className="container">
      <Toaster />
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Dropzone />
            <NeuromorphicProgressBar />
            <NeuromorphicButton onClick={() => moveTxService.prepareFile()}>
              Upload
            </NeuromorphicButton>
          </Route>
          <Route path="/library">
            <Library />
          </Route>
        </Switch>
      </Router>
      
      <OpenInSuiVision />
    </div>
  );
};
