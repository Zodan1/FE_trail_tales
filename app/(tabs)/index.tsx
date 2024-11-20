import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
      <Link href="/posts" style={styles.button}>
        Go to Post screen
      </Link>
      <Link href="/add" style={styles.button}>
        Go to Add screen
      </Link>
      <Link href="/leader" style={styles.button}>
        Go to Leader screen
      </Link>
      <Link href="/test" style={styles.button}>
        Go to test screen
      </Link>
      <Link href="/PostPage" style={styles.button}>
        Go to PostPage screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
