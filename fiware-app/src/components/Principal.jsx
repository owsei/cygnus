import orion from '../assets/orion.png'
import logo_fiware from '../assets/logo-fiware.jpg'



function Principal() {
    const jsonEjemplo = {
        "id": "sensor-365",
        "type": "TemperatureHumiditySensor",
        "temperature": {
            "value": 25.5,
            "type": "Float"
        },
        "humidity":{
            "value": 60,
            "type": "Float"
        }
        
        };
        const rawJson = JSON.stringify(jsonEjemplo, null, 2);
    return (
        <div>
            <div className="container">
                <div className="cabeceraPrincipal">
                    <img src={logo_fiware}/>
                </div>
                <div className="cuerpoPrincipal"> 
                    <h2>Información de la plataforma Fiware</h2>
                    <div className="info-fiware">
                        <h3>Ecosistema fiware</h3>
                        <h4>¿Que es fiware?</h4>
                        <p>Fiware es un conjunto de herramientas open source para la obtencion de datos del mundo real y trasladarlos a ámbito digital, lo que conocemos como gemelo digital. 
                        El sistema fiware esta compuesto de ciertas herramientas para trasladar esos datos de la realidad al mundo técnologico, dentro del ecosistema fiware existen muchas 
                        apliaciones que en conjunto consigen este objetico de recabar datos, en este enlace Catalogo fiware estan todas, pero no todas se usan, ya que dependen los objetivos 
                        a alcanzar el uso de unas u otras aplicaciones y tambien por que algunas de ellas son "piezas" que realizan cosas similares con caracteristicas que se adaptan mas al 
                        gusto de como se va a relizar la obtencion de datos por parque del equipo que va a gestionar el entorno.
                        Fiware es una plataforma de código abierto que proporciona un conjunto de herramientas y componentes para desarrollar aplicaciones inteligentes y soluciones basadas en datos. 
                        Fue creada para facilitar la creación de aplicaciones en áreas como ciudades inteligentes, agricultura, salud, transporte, entre otros.
                        Nosotros vamos a seguir el patrón que ha seguido la empresa Telefónica con su plataforma Thinking Cities, que en realidad es el mas fiel a lo que es la plataforma fiware original 
                        en cuanto a uso de las aplicaciones que se van a usar y como estan comunicadas entre ellas para el paso de la información de unas a otras.
                        </p>
                        
                        <h2>Elementos que componen la plataforma fiware</h2>
                        <hr/>
                        <h2>NGSI v2</h2>
                        <h4>¿Que es?</h4>

                        NGSI lo que busca es facilitar el intercambio abierto y compartición de la información estructurada (JSON) entre los diferentes interesados e integrantes de una arquitectura FIWARE determinada. 
                        NGSI representa la información de contexto como entidades que tienen propiedades y relaciones entre sí con lo que conseguimos esa interoperabilidad de los datos entre los distintos integrantes del 
                        ecosistema Fiware. Las entidades son la representación virtual de toda clase de objeto físico en el mundo real. Ejemplos como un barco, una puerta de acceso o incluso una persona pueden ser entidades. 
                        Los atributos son “cualidades” que se dan a cada entidad en función de la información que se quiere obtener de ella o acciones sobre las que se quiere poder realizar modificaciones en remoto mediante el 
                        atributo reservado de comandos.

                        Ejemplo basico de NGSI:
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Ejemplo de JSON</h2>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                                <code>{rawJson}</code>
                            </pre>
                        </div>

                        
                        <div className="container text-center">
                            <div className="row">
                                <div className="col">
                                    <img className="text-center" src={orion} alt="Esquema Orion" style={{ width: '50%', height: 'auto' }}/>
                                </div>
                            </div>
                        </div>
                        
                        <hr/>
                        <h2>Orion</h2>
                        <h4>¿Que es Orion?</h4>

                        <p>Orion es un broker o agente que hace fluir toda la información que le llega de los sensores, además de guardar la último dato actualizado que se ha enviado de un sensor, 
                        siempre se despliega con una base de datos noSQL MongoDB que almacena dicha información. Orion no tiene un historico de datos por que si se desea guardar esta información para su 
                        posterior explotación y análisis habra que persistirla de alguna manera y es ahi donde entran en juego otras apliaciones de persistencia como bases de datos, por lo generalmente se usa 
                        Postgres con extensiones PostGIS, para geolocalización y/o Timescale para analitica de datos masivos, pudiendose usar cualquier base de datos.

                        ¿Como funciona? Los datos enviados por los sensores son enviados bajo el protocolo HTTP o MQTT con el formato NGSI que entiende Orion
                        </p>

                        <hr/>
                        <h2>IoT Agents</h2>
                        <h4>¿Que son?</h4>

                        <p>Un agente IoT (Internet de las cosas) es un componente de software que facilita la comunicación entre dispositivos IoT y una plataforma centralizada o un broker de contexto, en nuestro caso Orion(CB).</p>

                        <h4>¿Como funcionan?</h4>

                        <p>Los dispositivos IoT a menudo utilizan diferentes protocolos de comunicación. El agente IoT se encarga de entender estos protocolos y recibir los datos que envían los dispositivos. Una vez que el agente recibe los datos, los traduce a un formato común que pueda entender la plataforma IoT en nuestro caso NGSI v2. Esto permite que dispositivos con diferentes protocolos puedan interactuar con la misma plataforma. El agente también facilita la comunicación bidireccional, permitiendo que la plataforma envíe comandos y actualizaciones a los dispositivos.</p>

                        <h4>Protocolos de envio de datos</h4>

                        <p>Existen varios protocolos de envio de datos desde los IoT hacia el IoT Agent pero los mas usuados son HTTP y MQTT.</p>

                        <h4>Tipos de IoT Agents</h4>

                        <p>Desde la plataforma fiware se puenden usar varios tipos de agentes siendo los mas usados IoT Agent for JSON y IoT Agent Ultralight pero existe una variedad muy amplia que se puede consultar en el catálogo de fiware.</p>

                        <hr/>
                        <h2>Cygnus</h2>
                        <h4>¿Que es Cygnus?</h4>

                        <p>Cygnus es un conector encargado de persistir ciertas fuentes de datos en ciertos almacenamientos, creando una vista histórica de los datos proporcinados por los IoT u otras fuentes que tengamos.</p>

                        <h4>¿Como funciona?</h4>

                        <p>Cygnus esta basado en el sistema open source de Apache Flume. Cygnus obtiene la información que le proporciona Orion en formato NGSI, trasforma esta informacion a traves de la parametrizacion con la configuración que se le proporciona para los diferentes sumideros de datos y la persiste ,por ejemplo, en tablas de base de datos de Postgres o MySQL, asi como tambien en portales de datos abiertos como CKAN u otras. Permite guardar los datos de contexto en bases de datos como</p>

                        <h4>Sumidero de datos de Cygnus</h4>

                        <p>Toda la persistencia de datos de los dispositivos u otras fuentes de datos se hace en diferentes sumideros de datos, bases de datos como Postgres, MySQL, MongoDB,CrateDB, etc.. asi como en portales de datos abiertos como CKAN u otras aplicaciones como Apache Kafka.</p>

                        <hr/>
                        <h2>Draco</h2>
                        <h4>¿Que es?</h4>

                        <p>Es una aplicación basada en Apache NIFI, dentro del ecosistema fiware podriamos decir que es similar a Cygnus, pero con la diferencia de que Draco es una herramienta con una interfaz visual y mas versatil a la hora de trasformar datos.</p>

                        <h4>¿Como funciona?</h4>

                        <p>Draco hace ese mismo trasbase de información desde los IoT Agent hacia Orion y de ahi hacia la persistencia de datos en un sumidero.</p>

                        <h4>¿Como funciona?</h4>

                        <p>Draco tiene unos metodos que se mantienen a la escucha de los datos que le va proporcionando Orion y a traves de un flujo de datos y trasformandolos va llevando estos datos a los sumideros que se requieran. Este es un ejemplo:</p>

                        <hr/>
                        <h2>PostgreSQL</h2>
                        <h4>¿Que es?</h4>

                        <p>Es un sistema de gestión de bases de datos relacionales de código abierto, conocido por su robustez, fiabilidad y compatibilidad con estándares SQL. Es una herramienta poderosa para almacenar y gestionar datos, utilizada tanto en aplicaciones web como móviles y geoespaciales. PostgreSQL es gratuito y de código abierto, lo que significa que puedes descargarlo, usarlo y modificarlo sin costo ni restricciones de licencia. Es compatible con el lenguaje SQL (Structured Query Language), el estándar para la gestión de bases de datos relacionales.</p>

                        <h6>Extensiones de PostgresSQL</h6>

                        <h6>Timescale DB</h6>

                        <h6>¿Que es?</h6>

                        <p>TimescaleDB es una extensión de código abierto para PostgreSQL que está optimizada para el almacenamiento y análisis de datos de series temporales. Combina la potencia y flexibilidad de PostgreSQL con las optimizaciones necesarias para manejar grandes volúmenes de datos de series temporales.</p>

                        <h6>¿Como funciona?</h6>

                        <p>TimescaleDB utiliza "hipertablas" que particionan automáticamente los datos por tiempo, mejorando el rendimiento de consultas y almacenamiento. Permite manejar grandes cantidades de datos de series temporales, lo que lo hace adecuado para aplicaciones que requieren análisis en tiempo real o históricos.</p>

                        <h6>PostGIS</h6>
                        <h6>¿Que es?</h6>

                        <p>PostGIS es una extensión de código abierto para el sistema de gestión de bases de datos PostgreSQL, que le añade capacidades espaciales. Básicamente, transforma PostgreSQL en una base de datos espacial, permitiendo el almacenamiento, consulta y análisis de datos geográficos. PostGIS no es una base de datos independiente, sino una extensión que se añade a PostgreSQL.</p>

                        <h6>¿Como funciona?</h6>

                        <p>Introduce tipos de datos como geometry y geography para representar objetos espaciales (puntos, líneas, polígonos, etc.). Ofrece una amplia gama de funciones para realizar operaciones espaciales como cálculos de distancia, intersecciones, búsquedas de vecinos, etc.</p>

                        <hr/>
                        <h2>Geoserver</h2>
                        <h4>¿Que es?</h4>

                        <p>GeoServer es un servidor de código abierto escrito en Java que permite publicar y compartir datos geoespaciales utilizando estándares abiertos. Es una herramienta esencial para crear servicios web que sirven mapas y datos a aplicaciones SIG y clientes web. Permite a los usuarios hacer públicos sus datos geoespaciales a través de diferentes formatos y estándares definidos por el Open Geospatial Consortium (OGC) como WMS, WFS, WCS y otros, asegurando la interoperabilidad con otras aplicaciones y sistemas SIG. Trabaja con información geográfica, como mapas, capas y datos vectoriales o raster.</p>

                        <h4>¿Como funciona?</h4>

                        <p>Funciona como una aplicación web que se ejecuta en un servidor, permitiendo la interacción a través de la web. Conecta a diferentes fuentes de datos (bases de datos espaciales, archivos shape, etc.) y los expone a través de servicios web.</p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}


export default Principal