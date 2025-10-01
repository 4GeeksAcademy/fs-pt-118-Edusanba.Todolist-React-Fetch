import React, { useState, useEffect } from "react";

const UserSelector = ({ onUserSelect }) => {
	const [users, setUsers] = useState([]);
	const [userTasks, setUserTasks] = useState({});
	const [selectedUser, setSelectedUser] = useState("");
	const [newUserName, setNewUserName] = useState("");
	const [loading, setLoading] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	
	const API_BASE_URL = "https://playground.4geeks.com/todo";

	// Función para obtener las tareas de un usuario específico
	const getUserTasks = async (username) => {
		try {
			const response = await fetch(`${API_BASE_URL}/users/${username}`);
			if (response.ok) {
				const data = await response.json();
				return data.todos || [];
			}
		} catch (error) {
			console.error(`Error obteniendo tareas de ${username}:`, error);
		}
		return [];
	};

	// Función para obtener todos los usuarios y sus tareas
	const getUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_BASE_URL}/users`);
			
			if (response.ok) {
				const data = await response.json();
				console.log("Usuarios obtenidos:", data);
				const usersList = data.users || [];
				setUsers(usersList);

				// Obtener tareas para cada usuario
				const tasksPromises = usersList.map(async (user) => {
					const tasks = await getUserTasks(user.name);
					return { username: user.name, tasks };
				});

				const tasksResults = await Promise.all(tasksPromises);
				const tasksMap = {};
				tasksResults.forEach(({ username, tasks }) => {
					tasksMap[username] = tasks;
				});
				setUserTasks(tasksMap);
			} else {
				console.error("Error obteniendo usuarios:", response.status);
				setUsers([]);
				setUserTasks({});
			}
		} catch (error) {
			console.error("Error:", error);
			setUsers([]);
			setUserTasks({});
		} finally {
			setLoading(false);
		}
	};

	// Función para crear un nuevo usuario
	const createUser = async () => {
		if (newUserName.trim() === "") {
			alert("Por favor ingresa un nombre de usuario");
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(`${API_BASE_URL}/users/${newUserName.trim()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});
			
			if (response.ok) {
				console.log("Usuario creado exitosamente");
				setNewUserName("");
				setShowCreateForm(false);
				// Actualizar la lista de usuarios
				await getUsers();
				// Seleccionar automáticamente el nuevo usuario
				setSelectedUser(newUserName.trim());
				onUserSelect(newUserName.trim());
			} else if (response.status === 400) {
				alert("El usuario ya existe");
			} else {
				console.error("Error creando usuario:", response.status);
				alert("Error creando usuario");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Error de conexión");
		} finally {
			setLoading(false);
		}
	};

	// Cargar usuarios al montar el componente
	useEffect(() => {
		getUsers();
	}, []);

	// Manejar selección de usuario
	const handleUserSelect = (username) => {
		setSelectedUser(username);
		onUserSelect(username);
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card">
						<div className="card-header">
							<h3 className="text-center mb-0">Seleccionar Usuario</h3>
						</div>
						<div className="card-body">
							{loading ? (
								<div className="text-center p-3">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Cargando...</span>
									</div>
								</div>
							) : (
								<>
									{/* Lista de usuarios existentes */}
									{users.length > 0 && (
										<div className="mb-4">
											<h5>Usuarios Existentes:</h5>
											<div className="list-group">
												{users.map((user) => (
													<button
														key={user.id}
														className={`list-group-item list-group-item-action ${
															selectedUser === user.name ? 'active' : ''
														}`}
														onClick={() => handleUserSelect(user.name)}
													>
														<div className="d-flex justify-content-between align-items-center">
															<span>{user.name}</span>
															<span className="badge bg-secondary">
																{userTasks[user.name] ? userTasks[user.name].length : 0} tareas
															</span>
														</div>
													</button>
												))}
											</div>
										</div>
									)}

									{/* Botón para mostrar formulario de crear usuario */}
									{!showCreateForm && (
										<div className="text-center">
											<button
												className="btn btn-primary"
												onClick={() => setShowCreateForm(true)}
											>
												Crear Nuevo Usuario
											</button>
										</div>
									)}

									{/* Formulario para crear nuevo usuario */}
									{showCreateForm && (
										<div className="mt-3">
											<h5>Crear Nuevo Usuario:</h5>
											<div className="input-group mb-3">
												<input
													type="text"
													className="form-control"
													placeholder="Nombre de usuario"
													value={newUserName}
													onChange={(e) => setNewUserName(e.target.value)}
													onKeyPress={(e) => e.key === "Enter" && createUser()}
												/>
												<button
													className="btn btn-success"
													onClick={createUser}
													disabled={loading || newUserName.trim() === ""}
												>
													Crear
												</button>
											</div>
											<button
												className="btn btn-secondary btn-sm"
												onClick={() => {
													setShowCreateForm(false);
													setNewUserName("");
												}}
											>
												Cancelar
											</button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSelector;