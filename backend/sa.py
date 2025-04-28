from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin, CORS
import google.generativeai as genai
import os
import jwt
from functools import wraps
from database import get_last_7_days_chat, get_username_by_id, save_sentiment_report, get_sentiment_scores, get_latest_sentiment, get_last_7_days_sentiments, get_sleep_quality_data, get_last_7_mood_entries, get_logged_dates_for_month, get_coping_mechanism_data
from visualization import generate_sentiment_plot, generate_sentiment_pie_chart, generate_emotion_radar_chart, generate_sleep_quality_plot, generate_mood_distribution_chart, generate_missed_log_calendar, generate_coping_mech_donut_chart
from config import Config
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sentimental_model import bert_sentiment_analysis  # Corrected function name

# Define Flask Blueprint
sentiment_bp = Blueprint("sentiment", __name__)
CORS(sentiment_bp, resources={r"/*": {"origins": "*"}})
# Load Gemini API key
SECRET_KEY = os.getenv("SECRET_KEY", "fucking_do_it_pr0prely") 
genai.configure(api_key=Config.GEMINI_API_KEY)

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            decoded_token = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_token["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(user_id, *args, **kwargs)

    return decorated

# API Route: Analyze Sentiment for a User
@sentiment_bp.route("/analyze_sentiment", methods=["POST"])
@cross_origin(origin='*') 
@token_required
def analyze_sentiment(user_id):  # Function name is back to normal
    # Fetch chat history
    username = get_username_by_id(user_id)
    if not username:
        return jsonify({"error": "User not found"}), 404

    chat_history = get_last_7_days_chat(username)
    if not chat_history:
        return jsonify({"message": "No chat history found for past 7 days"}), 404

    # Extract user messages only
    user_messages = [msg for msg, _, _ in chat_history]

    

    # Perform BERT Sentiment Analysis on all messages together
    # bert_results = bert_sentiment_analysis(user_messages)
    #print(bert_results)
    #bert_sentiment = {
    #    "average_sentiment_score": bert_results["average_sentiment_score"],
    #    "sentiment_label": bert_results["sentiment_label"]
    #}

    # Save sentiment analysis results to the database
    #save_sentiment_report(user_id, username, bert_sentiment["average_sentiment_score"], bert_sentiment["sentiment_label"])
    





    # **2. Gemini API Report Generation**
    # Format chat history
    formatted_chat = "\n".join([f"User: {msg} | Bot: {resp}" for msg, resp, _ in chat_history])
    prompt = f"""
    Analyze the following 7-day chat history:
    {formatted_chat}

    The report should have three **clearly separated sections** with headings, bullet points, and proper paragraph spacing:

---

## **1. Emotional Trends**  
- Identify key emotional patterns (happiness, sadness, anxiety, neutrality, etc.).  
- Explain any mood shifts and potential triggers.  
- Provide insights into how the user emotional state evolved over the week.  

---

## **2. Summary of Mood Patterns**  
- Summarize the overall emotional trends in 3-4 sentences.  
- Mention recurring themes in conversations.  
- Highlight any noticeable emotional fluctuations.  

---

## **3. Helpful Resources & Recommendations**  
- Provide 2-3 **actionable well-being tips** based on the user's emotional trends.  
- Suggest **relevant books, podcasts, or mindfulness exercises** to help with their emotional state.  
- Keep recommendations **clear and practical.**  

---

 **Important Formatting Rules:**  
- Do **NOT** use `*`, `#`, or unnecessary symbols.  
- Keep the headings **bold and clear** (e.g., "## **Emotional Trends**").  
- Use **bullet points** for key information.  
- Ensure **proper spacing** between paragraphs.  

Return only the **formatted report**, nothing extra.
    """
    
    def clean_report(text):
        text = text.replace("##", "").replace("**", "")
        text = text.replace(" - ", "• ")
        return text.strip()

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    cleaned_report = clean_report(response.text)
    


    response_data = {
    "user_id": user_id,
    "bert_sentiment": 0, # Placeholder for BERT sentiment score
    "gemini_report": cleaned_report
}

    
    return jsonify(response_data), 200


import textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
import io

@sentiment_bp.route("/download_report", methods=["GET"])
@token_required
def download_report(user_id):
    username = get_username_by_id(user_id)
    if not username:
        return jsonify({"error": "User not found"}), 404

    chat_history = get_last_7_days_chat(username)
    if not chat_history:
        return jsonify({"message": "No chat history found for past 7 days"}), 404

    formatted_chat = "\n".join([f"User: {msg} | Bot: {resp}" for msg, resp, _ in chat_history])


    # ✅ BERT Sentiment Analysis
    bert_scores = [bert_sentiment_analysis(msg) for msg, _, _ in chat_history]
    avg_bert_score = round(sum(res["average_sentiment_score"] for res in bert_scores) / len(bert_scores), 2)
    sentiment_label = get_sentiment_label(avg_bert_score)

    bert_sentiment = {
        "average_sentiment_score": avg_bert_score,
        "sentiment_label": sentiment_label
    }

    # ✅ Fetch Gemini AI Report
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(f"""
    Analyze the following 7-day chat history:
    {formatted_chat}

    ## Emotional Trends
    - Identify key emotional patterns.
    - Explain mood shifts.
    - Provide insights into emotional evolution.

    ## Summary of Mood Patterns
    - Summarize trends in 3-4 sentences.
    - Mention recurring themes.

    ## Helpful Resources & Recommendations
    - Suggest 2-3 well-being tips.
    - Recommend books, podcasts, or mindfulness exercises.

    **Important Formatting Rules:**  
- Do **NOT** use `*`, `#`, or unnecessary symbols.  
- Keep the headings **bold and clear** (e.g., "## **Emotional Trends**").  
- Use **bullet points** for key information.  
- Ensure **proper spacing** between paragraphs.  
    """)

    gemini_report = response.text.strip()

    # ✅ Create PDF
    A4_WIDTH, A4_HEIGHT = A4
    pdf_buffer = io.BytesIO()
    
    custom_height = A4_HEIGHT + 2000  # Extra space for charts
    pdf = canvas.Canvas(pdf_buffer, pagesize=(A4_WIDTH, custom_height))

    
    pdf.setFont("Helvetica", 11)

    # ✅ A4 Dimensions
    
    y_position =  custom_height - 100 

    # ✅ Add Mentora Logo
    try:
        logo_path = "logo.jpg"
        logo = ImageReader(logo_path)
        pdf.drawImage(logo, 50, A4_HEIGHT - 60, width=100, height=40, mask='auto')
    except:
        pass  # If no logo, continue

    # ✅ Function to wrap text properly
    def add_wrapped_text(text, y_offset, is_bold=False):
        nonlocal y_position
        if is_bold:
            pdf.setFont("Helvetica-Bold", 12)
        else:
            pdf.setFont("Helvetica", 11)

        lines = textwrap.wrap(text, width=90)
        for line in lines:
            pdf.drawString(50, y_position, line)
            y_position -= y_offset
            if y_position < 50:
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y_position = A4_HEIGHT - 80

    # ✅ Add Title
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y_position, f"Sentiment Analysis Report - {username}")
    pdf.setFont("Helvetica", 11)
    pdf.line(50, y_position - 5, A4_WIDTH - 50, y_position - 5)
    y_position -= 30

    # ✅ Fetch Latest BERT Sentiment Score & Label from Database
    latest_sentiment = get_latest_sentiment(username)

    # ✅ If data exists, use it; otherwise, use the calculated score
    if latest_sentiment:
        exact_bert_score, exact_sentiment_label = latest_sentiment
    else:
        exact_bert_score = bert_sentiment['average_sentiment_score']
        exact_sentiment_label = bert_sentiment['sentiment_label']

    # ✅ Add to PDF
    add_wrapped_text("BERT Sentiment Analysis:", 20, is_bold=True)
    add_wrapped_text(f"Detected Mood: {exact_sentiment_label}", 15)
    add_wrapped_text(f"Exact Score: {exact_bert_score}", 15)

    

    sections = ["Emotional Trends", "Summary of Mood Patterns", "Helpful Resources & Recommendations"]
    report_data = {}

    for section in sections:
        start_idx = gemini_report.find(section)
        if start_idx != -1:
            next_section_idx = min(
                [gemini_report.find(s) for s in sections if gemini_report.find(s) > start_idx] + [len(gemini_report)]
            )
            report_data[section] = gemini_report[start_idx:next_section_idx].strip()

    # Gemini AI Report Sections
    y_position -= 30
    add_wrapped_text("Gemini AI Report:", 20, is_bold=True)

    for section, content in report_data.items():
        add_wrapped_text(section + ":", 20, is_bold=True)
        add_wrapped_text(content, 15)
    # ✅ Function to add a small heading before the chart
    def add_chart_heading(text, y_offset):
        nonlocal y_position
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y_position, text)
        y_position -= y_offset
    # Fetch Sentiment Scores & Generate Visualization
    sentiment_data = get_sentiment_scores(username)  # Fetch {date: score}  
    sentiment_image_path = None

    if sentiment_data:
        sentiment_image_path = generate_sentiment_plot(sentiment_data, username)  

    # Add Line Chart to PDF
    if sentiment_image_path:
        try:
            # Add Heading
            add_chart_heading("Sentiment Trend (Line Chart):", 20)
            
            # Center the chart by adjusting the X position
            line_chart = ImageReader(sentiment_image_path)
            center_x = (A4_WIDTH - 400) / 2  # Calculate X position to center the image
            pdf.drawImage(line_chart, center_x, y_position - 300, width=400, height=300, mask="auto")
            y_position -= 300  # Adjust spacing after image
        except:
            pass

    # ✅ Generate Pie Chart & Get Image Path
    sentiment_labels = get_last_7_days_sentiments(username)
    pie_chart_path = generate_sentiment_pie_chart(sentiment_labels, username)

    # ✅ Add Pie Chart to PDF (if available)
    if pie_chart_path:
        try:
            # Add Heading
            add_chart_heading("Sentiment Distribution (Pie Chart):", 20)

            # Center the chart by adjusting the X position
            pie_chart = ImageReader(pie_chart_path)
            center_x = (A4_WIDTH - 250) / 2  # Calculate X position to center the image
            pdf.drawImage(pie_chart, center_x, y_position - 250, width=250, height=250, mask="auto")
            y_position -= 280  # Adjust spacing after image
        except:
            pass

    radar_chart_path = generate_emotion_radar_chart(username)

    if radar_chart_path:
        try:
            add_chart_heading("Radar Chart based on your last Facial Emotion Analysis: ", 20)
            radar_chart = ImageReader(radar_chart_path)
            center_x = (A4_WIDTH - 250) / 2  # Calculate X position to center the image
            pdf.drawImage(radar_chart, center_x, y_position - 250, width=250, height=250, mask="auto")
            y_position -= 300  # Adjust spacing after image
        except:
            pass

    sleep_mood_log = get_sleep_quality_data(username)
    scatter_chart_path= generate_sleep_quality_plot(sleep_mood_log, username)
    if scatter_chart_path:
        try:
            add_chart_heading("Scatter Chart Based on last 7 logs ", 20)
            scatter_chart = ImageReader(scatter_chart_path)
            center_x = (A4_WIDTH - 400) / 2  # Calculate X position to center the image
            pdf.drawImage(scatter_chart, center_x, y_position - 250, width=350, height=250, mask="auto")
            y_position -= 300  # Adjust spacing after image
        except:
            pass
    
    mood_dis_log = get_last_7_mood_entries(username)
    bar_chart_path = generate_mood_distribution_chart(mood_dis_log,username)
    if bar_chart_path:
        try:
            add_chart_heading("Mood Distrubution Based on last 7 logs ", 20)
            bar_chart = ImageReader(bar_chart_path)
            center_x = (A4_WIDTH - 400) / 2  # Calculate X position to center the image
            pdf.drawImage(bar_chart, center_x, y_position - 250, width=300, height=250, mask="auto")
            y_position -= 300  # Adjust spacing after image
        except:
            pass
    
    log_dates = get_logged_dates_for_month(username)
    heat_map_path= generate_missed_log_calendar(log_dates, username)
    if heat_map_path:
        try:
            add_chart_heading("This months HeatMap: ", 20)
            heat_map = ImageReader(heat_map_path)
            center_x = (A4_WIDTH - 400) / 2  # Calculate X position to center the image
            pdf.drawImage(heat_map, center_x, y_position - 250, width=300, height=250, mask="auto")
            y_position -= 300  # Adjust spacing after image
        except:
            pass

    counts = get_coping_mechanism_data(username)
    donut_path = generate_coping_mech_donut_chart(counts, username)
    if donut_path:
        try:
            add_chart_heading("Your Coping Mechanism Analysis: ", 20)
            donut = ImageReader(donut_path)
            center_x = (A4_WIDTH - 250) / 2  # Calculate X position to center the image
            pdf.drawImage(donut, center_x, y_position - 250, width=300, height=250, mask="auto")
            y_position -= 280  # Adjust spacing after image
        except:
            pass
    # ✅ Save and Return PDF
    pdf.showPage()
    pdf.save()
    pdf_buffer.seek(0)

    return send_file(pdf_buffer, as_attachment=True, download_name="Sentiment_Report.pdf", mimetype="application/pdf")

# ✅ Sentiment Label Function
def get_sentiment_label(score):
    if score >= 4.0:
        return "Positive"
    elif score >= 3.0:
        return "Neutral"
    else:
        return "Negative"
