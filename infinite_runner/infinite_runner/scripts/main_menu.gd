extends Control

@onready var HighScoreLabel = $HighScoreLabel

func _ready():
	HighScoreLabel.text = "High Score: " + str(Global.high_score)

func _on_1player_pressed():
	Global.set_player_count(1)
	get_tree().change_scene_to_file("res://scenes/Game.tscn")
	
func _on_2player_pressed():
	Global.set_player_count(2)
	get_tree().change_scene_to_file("res://scenes/Game.tscn")
	
func _on_quit_pressed():
	get_tree().quit()# Replace with function body.
