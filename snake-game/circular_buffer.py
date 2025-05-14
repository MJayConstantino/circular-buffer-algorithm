class CircularBuffer:
    def __init__(self, capacity):
        self.buffer = [None] * capacity
        self.capacity = capacity
        self.size = 0
        self.head = 0
        self.tail = 0
    
    def is_empty(self):
        return self.size == 0
    
    def is_full(self):
        return self.size == self.capacity
    
    def enqueue(self, item):
        if self.is_full():
            # If full, move tail forward (essentially removing the oldest item)
            self.tail = (self.tail + 1) % self.capacity
        else:
            self.size += 1
        
        # Add new item at head position
        self.buffer[self.head] = item
        # Move head forward
        self.head = (self.head + 1) % self.capacity
    
    def dequeue(self):
        if self.is_empty():
            return None
        
        # Get item at tail
        item = self.buffer[self.tail]
        # Move tail forward
        self.tail = (self.tail + 1) % self.capacity
        self.size -= 1
        return item
    
    def peek_tail(self):
        if self.is_empty():
            return None
        return self.buffer[self.tail]
    
    def peek_head(self):
        if self.is_empty():
            return None
        return self.buffer[(self.head - 1) % self.capacity]
    
    def get_all_items(self):
        items = []
        if self.is_empty():
            return items
        
        index = self.tail
        for _ in range(self.size):
            items.append(self.buffer[index])
            index = (index + 1) % self.capacity
        
        return items