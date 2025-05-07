import { Worksite } from './Worksite'
import { Item } from './Item'

export interface WorksiteBasket {
	worksite: Worksite
	scannedProducts: Item[]
	operator?: string
}
