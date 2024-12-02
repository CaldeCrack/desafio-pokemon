'use client';
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SearchInput = () => {
	const search = useSearchParams();
	const [pokemon, setPokemon] = useState(search ? search.get('name') : null);
	const router = useRouter();
	
	const onSearch = (event: React.FormEvent) => {
		event.preventDefault();

		const encodedPokemon = encodeURI(pokemon || '');
		router.push(`/pokemon?name=${encodedPokemon}`);
	}

	return (
		<form className="flex justify-center w-2/3" onSubmit={onSearch}>
			<input
				value={pokemon || ''}
				onChange={event => setPokemon(event.target.value)}
				className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-full focus:outline-none focus:ring-[1px] focus:ring-green-700"
				placeholder="Ingresa el nombre de un Pokémon">
			</input>
		</form>
	)
};

export default SearchInput;
