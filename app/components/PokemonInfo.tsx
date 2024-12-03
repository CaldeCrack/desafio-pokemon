'use client';
import styles from './Types.module.css';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

const capitalizePhrase = (str: string) => {
	const capitalize = (word: string) => {return word.charAt(0).toUpperCase() + word.substring(1);}
	return str.split('-').map((word: string) => capitalize(word)).join(' ');
}

const fetchData = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok)
		throw new Error('Fallo al buscar información');

	return response.json();
}

const formatId = (id: number) => {return String(id).padStart(4, '0');}

const formatName = (name: string) => {return capitalizePhrase(name);}

const formatHeight = (height: number) => {return `${height/10} m`;}
const formatWeight = (weight: number) => {return `${weight/10} kg`;}

const formatTypes = (types: Array<any>) => {
	return types.map((typeObject: any) => (
		<span key={typeObject.type.name} className={`${styles.type} ${styles[typeObject.type.name]}`}></span>
	));
}

const formatAbilities = (ability: any) => {
	let name;
	for (const elem of ability.names)
		if (elem.language.name === 'es')
			name = elem.name;
	if (!name)
		for (const elem of ability.names)
			if (elem.language.name === 'en')
				name = elem.name;

	let description;
	for (const elem of ability.flavor_text_entries)
		if (elem.language.name === 'es')
			description = elem.flavor_text;
	if (!description)
		for (const elem of ability.flavor_text_entries)
			if (elem.language.name === 'en')
				description = elem.flavor_text;

	return (
		<div key={name}>
			<p><u>{name}:</u></p>
			<p>{description}</p>
		</div>
	)
}

const formatGenera = (genera: Array<any>) => {
	let genus;
	for (const elem of genera)
		if (elem.language.name === 'es')
			genus = elem.genus;
	if (!genus)
		for (const elem of genera)
			if (elem.language.name === 'en')
				genus = elem.genus;
	return genus;
}

const PokemonInfo = (pokemon: any) => {
	const info = pokemon.children;
	const id = formatId(info.id);
	const name = formatName(info.name);
	const height = formatHeight(info.height);
	const weight = formatWeight(info.weight);
	const types = formatTypes(info.types);
	const imageURL = info.sprites.front_default;
	const shinyImageURL = info.sprites.front_shiny;
	const cry = info.cries.latest;

	const [isShiny, setIsShiny] = useState(false);
	const currentImageURL = isShiny ? shinyImageURL : imageURL;

	// Handle abilities info
	const { data, isLoading } = useSWR(`/api/pokemon-species?id=${info.species.name}`, fetchData);
	let abilitiesInfo: Array<any> = [];
	info.abilities.forEach((ability: any) => {
		const { data, isLoading } = useSWR(`/api/ability?name=${ability.ability.name}`, fetchData);
		if (isLoading) return <div>Cargando...</div>;
		if (!data) return;
		abilitiesInfo.push(formatAbilities(data));
	});
	let abilityHeader;
	if (abilitiesInfo.length > 1)
		abilityHeader = <h2 className='text-xl'><strong>Habilidades</strong></h2>
	else
		abilityHeader = <h2 className='text-xl'><strong>Habilidad</strong></h2>

	// Canvas behavior
	const handleCanvasClick = () => {setIsShiny((prev) => !prev);};
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !imageURL) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		context.imageSmoothingEnabled = false;
		const image = new window.Image();
		image.src = currentImageURL;
		image.onload = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
		};
	}, [data, isLoading, currentImageURL, abilitiesInfo]);

	if (isLoading) return <div>Cargando...</div>;
	if (!data) return;

	const genus = formatGenera(data.genera);

	return (
		<div className="flex flex-row gap-5 w-4/5 p-4">
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[1px] ring-green-700 gap-3">
				<div>
					<h1 className="text-xl"><strong>{name} #{id}</strong></h1>
					<p className="text-sm">{genus}</p>
				</div>
				<div className="flex flex-row gap-2">{types}</div>
				<canvas onClick={handleCanvasClick} ref={canvasRef} className={`${styles.render}`}></canvas>
				<div>
					<p><strong>Altura:</strong> {height}</p>
					<p><strong>Peso:</strong> {weight}</p>
				</div>
			</div>
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[1px] ring-green-700 gap-3" style={{ justifyContent:'space-between' }}>
				<div className='flex flex-col gap-3'>
					{abilityHeader}
					{abilitiesInfo}
				</div>
				<div className='flex flex-col gap-3'>
					<h2 className='text-xl'><strong>Grito</strong></h2>
					<audio controls className='w-full'>
						<source
							id="audio-player"
							src={cry}
							type="audio/ogg"
							/>
					</audio>
				</div>
			</div>
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[1px] ring-green-700 gap-3">
				<h2 className='text-xl'><strong>Estadísticas</strong></h2>

			</div>
		</div>
	)
}

export default PokemonInfo;
