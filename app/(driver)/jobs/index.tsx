import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import JobCard from "../../../src/components/driver/JobCard";
import EmptyState from "../../../src/components/ui/EmptyState";
import { Booking } from "../../../src/types/booking";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function DriverJobsListScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "bookings"), where("status", "==", "searching"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
        setJobs(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Available Loads Nearby</Text>
            <Text style={styles.subtitle}>Showing instant requests around Coimbatore</Text>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No Open Requests"
              description="Keep your status Online. New customer requests in your area will appear here immediately."
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <JobCard
            booking={item}
            onAccept={() => router.push(`/(driver)/jobs/${item.id}` as any)}
            onDecline={() => {}}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
