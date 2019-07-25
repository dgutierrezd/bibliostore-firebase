import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import store from '../store';
import {Provider} from 'react-redux';

import Login from './auth/Login';
import Navbar from './layout/Navbar'

import Suscriptores from './suscriptores/Suscriptores';
import EditarSuscriptor from './suscriptores/EditarSuscriptor';
import MostrarSuscriptor from './suscriptores/MostrarSuscriptor';
import NuevoSuscriptor from './suscriptores/NuevoSuscriptor';

import Libros from './libros/Libros';
import EditarLibro from './libros/EditarLibro';
import NuevoLibro from './libros/NuevoLibro';
import MostrarLibro from './libros/MostrarLibro';
import PrestamoLibro from './libros/PrestamoLibro';

import {UserIsAuthenticated, UserIsNotAuthenticated} from '../helpers/auth'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={UserIsAuthenticated(Libros)} />
            <Route exact path="/libros/nuevo" component={UserIsAuthenticated(NuevoLibro)} />
            <Route exact path="/libros/:id" component={UserIsAuthenticated(MostrarLibro)} />
            <Route exact path="/libros/editar/:id" component={UserIsAuthenticated(EditarLibro)} />
            <Route exact path="/libros/prestamo/:id" component={UserIsAuthenticated(PrestamoLibro)} />

            <Route exact path='/suscriptores' component={UserIsAuthenticated(Suscriptores)} />
            <Route exact path='/suscriptor/nuevo' component={UserIsAuthenticated(NuevoSuscriptor)} />
            <Route exact path='/suscriptor/:id' component={UserIsAuthenticated(MostrarSuscriptor)} />
            <Route exact path='/suscriptor/editar/:id' component={UserIsAuthenticated(EditarSuscriptor)} />        

            <Route exact path='/login' component={UserIsNotAuthenticated(Login)} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
