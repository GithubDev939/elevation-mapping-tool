from flask import Flask, render_template, request, url_for, jsonify
import json
import requests
from shapely.geometry import Polygon, Point
import numpy as np

app = Flask(__name__, template_folder='templates')
app.secret_key = "UuE@6Hkl9I(C(;VH9oF0~>}[VjW,y1"

@app.route("/")
def index():
    return render_template("input.html")

@app.route("/process", methods=["POST", "GET"])
def processer():
    if request.method == 'POST':
        data = request.get_json()
        json_object = data[0][0]
        return jsonify(dict(redirect = url_for('analyze', bounds = json_object)))


@app.route("/analyze_selection/<bounds>", methods=["GET", "POST"])
def analyze(bounds):
    print(bounds)
    json_object = json.loads(bounds.replace('\'', '\"'))
    points = [tuple([float(value['lat']), float(value['lng'])]) for value in json_object]
    polygon = Polygon(points)
    latmin, lonmin, latmax, lonmax = polygon.bounds
    hor = latmax-latmin
    ver = lonmax-lonmin
    k = hor/ver
    stepX = hor/(50/k)
    stepY = ver/(50*k)
    points = []
    request_params = []
    for lat in np.arange(latmin, latmax, stepX):
        for lon in np.arange(lonmin, lonmax, stepY):
            if polygon.contains(Point(round(lat,8), round(lon,8))):
                points.append([4*round((lat-latmin)/stepX), round((lon-lonmin)/stepY)])
                request_params.append({"longitude": lon, "latitude": lat})
    elevations = []
    for x in range(int(len(request_params)/1000)):
        results = json.loads(requests.post(url="https://api.open-elevation.com/api/v1/lookup",
                    headers={
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    data = json.dumps({"locations": request_params[1000*x:1000*(x+1)]})).content)['results']
        for val in results:
            elevations.append(val['elevation'])
    results = json.loads(requests.post(url="https://api.open-elevation.com/api/v1/lookup",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8",
                },
                data = json.dumps({"locations": request_params[1000*int(len(request_params)/1000):]})).content)['results']
    for val in results:
        elevations.append(val['elevation'])
    for i in range(len(elevations)):
        points[i].append(float(elevations[i]/(0.1*max(elevations))))
    return render_template("results.html", model_data = points)