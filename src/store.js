import {createStore, combineReducers, compose} from 'redux';
import {reactReduxFirebase, firebaseReducer} from 'react-redux-firebase';
import {reduxFirestore, firestoreReducer} from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

/** Custom Reducers */
import buscarUsuarioReducer from './reducers/buscarUsuarioReducer';

// Configurar firestore
const firebaseConfig = {
    apiKey: "AIzaSyABM8V_k57TqUhsVMhBKnm7xTO2MWQzk8M",
    authDomain: "bibliostore-3ac81.firebaseapp.com",
    databaseURL: "https://bibliostore-3ac81.firebaseio.com",
    projectId: "bibliostore-3ac81",
    storageBucket: "bibliostore-3ac81.appspot.com",
    messagingSenderId: "729489679678",
    appId: "1:729489679678:web:53e197f4495f0128"
};

// Inicializar firebase
firebase.initializeApp(firebaseConfig);

// Configuración de react-redux
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
}

// Crear el enhacer con compose de redux y firestore
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore)

// Reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    usuario: buscarUsuarioReducer
})

// State inicial
const initialState = {};

// Create store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()    
));

export default store;