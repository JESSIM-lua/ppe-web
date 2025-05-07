import React, { useCallback, useEffect, useState } from 'react'
import NavigationHeader from '../Navigation/NavigationHeader'
import { useNavigate } from 'react-router'
import style from '../../style/Features/Panier/Panier.module.scss'
import { fetchPost } from '../../services/Fecth.service'
import {} from '../../Models/Worksite'
import { CREATE_CART_QUERY } from '../../constants'
import { Item } from '../../Models/Item'
import { WorksiteBasket } from '../../Models/WorksiteBasket'

const Panier: React.FC = () => {
	const navigate = useNavigate()
	const [worksiteBaskets, setWorksiteBaskets] = useState<WorksiteBasket[]>(
		() => {
			const stored = sessionStorage.getItem('worksiteBaskets')
			return stored ? JSON.parse(stored) : []
		}
	)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		sessionStorage.setItem(
			'worksiteBaskets',
			JSON.stringify(worksiteBaskets)
		)
	}, [worksiteBaskets])

	const updateProductQuantity = (
		basketIndex: number,
		productIndex: number,
		newQuantity: number
	) => {
		setWorksiteBaskets((prev) => {
			const newBaskets = [...prev]
			newBaskets[basketIndex].scannedProducts[productIndex].quantity =
				newQuantity
			sessionStorage.setItem(
				'worksiteBaskets',
				JSON.stringify(newBaskets)
			)
			return newBaskets
		})
	}

	const deletePanier = (basketIndex: number) => {
		setWorksiteBaskets((prev) => {
			const updated = prev.filter((_, i) => i !== basketIndex)
			sessionStorage.setItem('worksiteBaskets', JSON.stringify(updated))
			return updated
		})
	}

	const deleteItem = (basketIndex: number, productIndex: number) => {
		setWorksiteBaskets((prev) => {
			const newBaskets = [...prev]
			newBaskets[basketIndex] = {
				...newBaskets[basketIndex],
				scannedProducts: newBaskets[basketIndex].scannedProducts.filter(
					(_, index) => index !== productIndex
				),
			}
			sessionStorage.setItem(
				'worksiteBaskets',
				JSON.stringify(newBaskets)
			)
			return newBaskets
		})
	}

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
						}
					}
				>(CREATE_CART_QUERY, {
					newCart: {
						items: basket.scannedProducts,
						worksiteId: basket.worksite._id || '',
						cartStatus: 'PENDING',
						date: new Date(),
					},
				})
				if (response) {
					setOpen(true)
					console.log(
						'Panier envoyé pour le Site:',
						basket.worksite._id
					)
					setWorksiteBaskets((prev) => {
						const updated = prev.filter((_, i) => i !== index)
						sessionStorage.setItem(
							'worksiteBaskets',
							JSON.stringify(updated)
						)
						return updated
					})
				}
			} catch (error) {
				console.error(
					"Erreur lors de l'envoi du panier individuel:",
					error
				)
			}
		},
		[]
	)

	const handleSubmitGroup = useCallback(async () => {
		try {
			for (const basket of worksiteBaskets) {
				await fetchPost<
					{ cartId: string },
					{
						newCart: {
							items: Item[]
							worksiteId: string
							cartStatus: string
							date: Date
						}
					}
				>(CREATE_CART_QUERY, {
					newCart: {
						items: basket.scannedProducts,
						worksiteId: basket.worksite._id || '',
						cartStatus: 'PENDING',
						date: new Date(),
					},
				})
			}
			setOpen(true)
			console.log('Tous les paniers ont été envoyés')
			sessionStorage.removeItem('worksiteBaskets')
			navigate('/scandraft')
		} catch (error) {
			console.error("Erreur lors de l'envoi groupé:", error)
		}
	}, [worksiteBaskets, navigate])

	const worksiteBasketVide = (basket: WorksiteBasket) => {
		if (basket.scannedProducts.length === 0) {
			alert('Le panier est vide')
		} else {
			handleSubmitIndividual(basket, 0)
		}
	}

	return (
		<div className={style.panierContainer}>
			<NavigationHeader />
			<h2>Paniers à envoyer</h2>
			{worksiteBaskets.map((basket, basketIndex) => (
				<div
					key={basket.worksite._id || basketIndex}
					className={style.basketContainer}
				>
					<h3>Site : {basket.worksite.name}</h3>{' '}
					<button
						onClick={() => deletePanier(basketIndex)}
						className={style.deleteButton}
					>
						Supprimer le panier
					</button>
					{basket.scannedProducts &&
					basket.scannedProducts.length > 0 ? (
						<div className={style.productList}>
							{basket.scannedProducts.map(
								(item: Item, productIndex: number) => (
									<div
										key={productIndex}
										className={style.productItem}
									>
										<span>{item.articleID}</span>
										{' - '}
										<label>Quantité : </label>
										<input
											type="number"
											value={item.quantity}
											min={1}
											onChange={(e) =>
												updateProductQuantity(
													basketIndex,
													productIndex,
													parseInt(e.target.value)
												)
											}
										/>
										<button
											onClick={() =>
												deleteItem(
													basketIndex,
													productIndex
												)
											}
											className={style.deleteButton}
										>
											Supprimer
										</button>
									</div>
								)
							)}
						</div>
					) : (
						<p>Aucun produit scanné.</p>
					)}
					<button
						className={style.PanierSubmitSingle}
						onClick={() => worksiteBasketVide(basket)}
					>
						Envoyer ce panier
					</button>
				</div>
			))}
			{worksiteBaskets.length > 1 && (
				<button
					onClick={handleSubmitGroup}
					className={style.groupSubmitButton}
				>
					Envoyer tous les paniers
				</button>
			)}
			{open && <p>Panier envoyé avec succès !</p>}
			<button
				onClick={() => navigate('/scandraft')}
				className={style.continueScanningButton}
			>
				Continuer à scanner
			</button>
		</div>
	)
}

export default Panier
