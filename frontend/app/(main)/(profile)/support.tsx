import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Modal, TextInput, Alert, KeyboardAvoidingView,
  Platform, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supportService } from '../../../src/services/api';
import { SupportTicket } from '../../../src/models/types';
import PrimaryButton from '../../../src/components/ui/PrimaryButton';
import EmptyState from '../../../src/components/ui/EmptyState';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import StatusBadge from '../../../src/components/ui/StatusBadge';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

interface FaqItem { id: string; question: string; answer: string; category: string; }

const CATEGORIES = [
  { key: 'delivery', label: 'Livraison' },
  { key: 'subscription', label: 'Abonnement' },
  { key: 'payment', label: 'Paiement' },
  { key: 'account', label: 'Compte' },
  { key: 'other', label: 'Autre' },
];

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function SupportScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'faq' | 'tickets'>('faq');
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('delivery');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [faqRes, ticketsRes] = await Promise.allSettled([
        supportService.getFaq(),
        supportService.getTickets(),
      ]);
      if (faqRes.status === 'fulfilled') setFaq(faqRes.value.data);
      if (ticketsRes.status === 'fulfilled') setTickets(ticketsRes.value.data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir le sujet et le message.');
      return;
    }
    setSubmitting(true);
    try {
      await supportService.createTicket({ subject, category, message });
      setShowModal(false);
      setSubject(''); setMessage(''); setCategory('delivery');
      Alert.alert('✓ Ticket créé', 'Notre équipe vous répondra dans les 24h.');
      load();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Aide & Support</Text>
        <TouchableOpacity style={styles.newTicketBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'faq' && styles.tabBtnActive]} onPress={() => setTab('faq')}>
          <Text style={[styles.tabText, tab === 'faq' && styles.tabTextActive]}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'tickets' && styles.tabBtnActive]} onPress={() => setTab('tickets')}>
          <Text style={[styles.tabText, tab === 'tickets' && styles.tabTextActive]}>Mes tickets {tickets.length > 0 ? `(${tickets.length})` : ''}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />
        }
      >
        {tab === 'faq' ? (
          <>
            {faq.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.faqItem}
                onPress={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={expanded === item.id ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textTertiary}
                  />
                </View>
                {expanded === item.id && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.contactCard} onPress={() => setShowModal(true)}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color={Colors.primary} />
              <Text style={styles.contactTitle}>Pas trouvé votre réponse ?</Text>
              <Text style={styles.contactSub}>Contactez notre équipe support</Text>
              <View style={styles.contactBtn}>
                <Text style={styles.contactBtnText}>Créer un ticket</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          tickets.length === 0 ? (
            <EmptyState
              icon="chatbubble-outline"
              title="Aucun ticket"
              description="Créez un ticket si vous avez besoin d'aide"
              actionLabel="Créer un ticket"
              onAction={() => setShowModal(true)}
            />
          ) : (
            tickets.map(ticket => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => router.push({ pathname: '/(main)/ticket', params: { id: ticket.id } } as any)}
              >
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketNum}>{ticket.ticketNumber}</Text>
                  <StatusBadge status={ticket.status} small />
                </View>
                <Text style={styles.ticketSubject} numberOfLines={1}>{ticket.subject}</Text>
                <View style={styles.ticketFooter}>
                  <Text style={styles.ticketCat}>{ticket.category}</Text>
                  <Text style={styles.ticketDate}>{formatDate(ticket.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )
        )}
      </ScrollView>

      {/* Create Ticket Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau ticket</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.inputLabel}>Sujet</Text>
              <TextInput
                style={styles.textInput}
                value={subject}
                onChangeText={setSubject}
                placeholder="Décrivez brièvement votre problème"
                placeholderTextColor={Colors.textPlaceholder}
              />

              <Text style={styles.inputLabel}>Catégorie</Text>
              <View style={styles.catRow}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[styles.catChip, category === cat.key && styles.catChipActive]}
                    onPress={() => setCategory(cat.key)}
                  >
                    <Text style={[styles.catChipText, category === cat.key && styles.catChipTextActive]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Décrivez votre problème en détail..."
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <PrimaryButton label="Envoyer le ticket" onPress={handleCreateTicket} loading={submitting} style={{ marginTop: Spacing.lg }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  title: { ...Typography.h3, color: Colors.textPrimary, flex: 1 },
  newTicketBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', marginHorizontal: Spacing.screen, marginBottom: Spacing.sm, backgroundColor: Colors.borderLight, borderRadius: BorderRadius.pill, padding: 4 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: BorderRadius.pill },
  tabBtnActive: { backgroundColor: Colors.surface, ...Shadow.card },
  tabText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.textTertiary },
  tabTextActive: { color: Colors.primary, fontFamily: 'Poppins_600SemiBold' },
  content: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  faqItem: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginRight: 8 },
  faqAnswer: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 22 },
  contactCard: { backgroundColor: Colors.primaryPale, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', marginTop: Spacing.md },
  contactTitle: { ...Typography.subtitle, color: Colors.primaryDark, marginTop: Spacing.sm, fontFamily: 'Poppins_600SemiBold' },
  contactSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  contactBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingHorizontal: 20, paddingVertical: 10, marginTop: Spacing.md },
  contactBtnText: { fontSize: 13, color: Colors.textInverse, fontFamily: 'Poppins_600SemiBold' },
  ticketCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  ticketNum: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium' },
  ticketSubject: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  ticketCat: { fontSize: 11, color: Colors.primary, fontFamily: 'Poppins_500Medium' },
  ticketDate: { fontSize: 11, color: Colors.textTertiary },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalTitle: { ...Typography.h4, color: Colors.textPrimary },
  modalContent: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  inputLabel: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary, marginBottom: 6, marginTop: Spacing.md },
  textInput: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.borderLight, paddingHorizontal: 14, paddingVertical: 12, ...Typography.body, color: Colors.textPrimary },
  textArea: { minHeight: 120, paddingTop: 12 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.borderLight, paddingHorizontal: 12, paddingVertical: 6 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  catChipTextActive: { color: Colors.textInverse },
});
