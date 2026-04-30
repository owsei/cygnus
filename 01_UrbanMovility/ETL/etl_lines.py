import requests
import time
import config
import json
from typing import Optional
from google.transit import gtfs_realtime_pb2 # type: ignore
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

DB_POSTGIS_CONFIG = {
    'dbname': 'geopamplona',
    'user': 'admin',
    'password': 'admin',
    'host': 'localhost',
    'port': 5432
}

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

def consultaDB(query: str) -> Optional[list]:
    try:
        conn = psycopg2.connect(**DB_POSTGIS_CONFIG)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            result = cur.fetchall()
        if result :
            return result
        else:
            return None
    except Exception as e:
        print(f"Error al ejecutar la consulta: {e}")
        return None

def getTables()->Optional[list]:
    query =f"""SELECT * FROM information_schema.tables WHERE table_schema = 'public' and table_name like 'traub_lin_tuc_linea%' ORDER BY table_name"""
    tablas = consultaDB(query)
    return tablas

def getLineShapes(tabla)->Optional[list]:
    print("Tabla encontrada:", tabla['table_name'])
    query =f"""Select id, ST_AsGeoJSON(geom) AS geom, feature, idlineabus, lineabus, iditinera, itinera, longitud, geom_long, beginlife from {tabla['table_name']}"""
    consultaDB(query)
    line=consultaDB(query)
    return line
    


def setLinesMIA()->Optional[str]:
    
    headerOrion = {
        'Fiware-Service': 'pamplona',
        'Fiware-ServicePath': '/urbanmobility',
    }
    
    tables=getTables()
    if tables is None:
        print("No se han encontrado tablas de líneas.")
        return None
    
    for tabla in tables:
        lines=getLineShapes(tabla)
        if lines is None:
            print("No se han obtenido líneas de la base de datos.")
            return None

        for line in lines:
            # print(vehicle)
            geojson = json.loads(line["geom"])
            coords = geojson["coordinates"]   # ← AQUÍ tienes las coordenadas directamente
            lin={
                    "id": line["idlineabus"]+ "_" +line["iditinera"],
                    "type": "gtfsshape",
                    "description": line["lineabus"],
                    "name": line["idlineabus"]+ "_" +line["iditinera"],
                    "areaServed":"Pamplona",
                    "location": {
                        "type": "LineString",
                        "coordinates":coords
                    },
                    "owner":"Mancomunidad de la Comarca de Pamplona"
                }

            try:
                requests.post(config.url_iot_json_Lines_CASA + lin["id"], headers=headerOrion,json=lin)
                print("Entidad creada:", line)
            except requests.exceptions.RequestException as e:
                print(f"Error sending vehicle data to Orion: {e}")
        time.sleep(30)

def setLines()->Optional[str]:
    
    tokenOrion=getOrionToken("/urbanmobility")
    headerOrion = {
        'Fiware-Service': 'sc_pamplona_pre',
        'Fiware-ServicePath': '/urbanmobility',
        'X-Auth-Token': tokenOrion,
    }
    
    tables=getTables()
    if tables is None:
        print("No se han encontrado tablas de líneas.")
        return None
    
    for tabla in tables:
        lines=getLineShapes(tabla)
        if lines is None:
            print("No se han obtenido líneas de la base de datos.")
            return None

        for line in lines:
            # print(vehicle)
            geojson = json.loads(line["geom"])
            coords = geojson["coordinates"]   # ← AQUÍ tienes las coordenadas directamente
            lin={
                    "id": line["idlineabus"]+ "_" +line["iditinera"],
                    "type": "GtfsShape",
                    "description": line["lineabus"],
                    "name": line["idlineabus"]+ "_" +line["iditinera"],
                    "areaServed":"Pamplona",
                    "location": {
                        "type": "LineString",
                        "coordinates":coords
                    },
                    "owner":"Mancomunidad de la Comarca de Pamplona"
                }

            try:
                requests.post(config.url_iot_json_CASA + lin["id"], headers=headerOrion,json=lin)
                print("Entidad creada:", line)
            except requests.exceptions.RequestException as e:
                print(f"Error sending vehicle data to Orion: {e}")

if __name__ == "__main__":
    # setLines()
    setLinesMIA()