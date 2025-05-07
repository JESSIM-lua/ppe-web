import { Cart } from '../Models/Cart'
import { Item } from '../Models/Item'
import { Worksite } from '../Models/Worksite'

type CartActionType =
	| 'add_cart'
	| 'remove_cart'
	| 'clear_cart'
	| 'add_item'
	| 'remove_item'
	// | 'update_item'
	| 'set_carts'

type CartState = Record<string, Cart>

// type AddCartAction = {
// 	type: 'add_cart'
// 	payload: Cart
// }

interface defaultCartAction {
	type: CartActionType
	payload?: unknown
}
interface AddCartAction extends defaultCartAction {
	type: 'add_cart'
	payload: Worksite
}

interface SetCartsAction extends defaultCartAction {
	type: 'set_carts'
	payload: Record<string, { items: Item[] }>
}

interface RemoveCartAction extends defaultCartAction {
	type: 'remove_cart'
	payload: string
}
interface ClearCartAction extends defaultCartAction {
	type: 'clear_cart'
	payload: string
}
interface AddItemToCartAction extends defaultCartAction {
	type: 'add_item'
	payload: { cartID: string; item: Item }
}
interface RemoveItemToCartAction extends defaultCartAction {
	type: 'remove_item'
	payload: { cartID: string; item: Item }
}
// interface UpdateItemToCartAction extends defaultCartAction {
// 	type: 'update_item'
// 	payload: { cartID: string; item: Item }
// }

type CartAction =
	| AddCartAction
	| RemoveCartAction
	| ClearCartAction
	| AddItemToCartAction
	| RemoveItemToCartAction
	// | UpdateItemToCartAction
	| SetCartsAction

export const reducerCart = (
	state: CartState,
	action: CartAction
): CartState => {
	switch (action.type) {
		case 'remove_cart':
			const { [action.payload]: removedCart, ...rest } = state
			sessionStorage.setItem('worksiteBaskets', JSON.stringify(rest))
			return rest
		case 'clear_cart':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					items: [],
				},
			}
		case 'add_cart':
			return {
				...state,
				[action.payload.name]: {
					items: [],
					worksite: action.payload,
					cartStatus: 'PENDING',
					date: new Date(),
				},
			}
		case 'add_item':
			const newCart = {
				...state[action.payload.cartID],
				items: state[action.payload.cartID].items.filter(
					(item) => item.articleID !== action.payload.item.articleID
				),
			}

			newCart.items.push(action.payload.item)
			const newState = {
				...state,
				[action.payload.cartID]: newCart,
			}
			sessionStorage.setItem('worksiteBaskets', JSON.stringify(newState))
			return newState

		case 'remove_item':
			const updatedCart = {
				...state[action.payload.cartID],
				items: state[action.payload.cartID].items.filter(
					(item) => item.articleID !== action.payload.item.articleID
				),
			}

			const updatedState = {
				...state,
				[action.payload.cartID]: updatedCart,
			}

			sessionStorage.setItem(
				'worksiteBaskets',
				JSON.stringify(updatedState)
			)
			return updatedState

		case 'set_carts':
			return {
				...state,
				...Object.entries(action.payload).reduce(
					(acc, [key, value]) => {
						acc[key] = {
							...value,
							cartStatus: 'PENDING',
							date: new Date(),
							worksite: state[key]?.worksite || null,
						}
						return acc
					},
					{} as CartState
				),
			}
		default:
			return state
	}
}

export const cacheCarts = (state: CartState) => {
	sessionStorage.setItem('worksiteBaskets', JSON.stringify(state))
}
export const loadCachedCarts = (): Record<string, Cart> => {
	const carts = sessionStorage.getItem('worksiteBaskets')
	if (carts) {
		return JSON.parse(carts)
	}
	return {}
}
