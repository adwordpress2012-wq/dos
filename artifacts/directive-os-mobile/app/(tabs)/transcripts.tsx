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
import { useTranscripts, useTranscriptDetail, Transcript } from "@/hooks/useMobileApi";

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function typeColor(t: string | null | undefined, colors: ReturnType<typeof useColors>) {
  if (t === "buyer") return colors.teal;
  if (t === "vendor") return colors.gold;
  if (t === "tenant") return "#a78bfa";
  return "#fb923c";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TranscriptDetailModal({ transcriptId, visible, onClose }: { transcriptId: number | null; visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useTranscriptDetail(transcriptId);

  const transcript = data?.transcript;
  const messages = data?.messages ?? [];
  const tc = typeColor(transcript?.leadType, colors);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: colors.navy, paddingTop: insets.top > 0 ? insets.top : 20 }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.modalTitleWrap}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>
              {transcript?.callerName ?? "Transcript"}
            </Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {transcript?.channel === "voice" && transcript.duration ? `📞 ${formatDuration(transcript.duration)}` : "💬 Chat"} · {transcript ? timeAgo(transcript.createdAt) : ""}
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {transcript && (
          <View style={[styles.transcriptMeta, { borderBottomColor: colors.border }]}>
            <View style={[styles.metaBadge, { backgroundColor: tc + "20" }]}>
              <Text style={[styles.metaBadgeText, { color: tc, fontFamily: "Inter_600SemiBold" }]}>{(transcript.leadType ?? "enquiry").toUpperCase()}</Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: transcript.channel === "voice" ? colors.teal + "20" : "#a78bfa20" }]}>
              <Ionicons name={transcript.channel === "voice" ? "call" : "chatbubble"} size={11} color={transcript.channel === "voice" ? colors.teal : "#a78bfa"} />
              <Text style={[styles.metaBadgeText, { color: transcript.channel === "voice" ? colors.teal : "#a78bfa", fontFamily: "Inter_600SemiBold" }]}>{transcript.channel}</Text>
            </View>
          </View>
        )}

        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.teal} />
          </View>
        ) : messages.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Ionicons name="document-text-outline" size={40} color={colors.textSecondary} />
            <Text style={[{ color: colors.textSecondary, fontFamily: "Inter_400Regular", fontSize: 15 }]}>
              {transcript?.summary ?? "No messages recorded"}
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.messageBubble, msg.role === "assistant" ? styles.sarahBubble : styles.userBubble]}>
                <Text style={[styles.bubbleRole, { color: msg.role === "assistant" ? colors.teal : colors.gold, fontFamily: "Inter_600SemiBold" }]}>
                  {msg.role === "assistant" ? "Sarah" : "Caller"}
                </Text>
                <Text style={[styles.bubbleText, {
                  color: colors.textPrimary,
                  fontFamily: "Inter_400Regular",
                  backgroundColor: msg.role === "assistant" ? colors.teal + "15" : colors.navyLight,
                  borderColor: msg.role === "assistant" ? colors.teal + "30" : colors.border,
                }]}>{msg.content}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

export default function TranscriptsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [channel, setChannel] = useState<"all" | "voice" | "chat">("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: transcripts, isLoading, refetch } = useTranscripts();
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const all = transcripts ?? [];
  const filtered = channel === "all" ? all : all.filter(t => t.channel === channel);

  const renderItem = ({ item }: { item: Transcript }) => {
    const tc = typeColor(item.leadType, colors);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        activeOpacity={0.75}
        onPress={() => { Haptics.selectionAsync(); setSelectedId(item.id); }}
      >
        <View style={[styles.channelIcon, { backgroundColor: item.channel === "voice" ? colors.teal + "20" : "#a78bfa20" }]}>
          <Ionicons name={item.channel === "voice" ? "call" : "chatbubble"} size={18} color={item.channel === "voice" ? colors.teal : "#a78bfa"} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardName, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>{item.callerName ?? "Unknown Caller"}</Text>
            <Text style={[styles.cardTime, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>{timeAgo(item.createdAt)}</Text>
          </View>
          <Text style={[styles.cardSummary, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>{item.summary ?? "No summary available"}</Text>
          <View style={styles.cardTags}>
            {item.leadType && (
              <View style={[styles.miniTag, { backgroundColor: tc + "20" }]}>
                <Text style={[styles.miniTagText, { color: tc, fontFamily: "Inter_600SemiBold" }]}>{item.leadType}</Text>
              </View>
            )}
            {item.duration != null && (
              <Text style={[styles.durationText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {formatDuration(item.duration)}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>Transcripts</Text>
      </View>

      <View style={[styles.segmentRow, { paddingHorizontal: 20, paddingBottom: 12 }]}>
        {(["all", "voice", "chat"] as const).map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.segment, { backgroundColor: channel === c ? colors.teal : colors.surface, borderColor: channel === c ? colors.teal : colors.border }]}
            onPress={() => { Haptics.selectionAsync(); setChannel(c); }}
            activeOpacity={0.75}
          >
            <Ionicons name={c === "voice" ? "call" : c === "chat" ? "chatbubble" : "list"} size={13} color={channel === c ? "#0a0e1a" : colors.textSecondary} />
            <Text style={[styles.segmentText, { color: channel === c ? "#0a0e1a" : colors.textSecondary, fontFamily: channel === c ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
              {c === "all" ? "All" : c === "voice" ? "Calls" : "Chats"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.teal} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottomPad + 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={40} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>No transcripts yet</Text>
            </View>
          }
        />
      )}

      <TranscriptDetailModal transcriptId={selectedId} visible={selectedId !== null} onClose={() => setSelectedId(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  screenTitle: { fontSize: 26 },
  segmentRow: { flexDirection: "row", gap: 8 },
  segment: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, height: 36, borderRadius: 10, borderWidth: 1 },
  segmentText: { fontSize: 13 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  channelIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardBody: { flex: 1, gap: 5 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardName: { fontSize: 15 },
  cardTime: { fontSize: 11 },
  cardSummary: { fontSize: 13, lineHeight: 18 },
  cardTags: { flexDirection: "row", gap: 8, alignItems: "center" },
  miniTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  miniTagText: { fontSize: 10, textTransform: "uppercase" },
  durationText: { fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  modalTitleWrap: { alignItems: "center" },
  modalTitle: { fontSize: 16 },
  modalSub: { fontSize: 12, marginTop: 2 },
  transcriptMeta: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  metaBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  metaBadgeText: { fontSize: 11 },
  messageBubble: { gap: 4 },
  sarahBubble: { alignItems: "flex-start" },
  userBubble: { alignItems: "flex-start" },
  bubbleRole: { fontSize: 11, paddingHorizontal: 4 },
  bubbleText: { fontSize: 14, lineHeight: 21, padding: 12, borderRadius: 12, borderWidth: 1 },
});
