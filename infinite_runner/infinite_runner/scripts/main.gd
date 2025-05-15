extends Node2D

# Global game variables
var score = 0
var game_speed = 300
var game_over = false
var players_alive = 0

# Platform generation variables
const PLATFORM_COUNT = 10  # Number of platforms in our circular buffer
const PLATFORM_WIDTH = 200
const PLATFORM_HEIGHT = 40
const GAP_MIN = 100
const GAP_MAX = 300
const HAZARD_CHANCE = 0.3

# Circular buffer properties
var platform_buffer = []
var current_index = 0
var last_platform_x = 0

# Player references
var player1
var player2

# initialize nodes
@onready var ScoreTimer = $ScoreTimer
@onready var ScoreLabel = $HUD/ScoreLabel
@onready var GameOverPanel = $HUD/GameOverPanel

func _ready():
	randomize()
	initialize_game()

func initialize_game():
	# Create player 1
	player1 = preload("res://scenes/Player.tscn").instantiate()
	player1.position = Vector2(100, 300)
	player1.player_id = 1
	player1.connect("player_died", Callable(self, "_on_player_died"))
	add_child(player1)
	players_alive += 1
	
	# Create player 2 if 2-player mode
	if Global.player_count == 2:
		player2 = preload("res://scenes/Player.tscn").instantiate()
		player2.position = Vector2(150, 300)
		player2.player_id = 2
		player2.connect("player_died", Callable(self, "_on_player_died"))
		add_child(player2)
		players_alive += 1
	
	# Initialize the platform buffer
	initialize_platforms()
	
	# Start the score timer
	ScoreTimer.start()

func initialize_platforms():
	# Create initial floor
	var floor_platform = preload("res://scenes/Platform.tscn").instantiate()
	floor_platform.position = Vector2(get_viewport_rect().size.x / 2, get_viewport_rect().size.y - 50)
	floor_platform.scale.x = get_viewport_rect().size.x / PLATFORM_WIDTH
	add_child(floor_platform)
	
	# Create initial platforms in the buffer
	last_platform_x = get_viewport_rect().size.x + 50
	
	for i in range(PLATFORM_COUNT):
		create_platform()

func create_platform():
	var platform = preload("res://scenes/Platform.tscn").instantiate()
	
	# Determine platform position
	var gap = randi_range(GAP_MIN, GAP_MAX)
	var platform_x = last_platform_x + gap
	var platform_y = randi_range(150, int(get_viewport_rect().size.y - 150))
	
	platform.position = Vector2(platform_x, platform_y)
	platform.platform_id = platform_buffer.size()
	
	# Add hazard sometimes
	if randf() < HAZARD_CHANCE:
		var hazard = preload("res://scenes/Hazard.tscn").instantiate()
		hazard.position = Vector2(0, -30)  # Position above platform
		platform.add_child(hazard)
	
	add_child(platform)
	platform_buffer.append(platform)
	last_platform_x = platform_x

func _process(delta):
	if game_over:
		return
		
	# Scroll all platforms to the left
	scroll_platforms(delta)
	
	# Check if we need to recycle platforms
	check_recycle_platforms()
	
	# Update the score display
	ScoreLabel.text = "Score: " + str(score)

func scroll_platforms(delta):
	for platform in platform_buffer:
		platform.position.x -= game_speed * delta

func check_recycle_platforms():
	# Check if the oldest platform is off-screen
	if platform_buffer[current_index].position.x < -PLATFORM_WIDTH:
		recycle_platform(platform_buffer[current_index])
		current_index = (current_index + 1) % PLATFORM_COUNT

func recycle_platform(platform):
	# Move platform to the end of our level
	var gap = randi_range(GAP_MIN, GAP_MAX)
	var platform_x = last_platform_x + gap
	var platform_y = randi_range(150, int(get_viewport_rect().size.y - 150))
	
	platform.position = Vector2(platform_x, platform_y)
	
	# Remove old hazards if present
	for child in platform.get_children():
		if child.is_in_group("hazards"):
			child.queue_free()
	
	# Add new hazard sometimes
	if randf() < HAZARD_CHANCE:
		var hazard = preload("res://scenes/Hazard.tscn").instantiate()
		hazard.position = Vector2(0, -30)  # Position above platform
		platform.add_child(hazard)
	
	last_platform_x = platform_x

func _on_player_died(player_id):
	players_alive -= 1
	
	if players_alive <= 0:
		game_over = true
		GameOverPanel.visible = true
		ScoreTimer.stop()

func _on_score_timer_timeout():
	score += 1
	
	# Gradually increase game speed
	if score % 10 == 0:
		game_speed += 10

func _on_restart_button_pressed():
	get_tree().reload_current_scene()


func _on_main_menu_button_pressed():
	get_tree().change_scene_to_file("res://scenes/MainMenu.tscn")
