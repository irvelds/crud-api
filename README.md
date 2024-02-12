# CRUD API server

## Install the application

Clone from the repository

```sh
git clone https://github.com/irvelds/crud-api.git
```

Go to development branch

```sh
git checkout develop
```

Setup dependencies

```sh
npm install
```

Rename `.env.example` to `.env` 


## Run the application

1. To run the application in development mode:

   ```sh
   npm run start:dev
   ```

   The application will launch in development mode on the port from `.env`. (default 4000)

2. To run the application in production mode:

   ```sh
   npm run start:prod
   ```
   `Webpack` will build the application into a file `dist/main.js` and run it.

3. To run the application with load balancer:

    ```sh
    npm run start:multi
    ```
    This command will create the number of worker processes according to the CPU cores of the host machine 
    and the load balancer that distributes requests between them.

## Test the application

You can use `Postman` for CRUD API server testing


To run jest test, use command:
```sh
npm run test
```
