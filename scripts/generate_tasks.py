import json
import random
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
QUESTIONS_PATH = BASE_DIR / "scripts" / "questions.json"
TASKS_DIR = BASE_DIR / "tasks"
# External path for cards - user provided constant path
CARDS_BASE_PATH = Path("C:/GitHub/AppExperiment1/assets")

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def get_card_by_id(cards, card_id):
    for card in cards:
        if card.get('id') == card_id:
            return card
    return None

def main():
    print(f"Reading questions from {QUESTIONS_PATH}")
    if not QUESTIONS_PATH.exists():
        print(f"Error: {QUESTIONS_PATH} not found.")
        return

    questions = load_json(QUESTIONS_PATH)
    
    # Ensure tasks directory exists
    TASKS_DIR.mkdir(exist_ok=True)
    
    # Cache loaded cards to avoid re-reading files
    cards_cache = {}

    for q in questions:
        q_id = q.get('id')
        q_text = q.get('question')
        lang = q.get('language')
        
        print(f"Processing Question {q_id} ({lang})...")

        # Load cards for the language if not already loaded
        if lang not in cards_cache:
            cards_file = CARDS_BASE_PATH / f"cards_{lang}.json"
            if not cards_file.exists():
                print(f"  Warning: Cards file {cards_file} not found. Skipping.")
                continue
            cards_cache[lang] = load_json(cards_file)
            print(f"  Loaded {len(cards_cache[lang])} cards for language '{lang}'")

        cards = cards_cache[lang]
        available_ids = [c['id'] for c in cards] # Get all actual available IDs
        
        # Select 3 unique random IDs
        # Note: The prompt asked for "random number from 1 to 72". 
        # We will sample from available IDs to ensure validity, assuming they cover the range or subset.
        if len(available_ids) < 3:
             print("  Error: Not enough cards to pick 3 unique ones.")
             continue
             
        selected_ids = random.sample(available_ids, 3)
        
        card_status = get_card_by_id(cards, selected_ids[0])
        card_obstacle = get_card_by_id(cards, selected_ids[1])
        card_resource = get_card_by_id(cards, selected_ids[2])
        
        task_data = {
            "id": q_id,
            "question": q_text,
            "language": lang,
            "status": {
                "card_id": card_status['id'],
                "title": card_status['title'],
                "description": card_status['description'],
                "image": card_status['image'],
                "theme_location": card_status.get('theme_location', [])
            },
            "obstacle": {
                "card_id": card_obstacle['id'],
                "title": card_obstacle['title'],
                "description": card_obstacle['description'],
                "image": card_obstacle['image'],
                "theme_blindspot": card_status.get('theme_blindspot', []) # Prompt said theme_blindspot for obstacle
            },
            "resource": {
                "card_id": card_resource['id'],
                "title": card_resource['title'],
                "description": card_resource['description'],
                "image": card_resource['image'],
                "theme_solution": card_status.get('theme_solution', []) # Prompt said theme_solution for resource
            }
        }
        
        # Correction based on prompt: "obstacle" uses "theme_blindspot" from the card selected for obstacle
        # "resource" uses "theme_solution" from the card selected for resource
        # My previous lines used 'card_status' for themes by mistake in the draft. Fixing:
        task_data["obstacle"]["theme_blindspot"] = card_obstacle.get('theme_blindspot', [])
        task_data["resource"]["theme_solution"] = card_resource.get('theme_solution', [])

        output_filename = f"task-{lang}-{q_id}.json"
        output_path = TASKS_DIR / output_filename
        save_json(output_path, task_data)
        print(f"  Generated {output_filename}")

if __name__ == "__main__":
    main()
