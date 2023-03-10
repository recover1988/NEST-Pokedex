<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokedex App

## Readme

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
npm install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levanta la base de datos

```
docker-compose up -d
```

5. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

## Stack Usado

- MongoDB
- Nest

## Retornar a un commit anterior

```
git add .
```

Revertir al utlimo commit

```
git checkout --.
```

## Levantar servidor

```
npm run start:dev
```

## Eliminar Prettier

```
npm remove prettier

npm remove eslint-config-prettier eslint-plugin-prettier
```

## Servir Contenido Estatico

Crear directorio `/public` para poner contenido estatico.

```
npm i @nestjs/serve-static
```

```
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public'),
    })
  ],
})
export class AppModule {

}
```

Con esto podemos servir aplicacion de angular, react, svelte, etc. La ruta esta creada y sirve el contenido estatico.

## Crear un CRUD completo

```
nest g res pokemon --no-spec

genera:
? What transport layer do you use? REST API
? Would you like to generate CRUD entry points? Yes
CREATE src/pokemon/pokemon.controller.ts (946 bytes)
CREATE src/pokemon/pokemon.module.ts (261 bytes)
CREATE src/pokemon/pokemon.service.ts (649 bytes)
CREATE src/pokemon/dto/create-pokemon.dto.ts (33 bytes)
CREATE src/pokemon/dto/update-pokemon.dto.ts (181 bytes)
CREATE src/pokemon/entities/pokemon.entity.ts (24 bytes)
UPDATE package.json (1903 bytes)
UPDATE src/app.module.ts (353 bytes)
✔ Packages installed successfully.
```

## DTO (data transfer object)

```
export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
```

El extends indica que tiene todas las propiedades y metodos del create pero son opcionales.

## Entity

Es una representacion de lo que se va a grabar en la base de datos. Esta clase representa la tabla, y sus valores que contendra.

## Cambiar el path de manera global

Para cambiar el path y poner por ejemplo la ruta api antes de nustro endpoint podemos ir al `main.ts` y configura el prefijo de la siguiente forma.

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');


  await app.listen(3000);
}
bootstrap();

```

Ahora nuestro endpoint tendran el prefijo api.

```
http://localhost:3000/api/pokemon
```

## Dockero-Compose

Levanta la imagen y los servicios.
Creamos un archivo que se va a llamar `docker-compose.yaml`, en este archivo es importante los espacios. Es como archivo json pero usa tabulaciones para hacer las agrupaciones.

```
version: "3"

services:
  db:
    image: mongo:5.0.0
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGODB_DATABASE: nest-pokemon
    volumes:
      - ./mongo:/data/db
```

Algunos puntos importantes:
`image:` aca especificamos la imagen que queremos usar.
`ports:` el primero es el de nuestra maquina y el segundo del contenedor que esta aislado, mediante este puerto accedemos al contenedor.
`environment:` especificamos algunas variables de entorno(ver documentacion de la imangen).
`volumes:` creamos una carpeta donde guardaremos los elementos de la imagen.

Para corre el servidor:

```
docker-compose up -d
```

Podemos ver en el Docker-Desktop que la base de datos esta corriendo.
Podemos destruir el contenedor y con el comando volverlo a reconstruir y gracias al respaldo que hicimos podemos recuperar la data.

# Conectar Nest con Mongo

Instalar:

```
npm i @nestjs/mongoose mongoose
```

Luegon en el `app.module.ts` ponemos el `MongooseModule.forRoot()` y dentro la direccion `URI` o `url`, si usamos otra instancia de mongo en la direccion url podemos enviar las credenciales para conectarse.

```
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),

    PokemonModule,
  ],
})
export class AppModule {

}

```

## Crear esquema y modelos

Al usar nest podemos usar los decoradores que nos proporciona la libreria.

```
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


    @Prop()
    no: number;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
