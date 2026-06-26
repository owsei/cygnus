import os
import requests
from google.transit import gtfs_realtime_pb2 # type: ignore
from datetime import datetime

print("ETL process started.")

# obtengo token de MCP
try:
    token_data = {
        'grant_type': 'client_credentials',
        'client_id': os.getenv("Urbanmobility_MCP_client_id"),
        'client_secret': os.getenv("Urbanmobility_MCP_client_secret")
    }

    token_response = requests.post("https://api.mcp.es/token", data=token_data)
    if token_response.status_code == 200:
        print("Token obtenido con éxito!")
        access_token = token_response.json()['access_token']
        print(f"Access Token: {access_token}")
    else:
        print(f"Error al obtener el token: {token_response.status_code} - {token_response.text}")
except requests.exceptions.RequestException as e:
    print(f"Error obtaining access token: {e}")

# Aquí iría el resto del proceso ETL utilizando el token obtenido

if not access_token:
    print(f"Error al obtener el token: {access_token.status_code} - {access_token.text}")
if access_token:
    api_url = "https://api.mcp.es/TUC/GTFS_RT/gtfs-realtime-vehicle"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    api_response = requests.get(api_url, headers=headers)
    if api_response.status_code == 200:
        # print("Posiciones de buses obtenidas con éxito!")
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(api_response.content)
        # print(f"\nSe han encontrado {len(feed.entity)} vehículos activos.")

        vehiclePositions = []
        for entity in feed.entity:
            if entity.HasField('vehicle'):
                vehiclePosition={
                    "id": entity.vehicle.vehicle.id,
                    "latitude": entity.vehicle.position.latitude,
                    "longitude": entity.vehicle.position.longitude,
                    "timestamp": datetime.fromtimestamp(entity.vehicle.timestamp).isoformat(),
                    "license_plate": entity.vehicle.vehicle.license_plate,
                    "current_stop_sequence": entity.vehicle.current_stop_sequence,
                    "stop_id": entity.vehicle.stop_id,
                    "route_id": entity.vehicle.trip.route_id,
                    "trip_id": entity.vehicle.trip.trip_id,
                    "direction_id": entity.vehicle.trip.direction_id,
                    "occupancy_percentage": entity.vehicle.occupancy_status,
                }
                vehiclePositions.append(vehiclePosition)
    else:
        print(f"Error al obtener las posiciones de los buses: {api_response.status_code} - {api_response.text}")

print("Vehículos obtenidos:", len(vehiclePositions))

##############################
headerOrion = {
    'Fiware-Service': 'sc_pamplona_pro',
    'Fiware-ServicePath': '/urbanmobility',
}
print("Header Orion:", headerOrion)

print("Procesando posiciones de vehículos en Orion...")
for vehicle in vehiclePositions:
    # print(vehicle)
    vec={
            "id": vehicle["id"],
            "type": "vehicle",
            "vehicleid":vehicle["id"],
            "license_plate":vehicle["license_plate"],
            "location": {
                "type": "Point",
                "coordinates":[vehicle["longitude"], vehicle["latitude"]]
            },
            "timedata":vehicle["timestamp"],
            "current_stop_sequence":vehicle["current_stop_sequence"],
            "stop_id":vehicle["stop_id"],
            "route_id":vehicle["route_id"],
            "trip_id":vehicle["trip_id"],
            "direction_id":vehicle["direction_id"],
            "occupancy_percentage":vehicle["occupancy_percentage"]
        }

    try:
        requests.post("http://pro-core-smc-iota-json.pro:7897/iot/json?k=" + os.getenv("Urbanmobility_IoTAgent_APIkey_PRO") + "&i=" + vehicle["id"], headers=headerOrion,json=vec)
        print("Entidad creada:", vec)
    except requests.exceptions.RequestException as e:
        print(f"Error sending vehicle data to Orion: {e}")

print("ETL process completed.")