import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

import { IDetectedBarcode } from '@yudiel/react-qr-scanner/dist/types'
import ChantierPopup from './Components/ChantierPopup'
import ScannedProductPopup from './Components/ScannedProductPopup'
import { useNavigate } from 'react-router'
import style from '../../style/Features/QRScanner/QRScanner.module.scss'
import { Worksite, WorksiteStatus } from '../../Models/Worksite'
import { fetchPost } from '../../services/Fecth.service'
import { GET_WORKSITES_QUERY } from '../../constants'
import { Item } from '../../Models/Item'
import ScannerButton from './Components/ScannerButton'
import { cacheCarts, loadCachedCarts, reducerCart } from '../../Reducer/Reducer'
import Popup from '../Popup/Popup'

// import logo from '../../assets/logo.png'

export interface WorksiteBasket {
	worksite: Worksite
	scannedProducts: Item[]
}

const QRScanner = () => {
	const navigate = useNavigate()
	const [carts, dispatch] = useReducer(reducerCart, loadCachedCarts())

	const currentCarts = useMemo(() => Object.keys(carts), [carts])

	const [selectedCart, setSelectedCart] = useState(
		() => carts[currentCarts[0]] || 'undefined'
	)

	const [availableWorksites, setAvailableWorksites] = useState<Worksite[]>([])

	const [activeWorksiteIndex, setActiveWorksiteIndex] = useState<number>(0)

	const [openChantierForm, setOpenChantierForm] = useState<boolean>(false)

	const addBasket = useCallback(
		(worksite: Worksite) =>
			dispatch({ type: 'add_cart', payload: worksite }),
		[dispatch]
	)

	const addItemToCart = useCallback(
		(item: Item) => {
			if (!selectedCart?.worksite?.name) return

			dispatch({
				type: 'add_item',
				payload: { cartID: selectedCart.worksite.name, item },
			})
		},
		[dispatch, selectedCart?.worksite?.name, selectedCart?.items]
	)
	const removeItemToCart = useCallback(
		(item: Item) => {
			console.log('removeItemToCart', item, selectedCart?.worksite?.name)
			dispatch({
				type: 'remove_item',
				payload: { cartID: selectedCart.worksite.name, item },
			})
		},
		[dispatch, selectedCart?.worksite?.name]
	)

	const updateItemToCart = useCallback(
		(item: Item) =>
			dispatch({
				type: 'add_item',
				payload: { cartID: selectedCart.worksite.name, item },
			}),
		[dispatch, selectedCart?.worksite?.name]
	)

	const closeChantierForm = () => setOpenChantierForm(false)

	const [openOnScanSuccess, setOpenOnScanSuccess] = useState(false)
	const closeOnScanSuccessModal = () => {
		setOpenOnScanSuccess(false)
		setScannedProducts(undefined)
	}

	const [openNoDataPopup, setOpenNoDataPopup] = useState(false)
	const closeNoDataPopup = () => setOpenNoDataPopup(false)

	const [openAlreadyScannedPopup, setOpenAlreadyScannedPopup] =
		useState(false)
	const closeAlreadyScannedPopup = () => setOpenAlreadyScannedPopup(false)

	const [isAScannedProduct, setIsAScannedProduct] = useState(false)

	const [lastScannedProduct, setLastScannedProduct] = useState<Item | null>(
		null
	)

	const [listFormat, setListFormat] = useState(['qr_code'] as Array<
		'qr_code' | 'databar' | 'data_matrix'
	>)

	const isPopupOpen = useMemo(() => {
		return openOnScanSuccess || openChantierForm
	}, [openOnScanSuccess, openChantierForm])

	useEffect(() => {
		if (isPopupOpen) {
			setListFormat(['data_matrix'] as Array<'qr_code' | 'data_matrix'>)
		} else {
			setListFormat(['qr_code'] as Array<'qr_code' | 'data_matrix'>)
		}
	}, [isPopupOpen])

	// const operatorName = localStorage.getItem('name') || 'JESSIM LOL'

	useEffect(() => {
		if (currentCarts.length === 0) {
			setOpenChantierForm(true)
		}
	}, [currentCarts.length])

	useEffect(() => {
		const fetchChantiers = async () => {
			const response = await fetchPost<
				{ worksites: Worksite[] },
				{ worksiteStatuses: WorksiteStatus[] }
			>(GET_WORKSITES_QUERY, {
				worksiteStatuses: [
					WorksiteStatus.PENDING,
					WorksiteStatus.IN_PROGRESS,
				],
			})
			if (response && response.worksites) {
				setAvailableWorksites(response.worksites)
			}
		}
		fetchChantiers()
	}, [])

	useEffect(() => {
		cacheCarts(carts)
	}, [carts])

	const handleSelectWorksite = useCallback(
		(selected: Worksite) => {
			if (selected.name === 'Aucun') return

			const index = currentCarts.findIndex(
				(cart) => cart === selected.name
			)

			if (index !== -1) {
				setActiveWorksiteIndex(index)
			} else {
				addBasket(selected)
				setActiveWorksiteIndex(currentCarts.length)
			}

			setOpenChantierForm(false)
		},
		[currentCarts, addBasket]
	)

	// useEffect(() => {
	// 	if (currentCarts.length > 0) {
	// 		const lastCart = carts[currentCarts[currentCarts.length - 1]]
	// 		if (lastCart && lastCart !== selectedCart) {
	// 			setSelectedCart(lastCart)
	// 		}
	// 	}
	// }, [currentCarts, carts, selectedCart])

	const activeIndexRef = useRef(activeWorksiteIndex)
	useEffect(() => {
		activeIndexRef.current = activeWorksiteIndex
	}, [activeWorksiteIndex])

	const [scannedProducts, setScannedProducts] = useState<string | undefined>()

	const selectedCartRef = useRef(selectedCart)

	useEffect(() => {
		selectedCartRef.current = selectedCart
	}, [selectedCart])

	useEffect(() => {
		setSelectedCart(carts[currentCarts[activeWorksiteIndex]])
	}, [activeWorksiteIndex, carts, currentCarts])

	const onScanSuccess = (scanResult: IDetectedBarcode[]) => {
		const productName = scanResult[0]?.rawValue
		if (productName) {
			setScannedProducts(productName)

			const currentCart = carts[selectedCartRef.current?.worksite?.name]
			if (!currentCart) return

			const isScanned = currentCart.items.some(
				(item) => item.articleID === productName
			)

			console.log(
				`product: ${productName}......in a cart?: ${isScanned};;; cart: ${selectedCartRef.current?.worksite?.name}`
			)

			if (isScanned) {
				const existingProduct = currentCart.items.find(
					(item) => item.articleID === productName
				)
				setLastScannedProduct(existingProduct || null)
				setIsAScannedProduct(true)
			} else {
				setLastScannedProduct({
					articleID: productName,
					quantity: 0,
					isEmpty: false,
				})
				setIsAScannedProduct(false)
			}
		} else {
			setLastScannedProduct({
				articleID: productName,
				quantity: 0,
				isEmpty: false,
			})
			setIsAScannedProduct(false)
		}
	}

	const handleScanClick = useCallback(() => {
		if (scannedProducts) {
			setOpenOnScanSuccess(true)
			setLastScannedProduct({
				articleID: scannedProducts,
				quantity: 0,
				isEmpty: false,
			})
			// setScannedProducts(undefined)
		}
	}, [scannedProducts])

	const handleSubmit = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			sessionStorage.setItem('worksiteBaskets', JSON.stringify(carts))

			navigate('/panier')
			window.location.reload()
		},
		[carts, navigate]
	)

	const popups = useMemo(() => {
		return (
			<div className={style.popupsContainer}>
				<Popup
					open={openAlreadyScannedPopup}
					onClose={closeAlreadyScannedPopup}
					closeOnDocumentClick={false}
				>
					Produit Deja scanné, veuillez entrer une nouvelle quantité
					<button onClick={closeAlreadyScannedPopup}>Fermer</button>
				</Popup>

				<ScannedProductPopup
					item={
						lastScannedProduct || {
							articleID: '',
							quantity: 0,
							isEmpty: false,
						}
					}
					open={openOnScanSuccess}
					onClose={closeOnScanSuccessModal}
					addItemToCart={addItemToCart}
					removeItemFromCart={removeItemToCart}
					updateItemToCart={updateItemToCart}
					scannedProducts={selectedCart?.items || []}
					closeOnScanSuccessModal={closeOnScanSuccessModal}
					isScanned={isAScannedProduct}
				/>
				<ChantierPopup
					open={openChantierForm}
					onClose={closeChantierForm}
					worksites={availableWorksites}
					selectedWorksite={currentCarts[activeWorksiteIndex] || ''}
					changeWorksite={handleSelectWorksite}
				/>
				<Popup
					open={openNoDataPopup}
					onClose={closeNoDataPopup}
					closeOnDocumentClick
				>
					Panier Vide!
				</Popup>
			</div>
		)
	}, [
		openAlreadyScannedPopup,
		lastScannedProduct,
		openOnScanSuccess,
		addItemToCart,
		removeItemToCart,
		updateItemToCart,
		selectedCart?.items,
		isAScannedProduct,
		openChantierForm,
		availableWorksites,
		currentCarts,
		activeWorksiteIndex,
		handleSelectWorksite,
		openNoDataPopup,
	])

	return (
		<div className={style.QRScannerContainer}>
			{popups}
			<div className={style.QRScannerWorksiteContainer}>
				<div className={style.QRScannerWorksiteContainerButtons}>
					{currentCarts.map((basket, index) => (
						<button
							key={basket || index}
							onClick={() => {
								setActiveWorksiteIndex(index)
								setSelectedCart(carts[basket])
							}}
							className={
								index === activeWorksiteIndex
									? style.activeTab
									: ''
							}
						>
							{basket} - {carts[basket].items.length}
						</button>
					))}
					<button
						className={style.QRScannerAjouterChantier}
						onClick={() => setOpenChantierForm(true)}
					>
						Ajouter un Site 🚧
					</button>
				</div>
			</div>
			<div className={style.QRScannerComponent}>
				<button
					id="panier"
					type="submit"
					onClick={handleSubmit}
					className={style.QRScannerCartButton}
				>
					Panier
					<img
						src="https://img.icons8.com/?size=10000&id=9671&format=png&color=000000"
						alt="Cart"
					/>
				</button>
				<Scanner
					onScan={onScanSuccess}
					components={{ audio: false, torch: false }}
					formats={listFormat}
					allowMultiple={false}
					scanDelay={250}
				/>

				<div className={style.QRScannerButtonContainer}>
					<ScannerButton
						enabled={!!scannedProducts}
						onClick={handleScanClick}
						nameProduct={scannedProducts}
					/>
				</div>
			</div>
		</div>
	)
}

export default QRScanner
