from circular_buffer import CircularBuffer
from constants import *
from enums import *

# Snake class
class Snake:
    def __init__(self, x, y):
        self.body = CircularBuffer(GRID_WIDTH * GRID_HEIGHT)
        self.body.enqueue((x, y))  # Head position
        self.direction = Direction.RIGHT
        self.grow = False
    
    def move(self):
        head_x, head_y = self.body.peek_head()
        dx, dy = self.direction.value
        new_head = ((head_x + dx) % GRID_WIDTH, (head_y + dy) % GRID_HEIGHT)
        
        # Add new head
        self.body.enqueue(new_head)
        
        # Remove tail if not growing
        if not self.grow:
            self.body.dequeue()
        else:
            self.grow = False
    
    def get_head(self):
        return self.body.peek_head()
    
    def get_body(self):
        return self.body.get_all_items()
    
    def check_collision(self):
        head = self.get_head()
        body = self.get_body()
        # Skip the head when checking for body collision
        return head in body[:-1]
    
    def change_direction(self, new_direction):
        # Prevent 180-degree turns
        if (new_direction == Direction.UP and self.direction != Direction.DOWN) or \
           (new_direction == Direction.DOWN and self.direction != Direction.UP) or \
           (new_direction == Direction.LEFT and self.direction != Direction.RIGHT) or \
           (new_direction == Direction.RIGHT and self.direction != Direction.LEFT):
            self.direction = new_direction
