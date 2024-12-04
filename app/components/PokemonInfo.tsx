'use client';
import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import styles from './Types.module.css';
import HeightWeight from './pokemonComponents/HeightWeight';
import GeneralInfo from './pokemonComponents/GeneralInfo';
import Abilities from './pokemonComponents/Abilities';
import Stats from './pokemonComponents/Stats';
import Types from './pokemonComponents/Types';
import Cry from './pokemonComponents/Cry';
import Block from './Block';

const fetchData = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok)
		throw new Error('Fallo al buscar información');

	return response.json();
}

export default function PokemonInfo(pokemon: any) {
	const info = pokemon.children;
	const imageURL = info.sprites.front_default;
	const shinyImageURL = info.sprites.front_shiny;

	const [spriteLoaded, setSpriteLoaded] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [isShiny, setIsShiny] = useState(false);
	const currentImageURL = isShiny ? shinyImageURL : imageURL;

	useEffect(() => {setIsClient(true);}, []);

	const { data, isLoading } = useSWR(`/api/pokemon-species?id=${info.species.name}`, fetchData);

	// Canvas behavior
	const handleCanvasClick = () => {
		setSpriteLoaded(false);
		setIsShiny((prev) => !prev);
	};
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
			setSpriteLoaded(true);
		};
	}, [data, isLoading, currentImageURL]);

	if (!isClient && isLoading) return <div>Cargando...</div>;
	if (!data) return;

	return (
		<div className="flex flex-row gap-5 w-4/5 p-4">
			<Block>
				<GeneralInfo>{{
					description: data.flavor_text_entries,
					id: info.id,
					name: info.name,
					genus: data.genera
				}}</GeneralInfo>
				<Types>{info.types}</Types>
				<div className='flex flex-col w-full items-center'>
					<canvas
						onClick={handleCanvasClick}
						ref={canvasRef}
						className={`${styles.render} ${isShiny && spriteLoaded ? styles.isShiny : ''}`}
						></canvas>
				</div>
				<HeightWeight>{{height: info.height, weight: info.weight}}</HeightWeight>
			</Block>
			<Block>{{
				content: (<><Abilities>{info.abilities}</Abilities><Cry>{info.cries.latest}</Cry></>),
				style: { justifyContent:'space-between' },
			}}</Block>
			<Block><Stats>{info.stats}</Stats></Block>
		</div>
	)
}
