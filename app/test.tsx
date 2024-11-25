import React, { useState } from "react";
import { StyleSheet, View, Button, Text, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import supabase from "../supabaseClient";

// Define types for location state
interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function TestScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Camera access is required to take a photo.");
        return;
      }

      const result: ImagePicker.ImagePickerResult =
        await ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });

      if (result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setPhotoUri(photoUri);
        setSelectedImage(photoUri); // Set the selected image

        const response = await fetch(photoUri);
        const blob = await response.arrayBuffer();

        const { data, error } = await supabase.storage
          .from("Images") //replace with TT bucket name
          .upload(`images/${new Date().getTime()}.jpg`, blob);

        if (error) {
          Alert.alert("Error uploading image:", error.message);
        } else {
          Alert.alert("Image uploaded successfully!");
          // Store the image URL or path in your database as needed
          console.log("Uploaded image URL:", data?.Key);
        }

        getLocation();
      } else {
        Alert.alert("No photo taken.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error taking photo catch:", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation && currentLocation.coords) {
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } else {
        Alert.alert("Could not fetch location.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error fetching location:", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };

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
            <Ionicons name="location" size={24} color="red" />
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  map: {
    width: "100%",
    height: "50%",
    marginTop: 20,
  },
});

//move into app tab
