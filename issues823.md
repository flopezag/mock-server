# Queries to simulate the problem: Issue 823

[https://github.com/FIWARE/context.Orion-LD/issues/823](https://github.com/FIWARE/context.Orion-LD/issues/823)

Orion instance: 

```json
{
 "orionld version": "post-v0.7",
 "orion version":   "1.15.0-next",
 "uptime":          "0 d, 0 h, 19 m, 8 s",
 "git_hash":        "nogitversion",
 "compile_time":    "Sun Apr 18 17:32:55 UTC 2021",
 "compiled_by":     "root",
 "compiled_in":     "buildkitsandbox",
 "release_date":    "Sun Apr 18 17:32:55 UTC 2021",
 "doc":             "https://fiware-orion.readthedocs.org/en/master/"
}
```

Check the OrionLD

```bash
http localhost:1026/version
```

Subscription with format keyValues

```bash
printf '{
    "description": "Notify Nifi when values updated",
    "type": "Subscription",
    "entities": [
        {"type": "Beach"}
    ],
    "notification": {
        "attributes": ["occupationRate", "peopleOccupancy", "dateObserved"],
        "format": "keyValues",
        "endpoint": {
            "uri": "http://host.docker.internal:10000/notify",
            "accept": "application/json"
        }
    }
}' | http  POST http://localhost:1026/ngsi-ld/v1/subscriptions \
 Content-Type:'application/json' \
 Link:'<https://smartdatamodels.org/context.jsonld>'
```

Create a new entity:

```bash
printf '{
    "id": "urn:ngsi-ld:Beach:Benidorm:Playa-Levante:B001",
    "type": "Beach",
    "dateObserved": {"type": "Property", "value": {"type": "DateTime", "value": "2021-04-27T09:26:17+02:00"}},
    "occupationRate": {"type": "Property", "value": "low"},
    "peopleOccupancy": {"type": "Property", "value": 4}
}' | http POST http://localhost:1026/ngsi-ld/v1/entities  \
 Content-Type:'application/json' \
 Link:'<https://smartdatamodels.org/context.jsonld>'
```

Send new updates values to OrionLD:

```bash
printf '{
    "occupationRate": {"type": "Property", "value": "high"},
    "peopleOccupancy": {"type": "Property", "value": 80},
    "dateObserved": {"type": "Property", "value": {"type": "DateTime", "value": "2021-04-27T09:50:00+02:00"}}
}' | http PATCH http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:Beach:Benidorm:Playa-Levante:B001/attrs \
Content-Type:'application/json' \
Link:'<https://smartdatamodels.org/context.jsonld>'
```

Received notifications:

```bash
{
  id: 'urn:ngsi-ld:Notification:60897efc430d9a1e80bb51a6',
  type: 'Notification',
  subscriptionId: 'urn:ngsi-ld:Subscription:60897edc430d9a1e80bb51a0',
  notifiedAt: '2021-04-28T15:27:56.319Z',
  data: [
    {
      id: 'urn:ngsi-ld:Beach:Benidorm:Playa-Levante:B001',
      type: 'Beach',
      'https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/dateObserved': [Object],
      occupationRate: 'high',
      peopleOccupancy: 80
    }
  ]
}
```

If we do the same with the normalized format:

```bash
printf '{
    "description": "Notify Nifi when values updated",
    "type": "Subscription",
    "entities": [
        {"type": "Beach"}
    ],
    "notification": {
        "attributes": ["occupationRate", "peopleOccupancy", "dateObserved"],
        "format": "normalized",
        "endpoint": {
            "uri": "http://host.docker.internal:10000/notify",
            "accept": "application/json"
        }
    }
}' | http  POST http://localhost:1026/ngsi-ld/v1/subscriptions \
 Content-Type:'application/json' \
 Link:'<https://smartdatamodels.org/context.jsonld>'
```

The answer is the following:

```bash
{
  id: 'urn:ngsi-ld:Notification:60898c9975a91f4a8cdb0f1f',
  type: 'Notification',
  subscriptionId: 'urn:ngsi-ld:Subscription:60898c8675a91f4a8cdb0f1b',
  notifiedAt: '2021-04-28T16:26:01.224Z',
  data: [
    {
      id: 'urn:ngsi-ld:Beach:Benidorm:Playa-Levante:B001',
      type: 'Beach',
      dateObserved: [Object],
      occupationRate: [Object],
      peopleOccupancy: [Object]
    }
  ]
}
```
