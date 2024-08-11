import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";


export type TPoi = { key: string, location: google.maps.LatLngLiteral  };
export type TPoiWithAddress = TPoi & { 
  address: string,
  placeId: string
};

export const PoiMarkers = (props: {pois: TPoi[]}) => {
  return (
    <>
      {props.pois.map( (poi: TPoi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}>
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};