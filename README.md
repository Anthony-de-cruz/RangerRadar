# RangerRadar

![Image of idea 1](docs/project_diagram_1.png)
![Image of idea 2](docs/project_diagram_2.png)

## Setup

> [!IMPORTANT]
>
> ### Prerequisites
>
> - Docker
>
> Docker will handle the dependencies such as PostgreSQL, NodeJS and NPM.
> On Windows/MacOS, I'd recommend installing the Docker GUI, as it also installs all the CLI tools, check the Docker section for more.
>
> If you're unsure about Docker at all, I highly recommend these 2 videos below, they offer most of what you need, very quickly.
>
> [docker in 100 seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ) and [setting up docker](https://www.youtube.com/watch?v=gAkwW2tuIqE)

### Build and Run

In the root directory, run:

```sh
$ docker compose up --build
```

Note that `docker-compose` is outdated, though still shows up on a lot of tutorials/guides. Use `docker compose` instead.

Which should result in output similar to this trimmed down reading:

```sh
--------
```

The first build will take a while, caching will speed up future builds.
The Node and Postgres containers will be running, you can see them using:

```sh
$ docker ps
```

Which should show the 2 containers:

```sh
CONTAINER ID   IMAGE                            COMMAND                  CREATED              STATUS         PORTS                    NAMES
--
```

When you want to restart the containers, just use `ctrl-c` on the command. If you want to delete them and completely rebuild, run `docker compose down` before running `docker compose up --build`. Note that this completely wipes any existing data in the database, which gets repopulated by the startup script.

Alternatively, you can do all this in the Docker GUI or even in your editor using the right extensions.

## Database documentation

### Schema

For an actually accurate understanding of the schema, read [the table build script](/database/scripts/schema/create_tables.sql). Reading the [triggers](/database/scripts/schema/create_triggers.sql) also can help you understand the system.

#### Things to keep in mind

## Development notes
