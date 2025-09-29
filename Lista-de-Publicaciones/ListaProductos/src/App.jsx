
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import PostsList from './components/PostsList.jsx';

function App() {


  return (
    <>
      <div className="App">
        <div className="container mt-5">
          <header className="text-center mb-5">
            <h1 className="display-4 text-primary">📝 Gestor de Publicaciones</h1>
            <p className="lead text-muted">
              Aplicación React CRUD con JSONPlaceholder API
            </p>
            <div className="badge bg-info fs-6">
              ✨ Crear • Leer • Actualizar • Eliminar
            </div>
          </header>
          <PostsList />
        </div>
      </div>
    </>
  )
}

export default App
