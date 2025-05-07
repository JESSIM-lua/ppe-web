import clsx from 'clsx'
import style from '../../style/Features/Popup/Popup.module.scss'

type PopupProps = {
	open: boolean
	closeOnDocumentClick: boolean
	onClose: () => void
	children?: React.ReactNode
	className?: string
}

const Popup = (props: PopupProps) => {
	return (
		<div>
			<div className={clsx(style.popupContent, props.open && style.open)}>
				<div className={style.blurContent}></div>
				<div className={props.className} onClick={props.onClose}>
					<div onClick={(e) => e.stopPropagation()}>
						{props.children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Popup
