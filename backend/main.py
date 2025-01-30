import flask from requests
from config import app, db 
from models import Expense

@app.route('/expenses', method=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    return expenses
