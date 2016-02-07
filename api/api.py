#!/usr/bin/env python

import os
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, base_dir)

from flask import Flask
from flask import request
import json
import tag

app = Flask(__name__)


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
