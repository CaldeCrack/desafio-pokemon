'use client';
import styles from './Types.module.css';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

const capitalizePhrase = (str: string) => {
	const capitalize = (word: string) => {return word.charAt(0).toUpperCase() + word.substring(1);}
	return str.split('-').map((word: string) => capitalize(word)).join(' ');
}

const fetchPokemonSpecies = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok)
		throw new Error('Fallo al buscar pokémon');

	return response.json();
}

const formatName = (name: string) => {
	return capitalizePhrase(name);
}

const formatId = (id: number) => {return String(id).padStart(4, '0');}

const formatTypes = (types: Array<any>) => {
	return types.map((typeObject: any) => (
		<span key={typeObject.type.name} className={`${styles.type} ${styles[typeObject.type.name]}`}></span>
	));
}

const formatHeight = (height: number) => {return `${height/10} m`;}
const formatWeight = (weight: number) => {return `${weight/10} kg`;}

const formatAbilities = (abilitiesArray: Array<any>) => {
	let header;
	if (abilitiesArray.length > 1)
		header = <h2 className='text-xl'><strong>Habilidades</strong></h2>
	else
		header = <h2 className='text-xl'><strong>Habilidad</strong></h2>

	return (
		<>
			{header}
			<div>
				{abilitiesArray.map((ability: any) => (
					<p key={ability.ability.name}>{capitalizePhrase(ability.ability.name)}</p>
				))}
			</div>
		</>
	);
}

const formatGenera = (genera: Array<any>) => {
	for (const elem of genera)
		if (elem.language.name === 'es' || elem.language.name === 'en')
			return elem.genus;
}

const PokemonInfo = (pokemon: any) => {
	const info = pokemon.children;
	const id = formatId(info.id);
	const name = formatName(info.name);
	const types = formatTypes(info.types);
	const imageURL = info.sprites.front_default;
	const height = formatHeight(info.height);
	const weight = formatWeight(info.weight);
	const abilities = formatAbilities(info.abilities);
	const cry = info.cries.latest;

	const { data, isLoading } = useSWR(`/api/pokemon-species?id=${info.id}`, fetchPokemonSpecies);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		console.log("canvasRef.current:", canvasRef.current);
		console.log("imageURL:", imageURL);

		const canvas = canvasRef.current;
		if (!canvas || !imageURL) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		context.imageSmoothingEnabled = false;
		const image = new window.Image();
		image.src = `${imageURL}?timestamp=${new Date().getTime()}`;
		image.onload = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
		};
	}, [data, isLoading, imageURL]);

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
				<canvas ref={canvasRef} className={`${styles.render}`}></canvas>
				<div>
					<p><strong>Altura:</strong> {height}</p>
					<p><strong>Peso:</strong> {weight}</p>
				</div>
			</div>
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[1px] ring-green-700 gap-3" style={{ justifyContent:'space-between' }}>
				<div className='flex flex-col gap-3'>
					{abilities}
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

			</div>
		</div>
	)
}

export default PokemonInfo;
