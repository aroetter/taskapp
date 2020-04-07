
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
import flask
from flask import request, jsonify


API_ROOT_URL = "/task/api/v1/resources"
app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

HTTP_400_BAD_REQUEST = 400
HTTP_500_INTERNAL_SERVER_ERROR = 500

# Set up the model
class Task(db.Model):
    # set up columns
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow())

    def __repr__(self):
        return "<Task %r>" % self.id

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'date_created': self.date_created.date().strftime("%Y-%m-%d") 
        }


@app.route("/", methods=["GET"])
def home():
    return "OK\n"

@app.route(API_ROOT_URL + "/tasks/all", methods=["GET"])
def api_get_tasks_all():
    try:
        tasks = Task.query.order_by(Task.date_created).all()
    except SQLAlchemyError as ex:
        return "DB Error: " + str(ex), HTTP_500_INTERNAL_SERVER_ERROR
    to_return = [task.to_dict() for task in tasks]
    return jsonify(to_return)




@app.route(API_ROOT_URL + "/tasks", methods=["GET"])
def api_get_tasks_by_id():
    if 'id' in request.args:
        id = int(request.args['id'])
    else:
        return "Bad Request: Missing 'id' query parameter", HTTP_400_BAD_REQUEST

    task = db.session.query(Task).get(id)
    if task is None:
        return "Couldn't find task: " + str(id), HTTP_400_BAD_REQUEST
    else:
        return jsonify([task.to_dict()])

    results = []

    for task in tasks:
        if task['id'] == id:
            results.append(task)
    return jsonify(results)

@app.route(API_ROOT_URL + "/tasks/delete", methods=["DELETE"])
def api_delete_task():
    if 'id' in request.args:
        id = int(request.args['id'])
    else:
        return "Bad Request: Missing 'id' query parameter", HTTP_400_BAD_REQUEST

    task_to_delete = Task.query.get(id)
    if task_to_delete is None:
        return "No such item with id=" + id, HTTP_400_BAD_REQUEST
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return "OK\n"
    except Exception as ex:
        return "Couldn't delete this task from the DB!" + repr(ex), HTTP_500_INTERNAL_SERVER_ERROR


@app.route(API_ROOT_URL + "/tasks/create", methods=["POST"])
def api_create_tasks():
    # TODO throw client error if malformed here
    task_content_list = request.get_json()["content"]

    try:
        for task_content in task_content_list:
            new_task = Task(content=task_content)
            db.session.add(new_task)
        db.session.commit()
    except Exception as ex:
        return "There was an issue adding your task: " + str(ex) + "\n", HTTP_500_INTERNAL_SERVER_ERROR

    return "Added " + str(len(task_content_list)) + " tasks!\n"


@app.route(API_ROOT_URL + "/tasks/update", methods=["PUT"])
def api_update_tasks():
    task_list = request.get_json()["tasks"]
    #try:
    for task in task_list:
        cur_id = task["id"]
        cur_content = task["content"]

        db_task = Task.query.get(cur_id)
        if db_task is None:
            return "Can't find task with id=" + cur_id, HTTP_400_BAD_REQUEST
        db_task.content = cur_content

    try:
        db.session.commit()
    except Exception as ex:
        return "Couldn't update these tasks in the DB: " + repr(ex), HTTP_500_INTERNAL_SERVER_ERROR

    return "OK\n"


if __name__ == "__main__":
    app.run("localhost", 5001)