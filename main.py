#!/usr/bin/env python

from flask import Flask
from flask import request

import json

import tag


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/event', methods=['POST'])
def event():
    event = json.loads(request.data)
    actor_type = event['actor_type']
    if actor_type == "RFID_READER":
        return tag.manage_event(event)


if __name__ == '__main__':
    app.run(port="4321")
