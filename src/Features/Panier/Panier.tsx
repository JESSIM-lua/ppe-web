import React, { useCallback, useReducer, useState } from 'react'
import NavigationHeader from '../Navigation/NavigationHeader'
import { useNavigate } from 'react-router'
import style from '../../style/Features/Panier/Panier.module.scss'
import { fetchPost } from '../../services/Fecth.service'
import {} from '../../Models/Worksite'
import { CREATE_CART_QUERY } from '../../constants'
import { Item } from '../../Models/Item'
import { WorksiteBasket } from '../../Models/WorksiteBasket'
import { loadCachedCarts, reducerCart } from '../../Reducer/Reducer'

const Panier: React.FC = () => {
	const navigate = useNavigate()

	const [open, setOpen] = useState(false)
	const [carts, dispatch] = useReducer(reducerCart, loadCachedCarts())

	const removeCart = useCallback(
		(worksiteName: string) => {
			dispatch({ type: 'remove_cart', payload: worksiteName })
		},
		[dispatch, carts]
	)

	const removeItemFromCart = useCallback(
		(item: Item, cartID: string) => {
			if (!item) return
			const cart = Object.values(carts).find((cart) =>
				cart.items.some((i) => i.articleID === item.articleID)
			)

			if (cart) {
				dispatch({
					type: 'remove_item',
					payload: { cartID, item },
				})
			}
		},
		[dispatch, carts]
	)

	const operator = localStorage.getItem('name')

	const handleSubmitIndividual = useCallback(
		async (basket: WorksiteBasket, index: number) => {
			try {
				const response = await fetchPost<
					{ cartId: string },
					{
						newCart: {
							items: Item[]
							worksiteId: string
							cartStatus: string
							date: Date
							operator: string
						}
					}
				>(CREATE_CART_QUERY, {
					newCart: {
						items: basket.scannedProducts,
						worksiteId: basket.worksite._id || '',
						cartStatus: 'PENDING',
						date: new Date(Date.now()),
						operator: operator || 'Sans Nom',
					},
				})
				if (response) {
					setOpen(true)
					console.log(
						'Panier envoyé pour le Site:',
						basket.worksite._id
					)
				}
			} catch (error) {
				console.error(
					"Erreur lors de l'envoi du panier individuel:",
					error
				)
			}
			index = index
		},

		[]
	)

	const worksiteBasketVide = (basket: WorksiteBasket, index: number) => {
		if (basket.scannedProducts.length === 0) {
			alert('Le panier est vide')
		} else {
			handleSubmitIndividual(basket, index)
			removeCart(basket.worksite.name)
		}
	}

	return (
		<div className={style.panierContainer}>
			<div className={style.PanierContainerHeader}>
				<NavigationHeader />
			</div>
			<h2>Paniers à envoyer</h2>
			{Object.entries(carts).map(([key, cart], cartIndex) => (
				<div key={key} className={style.basketContainer}>
					<h3>Site : {cart.worksite.name}</h3>
					<div className={style.basketContainerButton}>
						<button
							onClick={() => removeCart(cart.worksite.name)}
							className={style.deleteButton}
						>
							Supprimer le panier ⛔
						</button>
						{cart.items.length > 0 && (
							<button
								className={style.PanierSubmitSingle}
								onClick={() =>
									worksiteBasketVide(
										{
											worksite: cart.worksite,
											scannedProducts: cart.items,
											operator: cart.operator,
										},
										cartIndex
									)
								}
							>
								Envoyer ce panier 📨
							</button>
						)}
					</div>

					{cart.items && cart.items.length > 0 ? (
						<div className={style.productList}>
							{cart.items.map(
								(item: Item, productIndex: number) => (
									<div
										key={productIndex}
										className={style.productItem}
									>
										<span>{item.articleID}</span>

										{' - '}
										<label>Quantité : </label>
										<span>{item.quantity}</span>

										{' - '}
										<label>À recommander : </label>
										<span>
											{item.isEmpty ? 'Oui' : 'Non'}
										</span>
										<button
											onClick={() =>
												removeItemFromCart(
													item,
													cart.worksite.name
												)
											}
											className={style.deleteButton}
										>
											Supprimer 🗑️
										</button>
									</div>
								)
							)}
						</div>
					) : (
						<p>Aucun produit scanné.</p>
					)}
				</div>
			))}

			<div className={style.PanierContainerFooter}>
				{Object.keys(carts).length > 1 && (
					<button
						onClick={() => {
							Object.entries(carts).forEach(([, cart]) => {
								handleSubmitIndividual(
									{
										worksite: cart.worksite,
										scannedProducts: cart.items,
										operator: cart.operator,
									},
									0
								)
								removeCart(cart.worksite.name)
							})
						}}
						className={style.PanierSubmitAll}
					>
						Tout Envoyer 📩
					</button>
				)}
				<button
					onClick={() => navigate('/scan')}
					className={style.groupSubmitButton}
				>
					Scanner 📸
				</button>
				{open && <p>Panier envoyé avec succès !</p>}
			</div>
		</div>
	)
}

export default Panier
