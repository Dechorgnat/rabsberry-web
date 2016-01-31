import subprocess
from StringIO import StringIO
from Log import Log

def tag_manage_event(event):
    action = event['action']
    actor_id = event['actor_id']
    rfid_id = event['rfid_id']
    if rfid_id =='0':
        Log.info("RFID reader ", actor_id, " is ", action)
    else:
        Log.info("Event from RFID reader ", actor_id, ": tag ", rfid_id, " get ", action)


    '''args = ['rbd',
            'event',
            pool_name+"/"+image_name+"@"+snap_name,
            dest_pool_name+"/"+dest_image_name
            ]
    p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = p.communicate()
    if p.returncode != 0:
        raise subprocess.CalledProcessError(p.returncode, "", error)
    return StringIO(output)
        '''