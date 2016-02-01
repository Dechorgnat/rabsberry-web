import subprocess
from StringIO import StringIO
from Log import Log

from database import db

def get_rfid_info(rfid_id):
    rfid = db.rfid.find_one({"id": rfid_id})
    if rfid:
        return rfid
    else:
        rfid = {"id":rfid,"desc":"","action_in":"","action_out":""}
        db.rfid.insert_one(rfid)
        return rfid

def manage_event(event):
    action = event['action']
    actor_id = event['actor_id']
    rfid_id = event['rfid_id']
    if rfid_id =='0':
        Log.info("RFID reader "+ actor_id+ " is "+ action)
    else:
        rfid = get_rfid_info(rfid_id)

        Log.info("Event from RFID reader "+ actor_id+ ": tag "+ rfid_id+ " get "+ action)
        if action == 'IN':
	    Log.info("trying to read hour")
            # TODO use config
            args = ['/home/pi/Rabsberry/rabsberry-core/plugins/clock/read_hour.py']
            p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = p.communicate()
            if p.returncode != 0:
                raise subprocess.CalledProcessError(p.returncode, "can't read hour", error)
            return output


    return 'OK'