```

Para insrtar este schema en la base de datos tenemos que ir al module del componente:

```
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      }
    ])
  ]
})
export class PokemonModule { }
```

En los imports ponemos `MongooseModule.forFeature()` y enviamos el nombre y el shcema que creamos.
Si hay mas modelos y entidades las podemos agregar poniendolos en el array de objetos.

## DTO (data transfer object)

Para hacer un objeto validados tenemos que importar las siguientes librerias:

```
 npm i class-validator class-transformeror class-transformer
```

Luego en el dto ponemos las validaciones:

```
import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(3)
    name: string;
}

```

## Usar validation de manera global

En el `main.ts` tenemos que poner la siguiente configuracion:

```
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


```

## Inyectar modelo en el servicio

Nos vamos a `pokemon.service.ts` y en el constructor inyectamos el modelo:

```
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon, PokemonDocument } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>
  ) { }

}
```

Usamos el decorador `@InjectModel()` y el tipo es Model<>

## Validar duplicados

```
  async create(createPokemonDto: CreatePokemonDto) {
    try {

      const createPokemon = await this.pokemonModel.create(createPokemonDto);
      return createPokemon;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error);
      throw new InternalServerErrorException('Cant create Pokemon - Check Server Logs')
    }
  }
```

Si se intenta crear un nuevo elemnto con el id o el name usado esto da un error que es atrapado por el try/catch, si el error.code es 11000 sabemos que es un error de duplicado, sino es un error interno, de esta forma nos olvidamos de hacer varias peticiones a la base de datos para verificar que no esten duplicados.

## Modificar Codigo Http

```
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }
```

Con el `HttpStatus.` nest nos da una lista de codigos:

```
export declare enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505
}

```

## Find One By Id

```
async findOne(term: string) {

    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or "${term} not found"`)

    return pokemon;
}
```

Podemos hacer distintas comprobacionese si es un numero con el `!isNaN(+term)`, `!pokemon && isValidObjectId(term)` o si todavia no encontro por el name que lanze un error de `NotFoundException`

## Update

```
async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    await pokemon.updateOne(updatePokemonDto, { new: true });
    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }
```

El tipo de pokemon es `PokemonDocument` de esta forma tendra los metodos que necesitamos para realizar el update.

## Delete

```
  async remove(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
  }
```

# Custom Pipe

Los Pipes transforman la data.
Creamos un modulo common para poder ordenar y meter archivos comunes como los pipes personalizados.

```
nest g mo common
```

Luego creamos el pipe personalizado:

```
nest g pi common/pipes/parseMongoId --no-spec
```

Los pipe no actualizan ningun modulos al ser creados.

Personalizamos nuestro pipe para rechazar mongo id invalidos:

```
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid mongo id`)
    }
    return value;
  }

}
```

Y lo usamos en la funcion @Delete() del controlador.

```
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
```

Y la funcion quedaria asi:

```
 async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    // const result = await this.pokemonModel.deleteOne({ _id: id });
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
    return
  }

```

# Crear SEED

Con el generate resource creamos todo un CRUD del cual solo necesitaremos una peticion @GET

```
nest g res seed --no-spec
```

## Usar el mongoose en otro componente

Primero tenemos que exportar el mongoose con toda su configuracion:

```
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      }
    ])
  ],
  exports: [MongooseModule]
})
export class PokemonModule { }
```

Y en el modulo en el cual queremos usarlo tenemos que importar el modulo:

```
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[PokemonModule]
})
export class SeedModule {}

```

Aca se importa el `PokemonModule` el cual exporta el `MongooseModule`

Ahora si en el `SEED` podemos usarlo de la siguiente forma:

```
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
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=150`)

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const pokemon = { no, name };
      this.pokemonModel.create(pokemon);
    })

    return data.results;
  }
}

```

Hacemos la ` @InjectModel(Pokemon.name)` que es la inyeccion del modelo asi lo podemos usar en el servicio y luego creamos la entrada en la base de datos `this.pokemonModel.create(pokemon)`.

