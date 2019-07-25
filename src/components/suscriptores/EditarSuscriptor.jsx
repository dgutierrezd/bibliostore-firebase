import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import Spinner from '../layout/Spinner';

class EditarSuscriptor extends Component {

    // Crear los refs.
    nombreInput = React.createRef();
    apellidoInput = React.createRef();
    carreraInput = React.createRef();
    codigoInput = React.createRef();

    // Edita el suscriptor en la base de datos.
    editarSuscriptor = e => {
        e.preventDefault();

        // Crear el objeto que va a actualizar
        const suscriptorActualizado = {
            nombre: this.nombreInput.current.value,
            apellido: this.apellidoInput.current.value,
            carrera: this.carreraInput.current.value,
            codigo: this.codigoInput.current.value
        }

        // Extraer firestore de props
        const {suscriptor, firestore, history} = this.props;

        // Almacenar en la BD con firestore
        firestore.update({
            collection: 'suscriptores',
            doc: suscriptor.id
        }, suscriptorActualizado)
        .then( () => {
            Swal.fire(
                'Guardado exitosamente!',
                'El suscriptor se ha editado exitosamente.',
                'success'
            )
            history.push(`/suscriptor/${suscriptor.id}`)
        })
    }
    
    render() { 

        const {suscriptor} = this.props

        if(!suscriptor) return <Spinner />

        return ( 
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={`/suscriptor/${suscriptor.id}`} className="btn btn-secondary">
                        &#171; Volver a la Información del Suscriptor
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        &#9998; Editar Suscriptor
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.editarSuscriptor}
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
                                        ref={this.nombreInput}
                                        defaultValue={suscriptor.nombre}
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
                                        ref={this.apellidoInput}
                                        defaultValue={suscriptor.apellido}
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
                                        ref={this.carreraInput}
                                        defaultValue={suscriptor.carrera}
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
                                        ref={this.codigoInput}
                                        defaultValue={suscriptor.codigo}
                                    />
                                </div>

                                <input 
                                    type="submit"
                                    value="Guardar Suscriptor"
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

EditarSuscriptor.propTypes = {
    firestore: PropTypes.object.isRequired
}
  
export default compose(
    firestoreConnect(props => [{
        collection: 'suscriptores',
        storeAs: 'suscriptor',
        doc:props.match.params.id
    }]),
    connect(({firestore: {ordered}}, props) => ({
        suscriptor: ordered.suscriptor && ordered.suscriptor[0]
    }))
)(EditarSuscriptor);