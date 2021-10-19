import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './components/Home';
import Dashbord from './components/Dashbord';



function App() {
  return (
    <BrowserRouter >
        <Home/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/dashbord' component={Dashbord}/>
        <Route exact path='/register' component={Register}/>
    </BrowserRouter>
  );
}

export default App;
