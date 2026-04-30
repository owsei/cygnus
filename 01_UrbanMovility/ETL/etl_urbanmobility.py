
import requests
import config
from typing import Optional
from google.transit import gtfs_realtime_pb2 # type: ignore
from datetime import datetime

# get

def get_access_token_MCP() -> Optional[str]:
    try:
        token_data = {
            'grant_type': 'client_credentials',
            'client_id':config.client_id,
            'client_secret': config.client_secret
        }

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

def getBusPositionsMCP() -> Optional[dict]:
    access_token = get_access_token_MCP()
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

            return vehiclePositions

        else:
            print(f"Error al obtener las posiciones de los buses: {api_response.status_code} - {api_response.text}")
            return None

def getOrionToken(servicePath) -> Optional[str]:
    try:
    # Placeholder function to obtain Orion token
        headerOrion = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        payload = {
            "auth": {
                "identity": {
                "methods": [
                    "password"
                ],
                "password": {
                    "user": {
                    "domain": {
                        "name": config.service_plataforma
                    },
                    "name": config.userPlataforma,
                    "password": config.passPlataforma
                    }
                }
                },
                "scope": {
                    "project": {
                        "domain": {
                        "name": "sc_pamplona_pre"
                        },
                        "name": servicePath
                    }
                }
            }
        }

        token_response = requests.post(url=config.url_orion_token, headers=headerOrion, json=payload,)
        print("Código:", token_response.status_code)
        print("Respuesta:", token_response.json())
        
        print("Cabeceras de respuesta:")
        for clave, valor in token_response.headers.items():
            print(f"{clave}: {valor}")
        
        tokenOrion=token_response.headers["x-subject-token"]
        print("Token Orion obtenido:", tokenOrion)
        return tokenOrion
    
    except requests.exceptions.RequestException as e:
        print(f"Error obtaining Orion token: {e}")
        return None

# SETS
def setBusPositions():
    # Placeholder function to process or store bus positions
    vehiclePositions=getBusPositionsMCP()
    print("Vehículos obtenidos:", len(vehiclePositions))
    
    tokenOrion=getOrionToken("/urbanmobility")

    headerOrion = {
        'Fiware-Service': 'sc_pamplona_pre',
        'Fiware-ServicePath': '/urbanmobility',
        'X-Auth-Token': tokenOrion,
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
            requests.post(config.url_local_orion_entities + vehicle["id"], headers=headerOrion,json=vec)
            print("Entidad creada:", vec)
        except requests.exceptions.RequestException as e:
            print(f"Error sending vehicle data to Orion: {e}")

    

if __name__ == "__main__":
    setBusPositions()
    






