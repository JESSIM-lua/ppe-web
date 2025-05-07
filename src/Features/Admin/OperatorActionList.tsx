import { Cart } from '../../Models/Cart'
import style from '../../style/Features/Admin/OperatorActionList.module.scss'
import { Item } from '../../Models/Item'
import { useCallback, useState } from 'react'
import { exportToCSV } from '../../services/ExportCSV.service'
import { fetchPost } from '../../services/Fecth.service'
import { UPDATE_CART_QUERY } from '../../constants'

type BasketListProps = {
	data: Cart[]
	handleDelete: (rep: Cart) => void
	handleChangeStatus: (rep: Cart) => void
	actionVerifText: string
	refetchData?: () => void
}

const doChangeEtat = async (rep: Cart) => {
	const response = await fetchPost(UPDATE_CART_QUERY, {
		cartData: {
			_id: rep._id,
			cartStatus: 'EXPORTED',
		},
		cartStatuses: ['PENDING', 'ARCHIVED'],
	})
	if (response) {
		console.log('Cart status updated successfully')
	} else {
		console.error('Failed to update cart status')
	}
}

const animateRow = (rowId: string, color: string, time: number) => {
	const rowElement = document.getElementById(rowId)
	if (rowElement) {
		let originalColor = rowElement.style.backgroundColor
		rowElement.style.backgroundColor = `${color}`
		rowElement.style.transition = 'background-color 1s ease-in-out'
		rowElement.style.color = 'white'

		setTimeout(() => {
			rowElement.style.backgroundColor = originalColor
		}, time)
	}
}

