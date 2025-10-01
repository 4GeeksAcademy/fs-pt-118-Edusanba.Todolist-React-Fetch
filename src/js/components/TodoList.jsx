import React, { useState, useEffect } from "react";

const TodoList = ({ username, onBackToUserSelection }) => {
	// Estado para almacenar las tareas
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);
	
	const API_BASE_URL = "https://playground.4geeks.com/todo";

	// Función para crear usuario si no existe
	const createUser = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/users/${username}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});
			
			if (response.ok) {
				console.log("Usuario creado exitosamente");
			} else if (response.status === 400) {
				console.log("El usuario ya existe");
			}
		} catch (error) {
			console.error("Error creando usuario:", error);
		}
	};

	// Función para obtener todas las tareas del servidor
	const getTodos = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_BASE_URL}/users/${username}`);
			
			if (response.ok) {
				const data = await response.json();
				setTodos(data.todos || []);
			} else if (response.status === 404) {
				// Si el usuario no existe, lo creamos
				await createUser();
				setTodos([]);
			}
		} catch (error) {
			console.error("Error obteniendo tareas:", error);
		} finally {
			setLoading(false);
		}
	};

	// useEffect para cargar tareas al iniciar
	useEffect(() => {
		getTodos();
	}, []);

	// Función para agregar una nueva tarea
	const addTodo = async () => {
		if (inputValue.trim() !== "") {
			setLoading(true);
			try {
				const task = {
					label: inputValue.trim(),
					is_done: false
				};

				fetch(`${API_BASE_URL}/todos/${username}`, {
					method: "POST",
					body: JSON.stringify(task),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(resp => {
					console.log(resp.ok); // Será true si la respuesta es exitosa
					console.log(resp.status); // El código de estado 201, 300, 400, etc.
					return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
				})
				.then(data => {
					// Aquí es donde debe comenzar tu código después de que finalice la búsqueda
					console.log(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
					console.log("Tarea agregada exitosamente");
					// Actualizar la lista después de agregar
					getTodos();
					setInputValue(""); // Limpiar el input
					setLoading(false);
				})
				.catch(error => {
					// Manejo de errores
					console.log(error);
					console.error("Error agregando tarea:", error);
					setLoading(false);
				});

			} catch (error) {
				console.error("Error:", error);
				setLoading(false);
			}
		}
	};

	// Función para eliminar una tarea
	const deleteTodo = async (id) => {
		try {
			const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
				method: "DELETE"
			});

			if (response.ok) {
				console.log("Tarea eliminada exitosamente");
				// Actualizar la lista después de eliminar
				await getTodos();
			} else {
				console.error("Error eliminando tarea");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};



	// Función para manejar el evento de presionar Enter
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			addTodo();
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="todo-container">
						{/* Header con usuario actual y botón de cambiar */}
						<div className="d-flex justify-content-between align-items-center mb-4">
							<h1 className="mb-0">todos</h1>
							<div className="text-end">
								<small className="text-muted">Usuario: <strong>{username}</strong></small>
								<br />
								<button 
									className="btn btn-outline-secondary btn-sm mt-1"
									onClick={onBackToUserSelection}
								>
									Cambiar Usuario
								</button>
							</div>
						</div>
						
						{/* Input para agregar tareas */}
						<div className="todo-input-container">
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="What needs to be done?"
								className="form-control todo-input"
								disabled={loading}
							/>
						</div>

						{/* Lista de tareas */}
						<div className="todo-list">
							{loading ? (
								<div className="text-center p-3">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Cargando...</span>
									</div>
								</div>
							) : todos.length === 0 ? (
								<div className="no-tasks">
									No hay tareas, añadir tareas
								</div>
							) : (
								todos.map((todo) => (
									<div key={todo.id} className="todo-item">
										<span className="todo-text">{todo.label}</span>
										<button
											className="delete-btn"
											onClick={() => deleteTodo(todo.id)}
											disabled={loading}
										>
											×
										</button>
									</div>
								))
							)}
						</div>

						{/* Contador de tareas */}
						{todos.length > 0 && (
							<div className="todo-footer">
								<span>{todos.length} item{todos.length !== 1 ? 's' : ''} left</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TodoList;