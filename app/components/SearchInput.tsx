'use client';
import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
	const search = useSearchParams();
	const [pokemon, setPokemon] = useState(search ? search.get('name') : null);
	const router = useRouter();

	useEffect(() => {if (!search.has('name')) setPokemon('');}, [search]);

	const onSearch = (event: FormEvent) => {
		event.preventDefault();
		const encodedPokemon = encodeURI(pokemon || '');
		router.push(`/pokemon?name=${encodedPokemon}`);
	}

	const onRandomSearch = () => {
		const randomId = Math.floor(Math.random() * 1025) + 1;
		setPokemon(randomId.toString());
		router.push(`/pokemon?name=${randomId}`);
	};

	return (
		<form className="flex justify-center w-2/3" onSubmit={onSearch}>
			<input
				value={pokemon || ''}
				onChange={event => setPokemon(event.target.value)}
				className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-l-full focus:outline-none focus:ring-[1px] focus:ring-green-700"
				placeholder="Ingresa el nombre de un Pokémon">
			</input>
			<button
				type="button"
				onClick={onRandomSearch}
				className="pl-6 pr-8 text-white bg-green-700 hover:bg-green-800 rounded-r-full focus:outline-none flex items-center justify-center"
				aria-label="Random Pokémon"
			><i className="fas fa-dice text-3xl"></i></button>
		</form>
	)
};
