const DriverMap = ({ route }) => {
  const { pickupLocation, dropLocation, pickupAddress, dropAddress, truck } = route.params;

  console.log('Pickup Location:', pickupLocation);
  console.log('Drop Location:', dropLocation);

  
  if (!pickupLocation || !dropLocation) {
    return <Text>Error: Locations not available</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          coordinate={{ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }}
          title="Pickup Location"
          description={pickupAddress}
          pinColor="blue"
        />
        <Marker
          coordinate={{ latitude: dropLocation.latitude, longitude: dropLocation.longitude }}
          title="Drop-off Location"
          description={dropAddress}
          pinColor="red"
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text>Order from: {userName}</Text>
        <Text>Pickup: {pickupAddress}</Text>
        <Text>Drop-off: {dropAddress}</Text>
        <Text>Truck: {truck.type}</Text>
        <Text>Price: ${truck.price.toFixed(2)}</Text>
      </View>
    </View>
  );
};
