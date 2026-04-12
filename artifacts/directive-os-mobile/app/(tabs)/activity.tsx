import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useActivity, ActivityItem } from "@/hooks/useMobileApi";

const ACTIVITY_ICONS: Record<string, { name: string; color: string }> = {
  call_answered: { name: "call", color: "#00d1b2" },
  lead_captured: { name: "person-add", color: "#22c55e" },
  email_sent: { name: "mail", color: "#3b82f6" },
  inspection_booked: { name: "home", color: "#C9A84C" },
  appraisal_booked: { name: "calculator", color: "#C9A84C" },
  form_sent: { name: "document-text", color: "#a78bfa" },
};

function ActivityRow({ item, colors }: { item: ActivityItem; colors: ReturnType<typeof useColors> }) {
  const cfg = ACTIVITY_ICONS[item.type] ?? { name: "flash-outline", color: colors.teal };
  const lineColor = item.channel === "voice" ? colors.teal : item.channel === "chat" ? "#a78bfa" : colors.navyLight;

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconCircle, { backgroundColor: cfg.color + "20" }]}>
          <Ionicons name={cfg.name as any} size={16} color={cfg.color} />
        </View>
        <View style={[styles.line, { backgroundColor: lineColor + "40" }]} />
      </View>
      <View style={[styles.rowContent, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.desc, { color: colors.textPrimary, fontFamily: "Inter_500Medium" }]}>{item.description}</Text>
        {item.detail && <Text style={[styles.detail, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{item.detail}</Text>}
        <View style={styles.rowBottom}>
          {item.channel !== "system" && (
            <View style={[styles.channelPill, { backgroundColor: item.channel === "voice" ? colors.teal + "20" : "#a78bfa20" }]}>
              <Ionicons name={item.channel === "voice" ? "call" : "chatbubble"} size={9} color={item.channel === "voice" ? colors.teal : "#a78bfa"} />
              <Text style={[styles.channelText, { color: item.channel === "voice" ? colors.teal : "#a78bfa", fontFamily: "Inter_500Medium" }]}>{item.channel}</Text>
            </View>
          )}
          <Text style={[styles.time, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{item.time}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: activity, isLoading, refetch } = useActivity();
  const [refreshing, setRefreshing] = React.useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const items = activity ?? [];
  const todayCount = items.filter(i => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return true;
  }).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>AI Activity</Text>
        <View style={[styles.livePill, { backgroundColor: colors.teal + "20", borderColor: colors.teal + "40" }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.teal }]} />
          <Text style={[styles.liveText, { color: colors.teal, fontFamily: "Inter_600SemiBold" }]}>LIVE</Text>
        </View>
      </View>

      {items.length > 0 && (
        <View style={[styles.dateBanner, { backgroundColor: colors.navyLight, marginHorizontal: 20, borderRadius: 10 }]}>
          <Ionicons name="today-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.dateText, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>
            Last 7 days — {items.length} actions by Sarah
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.teal} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ActivityRow item={item} colors={colors} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: bottomPad + 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="pulse-outline" size={40} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>No activity yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  screenTitle: { fontSize: 26 },
  livePill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 11 },
  dateBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 4 },
  dateText: { fontSize: 13 },
  row: { flexDirection: "row", gap: 12, marginBottom: 4 },
  rowLeft: { alignItems: "center", width: 36 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  line: { width: 2, flex: 1, marginTop: 4, minHeight: 16 },
  rowContent: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 10 },
  desc: { fontSize: 14, marginBottom: 3 },
  detail: { fontSize: 12, lineHeight: 17, marginBottom: 8 },
  rowBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  channelPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  channelText: { fontSize: 10, textTransform: "uppercase" },
  time: { fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
