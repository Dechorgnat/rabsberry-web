#!/usr/bin/python

import subprocess
from Log import Log

from core.tools.config import getConfig
conf = getConfig()
CORE_ROOT = conf['CORE_ROOT']

import serial
from time import sleep

def manage_event(event):
    command = event['command']
    ser = serial.Serial ("/dev/ttyAMA0")    #Open named port
    ser.baudrate = 1200                     #Set baud rate to 9600

    i = 0
    while True:
        ser.write(command)                    #Send
        #ser.write('\n')                    #Send
        i=i+1
        response = ser.read(2)
        if response == "OK" or i==10:
            break;
        response = ''
        sleep(0.5)
    ser.close()
    return response 
