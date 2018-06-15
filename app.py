from flask import Flask
from clean_data import clean_csv


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/all-birds')
def mc_1():
    csv = clean_csv("AllBirdsv4.csv")
    return csv
    # return 'Mini Challenge 1!'


if __name__ == '__main__':
    app.run()
