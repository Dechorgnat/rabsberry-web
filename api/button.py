#!/usr/bin/python

import subprocess
from Log import Log

from core.tools.config import getConfig
conf = getConfig()
CORE_ROOT = conf['CORE_ROOT']

from database import get_db_client

db = get_db_client()

def get_rfid_info(rfid_id):
    rfid = db.rfid.find_one({"id": rfid_id})
    print rfid
    if rfid != None:
        print "tag "+rfid_id+" deja dans la base"
    else:
        print "insertion du tag "+rfid_id+" dans la base"
        rfid = {"rfid_id":rfid_id,"desc":"","action_in":"None","action_out":"None"}
        db.rfid.insert_one(rfid)
    return rfid

def manage_event(event):
    action = event['action']
    actor_id = event['actor_id']
    Log.info("Event from "+ actor_id+ ": action "+ action)
    if action == 'SHORT_PRESSED':
        Log.info("make R2D2 sream")
        args = [CORE_ROOT+'/functions/play_audio.py',
                CORE_ROOT+'/resources/mp3/star_wars/r2d2/r2d2-squeaks5.mp3']
        p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, error = p.communicate()
        if p.returncode != 0:
            raise subprocess.CalledProcessError(p.returncode, "can't play sound", error)
        return output

    return 'OK'
