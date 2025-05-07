import { useEffect, useState } from 'react'
import { GET_WORKSITES_QUERY } from '../../../constants'
import { fetchPost } from '../../../services/Fecth.service'
import { Worksite } from '../../../Models/Worksite'
import style from '../../../style/Features/QRScanner/components/WorksiteSearch.module.scss'

const WorksiteSearch = () => {
	const [chantier, setChantier] = useState<Worksite[]>([])
	const [selectedChantier, setSelectedChantier] = useState<Worksite | null>(
		null
	)
	const [hidChantier, setHidChantier] = useState<boolean>(true)

	const findChantierByName = async (name: string) => {
		const response = await fetchPost(GET_WORKSITES_QUERY, {
			worksiteStatuses: ['PENDING'],
		})
		if (response && (response as { worksites?: Worksite[] }).worksites) {
			const filteredChantiers =
				(response as { worksites: Worksite[] }).worksites?.filter(
					(worksite) =>
						worksite.name.toLowerCase().includes(name.toLowerCase())
				) || []
			setChantier(filteredChantiers)
		} else {
			setChantier([])
		}
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			const inputElement = document.getElementById(
				'nomChantier'
			) as HTMLInputElement
			if (inputElement) {
				const name = inputElement.value
				findChantierByName(name)
			}
		}, 1000)

		return () => clearTimeout(timeout)
	}, [chantier])

	return (
		<div className={style.WorksiteSearchContainer}>
			<input
				type="text"
				placeholder="Chercher votre site par nom"
				id="nomChantier"
				onClick={() => setHidChantier(!hidChantier)}
			/>
			<p className={style.WorksiteSearchContainerShowWorksite}>
				{selectedChantier?.name || '---'}
			</p>
			<div
				hidden={hidChantier}
				className={style.WorksiteSearchContainerTable}
			>
				<table>
					<tbody>
						{chantier
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((rep: Worksite) => (
								<tr key={rep._id}>
									<td>
										<button
											className={
												selectedChantier?._id ===
												rep._id
													? style.selectedButton
													: ''
											}
											onClick={() =>
												setSelectedChantier(rep)
											}
										>
											{rep.name}
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
			<div>
				<input
					id="worksite"
					value={selectedChantier?.name || ''}
					readOnly
					hidden
				/>
			</div>
		</div>
	)
}

export default WorksiteSearch
