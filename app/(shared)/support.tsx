import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { APP_CONFIG } from "../../src/constants/config";

export default function SupportScreen() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Required Fields", "Please enter both subject and message.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert("Ticket Created", "Our Coimbatore support team will contact you shortly.");
      setSubject("");
      setMessage("");
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.helplineCard}>
          <Text style={styles.cardTitle}>Immediate Assistance</Text>
          <Text style={styles.phone}>{APP_CONFIG.supportPhone}</Text>
          <Text style={styles.subtext}>Available Mon - Sun, 6:00 AM - 11:00 PM</Text>
        </View>

        <Text style={styles.formTitle}>Submit a Support Ticket</Text>
        <Input
          label="Subject"
          placeholder="e.g. Issue with driver or fare query"
          value={subject}
          onChangeText={setSubject}
        />

        <Input
          label="Detailed Description"
          placeholder="Explain what happened..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <Button
          title="Send Ticket"
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
    padding: 20,
    flexGrow: 1,
  },
  helplineCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 24,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
    textTransform: "uppercase",
  },
  phone: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    marginVertical: 6,
  },
  subtext: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 14,
  },
});
