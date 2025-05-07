import { useCallback } from 'react'
import '../../../style/Features/QRScanner/components/ScannerButton.scss'
import beep from '../../../assets/beep.mp3'
import beepJOJO from '../../../assets/beep-jojo.m4a'

const audio = new Audio(beep)
const audioDuRire = new Audio(beepJOJO)

type ScannerButtonProps = {
	enabled: boolean
	onClick: () => void
	nameProduct?: string
}
const playsound = () => {
	const math = Math.random()
	if (math > 0.1) {
		audio.play()
	} else {
		audioDuRire.play()
	}
}

const ScannerButton = (props: ScannerButtonProps) => {
	const handleClick = useCallback(() => {
		if (props.enabled) {
			playsound()
			props.onClick()
		}
	}, [props])

	return (
		<button
			disabled={!props.enabled}
			className={`qr-scanner-button ${!props.enabled && 'disabled'}`}
			onClick={() => {
				handleClick()
			}}
		>
			{/* {props.nameProduct && ( */}
			<span className="scanner-button-text">
				{props.nameProduct || '-- --'}
			</span>
			{/* )} */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				id="Layer_1"
				data-name="Layer 1"
				viewBox="0 0 24 24"
				width="80vw"
				height="64"
			>
				<path d="M2,14h2v9H2V14Zm15,9h2V14h-2v9Zm-8,0h2V14h-2v9Zm-4,0h3V14h-3v9Zm8,0h3V14h-3v9Zm7,0h2V14h-2v9Zm2-13V1h-2V10h-1V1h-2V10h-1V1h-3V10h-2V1h-2V10h-1V1h-3V10h-1V1H2V10H0v2H24v-2h-2Z" />
			</svg>
		</button>
	)
}

export default ScannerButton
