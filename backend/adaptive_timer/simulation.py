import pygame
import sys
import os
import random
import time
import threading
from vehicle_detection import VehicleDetection

# Initialize Pygame
pygame.init()
simulation_time = 300
current_time = 0

# Colors
black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)
yellow = (255, 255, 0)
green = (0, 255, 0)
blue = (0, 0, 255)

# Window Dimensions
width = 1400
height = 800
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Traffic Signal Timer")

# Signal Timers
defaultGreen = {0: 10, 1: 10, 2: 10, 3: 10}
defaultRed = 150
defaultYellow = 5

signals = []
noOfSignals = 4
currentGreen = 0   # Indicates which signal is green
nextGreen = (currentGreen + 1) % noOfSignals
currentYellow = 0   # Indicates whether yellow signal is on or off 

speeds = {'car': 2.25, 'bus': 1.8, 'truck': 1.8, 'bike': 2.5}  
vehicles = {'right': {0:[], 1:[], 2:[], 'crossed':0}, 'down': {0:[], 1:[], 2:[], 'crossed':0}, 
            'left': {0:[], 1:[], 2:[], 'crossed':0}, 'up': {0:[], 1:[], 2:[], 'crossed':0}}
vehicleTypes = {0:'car', 1:'bus', 2:'truck', 3:'bike'}
directionNumbers = {0:'right', 1:'down', 2:'left', 3:'up'}

# Coordinates of signal image, timer, and vehicle count
signalCoods = [(530, 230), (810, 230), (810, 570), (530, 570)]
signalTimerCoods = [(530, 210), (810, 210), (810, 550), (530, 550)]
vehicleCountCoods = [(480, 210), (880, 210), (880, 550), (480, 550)]
vehicleCountTexts = ["0", "0", "0", "0"]

# Gap between vehicles
gap = 15    # px

# Initialize signals
class Signal:
    def __init__(self, red, yellow, green):
        self.red = red
        self.yellow = yellow
        self.green = green
        self.signalText = ""
        
# Initialize signal objects
for i in range(noOfSignals):
    signals.append(Signal(defaultRed, defaultYellow, defaultGreen[i]))
    signals[i].signalText = "30"
    
class Vehicle:
    def __init__(self, direction_number, vehicle_type, path_number):
        self.x = None
        self.y = None
        self.direction_number = direction_number
        self.vehicle_type = vehicle_type
        self.path_number = path_number
        self.crossed = 0
        vehicles[directionNumbers[direction_number]][path_number].append(self)
        self.index = len(vehicles[directionNumbers[direction_number]][path_number]) - 1
        
def initialize():
    ts1 = threading.Thread(target=updateValues, args=())
    ts1.daemon = True
    ts1.start()
    repeat()

def repeat():
    global currentGreen, currentYellow, nextGreen
    while simulation_time > current_time:
        updateSignalAndVehicles()
        time.sleep(1)
        
def updateValues():
    global current_time
    while simulation_time > current_time:
        time.sleep(1)
        current_time += 1
        
def updateSignalAndVehicles():
    global currentGreen, currentYellow, nextGreen
    if currentYellow == 0:
        if (signals[currentGreen].green > 0):
            signals[currentGreen].green -= 1
            for i in range(noOfSignals):  
                if i == currentGreen:
                    if signals[i].yellow == 0:
                        signals[i].signalText = signals[i].green
                else:
                    if signals[i].red > 0:
                        signals[i].red -= 1
                    if signals[i].red == 0:
                        currentYellow = 1
                        signals[i].yellow = defaultYellow
                        signals[i].signalText = signals[i].yellow
            updateVehicles()
        else:
            currentYellow = 1
            for i in range(noOfSignals):
                if i == currentGreen:
                    signals[i].yellow = defaultYellow
                    signals[i].signalText = signals[i].yellow
    else:
        if(signals[currentGreen].yellow > 0):
            signals[currentGreen].yellow -= 1
            signals[currentGreen].signalText = signals[i].yellow
            updateVehicles()
        else:
            signals[currentGreen].red = defaultRed
            signals[currentGreen].yellow = 0
            signals[currentGreen].green = 0
            signals[currentGreen].signalText = signals[currentGreen].red
            currentGreen = nextGreen
            nextGreen = (currentGreen + 1) % noOfSignals
            signals[nextGreen].red = defaultRed
            signals[nextGreen].yellow = 0
            signals[nextGreen].green = defaultGreen[nextGreen]
            signals[nextGreen].signalText = signals[nextGreen].green
            currentYellow = 0
            
def updateVehicles():
    for direction in vehicles:
        for lane in vehicles[direction]:
            if lane == 'crossed':
                continue
            for vehicle in vehicles[direction][lane]:
                if vehicle.crossed == 0:
                    if direction == 'right':
                        if vehicle.x + vehicle.image.get_rect().width > stopLines[direction]:
                            vehicle.crossed = 1
                        else:
                            vehicle.x += speeds[vehicle.vehicle_type]
                    elif direction == 'down':
                        if vehicle.y + vehicle.image.get_rect().height > stopLines[direction]:
                            vehicle.crossed = 1
                        else:
                            vehicle.y += speeds[vehicle.vehicle_type]
                    elif direction == 'left':
                        if vehicle.x < stopLines[direction]:
                            vehicle.crossed = 1
                        else:
                            vehicle.x -= speeds[vehicle.vehicle_type]
                    elif direction == 'up':
                        if vehicle.y < stopLines[direction]:
                            vehicle.crossed = 1
                        else:
                            vehicle.y -= speeds[vehicle.vehicle_type]
                            
def main():
    global current_time
    initialize()
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()

        screen.fill(white)
        for i in range(0, noOfSignals):  
            drawSignal(i)
            displaySignalTimer(i)
        pygame.display.update()

if __name__ == '__main__':
    main()
