## Run a released Dashboard version

Start a nebula graph cluster.
```bash
docker-compose up -d -f docker-compose-nebula-graph.yml
```

Run Dashboard.

```bash
docker-compose build
docker-compose up -d
```

## Run for Dashbaord development

Start a nebula graph cluster.
```bash
docker-compose up -d -f docker-compose-nebula-graph.yml
```

```bash
docker-compose build -f docker-compose-dev.yml
docker-compose up
```
