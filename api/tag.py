#!/usr/bin/python

import subprocess
import logging

logging.basicConfig(format='%(asctime)s %(levelname)s: %(message)s', level=logging.DEBUG, filename='/var/log/rabsberry/api.log')
  
from core.tools.config import getConfig
conf = getConfig()
CORE_ROOT = conf['CORE_ROOT']

from database import get_db_client

db = get_db_client()

def get_rfid_info(rfid_id):
    rfid = db.rfid.find_one({"rfid_id": rfid_id})
    if rfid != None:
        logging.debug("Le tag "+rfid_id+" ("+rfid['desc']+") est deja dans la base")
    else:
        logging.info("insertion du tag "+rfid_id+" dans la base")
        rfid = {"rfid_id":rfid_id,"desc":"","action_in":"None","action_out":"None"}
        db.rfid.insert_one(rfid)
    return rfid

def manage_event(event):
    action = event['action']
    actor_id = event['actor_id']
    rfid_id = event['rfid_id']
    if rfid_id =='0':
        logging.debug("RFID reader "+ actor_id+ " is "+ action)
    else:
        rfid = get_rfid_info(rfid_id)

        if action == 'IN':
            action_prg = rfid['action_in']
        elif action == 'OUT':
            action_prg = rfid['action_out']
        logging.debug("Event from RFID reader "+ actor_id+ ": tag "+ rfid_id+ " get "+ action +" -> "+action_prg)

        if action_prg == "None":
            return 'OK'

        if action_prg == 'read_exact_hour':
            logging.debug("trying to read exact hour")
            args = [CORE_ROOT+'/plugins/clock/read_exact_hour.py']
            p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = p.communicate()
            if p.returncode != 0:
                raise subprocess.CalledProcessError(p.returncode, "can't read hour", error)
            return output

        if action_prg == 'read_hour':
            logging.debug("trying to read hour")
            args = [CORE_ROOT+'/plugins/clock/read_hour.py']
            p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = p.communicate()
            if p.returncode != 0:
                raise subprocess.CalledProcessError(p.returncode, "can't read hour", error)
            return output

        if action_prg == 'weather':
            logging.debug("trying to read weather forecast")
            args = [CORE_ROOT+'/plugins/weather/read_weather_broadcast.py']
            p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = p.communicate()
            if p.returncode != 0:
                raise subprocess.CalledProcessError(p.returncode, "can't read weather forecast", error)
            return output

        if action_prg == 'humor':
            logging.debug("trying to read humor")
            args = [CORE_ROOT+'/plugins/surprise/read_humor.py']
            p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = p.communicate()
            if p.returncode != 0:
                raise subprocess.CalledProcessError(p.returncode, "can't read humor", error)
            return output

        logging.debug(action_prg + " is not implemented")
    return 'OK'
