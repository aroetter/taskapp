# Basic Flask API

## Set up virtualenv
```
$ pip3 install virtualenv
$ virtualenv env
$ source ./env/bin/activate
$ pip3 install flask flask-sqlalchemy
```

## Set up the database
```
$ python3
from main import db
db.create_all()
```

## Ways to test the API
```
$ # Create
$ curl -d @- -H 'Content-Type: application/json' http://localhost:5001/task/api/v1/resources/tasks/create <  debug_create_tasks.json 

# Read
$ curl http://localhost:5001/task/api/v1/resources/tasks/all

# Update (TODO)
$ curl -X PUT -d @- -H 'Content-Type: application/json' http://localhost:5001/task/api/v1/resources/tasks/update <  debug_update_tasks.json 

# Delete
$ curl -X DELETE http://localhost:5001/task/api/v1/resources/tasks/delete?id=3

```