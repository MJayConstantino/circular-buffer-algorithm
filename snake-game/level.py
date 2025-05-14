import random
from constants import *

# Level class
class Level:
    def __init__(self):
        self.obstacles = []
        self.generate_obstacles()
    
    def generate_obstacles(self):
        # Clear existing obstacles
        self.obstacles = []
        
        # Add some random obstacles
        num_obstacles = random.randint(5, 15)
        for _ in range(num_obstacles):
            x = random.randint(1, GRID_WIDTH - 2)
            y = random.randint(1, GRID_HEIGHT - 2)
            self.obstacles.append((x, y))
    
    def check_collision(self, position):
        return position in self.obstacles