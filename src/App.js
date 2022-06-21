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

//<Header menuState={false} />
//<Home />

function App() {
  return (
    <div className="bg-transparent text-3xl h-screen w-full overflow-hidden">
      <Test />
    </div>
  );
}

export default App;
