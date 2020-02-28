#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const argv = require('yargs').argv
const axios = require("axios");

const { count = 50 } = argv;
console.log('Initiating scrapper ..');
console.log('Getting a total of ', count, ' pokemon');

/**
 * @description get indivisual pokemon data
 * @param {string} url
 * @example https://pokeapi.co/api/v2/pokemon/1/
 */
const fetchPokemon = async ({ url }) => {
  const pokeDataRequest = await axios(url);
  const { data: pokeData } = pokeDataRequest;
  delete pokeData.moves;
  return pokeData;
};

const fetchAllPokemon = async () => {
  const API_URL = `https://pokeapi.co/api/v2/pokemon?limit=${count}`;
  const PATH_OUTPUT = path.resolve("./data.js");

  const allPokeDataRequest = await axios(API_URL);
  const { data: allPokeData } = allPokeDataRequest;
  const promises = allPokeData.results.map(pokemon => fetchPokemon(pokemon));
  console.log("Resolving promises");
  const detailedData = await Promise.all([...promises]);
  console.log("Writing data to file");
  fs.writeFileSync(
    PATH_OUTPUT,
    JSON.stringify(detailedData, null, 2),
    "utf-8"
  );
  console.log("Done writting file to ", PATH_OUTPUT);
};

fetchAllPokemon();
