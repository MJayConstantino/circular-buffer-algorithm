from enum import Enum

class GameState(Enum):
    MENU = 0
    GAME = 1
    GAME_OVER = 2

# Directions
class Direction(Enum):
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)
