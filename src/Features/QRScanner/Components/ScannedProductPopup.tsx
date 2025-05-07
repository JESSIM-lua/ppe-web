import React, { use, useCallback, useEffect, useState } from 'react'
import { Item } from '../../../Models/Item'
import style from '../../../style/Features/QRScanner/components/ScannedProductPopup.module.scss'
import clsx from 'clsx'
import TrashIcon from '../../../assets/icons/trash.icon'
import RestockIcon from '../../../assets/icons/restock.icon'
import Popup from '../../Popup/Popup'

type DraftPopupProps = {
	item: Item | null
	addItemToCart: (item: Item) => void
	updateItemToCart: (item: Item) => void
	removeItemFromCart: (item: Item) => void
	scannedProducts: Item[]
	closeOnScanSuccessModal: () => void
	isScanned: boolean
	open: boolean
	onClose?: () => void
}

/**
 * Popup qui s'affiche lorsqu'un produit est scanné
 * et permet de choisir sa quantité. Appuyer sur la croix permet d'effacer ou non le produit
 * @param props
 * @returns
 */
const ScannedProductPopup = (props: DraftPopupProps) => {
	const [openDeletedPopup, setOpenDeletedPopup] = useState(false)

	const [isAScannedProduct, setIsAScannedProduct] = useState<boolean>(false)

	const [isRestock, setIsRestock] = useState<boolean>(
		props.item?.isEmpty || false
	)

	const qte = props.scannedProducts.find(
		(product) => product.articleID === props.item!.articleID
	)

	// const [isAScannedProduct, setIsAScannedProduct] = useState<boolean>(false)

	const [openNullValuePopup, setOpenNullValuePopup] = useState(false)
	const closeNullValuePopup = () => setOpenNullValuePopup(false)

	const closeDeletedPopup = () => setOpenDeletedPopup(false)

	const [quantity, setQuantity] = useState<number>(qte?.quantity || 0)

	useEffect(() => {
		setQuantity(qte?.quantity || 0)
	}, [qte?.quantity])

	const handleQuantityChang = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		if (value === '') {
			setQuantity(0)
			return
		}
		const parsedValue = parseInt(value, 10)
		if (!isNaN(parsedValue) && parsedValue >= 0) {
			setQuantity(parsedValue)
		}
	}

	const setCheckBoxTrue = () => {
		const checkbox = document.getElementById(
			'option1'
		) as HTMLInputElement | null
		if (checkbox) {
			checkbox.checked = !checkbox.checked
			setIsRestock(checkbox.checked)
		} else {
			setIsRestock(false)
		}
	}

	const onDelete = () => {
		if (props.item) {
			console.log(
				'deleted item from cart:',
				props.item.articleID,
				'quantity:',
				quantity
			)
			props.removeItemFromCart({
				...props.item,
				quantity: quantity,
				isEmpty: (
					document.getElementById('option1') as HTMLInputElement
				)?.checked,
			})
		}
	}

	useEffect(() => {
		const existentProduct = props.scannedProducts.find(
			(product) => product.articleID === props.item?.articleID
		)
		if (existentProduct) {
			setIsAScannedProduct(true)
		} else {
			setIsAScannedProduct(false)
		}
	}, [props.scannedProducts, props.item?.articleID])

	const onValidate = useCallback(() => {
		if (!props.item) return

		const existingProduct = props.scannedProducts.find(
			(product) =>
				props.item && product.articleID === props.item.articleID
		)

		if (existingProduct && quantity === 0) {
			props.updateItemToCart({
				...props.item,
				quantity: quantity,
				isEmpty: (
					document.getElementById('option1') as HTMLInputElement
				)?.checked,
			})
			setOpenNullValuePopup(true)
		} else if (quantity === 0) {
			props.removeItemFromCart({
				...props.item,
				quantity: quantity,
				isEmpty: (
					document.getElementById('option1') as HTMLInputElement
				)?.checked,
			})
			setOpenNullValuePopup(true)
		} else {
			props.addItemToCart({
				...props.item,
				quantity: quantity,
				isEmpty: (
					document.getElementById('option1') as HTMLInputElement
				)?.checked,
			})
			props.closeOnScanSuccessModal()
		}

		console.log(
			'Checkbox state:',
			(document.getElementById('option1') as HTMLInputElement)?.checked
		)
	}, [quantity, props])

	return (
		<div>
			<Popup
				open={openNullValuePopup}
				closeOnDocumentClick
				onClose={closeNullValuePopup}
				className={style.scannedProductPopupNullValue}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
					}}
				>
					Veuillez Entrer une quantité
					<button onClick={closeNullValuePopup}>fermer</button>
				</div>
			</Popup>

			<Popup
				open={openDeletedPopup}
				closeOnDocumentClick
				onClose={closeDeletedPopup}
				className={style.scannedProductPopupOnDelete}
			>
				<div className={style.closeScannedProductContainer}>
					<p>Êtes-vous sûr de vouloir supprimer cette article?</p>
					<p id="PrScanned">{props.item?.articleID || ''}</p>
					<p id="PrScanned">{quantity}</p>

					<div className={style.closeScannedProductButtons}>
						<button
							onClick={() => {
								setTimeout(() => {
									onDelete()
								}, 500)
								props.onClose?.()
								closeDeletedPopup()
							}}
						>
							Oui
						</button>
						<button
							onClick={closeDeletedPopup}
							className={style.closeScannedProductButtonCancel}
						>
							Non
						</button>
					</div>
				</div>
			</Popup>

			<Popup
				open={props.open}
				closeOnDocumentClick={true}
				onClose={props.onClose || (() => {})}
				className={style.scannedProductPopup}
			>
				<div className={style.scannedProductQuantityButtons}>
					<button
						type="button"
						onClick={() => props.onClose?.()}
						className={clsx(
							style.scannedProductQuantityButton,
							style.deleteQuantity
						)}
					>
						<img
							width="50"
							height="50"
							src="https://img.icons8.com/ios/50/delete-sign--v1.png"
							alt="delete-sign--v1"
						/>
					</button>
				</div>
				<div className={style.scannedProductContainer}>
					<p>Produit Scanné : </p>
					<p id="PrScanned">
						{props.item?.articleID || ''}
						{isAScannedProduct && (
							<p style={{ color: 'red', fontSize: '20px' }}>
								produit Deja scanné
							</p>
						)}
					</p>

					<p>Quantité : </p>
					<div
						className={style.scannedProductQuantityButtonsContainer}
					>
						<input
							type="tel"
							inputMode="numeric"
							pattern="[0-9]*"
							min={1}
							value={quantity || ''}
							onChange={handleQuantityChang}
						/>{' '}
						<button
							onClick={onValidate}
							className={style.scannedProductValidateButton}
						>
							Valider
						</button>
					</div>

					{isAScannedProduct && (
						<button
							type="button"
							onClick={() => setOpenDeletedPopup(true)}
							className={clsx(
								style.scannedProductQuantityButton,
								style.deleteQuantity
							)}
						>
							<TrashIcon />
						</button>
					)}
					{openDeletedPopup && <p>Supprimer </p>}
					<div className={style.scannedProductRecommanderContainer}>
						<div
							className={clsx(
								style.scannedProductRestockContainer,
								isRestock &&
									style.scannedProductRecommanderCheckboxRestock
							)}
							onClick={() => {
								setCheckBoxTrue()
							}}
							style={{ cursor: 'pointer' }}
						>
							<button>Restock</button>
							{/* <RestockIcon /> */}
							<input
								className={
									style.scannedProductRecommanderCheckbox
								}
								type="checkbox"
								id="option1"
								name="options"
								value={props.item?.isEmpty ? 'on' : 'off'}
								readOnly
							/>
						</div>

						<p className={style.scannedProductMinimalistText}>
							Veuillez clicker sur le l'encoche s'il faut
							recommander le produit
						</p>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default ScannedProductPopup
