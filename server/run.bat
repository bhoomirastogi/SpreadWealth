:;
:: Windows quick start
python -m venv .venv
call .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
