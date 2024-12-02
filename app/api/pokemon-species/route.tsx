import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get('id');

	if (!query)
		return new Response('Bad Request', {status: 400});

	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${query}`);

		if (!response.ok)
			throw new Error('Failed to fetch Pokémon species data');

		const pokemon = await response.json();

		return new Response(JSON.stringify(pokemon), {
			headers: {'Content-Type': 'application/json'},
		});
	} catch (error) {
		console.error(error);
		return new Response('Error fetching Pokémon species data', {status: 500});
	}
}
