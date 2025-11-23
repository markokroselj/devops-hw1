from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

DB_HOST = os.getenv('DB_HOST')
DB_USERNAME = os.getenv('DB_USERNAME')
DB_PASSWORD = os.getenv("DB_PASSWORD")

if not DB_HOST or not DB_USERNAME:
    raise ValueError(
        "Database configuration error: DB_HOST and DB_USERNAME must not be empty.")


app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/vehicles_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Location(db.Model):
    __tablename__ = 'Location'
    Location_ID = db.Column(db.Integer, primary_key=True)
    Location_name = db.Column(db.String(100))
    Location_link = db.Column(db.String(2048))

class Type(db.Model):
    __tablename__ = 'Type'
    Type_ID = db.Column(db.Integer, primary_key=True)
    Type = db.Column(db.String(25))


class Vehicle(db.Model):
    __tablename__ = 'Vehicle'
    Vehicle_ID = db.Column(db.Integer, primary_key=True)
    Location_ID = db.Column(db.Integer, db.ForeignKey(
        'Location.Location_ID'), nullable=False)
    Type_ID = db.Column(db.Integer, db.ForeignKey(
        'Type.Type_ID'), nullable=False)
    Name = db.Column(db.String(20))

    location = db.relationship('Location')
    type = db.relationship('Type')


@app.route('/get-vehicles', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    result = []
    for v in vehicles:
        result.append({
            "id": v.Vehicle_ID,
            "type": v.type.Type,
            "name": v.Name,
            "location": v.location.Location_name,
            "location_link": v.location.Location_link
        })
    return jsonify(result)


@app.route('/get-types', methods=['GET'])
def get_types():
    types = Type.query.all()
    result = [{"id": t.Type_ID, "type": t.Type} for t in types]
    return jsonify(result)


@app.route('/get-locations', methods=['GET'])
def get_locations():
    locations = Location.query.all()
    result = [{"id": l.Location_ID, "location": l.Location_name, "location_link": l.Location_link} for l in locations]
    return jsonify(result)

@app.route('/get/vehicle/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    v = Vehicle.query.get(vehicle_id)
    if not v:
        return jsonify({"error": "Vehicle not found"}), 404
    return jsonify({
        "id": v.Vehicle_ID,
        "type": v.type.Type,
        "name": v.Name,
        "location": v.location.Location_name
    })


@app.route('/add-vehicle', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    name = data.get("name")
    type_id = data.get("type_id")
    location_id = data.get("location_id")

    if not all([name, type_id, location_id]):
        return jsonify({
            "error": "Fields 'name', 'type_id', and 'location_id' are required"
        }), 400

    type_entry = Type.query.get(type_id)
    if not type_entry:
        return jsonify({"error": f"Type with ID {type_id} not found"}), 400

    
    location_entry = Location.query.get(location_id)
    if not location_entry:
        return jsonify({"error": f"Location with ID {location_id} not found"}), 400

    new_vehicle = Vehicle(
        Type_ID=type_id,
        Location_ID=location_id,
        Name=name
    )

    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({
        "id": new_vehicle.Vehicle_ID,
        "type_id": type_id,
        "location_id": location_id,
        "name": name
    }), 201


@app.route('/delete-vehicle/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    v = Vehicle.query.get(vehicle_id)
    if not v:
        return jsonify({"error": "Vehicle not found"}), 404
    db.session.delete(v)
    db.session.commit()
    return jsonify({"message": f"Vehicle {vehicle_id} deleted"}), 200


@app.route('/delete-all-vehicles', methods=['DELETE'])
def delete_all_vehicles():
    deleted = Vehicle.query.delete()
    db.session.commit()
    return jsonify({"message": f"Deleted {deleted} vehicles"}), 200


if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=os.getenv('APP_PORT'))