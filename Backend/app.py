
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from auth.user_model import create_user, authenticate_user, users_collection  # Assuming this is your auth module
from Preprocessing.PDF_process import extract_pdf_text
from Preprocessing.Web_scrape import run_scraper
from RAG_pipeline.rag import get_text_chunks, user_input  # Import user_input
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity  # Import get_jwt_identity
from dotenv import load_dotenv
from pymongo import MongoClient
import asyncio
from flask import request, jsonify
from werkzeug.security import generate_password_hash
import re
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from langchain_community.vectorstores import Qdrant
from RAG_pipeline.rag import create_qdrant_index



from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from RAG_pipeline.rag import  get_text_chunks, create_qdrant_index, user_input
from flask import Flask, render_template
# Load environment variables
load_dotenv()
# Enable CORS for all routes (for development)

app = Flask(__name__)
CORS(app, supports_credentials=True)
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://arisha:12345@cluster1.0ts3r.mongodb.net/")
DB_NAME = "FYDP"

# Initialize MongoDB connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["userinfos"]
chatbot_collection = db["chatbots"]
chat_history=db["chathistories"]
counters_collection = db["counters"]  

# JWT Authentication Configuration
app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Replace with a strong secret key
jwt = JWTManager(app)

# Directory to store uploaded PDFs
UPLOAD_FOLDER = "data/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    designation = data.get("designation")
    age_group = data.get("age_group")

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    # Generate user_id
    counter = counters_collection.find_one_and_update(
        {"name": "user_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    user_id = f"U{counter['seq']:03d}"

    # Hash password and save user
    hashed_password = generate_password_hash(password)
    user = {
        "user_id": user_id,
        "first_name": first_name,
        "last_name": last_name,
        "designation": designation,
        "age_group": age_group,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully", "user_id": user_id}), 201




@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user['user_id'])
    return jsonify({"access_token": access_token}), 200





from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from datetime import datetime
import os

# Import your virus scanning function
from Malware_Detection.pdf_check import scan_pdf_stream_with_virustotal


# @app.route('/upload-pdf', methods=['POST'])
# @jwt_required()
# def upload_pdf():
#     user_id = get_jwt_identity()
#     print(user_id)
    
#     chatbot_name = request.form.get("chatbot_name")
#     print(chatbot_name)
    
#     pdf = request.files.get("pdf")
#     if not chatbot_name or not pdf:
#         return jsonify({"error": "Missing chatbot name or PDF file"}), 400

#     # Check if chatbot with same name already exists for the user
#     if chatbot_collection.find_one({"user_id": user_id, "chatbot_name": chatbot_name}):
#         return jsonify({"error": "Chatbot name already exists"}), 400

#     # Secure filename
#     filename = secure_filename(pdf.filename)
#     if not filename.lower().endswith(".pdf"):
#         return jsonify({"error": "Only PDF files are allowed"}), 400

#     # Read file stream for virus scanning
#     pdf_stream = pdf.read()
#     scan_result = scan_pdf_stream_with_virustotal(pdf_stream, filename)

#     if not scan_result["safe"]:
#         return jsonify({
#             "error": "Malicious file detected",
#             "reason": scan_result["reason"]
#         }), 400

#     # Save PDF to disk after scanning
#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     with open(filepath, "wb") as f:
#         f.write(pdf_stream)
#     print("✅ PDF saved after virus scan")

#     # Extract text and chunks
#     text = extract_pdf_text(filepath)
#     chunks = get_text_chunks(text)

#     # Generate bot_id
#     counter = counters_collection.find_one_and_update(
#         {"name": "bot_id"},
#         {"$inc": {"seq": 1}},
#         upsert=True,
#         return_document=True
#     )
#     bot_id = f"B{counter['seq']:03d}"

#     # Create Qdrant collection
#     collection_name = f"{user_id.lower()}_{bot_id.lower()}"
#     create_qdrant_index(chunks, collection_name)

#     # Save chatbot metadata in MongoDB
#     chatbot_doc = {
#         "bot_id": bot_id,
#         "user_id": user_id,
#         "chatbot_name": chatbot_name,
#         "input_type": "pdf",
#         "collection_name": collection_name,
#         "pdf_file": {
#             "filename": filename,
#             "data": pdf_stream,
#             "content_type": pdf.content_type
#         },
#         "created_at": datetime.utcnow()
#     }
#     chatbot_collection.insert_one(chatbot_doc)

#     return jsonify({"message": "Chatbot created successfully", "bot_id": bot_id}), 201

from Malware_Detection.url_check import is_url_safe_combined

@app.route('/upload-pdf', methods=['POST'])
@jwt_required()
def upload_pdf():
    user_id = get_jwt_identity()
    print(user_id)
    chatbot_name = request.form.get("chatbot_name")
    print(chatbot_name)
    pdf = request.files.get("pdf")

    if not chatbot_name or not pdf:
        return jsonify({"error": "Missing chatbot name or PDF file"}), 400

    # Check if chatbot with same name already exists for the user
    if chatbot_collection.find_one({"user_id": user_id, "chatbot_name": chatbot_name}):
        return jsonify({"error": "Chatbot name already exists"}), 400

    # Save PDF to disk
    filename = secure_filename(pdf.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    pdf.save(filepath)

    # Extract text and chunks
    text = extract_pdf_text(filepath)
    chunks = get_text_chunks(text)

    # Generate bot_id
    counter = counters_collection.find_one_and_update(
        {"name": "bot_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    bot_id = f"B{counter['seq']:03d}"

    # Create Qdrant collection
    collection_name = f"{user_id.lower()}_{bot_id.lower()}"
    create_qdrant_index(chunks, collection_name)  # This stores vectors only in Qdrant

    # Save chatbot metadata in MongoDB (without embeddings)
    chatbot_doc = {
        "bot_id": bot_id,
        "user_id": user_id,
        "chatbot_name": chatbot_name,
        "input_type": "pdf",
        "collection_name": collection_name,   # ✅ ADD THIS LINE
        "pdf_file": {
            "filename": filename,
            "data": pdf.read(),
            "content_type": pdf.content_type
        },
        "created_at": datetime.utcnow()
    }
    chatbot_collection.insert_one(chatbot_doc)

    return jsonify({"message": "Chatbot created successfully", "bot_id":bot_id}),201




# @app.route('/upload-url', methods=['POST'])
# @jwt_required()
# def upload_url():
#     user_id = get_jwt_identity()
#     chatbot_name = request.json.get("chatbot_name")
#     website_url = request.json.get("website_url")

#     if not chatbot_name or not website_url:
#         return jsonify({"error": "Missing chatbot name or website URL"}), 400

#     # Check if chatbot name already exists for the user
#     if chatbot_collection.find_one({"user_id": user_id, "chatbot_name": chatbot_name}):
#         return jsonify({"error": "Chatbot name already exists"}), 400

#     # ✅ Perform URL safety checks
#     print("Running URL safety checks...")
#     safety_result = is_url_safe_combined(website_url)
#     if not safety_result["safe"]:
#         print(f"URL rejected: {safety_result['reason']}")
#         return jsonify({
#             "error": "Malicious or suspicious URL",
#             "details": safety_result["reason"]
#         }), 400
#     print("URL passed safety checks ✅")

#     # Generate bot_id
#     counter = counters_collection.find_one_and_update(
#         {"name": "bot_id"},
#         {"$inc": {"seq": 1}},
#         upsert=True,
#         return_document=True
#     )
#     bot_id = f"B{counter['seq']:03d}"

#     # Create save path for scraped content
#     os.makedirs(UPLOAD_FOLDER, exist_ok=True)
#     save_path = os.path.join(UPLOAD_FOLDER, f"{user_id}_{bot_id}.json")

#     # Run scraper
#     try:
#         scraped_data = asyncio.run(run_scraper(website_url, save_path))
#         if not scraped_data:
#             return jsonify({"error": "Website scraping failed or returned empty content"}), 400
#     except Exception as e:
#         return jsonify({"error": f"Failed to scrape website: {str(e)}"}), 500

#     # Chunk the scraped content
#     combined_text = "\n".join(scraped_data.values())
#     chunks = get_text_chunks(combined_text)

#     # Index with Qdrant
#     collection_name = f"{user_id.lower()}_{bot_id.lower()}"
#     create_qdrant_index(chunks, collection_name)

#     # Store metadata in MongoDB
#     chatbot_doc = {
#         "bot_id": bot_id,
#         "user_id": user_id,
#         "chatbot_name": chatbot_name,
#         "input_type": "website",
#         "collection_name": collection_name,
#         "website_url": website_url,
#         "json_file": {
#             "filename": os.path.basename(save_path),
#             "path": save_path,
#             "content_type": "application/json"
#         },
#         "created_at": datetime.utcnow()
#     }
#     chatbot_collection.insert_one(chatbot_doc)

#     return jsonify({"message": "Website-based chatbot created", "bot_id": bot_id}), 201


@app.route('/upload-url', methods=['POST'])
@jwt_required()
def upload_url():
    user_id = get_jwt_identity()
    chatbot_name = request.json.get("chatbot_name")
    website_url = request.json.get("website_url")

    if not chatbot_name or not website_url:
        return jsonify({"error": "Missing chatbot name or website URL"}), 400

    # Check if chatbot name is already used
    if chatbot_collection.find_one({"user_id": user_id, "chatbot_name": chatbot_name}):
        return jsonify({"error": "Chatbot name already exists"}), 400

    # Generate bot_id early so we can create the filename
    counter = counters_collection.find_one_and_update(
        {"name": "bot_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    bot_id = f"B{counter['seq']:03d}"

    # Save path for scraped data
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    save_path = os.path.join(UPLOAD_FOLDER, f"{user_id}_{bot_id}.json")

    # Scrape website content
    try:
        scraped_data = asyncio.run(run_scraper(website_url, save_path))  # run async function
        if not scraped_data:
            return jsonify({"error": "Website scraping failed or returned empty content"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to scrape website: {str(e)}"}), 500

    # Chunk text
    combined_text = "\n".join(scraped_data.values())

    chunks = get_text_chunks(combined_text)

    # Create Qdrant collection
    collection_name = f"{user_id.lower()}_{bot_id.lower()}"
    create_qdrant_index(chunks, collection_name)

    # Save metadata in MongoDB (without embeddings)
    chatbot_doc = {
        "bot_id": bot_id,
        "user_id": user_id,
        "chatbot_name": chatbot_name,
        "input_type": "website",
        "collection_name": collection_name,   # ✅ ADD THIS LINE
        "website_url": website_url,
        "json_file": {
            "filename": os.path.basename(save_path),
            "path": save_path,
            "content_type": "application/json"
        },
        "created_at": datetime.utcnow()
    }
    chatbot_collection.insert_one(chatbot_doc)

    return jsonify({"message": "Website-based chatbot created", "bot_id": bot_id}), 201


from RAG_pipeline.rag import load_vector_db , user_input


# @app.route('/chat', methods=['POST'])
# def chat():
#     data = request.get_json()
#     bot_id = data.get("bot_id")
#     question = data.get("question")

#     if not bot_id or not question:
#         return jsonify({"error": "Missing bot_id or question"}), 400

#     # Find the bot info (to get user_id and collection_name)
#     bot_doc = chatbot_collection.find_one({"bot_id": bot_id})
#     if not bot_doc:
#         return jsonify({"error": "Chatbot not found"}), 404

#     try:
#         user_id = bot_doc.get("user_id")
#         collection_name = bot_doc.get("collection_name")  # ✅ Add this

#         # Load Qdrant vector DB for this bot using the correct collection
#         vector_db = load_vector_db(collection_name)

#         # Get answer using RAG pipeline
#         answer = user_input(vector_db, question)

#         # Store chat in history
#         chat_history.insert_one({
#             "bot_id": bot_id,
#             "user_id": user_id,
#             "question": question,
#             "answer": answer,
#             "timestamp": datetime.utcnow()
#         })

#         return jsonify({"answer": answer}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    bot_id = data.get("bot_id")
    question = data.get("question")
    # --- ADDED: Get the language from the incoming request data ---
    selected_language = data.get("language", "en") # Default to 'en' if not provided

    print(f"Received bot_id: {bot_id}, question: {question}, language: {selected_language}") # Debug 1 - UPDATED LOG

    if not bot_id or not question:
        print("Missing bot_id or question") # Debug 2
        return jsonify({"error": "Missing bot_id or question"}), 400

    # Find the bot info (to get user_id and collection_name)
    bot_doc = chatbot_collection.find_one({"bot_id": bot_id})
    if not bot_doc:
        print(f"Chatbot not found for bot_id: {bot_id}") # Debug 3
        return jsonify({"error": "Chatbot not found"}), 404

    try:
        user_id = bot_doc.get("user_id")
        collection_name = bot_doc.get("collection_name")

        print(f"User ID: {user_id}, Collection Name: {collection_name}") # Debug 4

        # Load Qdrant vector DB for this bot using the correct collection
        vector_db = load_vector_db(collection_name)
        print("Vector DB loaded successfully.") # Debug 5

        # Get answer using RAG pipeline
        # --- MODIFIED: Pass the selected_language to user_input ---
        answer = user_input(vector_db, question, language=selected_language)
        print(f"Generated answer: {answer}") # Debug 6 - THIS IS CRITICAL!

        # Store chat in history
        chat_history.insert_one({
            "bot_id": bot_id,
            "user_id": user_id,
            "question": question,
            "answer": answer,
            "timestamp": datetime.utcnow() # Update this to datetime.now(datetime.UTC)
        })
        print("Chat history stored.") # Debug 7

        return jsonify({"answer": answer}), 200

    except Exception as e:
        print(f"An error occurred in chat endpoint: {str(e)}") # Debug 8
        return jsonify({"error": str(e)}), 500

# Example Flask Backend addition for /get_bot_chat_history


@app.route('/get_bot_chat_history', methods=['GET'])
def get_bot_chat_history():
    bot_id = request.args.get('bot_id')

    if not bot_id:
        return jsonify({"error": "Missing bot_id parameter"}), 400

    try:
        # Fetch chat history: only question and answer fields
        history_cursor = chat_history.find(
            {'bot_id': bot_id},
            {'_id': 0, 'question': 1, 'answer': 1}
        )

        history = list(history_cursor)

        return jsonify({"history": history}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200


@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    new_password = data.get("new_password")
    current_password = data.get("current_password")

    user = users_collection.find_one({"user_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Validate current password if new_password is provided
    if new_password and not check_password_hash(user['password'], current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    # Prepare update fields
    update_fields = {}
    if first_name:
        update_fields["first_name"] = first_name
    if last_name:
        update_fields["last_name"] = last_name
    if new_password:
        update_fields["password"] = generate_password_hash(new_password)

    if not update_fields:
        return jsonify({"error": "No valid fields to update"}), 400

    # Update user in MongoDB
    result = users_collection.update_one({"user_id": user_id}, {"$set": update_fields})
    if result.modified_count > 0:
        return jsonify({"message": "Profile updated successfully"}), 200
    return jsonify({"message": "No changes made"}), 200

@app.route('/get_my_chatbots', methods=['GET'])
@jwt_required()
def get_my_chatbots():
    user_id = get_jwt_identity()
    try:
        bots_cursor = chatbot_collection.find(
            {"user_id": user_id},
            {"_id": 0, "bot_id": 1, "chatbot_name": 1, "input_type": 1, "created_at": 1}
        )
        bots = list(bots_cursor)
        return jsonify({"chatbots": bots}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/embed/<bot_id>')
def embed_chatbot(bot_id):
    chatbot = chatbot_collection.find_one({"bot_id": bot_id})
    if not chatbot:
        return "Invalid bot ID", 404
    return render_template("embed.html", bot_id=bot_id)


@app.route('/get_embed_code/<bot_id>', methods=['GET'])
@jwt_required()
def get_embed_code(bot_id):
    user_id = get_jwt_identity()

    chatbot = chatbot_collection.find_one({"bot_id": bot_id, "user_id": user_id})
    if not chatbot:
        return jsonify({"error": "Chatbot not found"}), 404

    # Change this to your deployed backend domain
    base_url = "http://127.0.0.1:5000/"  # e.g., "https://botcraft.com"

    iframe_code = f"<iframe src='{base_url}/embed/{bot_id}' width='100%' height='500' frameborder='0'></iframe>"
    return jsonify({"iframe_code": iframe_code}), 200






# ✅ MAIN
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)




















