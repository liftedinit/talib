# Talib Blockchain Explorer for MANY Protocol

# Development 

To start the instance for local dev simply run docker-compose:
`docker-compose up`

### Development Config: 
- You will need a many ledger or kvstore chain to sync blocks.
- Follow the login steps below and add a network to sync.

### Documentation
Swagger REST API documentation is availabe at /api. 

# Login
All modifying endpoints to the Talib server are protected by a password. Currently, there is no update frontend that would allow you to login and make modifications, so a user would have to login manually via the command line and use the JWT token to make requests.

For example, to add a new neighborhood instance, first login to get a JWT:

```bash
# The admin password is set in the .env file.
$ curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password":"admin"}' http://localhost:3000/api/v1/auth/login
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjAsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODU2NTE3MDcsImV4cCI6MTY4NTY1MTc2N30.iR41GGP2zqNrfyoTXd6Ul7t7_Q4tHg0r1gHZj7D_OvA"}
```

An easier way to set the environment would be to extract the token and set it to a TALIB_TOKEN environment variable like so:

```bash
$ set TALIB_TOKEN "$(curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password":"admin"}' http://localhost:3000/api/v1/auth/login | jq -r .access_token)"
```

Then, use the token to make the update request:

```bash
$ curl http://localhost:3000/api/v1/neighborhoods -X PUT -H "Authorization: Bearer $TALIB_TOKEN" -H "Content-Type: application/json" -d '{"name": "Manifest QA Neighborhood", "description": "The Ledger QA neighborhood of the Manifest network.", "url": "https://qa-api.liftedinit.tech"}'
{"id":4,"address":"mae6o6amfv5upukm4n42rnnz4vicewllq3nx2k3yprhr3vny33","url":"https://qa-api.liftedinit.tech/","name":"Manifest QA Neighborhood","description":null}⏎
```
