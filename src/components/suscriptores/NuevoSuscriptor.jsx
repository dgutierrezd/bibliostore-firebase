import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

class NuevoSuscriptor extends Component {
    state = { 
        nombre: '',
        apellido: '',
        carrera: '',
        codigo: ''
    }

    // Agrega un nuevo suscriptor a la BD
    agregarSuscriptor = e => {
        e.preventDefault()

        // Extraer los valores del state
        const nuevoSuscriptor = {...this.state}

        // Extraer firestore de props
        const {firestore, history} = this.props

        // Guardar en la BD
        firestore.add({
            collection: 'suscriptores'
        }, nuevoSuscriptor)
        .then( () => {
            Swal.fire(
                'Creado exitosamente!',
                'El suscriptor se ha creado exitosamente.',
                'success'
            )
            history.push('/suscriptores')
        })
    }

    // Extrae los valores del input y los coloca en el state
    leerDato = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() { 
        return (  
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to='/suscriptores' className="btn btn-secondary">
                        &#171; Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        Nuevo Suscriptor
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.agregarSuscriptor}
                                id="create-form"
                            >
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        placeholder="Nombre del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.nombre}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Apellido:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="apellido"
                                        placeholder="Apellido del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.apellido}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Carrera:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="carrera"
                                        placeholder="Carrera del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.carrera}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Código:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="codigo"
                                        placeholder="Código del Suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.codigo}
                                    />
                                </div>

                                <input 
                                    type="submit"
                                    value="Agregar Suscriptor"
                                    className="btn btn-success"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

NuevoSuscriptor.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default firestoreConnect() (NuevoSuscriptor);