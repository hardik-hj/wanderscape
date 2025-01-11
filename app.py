from flask import Flask, render_template, request, jsonify
from urllib.parse import unquote
import webbrowser
import json
import dbms
import re

app = Flask(__name__)

@app.route("/home")
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/tag")
def tag():
    value = dbms.gettags()
    data = json.dumps(value)
    return render_template(template_name_or_list="tag.html", tag=data)

@app.route('/tag/<tag_id>')
def city_select(tag_id):
    tag_id = unquote(tag_id)
    value = dbms.getcitys(tag_id)
    data = json.dumps(value)
    return render_template("activity.html", tag=data, t_name=tag_id)

@app.route('/city/<city>')
def display_city(city):
    city = unquote(city)
    value = dbms.get_destination_info(city)
    data = json.dumps(value)
    c_name = re.sub(r'\(.*?\)', '', city).strip()
    value1 = [city.split()[0] + str(x) for x in range(1, 5)]
    data1 = json.dumps(value1)
    return render_template("city.html", city_slide=data1, city=c_name, city_detail=data)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')  # Get search query from the request
    cities = dbms.search_cities(query)  # Function to search cities
    return jsonify(cities)

# New Route for Budget-based Search
@app.route('/budget_search', methods=['GET'])
def budget_search():
    budget_value = int(request.args.get('budget', 0))  # Get the budget from the query parameter
    
    # Fetch sightseeing places within the budget from the DB
    places = dbms.get_sightseeing_by_budget(budget_value)
    
    return jsonify(places)  # Return the results as a JSON response

@app.route("/<click>")
def other(click):
    return render_template(template_name_or_list=f"{unquote(click)}.html")

if __name__ == '__main__':  
    # Open the browser automatically
    webbrowser.open("http://127.0.0.1:5000/")
    
    # Enable Flask's debug mode for live reloading
    app.run(debug=True, host='0.0.0.0', port=5000)
