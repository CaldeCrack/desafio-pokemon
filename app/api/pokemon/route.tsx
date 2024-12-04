import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get('name');

	if (!query)
		return new Response('Bad Request', {status: 400});

	const parsed_query = query.toLowerCase().trim().replace(' ', '-');

	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${parsed_query}`);

		if (response.status === 404) {
			return new Response(JSON.stringify({ error: 'Pokémon no encontrado' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (!response.ok)
			throw new Error('Error al obtener información del Pokémon');

		const pokemon = await response.json();

		return new Response(JSON.stringify(pokemon), {
			headers: {'Content-Type': 'application/json'},
		});
	} catch (error) {
		console.error(error);
		return new Response('Error obteniendo información del Pokémon', {status: 500});
	}
}
