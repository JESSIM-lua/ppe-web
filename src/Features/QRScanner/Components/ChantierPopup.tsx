import style from '../../../style/Features/QRScanner/components/ChantierPopup.module.scss'
import { Worksite } from '../../../Models/Worksite'
import WorksiteSearch from './WorksiteSearch'
import Popup from '../../Popup/Popup'

type ChantierPopupProps = {
	worksites: Worksite[]
	selectedWorksite: string
	changeWorksite: (data: Worksite) => void
	open: boolean
	onClose?: () => void
}

/**
 * Popup permettant de choisir le chantier
 * @param props
 * @returns
 */
const ChantierPopup = (props: ChantierPopupProps) => {
	return (
		<Popup
			open={props.open}
			closeOnDocumentClick={false}
			onClose={props.onClose || (() => {})}
			className={style.chantierPopup}
		>
			<div className={style.chantierPopupContainer}>
				<h2>Choisir le Site</h2>
				<WorksiteSearch />
				<button
					onClick={() => {
						props.changeWorksite(
							props.worksites.find(
								(rep) =>
									rep.name ===
									(
										document.getElementById(
											'worksite'
										) as HTMLSelectElement
									).value
							) as Worksite
						)
						if (props.onClose) {
							props.onClose()
						}
					}}
					className={style.chantierPopupContainerButtonValider}
				>
					Valider
				</button>
			</div>
		</Popup>
	)
}

export default ChantierPopup
