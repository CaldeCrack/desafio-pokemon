import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('name');
  if (!query)
    return new Response('Bad Request', {status: 400});

  try {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    return new Response(JSON.stringify(pokemon), {
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error(error);
    return new Response('Bad Request', {status: 400});
  }
}


