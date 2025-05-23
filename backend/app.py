from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from chatbot import chatbot_bp
from config import DevelopmentConfig
from database import create_tables
from sa import sentiment_bp
from user_profile import profile_bp
from mood import mood_bp
import os

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
CORS(app,resources={r"/*": {"origins": "https://mentora-frontend.onrender.com"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])
create_tables() 


@app.route('/')
def home():
    return "App is running!"

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(sentiment_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(mood_bp)


if __name__ == "__main__":
    app.run() # Ensure tables exist before running
    
