# dashboard-backend
This repository contains the source code of the dashboard's backend system.
There are a total of 5 components that constitute the backend system:
1. TimescaleDB - a time-series database built on top of PostgreSQL
2. RabbitMQ - a message broker
3. NodeJS server - consumer of the message broker
4. Hasura GraphQL engine - GraphQL API provider

## Setup
The easiest way to set up the backend system on your local development environment is to use the
docker-compose file in the codebase. docker-compose pulls all required images of the components mentioned
in the previous section, and running the docker-compose will set up all required components of the backend
system.

To use execute the docker-compose file, install Docker Hub from https://hub.docker.com/ and run the command
`$ docker-compose up` in the codebase directory. 

If you've updated the backend codebase, you'd need to rebuild the image of the NodeJS server. To do so, run
`$ docker-compose up --build` and a new image of the codebase will be built and executed. 

In order to set up the database with the correct tables, you'd need to install [Flyway](https://flywaydb.org/) database migration tool. The codebase
already has Flyway migration config set up with the default database configurations in docker-compose. Run `flyway migrate` and 
voila all .sql files in `sql` folder should be applied to your database. 

## GraphQL
The GraphQL management console can be accessed at http://localhost:8080 with the admin secret `Xjb84POExBxidM5gB3tdVrWHK1nqbx9o`.
You may change the endpoint port and the admin secret in the docker-compose file. 

## TimescaleDB
The PostgreSQL instance (installed with TimescaleDB extension) runs on port 5432. The default user is `postgres`
and the default password is `password`. Again, these values can be changed in the docker-compose file. Do note that
a persistent volume has been attached to the TimescaleDB image. You'd need to remove the persistent volume with `docker volume prune`
if you wish to start a fresh database. 

[Flyway](https://flywaydb.org/) is the database migration tool used in this project. All applied SQL commands reside in `/sql` folder.
It is recommended to use Flyway as a way to keep track of changes to database. To apply new SQL commands to the database, create a new `.sql`
file in the `/sql` directory with the name `VXX__MY_CHANGES.sql` where `XX` is the next version number. Run `flyway migrate` again to apply
the new changes to the database. 

## RabbitMQ
The RabbitMQ instance runs on port 5672 for AMQP communication.
The management console can be accessed at http://localhost:15672 with the default user `root` and default password `password`.
These values can be changed in the docker-compose file. 

## NodeJS Server
The docker-compose file spins up 2 instances of the NodeJS server -- one to process predicted data and one to process sensor data.
All messages are encrypted with AES-128 CBC standard. The encryption secret is provided in the docker-compose file and can be changed
if necessary. 

Each NodeJS server consumes from the appointed queue in RabbitMQ i.e. sensor data instance consumes from the queue `data_queue`
while predicted data instance consumes from the queue `predicted_queue`.

The codebase also provides a client script in `./src/util/client.js` to test the server. To execute the test script, provide the RabbitMQ's
user and password as `RABBITMQ_USER` and `RABBITMQ_PASSWORD` environment variables respectively before
running `node ./src/util/client.js`. 
