import ItemGhostTS from '../../app/components/shell/bottom-drawer/_ghost/ghost';
import ItemGhost from '../../app/components/shell/bottom-drawer/_ghost/ghost.vue';
import { StickerCount } from '../../app/views/dashboard/stickers/stickers';
import { arrayRemove, numberSort } from '../../utils/array';
import { Api } from '../api/api.service';
import { StickerLayerController } from '../sticker/layer/layer-controller';
import { StickerPlacement } from '../sticker/placement/placement.model';
import { Sticker } from '../sticker/sticker.model';

export const DrawerStoreKey = Symbol('drawer-store');

export interface StickableTarget {
	/** DrawerStore will manually trigger a 'mouseup' event when there's a 'touchend' event that happens above applicable targets. */
	onMouseUp(event?: any): void;
	/** Function to redeem the sticker for placement through the 'targetComponent' in the DrawerStore. */
	onRedeemSticker(): void;
}

export class DrawerStore {
	layers: StickerLayerController[] = [];
	drawerItems: StickerCount[] = [];
	targetComponent: StickableTarget | null = null;
	placedItem: StickerPlacement | null = null;
	sticker: Sticker | null = null;
	ghost: HTMLDivElement | null = null;
	isDrawerOpen = false;
	isDragging = false;
	hasValidTarget = false;
	isHoveringDrawer = false;

	_waitingForFrame = false;
	_onPointerMove: ((event: MouseEvent | TouchEvent) => void) | null = null;
	_onPointerUp: ((event: MouseEvent | TouchEvent) => void) | null = null;

	get activeLayer() {
		// The active layer is always the last to be added to the stack.
		return this.layers[this.layers.length - 1];
	}

	/** Reset the DrawerStore state to their initial values */
	// commented out === handled by function calls
	reset() {
		_removeEventListeners(this);
		_destroyDrawerStoreGhost(this);
		_setDraggingState(this, false);

		this.drawerItems = [];
		this.targetComponent = null;
		this.placedItem = null;
		// this.sticker = null;
		// this.ghost = null;
		this.isDrawerOpen = false;
		// this.isDragging = false;
		this.hasValidTarget = false;
		this.isHoveringDrawer = false;

		this._waitingForFrame = false;
		// this._onPointerMove = null;
		// this._onPointerUp = null;
	}

	commitPlacement() {
		if (!this.placedItem || !this.targetComponent) {
			return;
		}

		this.targetComponent.onRedeemSticker();
	}
}

export function registerStickerLayer(store: DrawerStore, layer: StickerLayerController) {
	store.layers.push(layer);
}

export function unregisterStickerLayer(store: DrawerStore, layer: StickerLayerController) {
	arrayRemove(store.layers, i => i === layer);
}

/**
 * Send an API request to get the user stickers.
 */
async function _initializeDrawerContent(store: DrawerStore) {
	const payload = await Api.sendRequest('/web/stickers/dash');

	store.drawerItems = [];
	for (const stickerCountPayload of payload.stickerCounts) {
		const stickerData = payload.stickers.find(
			(i: Sticker) => i.id === stickerCountPayload.sticker_id
		);

		const stickerCount: StickerCount = {
			count: stickerCountPayload.count,
			sticker_id: stickerCountPayload.sticker_id,
			sticker: new Sticker(stickerData),
		};

		store.drawerItems.push(stickerCount);
	}

	store.drawerItems.sort((a, b) => numberSort(b.sticker.rarity, a.sticker.rarity));
}

/**
 * Toggle the shell drawer, initializing the state when opening or resetting it when closing.
 */
export function toggleShellDrawer(store: DrawerStore) {
	store.isDrawerOpen = !store.isDrawerOpen;

	if (store.isDrawerOpen) {
		_initializeDrawerContent(store);
	} else {
		store.reset();
	}
}

/**
 * Assign the drawer item that we want to use as a ghost item.
 */
export function setDrawerStoreActiveItem(
	store: DrawerStore,
	sticker: Sticker,
	event?: MouseEvent | TouchEvent,
	fromTarget?: boolean
) {
	// JODO: This might feel cleaner by having the drawer set a separate field - not sure yet.
	if (fromTarget) {
		assignDrawerStoreItem(store, null, null);
	}

	if (!sticker || !event) {
		return;
	}

	if (!store.sticker) {
		store.sticker = sticker;

		if (!fromTarget) {
			alterDrawerStoreItemCount(store, sticker, false);
		}
	}

	_createGhostSticker(store, event);
	_addEventListeners(store, _onDragItem(store), _onPlaceItem(store));
}

/**
 * Removes and ghost elements from the document body, and sets 'store.placedItem' as the 'item' parameter.
 */
export function assignDrawerStoreItem(
	store: DrawerStore,
	item: StickerPlacement | null,
	component: StickableTarget | null
) {
	store.placedItem = item;
	store.targetComponent = component;
}

/**
 * Add or subtract from the drawer item count
 */
export function alterDrawerStoreItemCount(
	store: DrawerStore,
	sticker: Sticker,
	returnToDrawer = false
) {
	const drawerItem = store.drawerItems.find(i => {
		return i.sticker.id === sticker.id;
	});

	// This shouldn't ever trigger
	if (!drawerItem) {
		return;
	}

	if (returnToDrawer) {
		drawerItem.count++;
		assignDrawerStoreItem(store, null, null);
		_destroyDrawerStoreGhost(store);
	} else {
		drawerItem.count--;
	}
}

