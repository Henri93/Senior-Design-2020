import atexit
import time
import re
import socketio
import signal
import sys
import json
current_milli_time = lambda: int(round(time.time() * 1000))

sio = socketio.Client()

def disconnect():
    print('Disconnected')
    sio.emit('hub_disconnect', {'timestamp': current_milli_time(),'pumps': [8]});
    sio.disconnect()

@sio.event
def connect():
    print("I'm connected to sio \n")
    sio.emit('hub_connect', {'timestamp': current_milli_time(),'pumps': [8]});
    
@sio.on('run_order')
def on_run_order(data):
	port = data['pump']
	ingredients = data['order']['ingredients']

	for ingredient, info in ingredients.items():
		ingredInfo = json.loads(info)
		ml_amt = float(ingredInfo['total'] - ingredInfo['dispensed'])
		# hub.device_list[port].run_finite_with_accel(ml_amt, 0, 2, 200, 'ml')


atexit.register(disconnect)
sio.connect('http://localhost:3000')

def signal_handler(sig, frame):
    disconnect()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.pause()
