#!/usr/bin/python

import subprocess
from Log import Log

from core.tools.config import getConfig
conf = getConfig()
CORE_ROOT = conf['CORE_ROOT']


def manage_event(event):
    command = event['command']
    # action = event['action']
    # actor_id = event['actor_id']
    print event

    return "OK"