/**
 * Remove the ghost element - triggered when returning an item to the drawer.
 */
function _destroyDrawerStoreGhost(store: DrawerStore) {
	if (store.ghost && document.body.contains(store.ghost)) {
		document.body.removeChild(store.ghost);
	}

	store.sticker = null;
	store.ghost = null;
}

/**
 * Create the ghost item and append it to the document body - updating dragging state and updating the ghost element position.
 */
function _createGhostSticker(store: DrawerStore, event: MouseEvent | TouchEvent) {
	if (!store.sticker) {
		return;
	}

	if (!store.ghost) {
		const component = new ItemGhost({
			propsData: {
				drawerStore: store,
				sticker: store.sticker,
			},
		}) as ItemGhostTS;

		const elem = document.createElement('div');
		document.body.appendChild(elem);
		component.$mount(elem);
		store.ghost = component.$el;
	}

	_setDraggingState(store, true);
	_updateGhostPosition(store, event);
}

/**
 * This gets triggered through '_onDragItem' to calculate the position of the ghost element.
 */
function _updateGhostPosition(store: DrawerStore, event: MouseEvent | TouchEvent) {
	store._waitingForFrame = false;

	if (!store.ghost) {
		return;
	}

	let requiredEvent;
	if (event instanceof MouseEvent) {
		requiredEvent = event;
	}

	if (event instanceof TouchEvent) {
		requiredEvent = event.changedTouches[0];
	}

	if (!requiredEvent) {
		return;
	}

	store.ghost.style.left = `${requiredEvent.pageX - store.ghost.clientWidth / 2}px`;
	store.ghost.style.top = `${requiredEvent.pageY - store.ghost.clientHeight / 2}px`;

	if (requiredEvent.clientY > window.innerHeight - 64) {
		store.isHoveringDrawer = true;
	} else {
		store.isHoveringDrawer = false;
	}
}

/**
 * 'Move' events for both mouse and touch.
 */
const _onDragItem = (store: DrawerStore) => (event: MouseEvent | TouchEvent) => {
	if (!store._waitingForFrame) {
		store._waitingForFrame = true;
		window.requestAnimationFrame(() => _updateGhostPosition(store, event));
	}
};

/**
 * 'Up' or 'End' events for both mouse and touch.
 */
const _onPlaceItem = (store: DrawerStore) => (event: MouseEvent | TouchEvent) => {
	if (store.isHoveringDrawer && store.sticker) {
		alterDrawerStoreItemCount(store, store.sticker, true);
		_removeEventListeners(store);
		return;
	}

	let clientX: number | null = null;
	let clientY: number | null = null;

	if (event instanceof MouseEvent) {
		clientX = event.clientX;
		clientY = event.clientY;
	}
	if (event instanceof TouchEvent) {
		clientX = event.changedTouches[0].clientX;
		clientY = event.changedTouches[0].clientY;
	}

	if (clientX === null || clientY === null) {
		return;
	}

	let shouldContinue = true;
	store.activeLayer.targets.forEach(i => {
		if (!shouldContinue) {
			return;
		}

		// JODO: Make better
		const { x, y, width, height } = i.$el.getBoundingClientRect();

		if (
			clientX! - x < width &&
			clientY! - y < height &&
			clientX! - x > 0 &&
			clientY! - y > 0 //
		) {
			i.onMouseUp();
			shouldContinue = false;
		}
	});

	_removeEventListeners(store);
};

/**
 * Set the 'isDragging' field of the DrawerStore, as well as add/remove classes from the document body.
 */
function _setDraggingState(store: DrawerStore, isDragging: boolean) {
	if (!store.ghost) {
		store.isDragging = false;
	} else {
		store.isDragging = isDragging;
	}

	if (isDragging) {
		document.body.classList.add('grabbing');
	} else {
		document.body.classList.remove('grabbing');
	}
}

/**
 * Add the required 'mouse[move/up]' and 'touch[move/end]' event listeners to the window to handle ghost element placement.
 */
function _addEventListeners(
	store: DrawerStore,
	onPointerMove: (event: MouseEvent | TouchEvent) => void,
	onPointerUp: (event: MouseEvent | TouchEvent) => void
) {
	store._onPointerMove = onPointerMove;
	store._onPointerUp = onPointerUp;

	window.addEventListener('mousemove', onPointerMove, {
		capture: false,
	});
	window.addEventListener('mouseup', onPointerUp, {
		capture: false,
	});
	window.addEventListener('touchmove', onPointerMove, {
		capture: false,
	});
	window.addEventListener('touchend', onPointerUp, {
		capture: false,
	});
}

/**
 * Remove any event listeners that were added to the window to handle the ghost element movement.
 */
function _removeEventListeners(store: DrawerStore) {
	_setDraggingState(store, false);

	if (store._onPointerMove) {
		window.removeEventListener('mousemove', store._onPointerMove, {
			capture: false,
		});
		window.removeEventListener('touchmove', store._onPointerMove, {
			capture: false,
		});
	}

	if (store._onPointerUp) {
		window.removeEventListener('mouseup', store._onPointerUp, {
			capture: false,
		});
		window.removeEventListener('touchend', store._onPointerUp, {
			capture: false,
		});
	}

	store._onPointerMove = null;
	store._onPointerUp = null;
}
