import json
from gtts import gTTS
import os

# Load task data
with open('tasks/task-de-1.json', 'r', encoding='utf-8') as f:
    task_data = json.load(f)

question_text = task_data['question']
print(f"Generating audio for question: {question_text}")

# Generate TTS
tts = gTTS(text=question_text, lang='de')
output_path = 'public/assets/question_audio.mp3'

# Ensure directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

tts.save(output_path)
print(f"Audio saved to {output_path}")
