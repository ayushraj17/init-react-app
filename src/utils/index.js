/**
 * Keeps the order, after 3 there won't be a 5 it auto adjusts the child to 4
 */
export const reOrderList = (items) =>
	items.map((currentItem, index) => {
		const prevItem = items[Math.max(index - 1, 0)];
		// console.log({ currentItem, prevItem });
		if (currentItem.order - prevItem.order > 1) {
			currentItem.order = prevItem.order + 1;
		}
		if (index === 0) {
			currentItem.order = 0;
		}
		if (index === 1) {
			currentItem.order = 1;
		}

		return currentItem;
	});
