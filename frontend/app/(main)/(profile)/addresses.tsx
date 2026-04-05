import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, Alert, KeyboardAvoidingView, Platform,
  RefreshControl, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addressService } from '../../../src/services/api';
import { Address } from '../../../src/models/types';
import PrimaryButton from '../../../src/components/ui/PrimaryButton';
import EmptyState from '../../../src/components/ui/EmptyState';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

const EMPTY_FORM = { label: '', firstName: '', lastName: '', street: '', city: '', zipCode: '', country: 'France', phone: '', isDefault: false };

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await addressService.getAll();
      setAddresses(res.data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({ label: addr.label, firstName: addr.firstName, lastName: addr.lastName, street: addr.street, city: addr.city, zipCode: addr.zipCode, country: addr.country, phone: addr.phone || '', isDefault: addr.isDefault });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.street || !form.city || !form.zipCode) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await addressService.update(editing.id, form);
      } else {
        await addressService.create(form);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer ?', 'Cette adresse sera supprimée définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: async () => {
          try { await addressService.delete(id); load(); }
          catch { Alert.alert('Erreur', 'Impossible de supprimer'); }
        }}
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    try { await addressService.setDefault(id); load(); }
    catch { Alert.alert('Erreur', 'Impossible de définir par défaut'); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Adresses</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="location-outline"
              title="Aucune adresse"
              description="Ajoutez une adresse pour commencer vos livraisons"
              actionLabel="Ajouter une adresse"
              onAction={openAdd}
            />
          }
          renderItem={({ item }) => (
            <View style={[styles.card, item.isDefault && styles.cardDefault]}>
              <View style={styles.cardBody}>
                <View style={styles.cardLeft}>
                  <View style={styles.iconWrap}>
                    <Ionicons name="home-outline" size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{item.label} {item.isDefault ? '✓ Principale' : ''}</Text>
                    <Text style={styles.addrText}>{item.firstName} {item.lastName}</Text>
                    <Text style={styles.addrText}>{item.street}</Text>
                    <Text style={styles.addrText}>{item.zipCode} {item.city}, {item.country}</Text>
                    {item.phone ? <Text style={styles.addrText}>{item.phone}</Text> : null}
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                {!item.isDefault && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleSetDefault(item.id)}>
                    <Ionicons name="star-outline" size={16} color={Colors.primary} />
                    <Text style={[styles.actionText, { color: Colors.primary }]}>Principal</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(item)}>
                  <Ionicons name="pencil-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.actionText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  <Text style={[styles.actionText, { color: Colors.error }]}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editing ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {[
                { label: 'Libellé *', key: 'label', placeholder: 'Ex: Maison, Bureau...' },
                { label: 'Prénom *', key: 'firstName', placeholder: 'Votre prénom' },
                { label: 'Nom *', key: 'lastName', placeholder: 'Votre nom' },
                { label: 'Adresse *', key: 'street', placeholder: '12 Rue des Fleurs' },
                { label: 'Ville *', key: 'city', placeholder: 'Paris' },
                { label: 'Code postal *', key: 'zipCode', placeholder: '75001', keyboardType: 'numeric' },
                { label: 'Pays', key: 'country', placeholder: 'France' },
                { label: 'Téléphone', key: 'phone', placeholder: '+33 6 00 00 00 00', keyboardType: 'phone-pad' },
              ].map(field => (
                <View key={field.key} style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={(form as any)[field.key]}
                    onChangeText={v => setForm(prev => ({ ...prev, [field.key]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textPlaceholder}
                    keyboardType={(field as any).keyboardType || 'default'}
                  />
                </View>
              ))}

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}
              >
                <Ionicons
                  name={form.isDefault ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={form.isDefault ? Colors.primary : Colors.textTertiary}
                />
                <Text style={styles.toggleLabel}>Définir comme adresse principale</Text>
              </TouchableOpacity>

              <PrimaryButton label={editing ? 'Enregistrer' : 'Ajouter l\'adresse'} onPress={handleSave} loading={saving} style={{ marginTop: Spacing.lg }} />
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
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.card },
  cardDefault: { borderWidth: 2, borderColor: Colors.primary },
  cardBody: { marginBottom: 8 },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  label: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary },
  addrText: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8 },
  actionText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalTitle: { ...Typography.h4, color: Colors.textPrimary },
  modalContent: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  inputLabel: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary, marginBottom: 6 },
  textInput: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.borderLight, paddingHorizontal: 14, paddingVertical: 12, ...Typography.body, color: Colors.textPrimary },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  toggleLabel: { ...Typography.body, color: Colors.textPrimary },
});
