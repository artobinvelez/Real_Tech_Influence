#Import dependencies
import pandas as pd
import requests
import json

# Google developer API key
from config2 import API_chi_key

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
from config2 import mysql_password

### -- Connect to Chicago Data Portal API - Business Licenses Data -- ###
##########################################################################
# Build API URL
# API calls = 8000 (based on zipcode and issued search results)
# Filters: 'application type' Issued
target_URL = f"https://data.cityofchicago.org/resource/xqx5-8hwx.json?$$app_token={API_chi_key}&$limit=8000&application_type=ISSUE&zip_code="

# create list of zipcodes we are examining based
# on three different businesses of interest
zipcodes = ["60610","60607","60606","60661",
            "60614","60622","60647","60654"]

# Create a request to get json data on business licences
responses = []
for zipcode in zipcodes:
    license_response = requests.get(target_URL + zipcode).json()
    responses.append(license_response)

# Create sepearte variables for the 8 responses for zipcodes
# Data loaded in nested gropus based on zipcodes, so
# needed to make them separate
zip_60610 = responses[0]
zip_60607 = responses[1]
zip_60606 = responses[2]
zip_60661 = responses[3]
zip_60614 = responses[4]
zip_60622 = responses[5]
zip_60647 = responses[6]
zip_60654 = responses[7]

# Read zipcode_responses_busi.json files into pd DF
zip_60610_data = pd.DataFrame(zip_60610)

# Create list of the json object variables
# excluding zip_60610 bc that will start as a DF
zip_data = [zip_60607, zip_60606, zip_60661, zip_60614,
           zip_60622, zip_60647, zip_60654]

# Create a new DF to save compiled business data into
all_7_zipcodes = zip_60610_data

# Append json objects to all_7_zipcode DF
for zipcodes_df in zip_data:
    all_7_zipcodes = all_7_zipcodes.append(zipcodes_df)

# Select certain columns to show 
core_info_busi_licences = all_7_zipcodes[['legal_name', 'doing_business_as_name',
                                        'zip_code', 'license_description', 
                                        'business_activity', 'application_type', 
                                        'license_start_date', 'latitude', 'longitude']]

# Add sepearate column for just the start year
# Will use later when selecting year businesess were created
core_info_busi_licences['start_year'] = core_info_busi_licences['license_start_date']

# Edit 'start_year' to just include year from date information
core_info_busi_licences['start_year'] = core_info_busi_licences['start_year'].str[0:4]

# Cast 'start_year' column as an integer
core_info_busi_licences['start_year'] = core_info_busi_licences['start_year'].astype('int64')

# Get rid of NaN values in 'latitude' and 'license_start_date'
drop_nulls_latitudes = core_info_busi_licences.dropna(subset=['latitude'])
updated_business_licenses = drop_nulls_latitudes.dropna(subset=['license_start_date'])

# Declare a Base using `automap_base()`
Base = automap_base()

# Create engine using the `demographics.sqlite` database file
# engine = create_engine("sqlite://", echo=False)

engine = create_engine(f'mysql://root:{mysql_password}@localhost:3306/real_tech_db')

# Copy 'core_info_busi_licenses' db to MySql database
updated_business_licenses.to_sql('business_licenses', 
                               con=engine, 
                               if_exists='replace',
                               index_label=True)