export default function Cry(cry: any) {
	return (
		<div className='flex flex-col gap-3'>
			<h2 className='text-xl'><strong>Grito</strong></h2>
			<audio controls className='w-full'>
				<source id="audio-player" src={cry.children} type="audio/ogg"/>
			</audio>
		</div>
	)
}
