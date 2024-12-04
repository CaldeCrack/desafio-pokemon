import { Tooltip } from "@mui/material";

const capitalizePhrase = (str: string) => {
	if (str === 'ho-oh') return 'Ho-oh';
	const exceptions: string[] = ['porygon-z', 'wo-chien', 'chi-yu', 'chien-pao', 'ting-lu'];
	const splitter = str in exceptions ? ' ' : '-';
	const capitalize = (word: string) => {return word.charAt(0).toUpperCase() + word.substring(1);}
	return str.split('-').map((word: string) => capitalize(word)).join(splitter);
}

const formatId = (id: number) => {return String(id).padStart(4, '0');}
const formatName = (name: string) => {return capitalizePhrase(name);}

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

export default function GeneralInfo(info_parent: any) {
	const info = info_parent.children;
	const id = formatId(info.id);
	const name = formatName(info.name);
	const genus = formatGenera(info.genus);
	const description = formatDescription(info.description);

	return (
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
	)
}
