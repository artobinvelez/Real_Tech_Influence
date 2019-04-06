# testing out old app.py that will use json format with leaflet to 
# create markers 

import pandas as pd
import json

from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

from config2 import mysql_password

app = Flask(__name__)

# The database URI
# engine = create_engine("mysql://root:{}@localhost:3306/real_tech_db".format(mysql_password))
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:{}@localhost:3306/real_tech_db".format(mysql_password)
db = SQLAlchemy(app)


# Create our database model
class bus_licenses(db.Model):
    __tablename__ = 'business_licenses'

    index_label = db.Column(db.Integer, primary_key=True)
    legal_name = db.Column(db.String)
    doing_business_as_name = db.Column(db.String)
    zip_code = db.Column(db.String)
    license_description = db.Column(db.String)
    business_activity = db.Column(db.String)
    application_type = db.Column(db.String)
    license_start_date = db.Column(db.String)
    latitude = db.Column(db.Integer)
    longitude = db.Column(db.Integer)
    start_year = db.Column(db.Integer)

    def __repr__(self):
        return '<Business License %r>' % (self.doing_business_as_name)


# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()


@app.route("/")
def home():
    """Render Home Page."""
    # Query for the top 10 emoji data
    return render_template("index.html", bus_licenses=bus_licenses,)


@app.route("/api")
def select_one_business():
    """Select one of the three businesses: McDonalds, Groupon or Coyote"""
    results = db.session.query(bus_licenses.doing_business_as_name, bus_licenses.zip_code, bus_licenses.latitude, bus_licenses.longitude, bus_licenses.start_year, bus_licenses.license_description, bus_licenses.business_activity)
    data = results.all()
    geojson_list = []
    for d in data[:100]:
        print('data:', d)
        geojson_list.append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [float(d[2]), float(d[3])]
        },
        "properties": {
            "name": d[0],
            "zipcode": d[1],
            "year": d[4],
            "license": d[5],
            "activity": d[6]
        }
    })
    geojson = json.dumps(geojson_list)
    return geojson

    # geojson = json.dumps({'data': geojson_list})
    # print(geojson)
    # return {}

if __name__ == '__main__':
    app.run(debug=True)