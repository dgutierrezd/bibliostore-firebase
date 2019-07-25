import React, { Component } from 'react'
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import Spinner from '../layout/Spinner';
import FichaSuscriptor from '../suscriptores/FichaSucriptor';

// REDUX Actions
import {buscarUsuario} from '../../actions/buscarUsuarioActions';

class PrestamoLibro extends Component {
    state = {  
        busqueda: '',
        noResultados: false
    }

    // Buscar alumno por código.
    buscarAlumno = e => {
        e.preventDefault();

        // Obtener el valor a buscar
        const {busqueda} = this.state;

        // Extraer firestore
        const {firestore, buscarUsuario} = this.props;

        // Hacer la consulta
        const collection = firestore.collection('suscriptores');
        const consulta = collection.where("codigo", "==", busqueda).get();

        // Leer los resultados
        consulta.then(res => {
            if(res.empty) {
                // No hay resultados
                this.setState({
                    noResultados: true
                })

                // Almacenar en redux un objeto vacio
                buscarUsuario({})
                
            } else {
                // Si hay resultados

                // Colocar el resultado en el state de redux
                const datos = res.docs[0]
                buscarUsuario(datos.data())

                // Actualizar el state
                this.setState({
                    noResultados: false
                })
            }
        })
    }

    // Almacena los datos del alumno para solicitar el libro
    solicitarPrestamo = () => {
        const {usuario} = this.props;

        // Fecha de alta
        usuario.fecha_solicitud = new Date().toLocaleDateString();

        // No se pueden mutar los props, tomar una copia y crear un arreglo nuevo
        let prestados = [];
        prestados = [...this.props.libro.prestados, usuario]

        // Copiar el objeto y agregar los prestados
        const libro = {...this.props.libro};

        // Eliminar los prestados anteriores
        delete libro.prestados;

        // Asignar los prestados
        libro.prestados = prestados;

        // Extraer firestore
        const {firestore} = this.props;

        // Almacenar en la BD
        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libro)
        .then( () => {
            Swal.fire(
                'Agregado exitosamente!',
                'El préstamo se ha realizado exitosamente.',
                'success'
            )
        })
    }

    // Almacenar el código en el state.
    leerDato = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() { 
        // Extraer el libro.
        const {libro} = this.props;

        if(!libro) return <Spinner />

        // Extraer los datos del alumno.
        const {usuario} = this.props;

        let fichaAlumno, btnSolicitar;
        if(usuario.nombre) {
            fichaAlumno = <FichaSuscriptor
                                alumno={usuario}
                            />
            
            btnSolicitar = <button type="button" className="btn btn-primary" onClick={this.solicitarPrestamo}>
                            Solicitar Préstamo
                            </button>
        } else {
            fichaAlumno = null;
            btnSolicitar = null;
        }

        let mensajeResultado = '';
        
        if(this.state.noResultados) {
            mensajeResultado = <div className="alert alert-danger">Lo sentimos, el alumno no existe.</div>
        } else {
            mensajeResultado = null
        }

        return ( 
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={`/libros/${libro.id}`} className="btn btn-secondary">
                        &#171; Volver a la Información del Libro
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        Solicitar Préstamo: {libro.titulo}
                    </h2>

                    <hr className="mx-5 w-100"/>

                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={this.buscarAlumno} className="mb-4">
                                <legend className="color-primary text-center">
                                    Busca el Suscriptor por código
                                </legend>

                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="busqueda" 
                                        className="form-control"
                                        placeholder="Código del Alumno"
                                        required
                                        onChange={this.leerDato}
                                    />
                                </div>
                                <input type="submit" className="btn btn-success btn-block" value="Buscar Alumno"/>
                            </form>
                            {/* Muestra la ficha del alumno y el botón para solicitar el préstamo */}
                            {fichaAlumno}
                            {btnSolicitar}

                            {/* Muestra un mensaje de no resultados */}
                            {mensajeResultado}
                        </div>
                    </div>
                </div>
            </div>
        );  
    }
}
 
PrestamoLibro.propTypes = {
    firestore: PropTypes.object.isRequired
}
  
export default compose(
    firestoreConnect(props => [{
        collection: 'libros',
        storeAs: 'libro',
        doc:props.match.params.id
    }]),
    connect(({firestore: {ordered}, usuario}, props) => ({
        libro: ordered.libro && ordered.libro[0],
        usuario: usuario
    }), {buscarUsuario})
)(PrestamoLibro);