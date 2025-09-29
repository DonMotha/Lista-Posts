import { useState, useEffect } from 'react';


function PostsList() {
    const PostsList = () => {
        // Estados principales
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        // Estados para el formulario
        const [newPost, setNewPost] = useState({
            title: '',
            body: '',
            userId: 1
        });

        // Estados para edición
        const [editingPost, setEditingPost] = useState(null);
        const [showForm, setShowForm] = useState(false);

        // 📖 READ - Obtener publicaciones
        useEffect(() => {
            fetchPosts();
        }, []);

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                if (!response.ok) throw new Error('Error al cargar publicaciones');

                const data = await response.json();
                setPosts(data.slice(0, 10)); // Limitamos a 10
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // ➕ CREATE - Crear nueva publicación
        const createPost = async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPost)
                });

                if (!response.ok) throw new Error('Error al crear publicación');

                const createdPost = await response.json();

                // Actualizamos el estado local (useState en acción!)
                setPosts(prevPosts => [createdPost, ...prevPosts]);

                // Resetear formulario
                setNewPost({ title: '', body: '', userId: 1 });
                setShowForm(false);

                alert('✅ Publicación creada exitosamente!');
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        };

        // ✏️ UPDATE - Actualizar publicación
        const updatePost = async (e) => {
            e.preventDefault();

            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editingPost.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editingPost)
                });

                if (!response.ok) throw new Error('Error al actualizar publicación');

                const updatedPost = await response.json();

                // Actualizamos el estado local (useState en acción!)
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.id === updatedPost.id ? updatedPost : post
                    )
                );

                setEditingPost(null);
                alert('✅ Publicación actualizada exitosamente!');
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        };

        // 🗑️ DELETE - Eliminar publicación
        const deletePost = async (postId) => {
            if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;

            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error al eliminar publicación');

                // Actualizamos el estado local (useState en acción!)
                setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

                alert('✅ Publicación eliminada exitosamente!');
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        };

        // Manejar cambios en formularios
        const handleInputChange = (e, isEditing = false) => {
            const { name, value } = e.target;

            if (isEditing) {
                setEditingPost(prev => ({ ...prev, [name]: value }));
            } else {
                setNewPost(prev => ({ ...prev, [name]: value }));
            }
        };

        if (loading) {
            return (
                <div className="row">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-header">
                                <span className="placeholder col-6"></span>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-7"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-6"></span>
                                    <span className="placeholder col-8"></span>
                                </p>
                            </div>
                            <div className="card-footer bg-light">
                                <span className="placeholder col-4"></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
        }

        if (error) {
            return (
                <div className="alert alert-danger">
                    <h4>Error: {error}</h4>
                    <button className="btn btn-outline-danger" onClick={fetchPosts}>
                        Reintentar
                    </button>
                </div>
            );
        }
        return (
            <div className="posts-manager">
                {/* Botón para mostrar formulario */}
                <div className="mb-4 text-center">
                    <button
                        className="btn btn-success btn-lg"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '❌ Cancelar' : '➕ Nueva Publicación'}
                    </button>
                </div>

                {/* Formulario para crear nueva publicación */}
                {showForm && (
                    <div className="card mb-4">
                        <div className="card-header bg-success text-white">
                            <h5>➕ Crear Nueva Publicación</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={createPost}>
                                <div className="mb-3">
                                    <label className="form-label">Título:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={newPost.title}
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contenido:</label>
                                    <textarea
                                        className="form-control"
                                        name="body"
                                        rows="4"
                                        value={newPost.body}
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">
                                    ✅ Crear Publicación
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Formulario para editar publicación */}
                {editingPost && (
                    <div className="card mb-4">
                        <div className="card-header bg-warning text-dark">
                            <h5>✏️ Editar Publicación #{editingPost.id}</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updatePost}>
                                <div className="mb-3">
                                    <label className="form-label">Título:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={editingPost.title}
                                        onChange={(e) => handleInputChange(e, true)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contenido:</label>
                                    <textarea
                                        className="form-control"
                                        name="body"
                                        rows="4"
                                        value={editingPost.body}
                                        onChange={(e) => handleInputChange(e, true)}
                                        required
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-warning">
                                        ✅ Guardar Cambios
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditingPost(null)}
                                    >
                                        ❌ Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de publicaciones */}
                <div className="row">
                    {posts.map((post) => (
                        <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">Publicación #{post.id}</h6>
                                    <div className="btn-group btn-group-sm">
                                        <button
                                            className="btn btn-outline-light btn-sm"
                                            onClick={() => setEditingPost(post)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deletePost(post.id)}
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title text-capitalize">
                                        {post.title}
                                    </h5>
                                    <p className="card-text text-muted">
                                        {post.body}
                                    </p>
                                </div>
                                <div className="card-footer bg-light">
                                    <small className="text-muted">
                                        Usuario ID: {post.userId}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center">
                        <p className="text-muted">No hay publicaciones disponibles.</p>
                    </div>
                )}
            </div>
        );
    };
    return <PostsList />;
} 
export default PostsList;