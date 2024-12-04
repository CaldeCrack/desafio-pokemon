'use client';
import styles from './Types.module.css';
import { useEffect, useRef, useState } from 'react';
import { BarChart } from '@mui/x-charts';
import { Tooltip } from '@mui/material';
import useSWR from 'swr';

const capitalizePhrase = (str: string) => {
	if (str === 'ho-oh') return 'Ho-oh';
	const exceptions: string[] = ['porygon-z', 'wo-chien', 'chi-yu', 'chien-pao', 'ting-lu'];
	const splitter = str in exceptions ? ' ' : '-';
	const capitalize = (word: string) => {return word.charAt(0).toUpperCase() + word.substring(1);}
	return str.split('-').map((word: string) => capitalize(word)).join(splitter);
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

const formatTypes = (types: any[]) => {
	return types.map((typeObject: any) => (
		<span key={typeObject.type.name} className={`${styles.type} ${styles[typeObject.type.name]}`}></span>
	));
}

const formatAbilities = (ability: any, is_hidden: boolean = false) => {
	let name;
	for (const elem of ability.names) {
		if (elem.language.name === 'es') {
			name = elem.name;
			break;
		} else if (elem.language.name === 'en')
			name = elem.name;
	}
	if (is_hidden) name = name.concat(' (Habilidad oculta)');

	let description;
	for (const elem of ability.flavor_text_entries) {
		if (elem.language.name === 'es') {
			description = elem.flavor_text;
			break;
		} else if (elem.language.name === 'en')
			description = elem.flavor_text;
	}

	return (
		<div key={name}>
			<p><u>{name}:</u></p>
			<p>{description}</p>
		</div>
	)
}

const formatGenera = (genera: any[]) => {
	let genus;
	for (const elem of genera) {
		if (elem.language.name === 'es')
			return elem.genus;
		else if (elem.language.name === 'en')
			genus = elem.genus;
	}
	return genus;
}

const formatStats = (stats: any[]) => {
	const xData: string[] = ['HP', 'Atk', 'Def', 'SpA', 'Spd', 'Spe'];
	const yData: number[] = [];
	stats.forEach((elem: any) => {yData.push(elem.base_stat);});
	const total = stats.reduce((accum, elem) => {return accum + elem.base_stat}, 0);

	return (
		<div className='flex flex-col h-full gap-0'>
			<p><u>Total:</u> {total}</p>
			<BarChart
				grid={{ horizontal: true }}
				tooltip={{ trigger: 'none' }}
				barLabel='value'
				
				xAxis={[{
					id: 'stats',
					data: xData,
					scaleType: 'band',
					disableTicks: true,
					colorMap: {
						type: 'ordinal',
						colors: [
							'url(#gradientHP)',
							'url(#gradientAtk)',
							'url(#gradientDef)',
							'url(#gradientSpA)',
							'url(#gradientSpD)',
							'url(#gradientSpe)'
						]
					}
				}]}
				series={[{ data: yData, type: 'bar' }]}
				slotProps={{
					loadingOverlay: { message: 'Cargando información' },
					noDataOverlay: { message: 'No hay información disponible' },
				}}
				sx={{
					'& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {fill: 'white'},
					'& .MuiChartsAxis-root .MuiChartsAxis-line': {stroke: 'white'},
					'& .MuiChartsAxis-left .MuiChartsAxis-tick': {stroke: 'white'},
					'.MuiChartsGrid-line': {stroke: 'gray'},
					'.MuiBarElement-root': {strokeWidth: 2},
					'.MuiBarElement-root:nth-of-type(1)': {stroke: '#448f0c'},
					'.MuiBarElement-root:nth-of-type(2)': {stroke: '#9b8510'},
					'.MuiBarElement-root:nth-of-type(3)': {stroke: '#97410c'},
					'.MuiBarElement-root:nth-of-type(4)': {stroke: '#0d7f9d'},
					'.MuiBarElement-root:nth-of-type(5)': {stroke: '#304591'},
					'.MuiBarElement-root:nth-of-type(6)': {stroke: '#8b1370'},
					'.MuiBarLabel-root': {fontWeight: 1000},
				}}>
				<defs>
					<linearGradient id="gradientHP" x2="0" y2="1">
						<stop offset="0%" stopColor="#69dc12" />
						<stop offset="100%" stopColor="#a2db76" />
					</linearGradient>
					<linearGradient id="gradientAtk" x2="0" y2="1">
						<stop offset="0%" stopColor="#efcc18" />
						<stop offset="100%" stopColor="#edda80" />
					</linearGradient>
					<linearGradient id="gradientDef" x2="0" y2="1">
						<stop offset="0%" stopColor="#e86412" />
						<stop offset="100%" stopColor="#e5a27b" />
					</linearGradient>
					<linearGradient id="gradientSpA" x2="0" y2="1">
						<stop offset="0%" stopColor="#14c3f1" />
						<stop offset="100%" stopColor="#81d9ef" />
					</linearGradient>
					<linearGradient id="gradientSpD" x2="0" y2="1">
						<stop offset="0%" stopColor="#4a6adf" />
						<stop offset="100%" stopColor="#778ddd" />
					</linearGradient>
					<linearGradient id="gradientSpe" x2="0" y2="1">
						<stop offset="0%" stopColor="#d51dad" />
						<stop offset="100%" stopColor="#d372bc" />
					</linearGradient>
				</defs>
			</BarChart>
		</div>
	)
}

const formatDescription = (entries: any[]) => {
	let description;
	for (const elem of entries) {
		if (elem.language.name === 'es')
			return elem.flavor_text;
		else if (elem.language.name === 'en')
			description = elem.flavor_text;
	}
	return description;
}

export default function PokemonInfo(pokemon: any) {
	const info = pokemon.children;
	const id = formatId(info.id);
	const name = formatName(info.name);
	const height = formatHeight(info.height);
	const weight = formatWeight(info.weight);
	const types = formatTypes(info.types);
	const stats = formatStats(info.stats);
	const cry = info.cries.latest;
	const imageURL = info.sprites.front_default;
	const shinyImageURL = info.sprites.front_shiny;

	const [isShiny, setIsShiny] = useState(false);
	const [spriteLoaded, setSpriteLoaded] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const currentImageURL = isShiny ? shinyImageURL : imageURL;

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Handle abilities info
	const abilitiesInfo: any[] = [];
	info.abilities.forEach((ability: any) => {
		const { data, isLoading } = useSWR(`/api/ability?name=${ability.ability.name}`, fetchData);
		if (!isClient && isLoading) return <div>Cargando...</div>;
		if (!data) return;
		abilitiesInfo.push(formatAbilities(data, ability.is_hidden));
	});
	const abilityHeader = abilitiesInfo.length > 1
							? <h2 className='text-xl'><strong>Habilidades</strong></h2>
							: <h2 className='text-xl'><strong>Habilidad</strong></h2>;

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
	}, [data, isLoading, currentImageURL, abilitiesInfo]);

	if (!isClient && isLoading) return <div>Cargando...</div>;
	if (!data) return;

	const genus = formatGenera(data.genera);
	const description = formatDescription(data.flavor_text_entries);

	return (
		<div className="flex flex-row gap-5 w-4/5 p-4">
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[2px] ring-green-700 gap-3">
				<Tooltip title={description} placement='right'
					slotProps={{
						tooltip: {
							sx: {
								color: '#e4e4e7',
								backgroundColor: 'black',
								border: '1px solid #15803d',
								fontSize: '0.9em',
							}
						}
					}}>
					<div className='w-fit'>
						<h1 className="text-xl"><strong>{name} #{id}</strong></h1>
						<p className="text-sm">{genus}</p>
					</div>
				</Tooltip>
				<div className="flex flex-row gap-2">{types}</div>
				<div className='flex flex-col w-full items-center'>
					<canvas
						onClick={handleCanvasClick}
						ref={canvasRef}
						className={`${styles.render} ${isShiny && spriteLoaded ? styles.isShiny : ''}`}
					></canvas>
				</div>
				<div>
					<p><strong>Altura:</strong> {height}</p>
					<p><strong>Peso:</strong> {weight}</p>
				</div>
			</div>
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[2px] ring-green-700 gap-3" style={{ justifyContent:'space-between' }}>
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
			<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[2px] ring-green-700 gap-3">
				<h2 className='text-xl'><strong>Estadísticas</strong></h2>
				{stats}
			</div>
		</div>
	)
}
