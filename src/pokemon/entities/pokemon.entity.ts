import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<Pokemon>;


@Schema()
export class Pokemon {
    //id: string // Mongo lo crea
    @Prop({
        unique: true,
        index: true,
    })
    name: string;


    @Prop({
        unique: true,
        index: true,
    })
    no: number;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);