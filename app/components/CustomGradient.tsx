export default function CustomGradient(info: any) {
	const id = info.children.id;
	const start = info.children.start;
	const end = info.children.end;

	return (
		<linearGradient id={id} x2='0' y2='1'>
			<stop offset='0%' stopColor={start}/>
			<stop offset='100%' stopColor={end}/>
		</linearGradient>
	)
}
