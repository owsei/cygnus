import React,{useRef} from "react"
import { Viewer, Entity, PointGraphics, Label } from "resium"
import { Cartesian3, Color } from "cesium"
import * as Cesium from "cesium"




export default function CesiumViewer() {
  const viewerRef = useRef(null);
  
  const flyToNYC = () => {
    const viewer = viewerRef.current.cesiumElement
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-74.006, 40.7128, 5000), // Nueva York
      duration: 3, // duración en segundos
      
    })
  }

  const flyToParis = () => {
    const viewer = viewerRef.current.cesiumElement
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(2.3522, 48.8566, 5000), // París
      duration: 3,
    })
  }
  
  const flyToPamplona = () => {
    const viewer = viewerRef.current.cesiumElement
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-1.65572, 42.815268, 7000), // París
      duration: 3,
     
    })
  }

  const flyToEntity = () => {
    const viewer = viewerRef.current.cesiumElement
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-1.65572, 42.815268, 7000), // París
      duration: 3,
     
    })
  }


  return (
    <>
      
      <div style={{ height: "100vh", width: "100%" }}>
        <Viewer ref={viewerRef} full>
          <Entity
            name="New York City"
            position={Cartesian3.fromDegrees(-74.006, 40.7128, 500)}
            description="Este es un punto sobre Nueva York"
          >
            <PointGraphics pixelSize={7} color={Color.RED} />
          </Entity>
          <Entity
            name="Paris"
            position={Cartesian3.fromDegrees(2.3522, 48.8566, 500)}
            description="Este es un punto sobre Paris"
          >
            <PointGraphics pixelSize={7} color={Color.BLUE} />
          </Entity>
        </Viewer>
        
      </div>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 0,
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={flyToNYC}>Volar a Nueva York</button>
        <button onClick={flyToParis}>Volar a París</button>
        <button onClick={flyToPamplona}>Volar a Pamplona</button>
      </div>
    </>
  )
}
