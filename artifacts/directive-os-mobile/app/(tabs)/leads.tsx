import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLeads, useUpdateLeadStatus, Lead } from "@/hooks/useMobileApi";

const FILTERS = ["All", "Buyer", "Vendor", "Tenant", "Landlord"] as const;
type Filter = (typeof FILTERS)[number];

function typeColor(t: string, colors: ReturnType<typeof useColors>) {
  if (t === "buyer") return colors.teal;
  if (t === "vendor") return colors.gold;
  if (t === "tenant") return "#a78bfa";
  return "#fb923c";
}

function statusColor(s: string) {
  if (s === "new") return "#22c55e";
  if (s === "contacted") return "#3b82f6";
  if (s === "qualified") return "#f59e0b";
  return "#6b7280";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function LeadDetailModal({ lead, visible, onClose }: { lead: Lead | null; visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const updateStatus = useUpdateLeadStatus();

  if (!lead) return null;
  const tc = typeColor(lead.leadType, colors);
  const sc = statusColor(lead.status);

  const markContacted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStatus.mutate({ id: lead.id, status: "contacted" }, { onSuccess: onClose });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: colors.navy, paddingTop: insets.top > 0 ? insets.top : 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>Lead Details</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.leadDetailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.detailAvatar, { backgroundColor: tc + "20" }]}>
              <Text style={[styles.detailAvatarText, { color: tc, fontFamily: "Inter_700Bold" }]}>
                {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <Text style={[styles.detailName, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>{lead.name}</Text>
            <View style={styles.detailBadgeRow}>
              <View style={[styles.typeBadge, { backgroundColor: tc + "20" }]}>
                <Text style={[styles.typeBadgeText, { color: tc, fontFamily: "Inter_600SemiBold" }]}>{lead.leadType.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: sc + "20" }]}>
                <Text style={[styles.statusText, { color: sc, fontFamily: "Inter_600SemiBold" }]}>{lead.status.toUpperCase()}</Text>
              </View>
              {lead.hotLead && (
                <View style={[styles.typeBadge, { backgroundColor: "#f9731620" }]}>
                  <Ionicons name="flame" size={11} color="#f97316" />
                  <Text style={[styles.typeBadgeText, { color: "#f97316", fontFamily: "Inter_600SemiBold" }]}>HOT</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.detailSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.detailSectionTitle, { color: colors.textSecondary, fontFamily: "Inter_600SemiBold" }]}>CONTACT</Text>
            {lead.phone && (
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={16} color={colors.teal} />
                <Text style={[styles.contactText, { color: colors.teal, fontFamily: "Inter_500Medium" }]}>{lead.phone}</Text>
              </View>
            )}
            {lead.email && (
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={16} color={colors.teal} />
                <Text style={[styles.contactText, { color: colors.teal, fontFamily: "Inter_500Medium" }]}>{lead.email}</Text>
              </View>
            )}
            <View style={styles.contactRow}>
              <Ionicons name={lead.channel === "voice" ? "call" : "chatbubble"} size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                Via {lead.channel} · {timeAgo(lead.createdAt)}
              </Text>
            </View>
          </View>

          {lead.notes && (
            <View style={[styles.detailSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.detailSectionTitle, { color: colors.textSecondary, fontFamily: "Inter_600SemiBold" }]}>SARAH'S NOTES</Text>
              <Text style={[styles.notesText, { color: colors.textPrimary, fontFamily: "Inter_400Regular" }]}>{lead.notes}</Text>
            </View>
          )}

          {lead.status !== "contacted" && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.teal, opacity: updateStatus.isPending ? 0.7 : 1 }]}
              activeOpacity={0.85}
              onPress={markContacted}
              disabled={updateStatus.isPending}
            >
              <Ionicons name="checkmark-circle" size={18} color="#0a0e1a" />
              <Text style={[styles.actionBtnText, { color: "#0a0e1a", fontFamily: "Inter_700Bold" }]}>Mark as Contacted</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function LeadsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { data: leads, isLoading, refetch } = useLeads();
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const allLeads = leads ?? [];
  const filtered = filter === "All"
    ? allLeads
    : allLeads.filter(l => l.leadType === filter.toLowerCase());

  const newCount = allLeads.filter(l => l.status === "new").length;

  const renderLead = ({ item }: { item: Lead }) => {
    const tc = typeColor(item.leadType, colors);
    return (
      <TouchableOpacity
        style={[styles.leadCard, { backgroundColor: colors.surface, borderColor: item.hotLead ? "#f97316" + "40" : colors.border }]}
        activeOpacity={0.75}
        onPress={() => { Haptics.selectionAsync(); setSelectedLead(item); }}
      >
        <View style={[styles.avatar, { backgroundColor: tc + "20" }]}>
          <Text style={[styles.avatarText, { color: tc, fontFamily: "Inter_700Bold" }]}>
            {item.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </Text>
        </View>
        <View style={styles.leadBody}>
          <View style={styles.leadNameRow}>
            <Text style={[styles.leadName, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>{item.name}</Text>
            {item.hotLead && <Ionicons name="flame" size={14} color="#f97316" style={{ marginLeft: 4 }} />}
          </View>
          <Text style={[styles.leadNote, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>{item.notes ?? `${item.leadType} enquiry`}</Text>
          <View style={styles.leadTags}>
            <View style={[styles.tag, { backgroundColor: tc + "20" }]}>
              <Text style={[styles.tagText, { color: tc, fontFamily: "Inter_600SemiBold" }]}>{item.leadType}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: statusColor(item.status) + "20" }]}>
              <Text style={[styles.tagText, { color: statusColor(item.status), fontFamily: "Inter_600SemiBold" }]}>{item.status}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: item.channel === "voice" ? colors.teal + "15" : "#a78bfa20" }]}>
              <Ionicons name={item.channel === "voice" ? "call" : "chatbubble"} size={9} color={item.channel === "voice" ? colors.teal : "#a78bfa"} />
              <Text style={[styles.tagText, { color: item.channel === "voice" ? colors.teal : "#a78bfa", fontFamily: "Inter_500Medium" }]}>{item.channel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.leadRight}>
          <Text style={[styles.leadTime, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{timeAgo(item.createdAt)}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginTop: 8 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>Lead Inbox</Text>
        {newCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.teal }]}>
            <Text style={[styles.badgeText, { color: "#0a0e1a", fontFamily: "Inter_700Bold" }]}>{newCount}</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, { backgroundColor: filter === f ? colors.teal : colors.surface, borderColor: filter === f ? colors.teal : colors.border }]}
            onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterText, { color: filter === f ? "#0a0e1a" : colors.textSecondary, fontFamily: filter === f ? "Inter_600SemiBold" : "Inter_400Regular" }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.teal} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderLead}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 80 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={40} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>No leads here yet</Text>
            </View>
          }
        />
      )}

      <LeadDetailModal lead={selectedLead} visible={!!selectedLead} onClose={() => setSelectedLead(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingBottom: 8 },
  screenTitle: { fontSize: 26 },
  badge: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 12 },
  filters: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13 },
  leadCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarText: { fontSize: 15 },
  leadBody: { flex: 1 },
  leadNameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  leadName: { fontSize: 15 },
  leadNote: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  leadTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 10, textTransform: "uppercase" },
  leadRight: { alignItems: "flex-end" },
  leadTime: { fontSize: 11 },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 17 },
  leadDetailCard: { borderRadius: 16, borderWidth: 1, padding: 20, alignItems: "center", gap: 12 },
  detailAvatar: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  detailAvatarText: { fontSize: 22 },
  detailName: { fontSize: 22 },
  detailBadgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  typeBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  typeBadgeText: { fontSize: 11 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11 },
  detailSection: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  detailSectionTitle: { fontSize: 11, letterSpacing: 0.8 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  contactText: { fontSize: 15 },
  notesText: { fontSize: 14, lineHeight: 22 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14 },
  actionBtnText: { fontSize: 16 },
});
