
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from './Navbar.jsx'
//import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <NavBar />
    </Router>
  )
}

export default App;
