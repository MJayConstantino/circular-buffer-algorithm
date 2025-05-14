import random
from constants import *

# Food class
class Food:
    def __init__(self, snake_body):
        self.position = self.generate_position(snake_body)
    
    def generate_position(self, snake_body):
        while True:
            position = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
            if position not in snake_body:
                return position
    
    def respawn(self, snake_body):
        self.position = self.generate_position(snake_body)