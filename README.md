Hello, this repo is a compilation of different games and apps that implement the circulat buffer algorithm. Since I have no creative idea, or I have some but they would not be possible to do with the remaining time.


# 1. Snake Game with Circular Buffer

A Python implementation of the classic Snake game using Pygame, featuring a circular buffer algorithm for efficient snake body management.

## Features

- **Circular Buffer Implementation**: Efficient memory management for the snake's body segments
- **Interactive Menu System**: Clean UI with start and quit options
- **Obstacle Levels**: Randomly generated obstacles for varied gameplay
- **Multiple Game States**: Menu, gameplay, and game over screens
- **Score Tracking**: Points system that increases as you collect food

## Requirements

- Python 3.6+
- Pygame

## Installation

1. Clone this repository or download the source code:
   ```
   git clone https://github.com/MJayConstantino/circular-buffer-algorithm.git
   ```
   or download and extract the ZIP file.

2. Install the required dependencies:
   ```
   pip install pygame
   ```

3. Run the game:
   ```
   python snake_game.py
   ```

## How to Play

- Use **arrow keys** to control the snake's direction
- Eat **red squares (food)** to grow longer and earn points
- Avoid hitting **blue squares (obstacles)** and your own snake body
- Press **ESC** to return to the main menu
- After game over, press **ENTER** to play again or **ESC** for menu

## Technical Details

### Circular Buffer Implementation

The game implements a circular buffer data structure to manage the snake's body segments efficiently. This approach provides the following benefits:

- **Constant-time operations**: O(1) time complexity for adding and removing segments
- **Memory efficiency**: Reuses memory locations instead of constant allocations/deallocations
- **Fixed memory footprint**: Memory usage doesn't grow indefinitely as the snake gets longer

The circular buffer is implemented as a class with these key operations:
- `enqueue()`: Add a new segment (typically the head)
- `dequeue()`: Remove the oldest segment (typically the tail)
- `get_all_items()`: Retrieve all segments for rendering

### Game Architecture

The game is organized into several classes:
- `CircularBuffer`: Manages the snake's body segments
- `Snake`: Handles movement, growth, and collision detection
- `Food`: Manages food placement and respawning
- `Level`: Generates and manages obstacles
- `Button`: Creates interactive UI elements
- `Game`: Main game class that coordinates all game elements

## Controls

- **Arrow keys**: Control snake direction
- **ESC**: Return to main menu
- **ENTER**: Restart game after game over
- **Mouse**: Select menu options
