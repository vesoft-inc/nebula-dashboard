## Run a released Dashboard version

Start a NebulaGraph cluster.
```bash
cd playground
docker-compose -f docker-compose-nebula-graph.yaml up -d
```

Run Dashboard.

```bash
docker-compose build
docker-compose up -d
```

## Run for Dashbaord development

Start a NebulaGraph cluster.
```bash
cd playground
docker-compose -f docker-compose-nebula-graph.yaml up -d
```

```bash
docker-compose -f docker-compose-dev.yaml build
docker-compose -f docker-compose-dev.yaml up
```