# 3 Formas de Insertar en MongoDB

1. Es haciendo una insercion por cada valor que tengamos:

```
  async executeSeed() {

    await this.pokemonModel.deleteMany();

    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=150`)

    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const pokemon = { no, name };
      await this.pokemonModel.create(pokemon);
    })

    return 'SEED executed';
}

```

Este es el que mas tarda debido a que por cada insercion hace un await.

2. Promise.all
   La segunda forma es crearse un array de promesas, y luego realizar un Promise.all esta es mas efectiva que la anterior.

```
  async executeSeed() {

    await this.pokemonModel.deleteMany();

    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=150`)

    const insertPromisesArray = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const pokemon = { no, name };
      insertPromisesArray.push(this.pokemonModel.create(pokemon));
    })

    await Promise.all(insertPromisesArray);

    return 'SEED executed';
}
```

Ahora el forEach no es asincrono y solo crea el array de promesas para luego ejecutar el promise.all

3. Bulk create

```
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

```

Con el forEach creamo un array de objetos con lo valores que queremos. Y luego los insertamos a Mongo con el `.inserMany()` el cual admite un array de objetos.

## Crear un custom Provider

Crear una implementacion o wrapper propia.
1 - Crear una interface con los metodos que necesita cualquier proveedor que quiera usarse para realizar la peticion en este caso get:

```
export interface httpAdapter {
    get<T>(url: string): Promise<T>;
}
```

```
import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private axios: AxiosInstance = axios;


    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error('This is an error - Check Logs')
        }

    }

}
```

Tenemos que exportarlo porque este adapter esta a nivel de modulo y queremos usarlo en otros e importarlo.

```
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[PokemonModule, CommonModule]
})
export class SeedModule {}

```

Y ahora lo inyectamos en nuestro servicio.

```
  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<PokemonDocument>,

    private readonly http: AxiosAdapter,
  ) { }
```

Lo inyectamos en el constructor y lo usamos como si fuera un axios.

## Paginacion

Para la paginacion tenemos que usar en la url las propiedades de `offset` y `limit` que le indican a la API desde que objeto tiene que enviar y en que cantidad.

Como la paginacion es un servicio comun lo ponemos en la carpeta `common`. Y creamos el `dto`.

```
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Min(1)
    limit: number;

    @IsOptional()
    @IsPositive()
    offset: number;
}
```

La opcion del limite es para indicar la cantidad y el offset indica el indice o start

Como todo los que viene por url o body es string y nosotros esperamos numeros tenemos que hacer la conversion, una forma es hacerla en el `main.ts` de manera global para eso ponemos las siguientes opciones.

```
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );
```

El `transform: true,` y `transformOptions:` con esta configuracion transformamos en numero.

Ahora podemos usarlos en la funcion:

```
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('1__v');
  }
```

Con el `sort` ordenamos y con el `select` quitamos esa propiedad.

# Environment

Crear un `.env` en este archivo van a ir las variables de entorno, hay que agregarlo al `.gitignore`.

## Configuraciones de variables de entorno en Nest

Crear en el root del proyecto el archivo `.env`.
Instalacion del paquete:

```
npm i @nestjs/config

yarn add @nestjs/config
```

Luego en el `app.module.ts` del root hay que agregar la siguiente configuracion:

```
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

A esta importacion hay que agregarla al principio de los imports.
Las variables de entorno siempre son `strings`.

## Crear Config Module

Crearse una funcion que devuelve un objeto con las variables de entorno y inyectarlo en el root del ConfigModule del app.module.ts.

```
/config.app.config.ts

export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3002,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,
})
```

```
    ConfigModule.forRoot({
      load: [EnvConfiguration]
    }),

```

Estamso cargando en el ConfigModule las variables de entorno y este tiene un metodo para poder usarlos.
