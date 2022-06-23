import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import Test from "./Test";
import Globe from "./Globe"

import LandformCanvas from "./LandformCanvas"

//<Header menuState={false} />
//<Home />

function App() {
  var image = new Image()
        image.src = "./assets/earthLandmass.png"
  return (
    <div className="bg-transparent text-3xl h-screen w-full overflow-hidden">
      <Globe />
    </div>
  );
}

export default App;
