
import pdfplumber
import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')
STOPWORDS = set(stopwords.words('english'))

def preprocess_text(text):
    text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
    text = re.sub(r'[^A-Za-z0-9\s]', '', text).lower()
    tokens = text.split()
    cleaned = [word for word in tokens if word not in STOPWORDS and len(word) > 2]
    return " ".join(cleaned)

def extract_pdf_text(filepath):
    full_text = ""
    with pdfplumber.open(filepath) as pdf_obj:
        for page in pdf_obj.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += "\n" + page_text.strip()
    return full_text
