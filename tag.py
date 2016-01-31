import subprocess
from StringIO import StringIO
from Log import Log

def manage_event(event):
    action = event['action']
    actor_id = event['actor_id']
    rfid_id = event['rfid_id']
    if rfid_id =='0':
        Log.info("RFID reader "+ actor_id+ " is "+ action)
    else:
        Log.info("Event from RFID reader "+ actor_id+ ": tag "+ rfid_id+ " get "+ action)
        if action == 'IN':
            args = ['/home/pi/Rabsberry/rabsberry-core/plugins/clock/read_hour.py']
            p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = p.communicate()
            if p.returncode != 0:
                raise subprocess.CalledProcessError(p.returncode, "", error)
            return 'OK'


    return 'OK'


