# Desafío Pokémon

Aplicación web desarrollada en [Next.js](https://nextjs.org) para la visualización de información de Pokémon obtenida mediante la [PokéAPI](https://pokeapi.co).

Disponible públicamente mediante el despliegue realizado en [Vercel](https://desafio-pokemon-sand.vercel.app).

## Contenidos

- [Desafío Pokémon](#desafío-pokémon)
  - [Instalación](#instalación)
  - [Características](características)

## Instalación

Si se quiere ejecutar localmente se necesita tener instalado `npm`, luego, seguir los siguientes pasos:

- Clonar el repositorio:

```bash
git clone https://github.com/CaldeCrack/desafio-pokemon.git
cd desafio-pokemon
```

- Instalar las dependencias:
```bash
npm install --force
```

- Hacer build y ejecutar el proyecto:
```
npm run build
npm start
```

- Abrir la página:

Tras realizar `npm start` la página estará disponible al abrir [http://localhost:3000](http://localhost:3000) en un navegador.

## Características

### Botón de búsqueda aleatoria

En la página de inicio se cuenta con un botón en el lado derecho de la barra de búsqueda, al hacer click en este busca por un Pokémon aleatoriamente entre todos los disponibles.

### Sprite dinámico

Al hacer click sobre el sprite del Pokémon se alterna entre su sprite por defecto y la versión shiny.

### Descripción del Pokémon

Esta información se puede visualizar cuando el cursor se posa encima del nombre, id o apodo del Pokémon.
