import { View, StyleSheet, Text, Image, Alert, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useRef,useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import IconButton from "@/components/IconButton";
import CircleButton from "@/components/CircleButton";
import supabase from "../../supabaseClient";
import { postPost, patchUser, fetchUserByUsername } from "@/api";
import { useIsFocused } from "@react-navigation/native";


const PlaceholderImage = require("@/assets/images/background-image.png");


interface LocationCoords {
  latitude: number;
  longitude: number;
}
export default function Add() {
  const isFocused = useIsFocused();
  const username = 'nature_lover'
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [description, setDescription] = useState<string>("");
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);
  if (status === null) {
    requestPermission();
  }
  useEffect(() => {
    if (isFocused) {
      setPhotoUri(null);
      setLocation(null);
      setSelectedImage(undefined);
      setDescription("");
      setShowAppOptions(false);  
    }
  }, [isFocused]);
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
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
      if (result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setPhotoUri(photoUri);
        setSelectedImage(photoUri);
        getLocation();
      } else {
        Alert.alert("No photo taken.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error taking photo:", error.message);
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
  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        console.log('Selected image URI:', photoUri);
        setPhotoUri(photoUri);
        setSelectedImage(photoUri);
        getImageLocation(photoUri);
      } else {
        Alert.alert("You did not select any image.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error selecting image:", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };
  const getImageLocation = async (uri: string) => {
    try {
      const assets = await MediaLibrary.getAssetsAsync({
        first: 100,
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: MediaLibrary.SortBy.default,
      });
      
      const asset = assets.assets.find((asset) => asset.uri === uri);
      if (asset) {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
        if (assetInfo.location) {
          setLocation({
            latitude: assetInfo.location.latitude,
            longitude: assetInfo.location.longitude,
          });
        } else {
          Alert.alert("No location data available for this image.");
        }
      } else {
        Alert.alert("Could not find asset for the selected image.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error fetching location data:", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };
  const onReset = () => {
    setShowAppOptions(false);
    setDescription("");
  };
  const onSaveImageAsync = async () => {
    try {
      if (typeof photoUri === "string") {
        const response = await fetch(photoUri);
        const blob = await response.arrayBuffer();
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(`images/${new Date().getTime()}.jpg`, blob);
        if (error) {
          Alert.alert("Error uploading image:", error.message);
        } else {
          Alert.alert("Image uploaded successfully!");
          console.log("Uploaded image URL:", data.path);
          // Save image information including description
          const description = 'test'
          const testObj = {username: 'nature_lover', img: `https://azktqvfywfwnqcktucbs.supabase.co/storage/v1/object/public/Images/${data.path}`, description: 'test', location: `POINT(${location?.latitude} ${location?.longitude})`, location_coord: `(${location?.latitude}, ${location?.longitude})`}
          console.log(testObj)
          postPost(username, `https://azktqvfywfwnqcktucbs.supabase.co/storage/v1/object/public/Images/${data.path}`, description, `POINT(${location?.latitude} ${location?.longitude})`, `(${location?.latitude}, ${location?.longitude})`)
            .then(async (body) => {
              console.log(body);
              if (body.success) {
                const currentUser = await fetchUserByUsername(testObj.username);
                if (currentUser) {
                  const updatedPoints = (currentUser.points || 0) + 3; // Update points
                  const updatedUser = await patchUser(testObj.username, { points: updatedPoints });
                }
              } else {
                Alert.alert("Error", body.error || "An error occurred while adding the post.");
              }
            });
          setPhotoUri(null);
        setSelectedImage(undefined);
        setDescription("");
        setLocation(null);
        setShowAppOptions(false);

        }
      } else {
        Alert.alert("No image to save.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error saving image:", error.message);
      }
    }
  
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            imgSource={PlaceholderImage}
            selectedImage={photoUri || selectedImage}
          />
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
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Return" onPress={onReset} />
            <CircleButton onPress={onSaveImageAsync} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="camera" label="Take photo" onPress={pickImage} />
          <Button theme="primary" label="upload" onPress={pickImageAsync} />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292E",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 2.5,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  map: {
    flex: 1,
    width: 320,
    height: 200,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
  },
  descriptionInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
    color: "black",
  },
});