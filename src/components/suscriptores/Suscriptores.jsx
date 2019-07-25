import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

const Suscriptores = props => {

    const {suscriptores, firestore} = props;

    if(!suscriptores) return <Spinner/>

    // Eliminar suscriptores
    const eliminarSuscriptor = id => {
        // Eliminar
        Swal.fire({
            title: 'Estás seguro de eliminar el suscriptor?',
            text: "No podrás revertir esta función!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
        }).then( result => {
            if (result.value) {

                try {
                    firestore.delete({
                        collection: 'suscriptores',
                        doc: id
                    })

                    if(result.value) {
                        Swal.fire(
                            'Eliminado!',
                            'El suscriptor se ha eliminado exitosamente.',
                            'success'
                        )
                    }
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error, vuelve a intentarlo'
                    })
                }
            }
        })
    }

    return ( 
        <div className="row">
            <div className="col-md-12 mb-4">
                <Link to={'/suscriptor/nuevo'} className="btn btn-success">
                    &#43; Nuevo Suscriptor
                </Link>
            </div>
            <div className="col-md-8">
                <h2>
                    Suscriptores
                </h2>
            </div>
            <table className="table table-striped mt-4">
                <thead className="text-light bg-primary">
                    <tr>
                        <th>Nombre</th>
                        <th>Carrera</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suscriptores.map(sub => (
                        <tr key={sub.id}>
                            <td>{sub.nombre} {sub.apellido}</td>
                            <td>{sub.carrera}</td>
                            <td>
                                <Link to={`/suscriptor/${sub.id}`} className="btn btn-info mr-3">
                                    Más Información
                                </Link>
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={() => eliminarSuscriptor(sub.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

Suscriptores.propTypes = {
    firestore: PropTypes.object.isRequired,
    suscriptores: PropTypes.array
}
 
export default compose(
    firestoreConnect([{collection: 'suscriptores'}]),
    connect((state, props) => ({
        suscriptores: state.firestore.ordered.suscriptores
    }))
)(Suscriptores)