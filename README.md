<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokedex App

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
Creamos un archivo que se va a llamar `docker-compose.yaml`, en este archivo es importante los espacios.
