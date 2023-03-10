import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import { CommonModule } from './common/common.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';


@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfiguration]
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {
}
