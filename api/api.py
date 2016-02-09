#!/usr/bin/env python

import os
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, base_dir)

from flask import Flask
from flask import request
import json

from flask.ext.mongoengine import MongoEngine
from flask.ext.mongorest import MongoRest
from flask.ext.mongorest.views import ResourceView
from flask.ext.mongorest.resources import Resource
from flask.ext.mongorest import operators as ops
from flask.ext.mongorest import methods

import tag


app = Flask(__name__)
app.config.update(
    MONGODB_HOST='localhost',
    MONGODB_PORT=27017,
    MONGODB_DB='rabsberry',
)

db = MongoEngine(app)
api = MongoRest(app)


# CRUD rfid
class Rfid(db.Document):
    rfid_id = db.StringField(required=True, unique=True)
    desc = db.StringField()
    action_in = db.StringField()
    action_out = db.StringField()


class RfidResource(Resource):
    document = Rfid
    related_resources = {
    }
    filters = {
        'rfid_id': [ops.Exact],
    }
    rename_fields = {
    }


@api.register(name='rfids', url='/api/rfids/')
class RfidView(ResourceView):
    resource = RfidResource
    methods = [methods.Create, methods.Update, methods.Fetch, methods.List, methods.Delete]
# end CRUD rfid
# ----------------

@app.route('/api/noroute')
def hello():
    return 'no route'


@app.route('/api')
def hello_world():
    return 'Hello World! in WSGI mode vraiment!!!!'


@app.route('/api/event', methods=['POST'])
def event():
    event = json.loads(request.data)
    actor_type = event['actor_type']
    if actor_type == "RFID_READER":
        return tag.manage_event(event)


if __name__ == '__main__':
    app.run()
