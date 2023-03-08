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

```
npm i @nestjs/serve-static
```

```
@Module({
  imports:[
    ServeStaticModuleForRoot({
      rootPath: join(__dirname, '..','public'),
    })
  ],
})

export class AppModule{}
```
