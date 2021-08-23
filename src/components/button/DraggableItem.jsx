import React from "react";
import { Draggable } from "react-beautiful-dnd";
const DraggableItem = ({ children, data }) => {
	return (
		<Draggable draggableId={data.id} index={data.id}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					{children}
				</div>
			)}
		</Draggable>
	);
};

export default DraggableItem;
