import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

const Libros = props => {

    const {libros, firestore} = props;

    if(!libros) return <Spinner />

    const eliminarLibro = id => {
        // Eliminar libro de firestore.
        Swal.fire({
            title: 'Estás seguro de eliminar este libro?',
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
                        collection: 'libros',
                        doc: id
                    })

                    if(result.value) {
                        Swal.fire(
                            'Eliminado!',
                            'El libro se ha eliminado exitosamente.',
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
            <div className="col-12 mb-4">
                <Link to='/libros/nuevo' className="btn btn-success">
                    &#43; Nuevo Libro
                </Link>
            </div>
            <div className="col-md-8">
                <h2>
                {/* eslint-disable-next-line */} &#128214; Libros
                </h2>
            </div>
            <table className="table table-striped mt-4">
                <thead className="text-light bg-primary">
                    <tr>
                        <th>Título</th>
                        <th>ISBN</th>
                        <th>Editorial</th>
                        <th>Existencia</th>
                        <th>Disponibles</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {libros.map(libro => (
                        <tr key={libro.id}>
                            <td>{libro.titulo}</td>
                            <td>{libro.ISBN}</td>
                            <td>{libro.editorial}</td>
                            <td>{libro.existencia}</td>
                            <td>{libro.existencia - libro.prestados.length}</td>
                            <td>
                                <Link 
                                    to={`/libros/${libro.id}`}
                                    className="btn btn-success mr-3"
                                >
                                    Mas información
                                </Link>
                                
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={ () => eliminarLibro(libro.id)}
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

Libros.propTypes = {
    firestore: PropTypes.object.isRequired,
    libros: PropTypes.array
}
 
export default compose(
    firestoreConnect([{collection: 'libros'}]),
    connect((state, props) => ({
        libros: state.firestore.ordered.libros
    }))
)(Libros)