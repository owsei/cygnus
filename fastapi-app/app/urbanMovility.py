import requests
from typing import Optional
import config
from google.transit import gtfs_realtime_pb2
from datetime import datetime


from config import client_id, client_secret

token_data = {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret
}

# Function to obtain access token from MCP API
def get_access_token() -> Optional[str]:
    try:
        token_response = requests.post(config.token_url, data=token_data)
        if token_response.status_code == 200:
            print("Token obtenido con éxito!")
            access_token = token_response.json()['access_token']
            print(f"Access Token: {access_token}")
            return access_token
        else:
            print(f"Error al obtener el token: {token_response.status_code} - {token_response.text}")
            return token_response
    except requests.exceptions.RequestException as e:
        print(f"Error obtaining access token: {e}")
        return None
    

# Function to get bus positions from urban mobility API
def getBusPositions() -> Optional[dict]:
    access_token = get_access_token()
    if not access_token:
        print(f"Error al obtener el token: {access_token.status_code} - {access_token.text}")
        return None
    if access_token:
        api_url = config.mcp_url
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
    
        api_response = requests.get(api_url, headers=headers)
        if api_response.status_code == 200:
            print("Posiciones de buses obtenidas con éxito!")
            feed = gtfs_realtime_pb2.FeedMessage()
            feed.ParseFromString(api_response.content)
            print(f"\nSe han encontrado {len(feed.entity)} vehículos activos.")

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

            return vehiclePositions

        else:
            print(f"Error al obtener las posiciones de los buses: {api_response.status_code} - {api_response.text}")
            return None



