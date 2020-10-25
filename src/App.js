import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { LinkContainer } from 'react-router-bootstrap';

const App = () =>  
    <div className="App container">
      <Navbar fluid="true" collapseOnSelect>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/signup">
                <NavItem>Signup</NavItem>
              </LinkContainer>
              <LinkContainer to="/login">
                <NavItem>Login</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div> 

export default App;
