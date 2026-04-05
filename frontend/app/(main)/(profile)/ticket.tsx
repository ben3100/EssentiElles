import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supportService } from '../../../src/services/api';
import { SupportTicket, TicketMessage } from '../../../src/models/types';
import StatusBadge from '../../../src/components/ui/StatusBadge';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' · ' +
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      supportService.getTicket(id)
        .then(res => setTicket(res.data))
        .catch(() => Alert.alert('Erreur', 'Ticket introuvable'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await supportService.addMessage(id!, message.trim());
      setTicket(res.data);
      setMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    Alert.alert('Fermer le ticket ?', 'Ce ticket sera marqué comme résolu.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Fermer', onPress: async () => {
          try {
            const res = await supportService.closeTicket(id!);
            setTicket(res.data);
          } catch { Alert.alert('Erreur', 'Impossible de fermer'); }
        }}
      ]
    );
  };

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
    </SafeAreaView>
  );

  if (!ticket) return null;

  const canReply = ticket.status !== 'closed' && ticket.status !== 'resolved';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.ticketNum}>{ticket.ticketNumber}</Text>
            <Text style={styles.ticketSubject} numberOfLines={1}>{ticket.subject}</Text>
          </View>
          <StatusBadge status={ticket.status} small />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={ticket.messages}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }: { item: TicketMessage }) => {
            const isCustomer = item.sender === 'customer';
            return (
              <View style={[styles.bubble, isCustomer ? styles.bubbleRight : styles.bubbleLeft]}>
                {!isCustomer && (
                  <View style={styles.supportAvatar}>
                    <Ionicons name="headset-outline" size={14} color={Colors.primary} />
                  </View>
                )}
                <View style={[styles.bubbleContent, isCustomer ? styles.bubbleContentRight : styles.bubbleContentLeft]}>
                  <Text style={[styles.bubbleText, isCustomer && { color: Colors.textInverse }]}>{item.message}</Text>
                  <Text style={[styles.bubbleTime, isCustomer && { color: Colors.primaryPale }]}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input or closed */}
        {canReply ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Répondre..."
              placeholderTextColor={Colors.textPlaceholder}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !message.trim() && { opacity: 0.5 }]}
              onPress={handleSend}
              disabled={!message.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={Colors.textInverse} />
              ) : (
                <Ionicons name="send" size={18} color={Colors.textInverse} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.closedBanner}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.closedText}>Ticket résolu — {ticket.satisfactionRating ? `Note : ${ticket.satisfactionRating}/5 ⭐` : ''}</Text>
          </View>
        )}

        {/* Close ticket action */}
        {canReply && (
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>Marquer comme résolu</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.surface },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  ticketNum: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium' },
  ticketSubject: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  messages: { padding: Spacing.screen, paddingBottom: Spacing.md },
  bubble: { flexDirection: 'row', marginBottom: Spacing.sm, alignItems: 'flex-end' },
  bubbleRight: { justifyContent: 'flex-end' },
  bubbleLeft: { justifyContent: 'flex-start' },
  supportAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4 },
  bubbleContent: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  bubbleContentRight: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleContentLeft: { backgroundColor: Colors.surface, borderBottomLeftRadius: 4, ...Shadow.card },
  bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  bubbleTime: { fontSize: 10, color: Colors.textTertiary, marginTop: 4, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.screen, paddingVertical: Spacing.sm, gap: 8, borderTopWidth: 1, borderTopColor: Colors.borderLight, backgroundColor: Colors.surface },
  textInput: { flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadius.xl, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, ...Typography.body, color: Colors.textPrimary },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  closedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.md, backgroundColor: Colors.successBg, margin: Spacing.screen, borderRadius: BorderRadius.md },
  closedText: { fontSize: 13, color: Colors.success, fontFamily: 'Poppins_500Medium' },
  closeBtn: { padding: Spacing.sm, alignItems: 'center' },
  closeBtnText: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium' },
});
