import React, { useState } from "react";

const TodoList = () => {
	// Estado para almacenar las tareas
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");

	// Función para agregar una nueva tarea
	const addTodo = () => {
		if (inputValue.trim() !== "") {
			const newTodo = {
				id: Date.now(), // ID único basado en timestamp
				text: inputValue.trim()
			};
			setTodos([...todos, newTodo]);
			setInputValue(""); // Limpiar el input
		}
	};

	// Función para eliminar una tarea
	const deleteTodo = (id) => {
		setTodos(todos.filter(todo => todo.id !== id));
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
						<h1 className="text-center mb-4">todos</h1>
						
						{/* Input para agregar tareas */}
						<div className="todo-input-container">
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="What needs to be done?"
								className="form-control todo-input"
							/>
						</div>

						{/* Lista de tareas */}
						<div className="todo-list">
							{todos.length === 0 ? (
								<div className="no-tasks">
									No hay tareas, añadir tareas
								</div>
							) : (
								todos.map((todo) => (
									<div key={todo.id} className="todo-item">
										<span className="todo-text">{todo.text}</span>
										<button
											className="delete-btn"
											onClick={() => deleteTodo(todo.id)}
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
								{todos.length} item{todos.length !== 1 ? 's' : ''} left
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TodoList;