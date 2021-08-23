import React from "react";
import { useState } from "react";
// import List from "./mock/list";
import styles from "./styles/app.module.css";

const MoveButton = ({ onClick }) => {
	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M18 11V8l4 4-4 4v-3h-5v5h3l-4 4-4-4h3v-5H6v3l-4-4 4-4v3h5V6H8l4-4 4 4h-3v5z" />
		</svg>
	);
};

const DeleteButton = ({ onClick }) => {
	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
		>
			<title>Delete</title>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" />
		</svg>
	);
};

const IndentLeftButton = ({ onClick }) => {
	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" />
		</svg>
	);
};

const IndentRightButton = ({ onClick }) => {
	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
		</svg>
	);
};

const ACTIONS = [MoveButton, IndentLeftButton, IndentRightButton, DeleteButton];

const App = () => {
	const [list, setList] = useState(list2);

	const renderParentChildren = (id) => {
		const childrens = list
			.filter((item) => !isNaN(item.parent))
			.filter((item) => item.parent === id);

		if (childrens.length === 0) return;

		return renderListItems(childrens, styles.children);
	};

	const renderListItems = (items, className) =>
		items.map((item) => (
			<div className={className ? className : styles.parent} key={item.id}>
				<div className={styles.actions}>
					<DeleteButton onClick={() => handleDelete(item)} />
					<IndentLeftButton onClick={() => handleIndentLeft(item)} />
					<IndentRightButton onClick={() => handleIndentRight(item)} />
				</div>
				{item.id}
				<input value={item.value} id={item.id} onChange={handleInputChange} />
				{renderParentChildren(item.id)}
			</div>
		));

	const handleIndentLeft = (itemToBeIndented) => {
		setList((prevState) => {
			const parentItem = prevState
				// .slice()
				// .reverse()
				.find((item) => item.id === itemToBeIndented?.parent);

			return prevState.map((item) => {
				if (item.id === itemToBeIndented.id) {
					itemToBeIndented.parent = parentItem?.parent;
				}
				return item;
			});
		});
	};

	const handleIndentRight = (itemToBeIndented) => {
		setList((prevState) => {
			let closest = Math.max(
				...prevState
					.map((item) => item.id)
					.filter((id) => id < itemToBeIndented.id)
			);
			console.log({ closest, item: itemToBeIndented.id });

			const sibling = prevState
				// .slice()
				// .reverse()
				.find((item) => item.id === closest);
			// .find((item) => item.parent === itemToBeIndented?.parent);
			// .filter((item) => item.id !== itemToBeIndented.id)

			console.log(JSON.stringify({ sibling }, null, 2));
			console.log(JSON.stringify({ itemToBeIndented }, null, 2));

			// if (sibling.parent === itemToBeIndented.parent) {
			//   console.log("same parent");
			//   prevState.map((item))
			// }

			return prevState.map((item) => {
				if (item.id === itemToBeIndented.id) {
					if (sibling.id !== item.id) {
						console.log("no parent");
						itemToBeIndented.parent = sibling?.parent ?? sibling.id;
					}
					if (
						!isNaN(sibling.parent) &&
						!isNaN(itemToBeIndented.id) &&
						sibling.parent === itemToBeIndented.parent
					) {
						console.log("same parent");
						// itemToBeIndented.parent = sibling.id;
					}
				}
				return item;
			});
		});
	};

	const handleDelete = (itemToDeleted) => {
		setList((prevState) =>
			prevState.filter((item) => item.id !== itemToDeleted.id)
		);

		const childrens = list.filter((item) => item.parent === itemToDeleted.id);

		if (childrens.length) {
			childrens.map((item) => handleDelete(item));
		}
	};

	const handleInputChange = (e) => {
		const id = e.target.id;
		const value = e.target.value;

		setList((prevState) => {
			return prevState.map((item) => {
				if (item.id === Number(id)) {
					item.value = value;
					return item;
				}
				return item;
			});
		});
	};

	return (
		<div className={styles.root} id="root">
			<button onClick={() => setList(list2)}>reset</button>
			{renderListItems(list.filter((item) => item.parent === undefined))}
		</div>
	);
};

export default App;

const list2 = [
	// {
	// 	id: 1,
	// 	value: "Read some news",
	// },
	// {
	// 	id: 2,
	// 	value: "Go out for a walk",
	// },
	// {
	// 	id: 3,
	// 	value: "Do some exercise",
	// },
	// {
	// 	id: 4,
	// 	value: "Watch tutorials on YouTube",
	// },
	{
		id: 5,
		value: "Netflix and chill",
		// parent: undefined,
	},
	{
		id: 6,
		value: "Read a book",
		// parent: undefined,
	},

	{
		id: 7,
		value: "Turn a page",
		// parent: 6,
	},
	{
		id: 8,
		value: "Make Summary",
		// parent: 6,
	},
	{
		id: 9,
		value: "Pick up marker",
		// parent: 8,
	},
	{
		id: 10,
		value: "Scribble",
		// parent: 9,
	},
	{
		id: 11,
		value: "Dot",
		// parent: 9,
	},
	{
		id: 12,
		value: "yellow",
		// parent: 11,
	},
	{
		id: 13,
		value: "red",
		// parent: 11,
	},
];
