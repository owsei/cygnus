from typing import Optional
import dbConfig
import dbQuerys


def getOrionWebSettings() -> Optional[dict]:
    #Lista todos los servicios (bases de datos creadas por Orion).
    # Filtramos solo las DB que empiezan por "orion-" (convención de Orion)

    querySettings = 'SELECT url_orion, url_iot_json_register, url_iot_json_data_send, url_iot_ul_register, url_iot_ul_data_send, url_cygnus FROM "orion".setting'
    print(querySettings)
    result = dbQuerys.select(querySettings)
    print(result)
    if result:
        return result
    else:
        return None


def setOrionWebSettings(data: str) -> Optional[dict]:
    #Lista todos los servicios (bases de datos creadas por Orion).
    # Filtramos solo las DB que empiezan por "orion-" (convención de Orion)

    querySettings = f'UPDATE "orion".setting SET url_orion=\'{data["url_orion"]}\', url_iot_json_register=\'{data["url_iot_json_register"]}\', url_iot_json_data_send=\'{data["url_iot_json_data_send"]}\', url_iot_ul_register=\'{data["url_iot_ul_register"]}\', url_iot_ul_data_send=\'{data["url_iot_ul_data_send"]}\', url_cygnus=\'{data["url_cygnus"]}\' WHERE id=1;'
    print(querySettings)
    result = dbQuerys.execute(querySettings)
    print(result)
    if result:
        return result
    else:
        return None
    