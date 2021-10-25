import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter, Route } from "react-router-dom";
import Home from './components/Home';
import Dashbord from './components/Dashbord';




function App() {
  return (
    <BrowserRouter >
      <Route exact path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/dashbord' component={Dashbord} />
      <Route path='/register' component={Register} />
    </BrowserRouter>
  );
}

export default App;
