from typing import Optional
import dbConfig
from pymongo import MongoClient

clientMongo = MongoClient(dbConfig.DB_MONGO_CONFIG)

def getOrionServices() -> Optional[dict]:
    #Lista todos los servicios (bases de datos creadas por Orion).
    # Filtramos solo las DB que empiezan por "orion-" (convención de Orion)
    clientMongo = MongoClient(dbConfig.DB_MONGO_CONFIG)
    databases = clientMongo.list_database_names()
    services = [db.replace("orion-", "") for db in databases if db.startswith("orion-")]
    print(services)
    return services

def getOrionServicesWithServicePath(servicie) -> Optional[dict]:
    #Lista todos los servicios (bases de datos creadas por Orion).
    # Filtramos solo las DB que empiezan por "orion-" (convención de Orion)
    databases = clientMongo.list_database_names()
    services = [db.replace("orion-", "") for db in databases if db.startswith("orion-"+servicie)]
    
    servicesPathArray=[]
    for service in services:
        print("Rescorriendo servicio: orion-"+service)
        ser="orion-"+ service
        dbMongo=clientMongo["orion-"+ service]
        print("Buscando en base de datos:" + ser)
        colecction=dbMongo["entities"]

        print(colecction)
        servicesPaths=colecction.distinct("_id.servicePath")   # Itera todos los documentos
        
        for servicesPath in servicesPaths:
            print("ServicesPath:" + servicesPath)
            servicesPathArray.append(ser + " - " + servicesPath)
    
    return servicesPathArray

def setOrionService(service)-> Optional[dict]:
    newdb= "orion-" + service
    print("Creando BD Mongo:" + newdb)
    mydb= clientMongo[newdb]
    
    mydb["commands"].insert_one({})
    mydb["commands"].delete_one({})
    
    mydb["entities"].insert_one({})
    mydb["entities"].delete_one({})
    
    mydb["devices"].insert_one({})
    mydb["devices"].delete_one({})
    
    mydb["groups"].insert_one({})
    mydb["groups"].delete_one({})
    
    mydb["csubs"].insert_one({})
    mydb["csubs"].delete_one({})
    
    
    return  newdb

def getServiceServicePath(service)-> Optional[dict]:
    
    if (service=='') or (service is None):
        serviceToFind = "orion"
    else:
        serviceToFind = "orion-" + service    
    
    # print("Busacando servicePath para:" + serviceToFind)
    db=clientMongo[serviceToFind]
    col=db["entities"]
    valores=col.distinct("_id.servicePath")
    # print(valores)
    return valores
    
def setOrionSubservice(service,subservice)-> Optional[dict]:
    service= "orion-" + service
    print("Creando Service:" + service)
    print("Creando Subservice:" + subservice)
    mydb=clientMongo[service]
    mydb["commands"].insert_one({})
    mydb["entities"].insert_one({})
    mydb["devices"].insert_one({})
    mydb["groups"].insert_one({})
    return  service


