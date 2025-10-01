import React, { useState } from "react";
import TodoList from "./TodoList";
import UserSelector from "./UserSelector";

const Home = () => {
	const [selectedUser, setSelectedUser] = useState(null);

	const handleUserSelect = (username) => {
		setSelectedUser(username);
	};

	const handleBackToUserSelection = () => {
		setSelectedUser(null);
	};

	return (
		<div>
			{selectedUser ? (
				<TodoList 
					username={selectedUser} 
					onBackToUserSelection={handleBackToUserSelection}
				/>
			) : (
				<UserSelector onUserSelect={handleUserSelect} />
			)}
		</div>
	);
};

export default Home;