#!/usr/bin/python

import subprocess
from Log import Log
import json;
from core.tools.config import getConfig
import paho.mqtt.client as paho

conf = getConfig()
CORE_ROOT = conf['CORE_ROOT']

def manage_event(event):
    action = event['action']
    actor_id = event['actor_id']
    Log.info("Event from "+ actor_id+ ": action "+ action)
    if action == 'SHORT_PRESSED':
        Log.info("make R2D2 sream")
        # init mqtt connection and subscribe
        broker="127.0.0.1"
        client = paho.Client("show_weather")  # create client
        client.connect(broker)  # connect
        message = {"command": "pattern", "pattern": "google"}
        client.publish("leds",json.dumps(message))
        print json.dumps(message)
        
        message = {"command": "goto", "ear": "both", "pos":13, "dir":"forward"}
        client.publish("ears",json.dumps(message))
        print json.dumps(message)
        

        args = [CORE_ROOT+'/functions/play_audio.py',
                CORE_ROOT+'/resources/mp3/star_wars/r2d2/r2d2-squeaks5.mp3']
        p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, error = p.communicate()
        if p.returncode != 0:
            raise subprocess.CalledProcessError(p.returncode, "can't play sound", error)
        return output

    return 'OK'
