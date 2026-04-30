import uvicorn
from typing import Union, Optional
from fastapi import FastAPI
from fastapi import HTTPException
import psycopg2
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
import base64
import requests
import  dbConfig 
import serviceMongoOrion
import urbanMovility
import serviceOrionSettings

MONGO_URI = "mongodb://localhost:27017"
MONGO_DB = "mi_base"

app = FastAPI()
# Lista de orígenes permitidos
origins = [
    "http://localhost:5173",
    "http://locahost"  # Vite dev server
    # Puedes agregar más orígenes si los necesitas
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/db-status-postgis")
def db_status():
    try:
        conn = psycopg2.connect(**dbConfig.DB_POSTGIS_CONFIG)
        conn.close()
        return {"status": "PostGIS is connected"}
    except Exception as e:
        return {"status": f"Failed to connect: {e}"}
    
    
@app.get("/db-status-mongo")
async def db_status():
    try:
        print('Conectando a Mongo')
        client = MongoClient(dbConfig.DB_MONGO_CONFIG)
        databases = client.list_database_names()
        for db in databases: 
            if db.startswith("orion"):
                return f"Mongo is connected - {db.upper()} found"
    except Exception as e:
        return {"status": f"Failed to connect: {e}"}
    

@app.get("/getOrionServices")
def getOrionServices():
    print(f"Obteniendo servicios Orion")
    results = serviceMongoOrion.getOrionServices()
    return results

@app.get("/getOrionServicesWithServicePath/{service}")
def getOrionServicesWithServicePath(servicie: Optional[str] = ''):
    print(f"getOrionServicesWithServicePath")
    if servicie=='':
        return []
    results=serviceMongoOrion.getOrionServicesWithServicePath(servicie)
    return results



@app.post("/setOrionService/{service}")
def setOrionService(service):
    print(f"Creacion servicio {service} en orion")
    if service==[]:
        raise HTTPException(status_code=404, detail="No se encontraron resultados de subservicios de Orion") 
    results = serviceMongoOrion.setOrionService(service)
    if results:
        return results
    else:
        raise HTTPException(status_code=404, detail="No se creo el servicio {service}") 



@app.get("/getOrionServicesPath/")
@app.get("/getOrionServicesPath/{service}")
def getOrionServicesPath(service: Optional[str] = ''):
    print(f"Obteniendo servicios Orion")
    if service=='':
        return []
    results = serviceMongoOrion.getServiceServicePath(service)
    if results:
        return results
    else:
        raise HTTPException(status_code=404, detail="No se encontraron resultados de subservicios de Orion") 


@app.get("/busPositions/")
def BusPoitions():
    print(f"Obteniendo posiciones de urbanMovility")
    results = urbanMovility.getBusPositions()
    if results:
        return results
    else:
        raise HTTPException(status_code=404, detail="No se encontraron posiciones de urbanMovility")


# ORION WEB SETTINGS
@app.get("/getOrionWebSettings")
def getOrionWebSettings():
    print(f"Obteniendo configuracion web de orion")
    results = serviceOrionSettings.getOrionWebSettings()
    if results:
        return results
    else:
        raise HTTPException(status_code=404, detail="No se encontraron configuraciones web de Orion")

@app.get("/setOrionWebSettings/{data}")
def setOrionWebSettings(data: str):
    print(f"Obteniendo configuracion web de orion")
    results = serviceOrionSettings.setOrionWebSettings(data)
    if results:
        return results
    else:
        raise HTTPException(status_code=404, detail="No se encontraron configuraciones web de Orion")




if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)