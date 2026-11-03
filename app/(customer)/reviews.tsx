import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

export default function CustomerReviewsScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert("Thank you!", "Your review has been submitted.");
      router.back();
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Rate Your Trip Experience</Text>
        <Text style={styles.subtitle}>Help us recognize excellent drivers in Coimbatore</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, star <= rating ? styles.starFilled : styles.starEmpty]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Trip Feedback"
          placeholder="How was the driver's driving, punctuality, and cargo handling?"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <Button
          title="Submit Rating"
          size="large"
          loading={submitting}
          onPress={handleSubmit}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 24,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 28,
  },
  star: {
    fontSize: 44,
    marginHorizontal: 6,
  },
  starFilled: {
    color: "#F59E0B",
  },
  starEmpty: {
    color: colors.border,
  },
});
