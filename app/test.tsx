import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Image as RNImage } from 'react-native';


export default function TestScreen() {
  
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);

  // Function to request camera permissions and pick an image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Camera access is required to take a photo.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      getLocation();
    } else {
      alert('No photo taken.');
    }
  };

  // Function to get current location of the user
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  // Render Map and Image only if location and photoUri are available
  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={pickImage} />

      {photoUri && location && (
        <View style={styles.imageContainer}>
          <Text>Your photo and location:</Text>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </View>
      )}

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={"Your Location"}
            description={`Lat: ${location.latitude}, Long: ${location.longitude}`}
          >
            {photoUri && (
              <RNImage source={{ uri: photoUri }} style={{ width: 40, height: 40 }} />
            )}
          </Marker>
        </MapView>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  map: {
    width: '100%',
    height: '50%',
    marginTop: 20,
  },
});