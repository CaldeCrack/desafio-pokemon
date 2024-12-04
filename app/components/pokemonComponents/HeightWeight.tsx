const formatHeight = (height: number) => {return `${height/10} m`;}
const formatWeight = (weight: number) => {return `${weight/10} kg`;}

export default function HeightWeight(hw_parent: any) {
	const hw = hw_parent.children;
	const height = formatHeight(hw.height);
	const weight = formatWeight(hw.weight);

	return (
		<div>
			<p><strong>Altura:</strong> {height}</p>
			<p><strong>Peso:</strong> {weight}</p>
		</div>
	)
}
