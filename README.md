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
