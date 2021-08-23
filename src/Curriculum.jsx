import React from "react";
import { useEffect } from "react";
import { useState } from "react";
// import List from "./mock/list";
import styles from "./styles/app.module.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// Icons
import { ReactComponent as ArrowLeftIcon } from "./assets/icons/arrow-left-line.svg";
import { ReactComponent as ArrowRightIcon } from "./assets/icons/arrow-right-line.svg";
import { ReactComponent as DeleteIcon } from "./assets/icons/delete-bin-line.svg";
import { ReactComponent as DragIcon } from "./assets/icons/drag-move-2-fill.svg";
import { reOrderList } from "./utils";

const MoveButton = (props) => {
	return (
		<button {...props}>
			<DragIcon />
		</button>
	);
};

const DeleteButton = (props) => {
	return (
		<button {...props}>
			<DeleteIcon />
		</button>
	);
};

const IndentLeftButton = (props) => {
	return (
		<button {...props}>
			<ArrowLeftIcon />
		</button>
	);
};

const IndentRightButton = (props) => {
	return (
		<button {...props}>
			<ArrowRightIcon />
		</button>
	);
};

const Curriculum = () => {
	const [list, setList] = useState(list2);

	const getClosestItemToLeft = (id) =>
		Math.max(...list.map((item) => item.id).filter((prevId) => prevId < id));

	const disableRightIndent = (id, index) => {
		let result = false;
		if (index === 0) {
			result = true;
		}
		let closestItemToLeft = getClosestItemToLeft(id);
		if (list.find((item) => item.id === closestItemToLeft)) {
			result =
				list.find((item) => item.id === closestItemToLeft).order + 1 ===
				list.find((item) => item.id === id).order;
		}

		return result;
	};

	// /**
	//  * Keeps the order, after 3 there won't be a 5 it auto adjusts the child to 4
	//  */
	// const reOrderList = (items) =>
	// 	items.map((currentItem, index) => {
	// 		const prevItem = list[Math.max(index - 1, 0)];
	// 		// console.log({ currentItem, prevItem });
	// 		if (currentItem.order - prevItem.order > 1) {
	// 			currentItem.order = prevItem.order + 1;
	// 		}
	// 		return currentItem;
	// 	});

	const [dragId, setDragId] = useState(null);

	const renderListItems = (items, className) =>
		reOrderList(items).map((item, index) => (
			<div
				className={className ? className : styles.parent}
				draggable={item.id === dragId}
				style={{
					paddingLeft: `calc(${item.order}rem + 12rem )`,
				}}
				key={item.id}
			>
				<div className={styles.actions}>
					<MoveButton onClick={() => setDragId(item.id)} />
					<DeleteButton onClick={() => handleDelete(item.id)} />
					<IndentLeftButton
						onClick={() => handleIndentLeft(item.id)}
						disabled={item.order === 0}
					/>
					<IndentRightButton
						onClick={() => handleIndentRight(item.id)}
						disabled={disableRightIndent(item.id, index)}
					/>
				</div>
				{item.order}
				<input value={item.value} id={item.id} onChange={handleInputChange} />
			</div>
		));

	// const handleMove = () => {

	const handleIndentLeft = (id) =>
		setList(
			list.map((item) => {
				if (item.id === id) {
					item.order--;
					return item;
				}
				return item;
			})
		);

	const handleIndentRight = (id) =>
		setList(
			list.map((item) => {
				if (item.id === id) {
					item.order++;
					return item;
				}
				return item;
			})
		);

	const handleDelete = (id) => {
		const itemToDelete = list.find((item) => item.id === id);
		const indexOfItemToDelete = list.indexOf(itemToDelete);

		let index = 0;
		let finalList = list;
		// Deleting the child if/any
		while (index < list.length) {
			if (index > indexOfItemToDelete) {
				const item = list[index];

				if (item.order > itemToDelete.order) {
					// console.log(item, "if");
					finalList = finalList.filter((listItem) => listItem.id !== item.id);
				} else {
					// console.log(item, "else");
					break;
				}
			}
			index++;
		}

		// Deleting the item itself
		setList(finalList.filter((listItem) => listItem.id !== itemToDelete.id));
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
			{list.length}
			{renderListItems(list)}
		</div>
	);
};

export default Curriculum;

export const list2 = [
	{
		id: 5,
		value: "Netflix and chill",
		parent: undefined,
		order: 0,
	},
	{
		id: 6,
		value: "Read a book",
		parent: undefined,
		order: 0,
	},

	{
		id: 7,
		value: "Turn a page",
		// parent: 6,
		order: 1,
	},
	{
		id: 8,
		value: "Make Summary",
		// parent: 6,
		order: 1,
	},
	{
		id: 9,
		value: "Pick up marker",
		// parent: 8,
		order: 2,
	},

	{
		id: 10,
		value: "Scribble",
		// parent: 9,
		order: 3,
	},

	{
		id: 11,
		value: "Dot",
		order: 1,
		// parent: 9,
	},
	{
		id: 12,
		value: "yellow",
		order: 2,
		// parent: 11,
	},
	{
		id: 13,
		value: "red",
		order: 1,
		// parent: 11,
	},
];

// const handleDeleted = (id) => {
// 	const itemToDelete = list.find((item) => item.id === id);
// 	const indexOfItemToDelete = list.indexOf(itemToDelete);

// 	// Get all the possible orders in list
// 	const existingPossibleOrders = [
// 		...new Set(list.map((item) => item.order).sort((a, b) => a - b)),
// 	];

// 	/**
// 	 * We are trying to determine until which element to slice
// 	 */
// 	let firstElementIndex = list.findIndex(
// 		(item, index) =>
// 			item.order === itemToDelete.order && index > indexOfItemToDelete
// 	);
// 	/**
// 	 * Order
// 	 * [1,1,2,3,4,1]
// 	 *            ^
// 	 * Math.sign(currentItem(4) - nextItem(1)) = -1 bingo!
// 	 */
// 	if (firstElementIndex === -1) {
// 		existingPossibleOrders.forEach((order) => {
// 			if (order >= itemToDelete.order) {
// 				firstElementIndex =
// 					list.findIndex((currentItem, index) => {
// 						const nextItem = list[Math.min(index + 1, list.length - 1)];
// 						// console.log({ currentItem, nextItem });
// 						return Math.sign(nextItem.order - currentItem.order) === -1;
// 					}) - 1;
// 			}
// 		});
// 	}

// 	console.log(firstElementIndex);
// 	// No Children
// 	// if (firstElementIndex <= -2 || !firstElementIndex) {
// 	// 	return setList((list) => list.filter((item) => item.id !== id));
// 	// }

// 	const newList = [...list];
// 	newList.splice(
// 		indexOfItemToDelete,
// 		firstElementIndex - indexOfItemToDelete
// 	);
// 	// console.log(newList);
// 	// console.log(list[firstElementIndex]);
// 	// console.log({
// 	// 	firstElementIndex,
// 	// 	indexOfItemToDelete,
// 	// 	// updatedList,
// 	// 	itemToDelete,
// 	// });
// 	// return setList(newList);

// 	// console.log({
// 	// 	firstElementIndex,
// 	// 	indexOfItemToDelete,
// 	// 	// updatedList,
// 	// 	itemToDelete,
// 	// });
// 	// setList((list) => list.filter((item) => item.id !== id));
// 	// const itemToDelete = list.find((item) => item.id === id)
// 	// Math.max(...new Set(list.map((item) => item.order))]
// };
