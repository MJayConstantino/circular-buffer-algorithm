extends Node

# Global game settings
var player_count = 1  # Default to 1 player
var high_score = 0

func set_player_count(count):
	player_count = count

func update_high_score(score):
	if score > high_score:
		high_score = score
