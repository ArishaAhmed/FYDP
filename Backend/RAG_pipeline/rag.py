from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Qdrant
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
from langchain.docstore.document import Document


from langdetect import detect
from deep_translator import GoogleTranslator


# --- Set your Qdrant Cloud credentials ---
QDRANT_URL = "#####"
QDRANT_API_KEY = "#####"

# Step 1: Chunk PDF text
def get_text_chunks(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    return splitter.create_documents([text])  # Wraps in Document

# Step 2: Upload to Qdrant (create collection)
def create_qdrant_index(chunks, collection_name):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    vector_db = Qdrant.from_documents(
        documents=chunks,
        embedding=embeddings,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        collection_name=collection_name,
        batch_size=16
    )
    return vector_db

# Step 3: QA Chain
def get_conversational_chain():
    prompt_template = """Answer ONLY using these context blocks:
    {context}
    Question: {question}
    Rules:
    1. If the answer exists, be concise.
    2. If not, say "Not in context".
    Answer:"""
    model = Ollama(model="llama3.2:3b")
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)

from qdrant_client import QdrantClient

def load_vector_db(collection_name):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    
    # Connect to remote Qdrant instance
    client = QdrantClient(
        url=QDRANT_URL,           # e.g. "https://your-qdrant-url.qdrant.cloud"
        api_key=QDRANT_API_KEY
    )
    
    return Qdrant(
        client=client,
        collection_name=collection_name,
        embeddings=embeddings
    )

from langdetect import detect
from deep_translator import GoogleTranslator

def translate_text(text, target_lang):
    return GoogleTranslator(source='auto', target=target_lang).translate(text)

def user_input(vector_db, user_question, language):
    # Detect if input is Urdu (if language param missing)
    detected_lang = detect(user_question)
    
    # Translate Urdu to English for processing
    if language == 'ur' or detected_lang == 'ur':
        user_question_en = translate_text(user_question, 'en')
    else:
        user_question_en = user_question

    # Retrieve relevant documents
    retriever = vector_db.as_retriever(search_type="similarity", search_kwargs={"k": 5})
    docs = retriever.get_relevant_documents(user_question_en)
    
    # Run the chain
    chain = get_conversational_chain()
    result = chain({"input_documents": docs, "question": user_question_en}, return_only_outputs=True)
    answer_en = result["output_text"]

    # Translate answer back to Urdu if needed
    if language == 'ur' or detected_lang == 'ur':
        answer_translated = translate_text(answer_en, 'ur')
    else:
        answer_translated = answer_en

    return answer_translated
