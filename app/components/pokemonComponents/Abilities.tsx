'use client';
import useSWR from "swr";

const fetchData = async (url: string) => {
	const response = await fetch(url);

	if(!response.ok)
		throw new Error('Fallo al buscar información');

	return response.json();
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

export default function Abilities(abilities: any) {
	const abilitiesInfo: any[] = [];
	abilities.children.forEach((ability: any) => {
		const { data, isLoading } = useSWR(`/api/ability?name=${ability.ability.name}`, fetchData);
		if (isLoading) return <div>Cargando...</div>;
		if (!data) return;
		abilitiesInfo.push(formatAbilities(data, ability.is_hidden));
	});

	const abilityHeader = abilities.children.length > 1
							? <h2 className='text-xl'><strong>Habilidades</strong></h2>
							: <h2 className='text-xl'><strong>Habilidad</strong></h2>;

	return (<div className='flex flex-col gap-3'>{abilityHeader}{abilitiesInfo}</div>)
}
