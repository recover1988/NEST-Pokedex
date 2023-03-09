import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon, PokemonDocument } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<PokemonDocument>
  ) { }

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {

    await this.pokemonModel.deleteMany();

    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=150`)

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const pokemon = { no, name };
      pokemonToInsert.push(pokemon);
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'SEED executed';
  }
}
