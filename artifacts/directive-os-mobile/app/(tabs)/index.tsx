import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { AGENCY, LEADS, ACTIVITY } from "@/constants/mockData";

function PulseDot({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.6, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <View style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ position: "absolute", width: 16, height: 16, borderRadius: 8, backgroundColor: color, opacity: 0.3, transform: [{ scale: pulse }] }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
    </View>
  );
}

function StatCard({ label, value, sub, icon, accent }: { label: string; value: string; sub?: string; icon: string; accent: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: accent + "20" }]}>
        <Ionicons name={icon as any} size={18} color={accent} />
      </View>
      <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>{label}</Text>
      {sub ? <Text style={[styles.statSub, { color: accent, fontFamily: "Inter_400Regular" }]}>{sub}</Text> : null}
    </View>
  );
}

export default function CommandCentreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const recentLeads = LEADS.slice(0, 4);
  const recentActivity = ACTIVITY.slice(0, 4);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const typeColor = (t: string) => {
    if (t === "buyer") return colors.teal;
    if (t === "vendor") return colors.gold;
    if (t === "tenant") return "#a78bfa";
    return "#fb923c";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.navy }]}
      contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: Platform.OS === "web" ? 34 : 20 + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{getGreeting()},</Text>
          <Text style={[styles.agencyName, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>Meridian</Text>
        </View>
        <View style={[styles.sarahBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <PulseDot color={colors.teal} />
          <Text style={[styles.sarahLabel, { color: colors.teal, fontFamily: "Inter_600SemiBold" }]}>Sarah Online</Text>
        </View>
      </View>

      {/* Tonight's summary */}
      <View style={[styles.summaryBanner, { backgroundColor: colors.teal + "15", borderColor: colors.teal + "30" }]}>
        <Ionicons name="moon" size={14} color={colors.teal} />
        <Text style={[styles.summaryText, { color: colors.teal, fontFamily: "Inter_500Medium" }]}>
          Sarah captured <Text style={{ fontFamily: "Inter_700Bold" }}>{AGENCY.newLastNight} leads</Text> while your team was offline
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Leads This Month" value={String(AGENCY.leadsThisMonth)} sub="+5 last night" icon="people" accent={colors.teal} />
        <StatCard label="Hot Leads" value={String(AGENCY.hotLeads)} sub="Follow up now" icon="flame" accent="#f97316" />
        <StatCard label="AI Calls" value={String(AGENCY.aiCallsHandled)} sub="After hours" icon="call" accent="#a78bfa" />
        <StatCard label="Value Captured" value={AGENCY.estimatedValue} sub="In enquiry pipeline" icon="trending-up" accent={colors.gold} />
      </View>

      {/* AI Minutes usage */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>AI Minutes</Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{AGENCY.aiMinutesUsed}/{AGENCY.aiMinutesIncluded} used</Text>
        </View>
        <View style={[styles.progressBg, { backgroundColor: colors.navyLight }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.teal, width: `${(AGENCY.aiMinutesUsed / AGENCY.aiMinutesIncluded) * 100}%` }]} />
        </View>
        <Text style={[styles.progressLabel, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
          {AGENCY.aiMinutesIncluded - AGENCY.aiMinutesUsed} minutes remaining this month
        </Text>
      </View>

      {/* Recent Leads */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>Recent Leads</Text>
          <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/leads"); }}>
            <Text style={[styles.seeAll, { color: colors.teal, fontFamily: "Inter_500Medium" }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {recentLeads.map((lead) => (
          <TouchableOpacity
            key={lead.id}
            style={[styles.leadRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/leads"); }}
          >
            <View style={[styles.leadAvatar, { backgroundColor: typeColor(lead.leadType) + "20" }]}>
              <Text style={[styles.leadAvatarText, { color: typeColor(lead.leadType), fontFamily: "Inter_700Bold" }]}>
                {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View style={styles.leadInfo}>
              <View style={styles.leadNameRow}>
                <Text style={[styles.leadName, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>{lead.name}</Text>
                {lead.hotLead && <Ionicons name="flame" size={13} color="#f97316" style={{ marginLeft: 4 }} />}
              </View>
              <Text style={[styles.leadNote, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>{lead.notes}</Text>
            </View>
            <View style={styles.leadMeta}>
              <View style={[styles.channelBadge, { backgroundColor: lead.channel === "voice" ? colors.teal + "20" : "#a78bfa20" }]}>
                <Ionicons name={lead.channel === "voice" ? "call" : "chatbubble"} size={10} color={lead.channel === "voice" ? colors.teal : "#a78bfa"} />
              </View>
              <Text style={[styles.leadTime, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{lead.timeAgo}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sarah's Activity */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>Sarah's Activity</Text>
          <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/activity"); }}>
            <Text style={[styles.seeAll, { color: colors.teal, fontFamily: "Inter_500Medium" }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {recentActivity.map((item) => (
          <View key={item.id} style={[styles.activityRow, { borderLeftColor: item.channel === "voice" ? colors.teal : item.channel === "chat" ? "#a78bfa" : colors.navyLight }]}>
            <View style={styles.activityContent}>
              <Text style={[styles.activityDesc, { color: colors.textPrimary, fontFamily: "Inter_500Medium" }]}>{item.description}</Text>
              {item.detail && <Text style={[styles.activityDetail, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{item.detail}</Text>}
            </View>
            <Text style={[styles.activityTime, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{item.time}</Text>
          </View>
        ))}
      </View>

      {/* Powered by footer */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={12} color={colors.textSecondary} />
        <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Powered by Directive OS · Sarah AI Receptionist</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 },
  headerLeft: {},
  greeting: { fontSize: 14 },
  agencyName: { fontSize: 26, marginTop: 2 },
  sarahBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  sarahLabel: { fontSize: 12 },
  summaryBanner: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 20, marginBottom: 20, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  summaryText: { fontSize: 13, flex: 1 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  statCard: { width: "47%", borderRadius: 14, padding: 14, borderWidth: 1, gap: 6 },
  statIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 11 },
  statSub: { fontSize: 11 },
  section: { marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderRadius: 14, padding: 16 },
  sectionBlock: { marginHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16 },
  sectionSub: { fontSize: 13 },
  seeAll: { fontSize: 13 },
  progressBg: { height: 6, borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 12 },
  leadRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  leadAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  leadAvatarText: { fontSize: 14 },
  leadInfo: { flex: 1 },
  leadNameRow: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  leadName: { fontSize: 14 },
  leadNote: { fontSize: 12 },
  leadMeta: { alignItems: "flex-end", gap: 4 },
  channelBadge: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  leadTime: { fontSize: 11 },
  activityRow: { borderLeftWidth: 2, paddingLeft: 12, paddingVertical: 8, marginBottom: 10, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  activityContent: { flex: 1 },
  activityDesc: { fontSize: 14, marginBottom: 2 },
  activityDetail: { fontSize: 12 },
  activityTime: { fontSize: 11, marginLeft: 8, marginTop: 2 },
  footer: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", paddingTop: 8, paddingBottom: 4 },
  footerText: { fontSize: 11 },
});
