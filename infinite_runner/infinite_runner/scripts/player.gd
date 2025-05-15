extends CharacterBody2D

signal player_died(player_id)

# Player properties
var player_id = 1
var speed = 100
var gravity = 980
var gravity_direction = 1  # 1 = down, -1 = up
var is_alive = true

@onready var PlayerSprite = $Sprite2D
@onready var PlayerCollider = $CollisionShape2D
@onready var FlipSound = $FlipSound
@onready var DeathSound = $DeathSound
@onready var DeathParticles = $DeathParticles

# Player controls
var flip_key

func _ready():
	# Set up player controls based on player_id
	if player_id == 1:
		flip_key = KEY_SPACE
		PlayerSprite.modulate = Color(0.2, 0.6, 1.0)  # Blue for player 1
	else:
		flip_key = KEY_SHIFT
		PlayerSprite.modulate = Color(1.0, 0.3, 0.3)  # Red for player 2
		
	# Add player to group for collision detection
	add_to_group("players")

func _physics_process(delta):
	if !is_alive:
		return
	
	# Check for player input to flip gravity
	if Input.is_key_pressed(flip_key):
		flip_gravity()
	
	# Apply gravity based on current direction
	velocity.y += gravity * gravity_direction * delta
	
	# Move the player
	velocity.x = speed
	
	move_and_slide()
	
	# Check boundaries
	check_boundaries()
	
	# Check collisions
	check_collisions()

func flip_gravity():
	gravity_direction *= -1
	PlayerSprite.scale.y *= -1  # Flip the sprite visually
	FlipSound.play()

func check_boundaries():
	# Die if player goes off screen
	if position.y > get_viewport_rect().size.y + 50 or position.y < -50:
		die()

func check_collisions():
	# Check for collisions with hazards
	for i in get_slide_collision_count():
		var collision = get_slide_collision(i)
		var collider = collision.get_collider()
		
		if collider.is_in_group("hazards"):
			die()

func die():
	if is_alive:
		is_alive = false
		DeathParticles.emitting = true
		DeathSound.play()
		PlayerSprite.visible = false
		PlayerCollider.set_deferred("disabled", true)
		emit_signal("player_died", player_id)