const OperatorActionList = (props: BasketListProps) => {
	const [listToExport, setListToExport] = useState<Cart[]>([])

	const addCart = (cartToAdd: Cart) => {
		setListToExport((previousSelectedCarts) => [
			...previousSelectedCarts,
			cartToAdd,
		])
	}

	const removeCartList = (cartToRemove: Cart) =>
		setListToExport((previousSelectedCarts) =>
			previousSelectedCarts.filter(
				(cart) => cart._id !== cartToRemove._id
			)
		)

	const removeCart = (cartToRemove: Cart) => {
		animateRow(cartToRemove._id ?? 'unknown-id', '#e36588', 1000)
		setTimeout(() => {
			props.handleDelete(cartToRemove)
			setListToExport((previousSelectedCarts) =>
				previousSelectedCarts.filter(
					(cart) => cart._id !== cartToRemove._id
				)
			)
		}, 1200)
	}

	const changeStatusOfSelectedCarts = useCallback(() => {
		let i = 0
		listToExport.forEach((cart, index) => {
			animateRow(cart._id ?? 'unknown-id', '#99edcc', 1000 + i * 500)
			i += 1
			setTimeout(() => {
				props.handleChangeStatus(cart)
			}, index * 1200)
		})
	}, [listToExport, props.refetchData])

	const changeStatusOfAllCarts = useCallback(() => {
		let i = 0
		props.data.forEach((cart) => {
			animateRow(cart._id ?? 'unknown-id', '#99edcc', 1000 + i * 500)
			i += 1
		})
		props.data.forEach((cart, index) => {
			setTimeout(() => {
				props.handleChangeStatus(cart)
			}, 600 * index + 1100)
		})
	}, [props.data, props.refetchData])

	const exportAllSelectedCarts = useCallback(() => {
		listToExport.forEach((cart) => {
			animateRow(cart._id ?? 'unknown-id', '#db967d', 1000)
		})
		setTimeout(() => {
			const groupedByWorksite = listToExport.reduce<
				Record<string, Item[]>
			>((groups, currentCart) => {
				const worksiteName = currentCart.worksite.name || 'Sans Nom'
				if (!groups[worksiteName]) {
					groups[worksiteName] = []
				}
				groups[worksiteName].push(...currentCart.items)
				return groups
			}, {})

			Object.entries(groupedByWorksite).forEach(
				([worksiteName, items], index) => {
					setTimeout(() => {
						exportToCSV(items, (worksiteName ?? 'no-name') + '.txt')
						listToExport.forEach((cart) => doChangeEtat(cart))
						props.refetchData?.()
					}, index * 500)
				}
			)
		}, 2000)
	}, [listToExport, props.refetchData])

	const singleExport = useCallback(
		(cart: Cart) => {
			animateRow(cart._id ?? 'unknown-id', '#db967d', 1000)

			setTimeout(() => {
				const allItems = cart.items.map((prod: Item) => ({
					articleID: prod.articleID,
					quantity: prod.quantity,
					isEmpty: prod.isEmpty,
				}))

				doChangeEtat(cart).then(() => {
					props.refetchData?.()
				})

				exportToCSV(allItems, 'no-name' + '.txt')
			}, 1400)
		},
		[props]
	)

	const handleExportAll = (carts: Cart[]) => {
		let i = 0
		carts.forEach((cart) => {
			animateRow(cart._id ?? 'unknown-id', '#db967d', 1000 + i * 500)
			i += 1
		})
		setTimeout(() => {
			const groupedByWorksite = props.data.reduce<Record<string, Item[]>>(
				(groups, currentCart) => {
					const worksiteName = currentCart.worksite.name || 'Sans Nom'
					if (!groups[worksiteName]) {
						groups[worksiteName] = []
					}
					groups[worksiteName].push(...currentCart.items)
					return groups
				},
				{}
			)

			Object.entries(groupedByWorksite).forEach(
				([worksiteName, items], index) => {
					setTimeout(() => {
						exportToCSV(items, (worksiteName ?? 'no-name') + '.txt')
						props.data.forEach((cart) => doChangeEtat(cart))
						props.refetchData?.()
					}, index * 500)
				}
			)
		}, 2000)
	}

	return (
		<div className={style.operatorActionContainer}>
			<div className={style.operatorActionButtonsContainer}>
				{listToExport.length > 0 && (
					<>
						<button
							className={
								style.operatorActionListArrayItemVerifierButton
							}
							onClick={() => {
								changeStatusOfSelectedCarts()
								props.refetchData?.()
							}}
						>
							Validér les Sélectionnés
						</button>
						<button
							className={
								style.operatorActionListArrayItemExportButton
							}
							onClick={() => {
								exportAllSelectedCarts()
								props.refetchData?.()
							}}
						>
							Exporter les Sélectionnés
						</button>
					</>
				)}
				{props.data.length > 0 && (
					<>
						<button
							className={
								style.operatorActionListArrayItemVerifierButton
							}
							onClick={() => {
								changeStatusOfAllCarts()
								props.refetchData?.()
							}}
						>
							Tout Valider
						</button>
						<button
							className={
								style.operatorActionListArrayItemExportButton
							}
							onClick={() => {
								handleExportAll(props.data)
								props.refetchData?.()
							}}
						>
							Tout Exporter
						</button>
					</>
				)}
			</div>

			<table className={style.operatorActionListArrayContainer}>
				<thead>
					<tr className="">
						<th>Site</th>
						<th>Operateur</th>
						<th>Produits</th>
						<th>Date</th>
						<th>Etat</th>
						<th>actions</th>
					</tr>
				</thead>
				<tbody>
					{props.data.map((rep: Cart) => (
						<tr key={rep._id} id={rep._id}>
							<td>{rep.worksite?.name ?? 'N/A'}</td>
							<td>{rep.operator ?? 'N/A'}</td>
							<td>
								{Array.isArray(rep.items) ? (
									<ul>
										{rep.items.map((prod: Item) => (
											<li>
												{prod.articleID} - qte:
												{prod.quantity}
												{' - '}À recommander:
												{prod.isEmpty ? 'Oui' : 'Non'}
											</li>
										))}
									</ul>
								) : (
									'N/A'
								)}
							</td>
							<td>
								{rep.date &&
								!isNaN(new Date(rep.date).getTime())
									? new Date(rep.date).toLocaleString('fr-FR')
									: 'Date invalide'}
							</td>
							<td>
								<p
									className={
										style.operatorActionListCartState
									}
								>
									{rep.cartStatus === 'PENDING'
										? '🆕'
										: rep.cartStatus === 'ARCHIVED'
										? '💾'
										: rep.cartStatus === 'EXPORTED'
										? '🚧'
										: rep.cartStatus}
								</p>
							</td>
							<td
								className={
									style.operatorActionListArrayActionContainer
								}
							>
								<button
									className={
										style.operatorActionListArrayItemDeleteButton
									}
									onClick={() => {
										removeCart(rep)
										props.refetchData?.()
									}}
								>
									Supprimer
								</button>
								<button
									className={
										style.operatorActionListArrayItemExportButton
									}
									onClick={() => {
										singleExport(rep)
										props.refetchData?.()
									}}
								>
									exporter en CSV
								</button>
								<button
									className={
										style.operatorActionListArrayItemVerifierButton
									}
									onClick={() => {
										props.handleChangeStatus(rep)
										props.refetchData?.()
									}}
								>
									{props.actionVerifText}
								</button>

								<input
									key={rep._id}
									type="checkbox"
									onChange={(e) => {
										if (e.target.checked) {
											addCart(rep)
											console.log(listToExport)
										} else {
											removeCartList(rep)
											console.log(listToExport)
										}
									}}
									className={
										style.operatorActionListArrayItemCheckbox
									}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default OperatorActionList
