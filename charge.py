import requests


def launchCar():

    for i in range(0, 100):
        requests.post('http://localhost:6808/start-car', {"license_plate": str(i)})


def changeInterval():
    for i in range(0, 100):
        requests.post('http://localhost:6808/edit-request-interval', {"license_plate": str(i), "interval": 0.01})

def stopCar():

    for i in range(0, 100):
        requests.post('http://localhost:6808/stop-car', {"license_plate": str(i)})

stopCar()
