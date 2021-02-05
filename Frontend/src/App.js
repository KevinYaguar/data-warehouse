
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from './Navbar.jsx';
import Login from './Login';
import './Navbar-events'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Switch>
      <Route path='/login' component={NavBar} />
      <Route path='/login' component={Login} />
      <Route component={ () => (
        <div>
          <h1>ERROR 404</h1>
          <span>Page not found</span>
        </div>
      )}/>
      </Switch>
      
    </Router>
  )
}

export default App;
