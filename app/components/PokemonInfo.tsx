'use client';
import Image from "next/image";
import styles from './Types.module.css';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

const fetchPokemonSpecies = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok)
		throw new Error('Fallo al buscar pokémon');

	return response.json();
}

const formatName = (name: string) => {
	return name.split('-')
		.map((word: string) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

const formatId = (id: number) => {return String(id).padStart(4, '0');}

const formatTypes = (types: Array<any>) => {
	return types.map((typeObject: any) => (
		<span key={typeObject.type.name} className={`${styles.type} ${styles[typeObject.type.name]}`}></span>
	));
}

const formatHeight = (height: number) => {return `${height/10} m`;}
const formatWeight = (weight: number) => {return `${weight/10} kg`;}

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

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		const image = imgRef.current;
		if (canvas && image) {
			const context = canvas.getContext('2d');
			if (context === null)
				return;

			image.onload = () => {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(image, 0, 0, canvas.width, canvas.height);
			};
			if (image.complete) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(image, 0, 0, canvas.width, canvas.height);
			}
		}
	}, []);

	const { data, isLoading } = useSWR(`/api/pokemon-species?id=${info.id}`, fetchPokemonSpecies);
	if (!data)
		return;

	const genus = formatGenera(data.genera);

	return (
		<div className="flex flex-row gap-5 w-4/5 p-4">
			<div className="flex flex-col p-4 bg-zinc-800 rounded-3xl ring-[1px] ring-green-700 gap-3">
				<div>
					<h1 className="text-xl"><strong>{name} #{id}</strong></h1>
					<p className="text-sm">{genus}</p>
				</div>
				<div className="flex flex-row gap-2">{types}</div>
				<canvas className={`${styles.render}`} ref={canvasRef}></canvas>
				<img ref={imgRef} src={imageURL} alt={name} style={{display: 'none'}}/>
				<p><strong>Altura:</strong> {height}</p><p><strong>Peso:</strong> {weight}</p>
			</div>
			<div className="flex flex-col p-4 bg-zinc-800 rounded-3xl ring-[1px] ring-green-700 gap-3">

			</div>
		</div>
	)
}

export default PokemonInfo;
