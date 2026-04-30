-- Buenas,

-- Dejo por aquí un enlace a la colección de POSTMAN https://github.com/telefonicaid/thinkingcity/tree/master/postman [github.com] para que os la podáis descargar. Las peticiones están en la carpeta de Orion Context Broker 
 

-- He hecho pruebas en postman con la info que os ha pasado Cristina antes, para obtener el token el endpoint es https://auth.plataformaciudad.pamplona.es 
-- [auth.plataformaciudad.pamplona.es]/v3/auth/tokens y para hacer peticiones al CB el endpoint es https://cb.plataformaciudad.pamplona.es/ 
-- [cb.plataformaciudad.pamplona.es]<varía según la operación> 
-- El subservicio es sc_pamplona_pro y actualmente tenemos info en los subservicios de /parking /sdmenergyefficiency y /sdmenvironment. 
-- Podéis usar las credenciales del usuario PRUGDADM para realizar las peticiones.

-- Si hacéis una petición por cada subservicio a https://cb.plataformaciudad.pamplona.es [cb.plataformaciudad.pamplona.es]/v2/entities os devolverá el listado de todos las entidades disponibles con su respectivo tipo y atributos disponibles. Las principales son:

-- parking -> ParkingSpot, OffStreetParking y OnStreetParking
-- sdmenvironment -> WeatherObserved, NoiseLevelObserved y WeatherObserved
-- sdmenergyefficiency -> ThreePhaseAcMeasurement y Device

-- Importante que en el servicio sc_pamplona_pro solo se realicen operaciones de lectura para no alterar medidas de las entidades. Si queréis hacer alguna prueba de escritura podeis probar en sc_pamplona_pre 

-- Por cierto, debe estar en el fichero host de la máquina desde la cual se enviaran las peticiones tanto auth.plataformaciudad.pamplona.es [auth.plataformaciudad.pamplona.es] como cb.plataformaciudad.pamplona.es [cb.plataformaciudad.pamplona.es]

-- Por otra parte, si quereís hacer pruebas por iota hay que apuntar a iota-json.plataformaciudad.pamplona.es [iota-json.plataformaciudad.pamplona.es] y también debe estar en el fichero host.

-- entityID: OFF-SUB-PLAZA-CASTILLO
-- apikey: m6hqjnuylagjtl5o5xp9zghn5

-- Ejemplo de endpoint para envio de información por iota: http://iota-json.plataformaciudad.pamplona.es/iot/json?i=OFF-SUB-PLAZA-CASTILLO&k=m6hqjnuylagjtl5o5xp9zghn5 [iota-json.plataformaciudad.pamplona.es]

-- Podéis hacer las pruebas con esa entidad y ese grupo de dispositivos. Se le puede mandar algo como lo siguiente
-- {
--         "TimeInstant": {"type": "DateTime", "value": "2025-09-30T06:10:59.103Z"},
--         "accessModified": {"type": "DateTime", "value": "2025-09-30T06:10:59.103Z"},
--         "availableSpotNumber": {"type": "Number", "value":10},
--         "totalSpotNumber": {"type": "Number", "value": 50}
--     }

-- Cualquier duda, me decis



CREATE SCHEMA IF NOT EXISTS pamplona;

CREATE EXTENSION IF NOT EXISTS postgis SCHEMA pamplona;
CREATE EXTENSION IF NOT EXISTS postgis_topology SCHEMA pamplona;

CREATE EXTENSION IF NOT EXISTS timescaledb SCHEMA pamplona;


 CREATE TABLE IF NOT EXISTS pamplona.urbanmobility_vehicle (
  timeinstant timestamp with time zone,
  vehicleid text,
  license_plate text,
  location pamplona.geometry(Point, 4326),
  timedata timestamp with time zone,
  current_stop_sequence text,
  stop_id text,
  route_id text,
  trip_id text,
  direction_id text,
  occupancy_percentage text,
  -- Common model attributes
  entityid text,
  entitytype text,
  recvtime timestamp with time zone,
  fiwareservicepath text,
  -- PRIMARY KEYS
  CONSTRAINT urbanmobility_vehicle_pkey PRIMARY KEY (timeinstant, entityid)
);

CREATE INDEX urbanmovility_vehicle_idx_tm ON sc_pamplona_pre.urbanmobility_vehicle (timeinstant);

GRANT ALL PRIVILEGES ON TABLE sc_pamplona_pre.urbanmobility_vehicle TO cygnus_user;

CREATE TABLE IF NOT EXISTS sc_pamplona_pre.urbanmobility_vehicle_lastdata (
  timeinstant timestamp with time zone,
  vehicleid text,
  license_plate text,
  location geometry,
  timedata timestamp with time zone,
  current_stop_sequence text,
  stop_id text,
  route_id text,
  trip_id text,
  direction_id text,
  occupancy_percentage text,
  -- Common model attributes
  entityid text,
  entitytype text,
  recvtime timestamp with time zone,
  fiwareservicepath text,
  -- PRIMARY KEYS
  CONSTRAINT urbanmobility_vehicle_lastdata_pkey PRIMARY KEY (entityid)
);


CREATE INDEX urbanmovility_vehicle_idx_tm ON sc_pamplona_pre.urbanmobility_vehicle_lastdata (timeinstant);

GRANT ALL PRIVILEGES ON TABLE sc_pamplona_pre.urbanmobility_vehicle_lastdata TO cygnus_user;




CREATE INDEX urbanmobility_vehicle_idx_tm ON urbanmobility_vehicle (timeinstant);

GRANT ALL PRIVILEGES ON TABLE sc_pamplona_pre.urbanmobility_vehicle TO cygnus_user;


-- GTFS Shape

CREATE TABLE sc_pamplona_pre.urbanmobility_gtfsshape (
    entityId           text,
    entityType         text,
    fiwareServicePath  text,
    recvTime           timestamp with time zone,
    owner              text,
    measure_type       text,
    areaServed         text,
    name               text,
    description        text,
    location           geometry,
    measure_id         text,
    TimeInstant        timestamp with time zone
);

GRANT ALL PRIVILEGES ON TABLE sc_pamplona_pre.urbanmobility_gtfsshape TO cygnus_user;

CREATE TABLE sc_pamplona_pre.urbanmobility_gtfsshape_lastdata (
    entityId           text,
    entityType         text,
    fiwareServicePath  text,
    recvTime           timestamp with time zone,
    owner              text,
    measure_type       text,
    areaServed         text,
    name               text,
    description        text,
    location           geometry,
    measure_id         text,
    TimeInstant        timestamp with time zone
);
GRANT ALL PRIVILEGES ON TABLE sc_pamplona_pre.urbanmobility_gtfsshape_lastdata TO cygnus_user;

ALTER TABLE IF EXISTS sc_pamplona_pre.urbanmobility_gtfsshape_lastdata
    ADD CONSTRAINT urbanmobility_gtfsshape_lastdata_pkey PRIMARY KEY (entityid);

