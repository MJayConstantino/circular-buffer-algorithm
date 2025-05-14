import pygame
import sys
import random
from constants import *
from enums import *
from button import Button
from food import Food
from level import Level
from snake import Snake

# Initialize pygame
pygame.init()

# Game class
class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Snake Game with Circular Buffer")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.state = GameState.MENU
        self.reset_game()
        
        # Create menu buttons
        self.start_button = Button(
            SCREEN_WIDTH // 2 - 100, 
            SCREEN_HEIGHT // 2 - 60, 
            200, 50, "Start Game", GREEN, DARK_GREEN
        )
        self.quit_button = Button(
            SCREEN_WIDTH // 2 - 100, 
            SCREEN_HEIGHT // 2 + 10, 
            200, 50, "Quit", RED, (150, 0, 0)
        )
    
    def reset_game(self):
        self.snake = Snake(GRID_WIDTH // 2, GRID_HEIGHT // 2)
        self.level = Level()
        # Make sure food doesn't spawn on obstacles
        valid_positions = [(x, y) for x in range(GRID_WIDTH) for y in range(GRID_HEIGHT) 
                          if (x, y) not in self.level.obstacles]
        food_pos = random.choice(valid_positions)
        self.food = Food(self.snake.get_body() + self.level.obstacles)
        self.score = 0
        self.game_over = False
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if self.state == GameState.MENU:
                mouse_pos = pygame.mouse.get_pos()
                mouse_click = pygame.mouse.get_pressed()[0]
                
                self.start_button.check_hover(mouse_pos)
                self.quit_button.check_hover(mouse_pos)
                
                if self.start_button.is_clicked(mouse_pos, mouse_click):
                    self.state = GameState.GAME
                    # Small delay to prevent immediate input
                    pygame.time.delay(200)
                
                if self.quit_button.is_clicked(mouse_pos, mouse_click):
                    pygame.quit()
                    sys.exit()
            
            elif self.state == GameState.GAME:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_UP:
                        self.snake.change_direction(Direction.UP)
                    elif event.key == pygame.K_DOWN:
                        self.snake.change_direction(Direction.DOWN)
                    elif event.key == pygame.K_LEFT:
                        self.snake.change_direction(Direction.LEFT)
                    elif event.key == pygame.K_RIGHT:
                        self.snake.change_direction(Direction.RIGHT)
                    elif event.key == pygame.K_ESCAPE:
                        self.state = GameState.MENU
            
            elif self.state == GameState.GAME_OVER:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_RETURN:
                        self.reset_game()
                        self.state = GameState.GAME
                    elif event.key == pygame.K_ESCAPE:
                        self.state = GameState.MENU
    
    def update(self):
        if self.state == GameState.GAME:
            # Move snake
            self.snake.move()
            
            # Check if snake ate food
            if self.snake.get_head() == self.food.position:
                self.snake.grow = True
                self.score += 10
                self.food.respawn(self.snake.get_body() + self.level.obstacles)
            
            # Check for collisions with self
            if self.snake.check_collision():
                self.state = GameState.GAME_OVER
            
            # Check for collisions with obstacles
            if self.level.check_collision(self.snake.get_head()):
                self.state = GameState.GAME_OVER
    
    def draw_menu(self):
        self.screen.fill(BLACK)
        
        # Draw title
        title_text = self.font.render("Snake Game", True, WHITE)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 4))
        self.screen.blit(title_text, title_rect)
        
        # Draw buttons
        self.start_button.draw(self.screen)
        self.quit_button.draw(self.screen)
        
        # Draw instructions
        instructions = [
            "Use arrow keys to control the snake",
            "Eat food to grow longer",
            "Avoid hitting obstacles and yourself",
            "Press ESC to return to menu"
        ]
        
        instruction_font = pygame.font.Font(None, 24)
        y_offset = SCREEN_HEIGHT * 3 // 4
        
        for instruction in instructions:
            text = instruction_font.render(instruction, True, WHITE)
            rect = text.get_rect(center=(SCREEN_WIDTH // 2, y_offset))
            self.screen.blit(text, rect)
            y_offset += 30
    
    def draw_game(self):
        self.screen.fill(BLACK)
        
        # Draw grid
        for x in range(0, SCREEN_WIDTH, GRID_SIZE):
            pygame.draw.line(self.screen, GRAY, (x, 0), (x, SCREEN_HEIGHT), 1)
        for y in range(0, SCREEN_HEIGHT, GRID_SIZE):
            pygame.draw.line(self.screen, GRAY, (0, y), (SCREEN_WIDTH, y), 1)
        
        # Draw obstacles
        for obstacle in self.level.obstacles:
            x, y = obstacle
            pygame.draw.rect(self.screen, BLUE, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        
        # Draw food
        x, y = self.food.position
        pygame.draw.rect(self.screen, RED, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        
        # Draw snake
        for segment in self.snake.get_body():
            x, y = segment
            pygame.draw.rect(self.screen, GREEN, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        
        # Draw head in a different color
        head_x, head_y = self.snake.get_head()
        pygame.draw.rect(self.screen, DARK_GREEN, (head_x * GRID_SIZE, head_y * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        
        # Draw score
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
    
    def draw_game_over(self):
        self.screen.fill(BLACK)
        
        # Draw game over text
        game_over_text = self.font.render("Game Over!", True, RED)
        game_over_rect = game_over_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 3))
        self.screen.blit(game_over_text, game_over_rect)
        
        # Draw score
        score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
        score_rect = score_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
        self.screen.blit(score_text, score_rect)
        
        # Draw instructions
        instructions_text = self.font.render("Press ENTER to play again or ESC for menu", True, WHITE)
        instructions_rect = instructions_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT * 2 // 3))
        self.screen.blit(instructions_text, instructions_rect)
    
    def draw(self):
        if self.state == GameState.MENU:
            self.draw_menu()
        elif self.state == GameState.GAME:
            self.draw_game()
        elif self.state == GameState.GAME_OVER:
            self.draw_game_over()
        
        pygame.display.flip()
    
    def run(self):
        while True:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)

# Main function
def main():
    game = Game()
    game.run()

if __name__ == "__main__":
    main()