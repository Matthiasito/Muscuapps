import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Switch,
  ScrollView,
} from 'react-native';

export default function App() {
  // Navigation par onglets ('profile', 'amrap', 'workout')
  const [activeTab, setActiveTab] = useState('workout');

  // Paramètres (Thème et Taille de police)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0); // -2, 0, ou +2

  // Profil
  const [profile, setProfile] = useState({ weight: '', gender: '', height: '' });

  // Chrono AMRAP & Cycle
  const [amrapSeconds, setAmrapSeconds] = useState(0);
  const [isAmrapRunning, setIsAmrapRunning] = useState(false);
  const [amrapRounds, setAmrapRounds] = useState(0);
  const [cycleText, setCycleText] = useState('Cycle 1 - Semaine 1');

  // Exercices & Séances
  const [exercisesList, setExercisesList] = useState([
    { id: '1', name: 'Développé couché' },
    { id: '2', name: 'Squat' },
  ]);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('Développé couché');
  
  // Séries pour l'exercice sélectionné [{ id, weight, reps }]
  const [sets, setSets] = useState([{ id: 1, weight: '', reps: '' }]);

  // Fonctions AMRAP (simplifiées pour l'exemple)
  const resetAmrap = () => {
    setIsAmrapRunning(false);
    setAmrapSeconds(0);
    setAmrapRounds(0);
  };

  // Gestion des séries de la séance
  const addSet = () => {
    setSets([...sets, { id: Date.now(), weight: '', reps: '' }]);
  };

  const removeSet = (id) => {
    setSets(sets.filter((s) => s.id !== id));
  };

  const updateSet = (id, field, value) => {
    setSets(
      sets.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Création d'un nouvel exercice
  const addNewExercise = () => {
    if (!newExerciseName.trim()) return;
    setExercisesList([
      ...exercisesList,
      { id: Date.now().toString(), name: newExerciseName },
    ]);
    setNewExerciseName('');
  };

  // Styles dynamiques selon le thème et la police
  const themeBg = isDarkMode ? '#121212' : '#F5F5F7';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const inputBg = isDarkMode ? '#2A2A2A' : '#FFFFFF';
  const inputBorder = isDarkMode ? '#444444' : '#DDDDDD';

  const baseFont = 16 + fontSizeOffset;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* EN-TÊTE : Paramètres Thème & Police intégrés */}
      <View style={[styles.header, { borderBottomColor: inputBorder }]}>
        <Text style={[styles.mainTitle, { color: textColor, fontSize: baseFont + 8 }]}>
          MuscuApps 🏋️‍♂️
        </Text>
        <View style={styles.settingsRow}>
          {/* Bouton Taille Police */}
          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => setFontSizeOffset(fontSizeOffset === 2 ? -2 : fontSizeOffset + 2)}
          >
            <Text style={{ color: textColor, fontSize: 12 }}>A±</Text>
          </TouchableOpacity>
          {/* Switch Thème */}
          <Switch
            value={isDarkMode}
            onValueChange={(val) => setIsDarkMode(val)}
          />
        </View>
      </View>

      {/* CONTENU SELON L'ONGLET ACTIF */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- ONGLET PROFIL --- */}
        {activeTab === 'profile' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor, fontSize: baseFont + 4 }]}>
              Mon Profil
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
              placeholder="Poids (ex: 75 kg)"
              placeholderTextColor={subTextColor}
              value={profile.weight}
              onChangeText={(val) => setProfile({ ...profile, weight: val })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
              placeholder="Sexe (ex: Homme / Femme)"
              placeholderTextColor={subTextColor}
              value={profile.gender}
              onChangeText={(val) => setProfile({ ...profile, gender: val })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
              placeholder="Taille (ex: 1m78)"
              placeholderTextColor={subTextColor}
              value={profile.height}
              onChangeText={(val) => setProfile({ ...profile, height: val })}
            />
          </View>
        )}

        {/* --- ONGLET AMRAP & CYCLE --- */}
        {activeTab === 'amrap' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor, fontSize: baseFont + 4 }]}>
              Chrono AMRAP
            </Text>
            <Text style={[styles.timerText, { color: textColor, fontSize: baseFont + 20 }]}>
              00:{amrapSeconds < 10 ? `0${amrapSeconds}` : amrapSeconds}
            </Text>
            <Text style={[styles.roundsText, { color: subTextColor, fontSize: baseFont }]}>
              Séries / Tours validés : {amrapRounds}
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#34C759' }]}
                onPress={() => setAmrapRounds(amrapRounds + 1)}
              >
                <Text style={styles.btnText}>+ 1 Tour</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
                onPress={resetAmrap}
              >
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Section Cycle en dessous */}
            <View style={[styles.cycleContainer, { borderTopColor: inputBorder }]}>
              <Text style={[styles.subSectionTitle, { color: textColor, fontSize: baseFont + 2 }]}>
                Cycle d'entraînement
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
                value={cycleText}
                onChangeText={setCycleText}
                placeholder="Nom du cycle"
                placeholderTextColor={subTextColor}
              />
            </View>
          </View>
        )}

        {/* --- ONGLET SÉANCE & EXERCICES --- */}
        {activeTab === 'workout' && (
          <View>
            {/* Création de nouveaux exercices */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.sectionTitle, { color: textColor, fontSize: baseFont + 4 }]}>
                Créer un exercice
              </Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10, backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
                  placeholder="Nom de l'exercice"
                  placeholderTextColor={subTextColor}
                  value={newExerciseName}
                  onChangeText={setNewExerciseName}
                />
                <TouchableOpacity style={styles.smallBtn} onPress={addNewExercise}>
                  <Text style={styles.btnText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sélection de l'exercice de la séance */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.sectionTitle, { color: textColor, fontSize: baseFont + 4 }]}>
                Séance en cours : {selectedExercise}
              </Text>
              
              {/* Liste horizontale des exercices disponibles */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exList}>
                {exercisesList.map((ex) => (
                  <TouchableOpacity
                    key={ex.id}
                    style={[
                      styles.exBadge,
                      { backgroundColor: selectedExercise === ex.name ? '#007AFF' : inputBg, borderColor: inputBorder }
                    ]}
                    onPress={() => setSelectedExercise(ex.name)}
                  >
                    <Text style={{ color: selectedExercise === ex.name ? '#FFF' : textColor, fontSize: baseFont - 1 }}>
                      {ex.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Gestion des Séries, Répétitions et Poids */}
              <Text style={[styles.subSectionTitle, { color: textColor, fontSize: baseFont + 2, marginTop: 15 }]}>
                Séries
              </Text>

              {sets.map((set, index) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={{ color: textColor, fontSize: baseFont, width: 30 }}>#{index + 1}</Text>
                  <TextInput
                    style={[styles.setInput, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
                    placeholder="Poids (kg)"
                    placeholderTextColor={subTextColor}
                    keyboardType="numeric"
                    value={set.weight}
                    onChangeText={(val) => updateSet(set.id, 'weight', val)}
                  />
                  <TextInput
                    style={[styles.setInput, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: baseFont }]}
                    placeholder="Reps"
                    placeholderTextColor={subTextColor}
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={(val) => updateSet(set.id, 'reps', val)}
                  />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeSet(set.id)}
                  >
                    <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addSetBtn} onPress={addSet}>
                <Text style={styles.addSetText}>+ Ajouter une série</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BARRE DE NAVIGATION INFÉRIEURE */}
      <View style={[styles.navBar, { backgroundColor: cardBg, borderTopColor: inputBorder }]}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={{ color: activeTab === 'profile' ? '#007AFF' : subTextColor, fontSize: baseFont - 2 }}>
            👤 Profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'amrap' && styles.activeNavItem]}
          onPress={() => setActiveTab('amrap')}
        >
          <Text style={{ color: activeTab === 'amrap' ? '#007AFF' : subTextColor, fontSize: baseFont - 2 }}>
            ⏱️ AMRAP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'workout' && styles.activeNavItem]}
          onPress={() => setActiveTab('workout')}
        >
          <Text style={{ color: activeTab === 'workout' ? '#007AFF' : subTextColor, fontSize: baseFont - 2 }}>
            💪 Séance
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  mainTitle: { fontWeight: 'bold' },
  settingsRow: { flexDirection: 'row', alignItems: 'center' },
  fontButton: {
    borderWidth: 1,
    borderColor: '#888',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 12,
  },
  scrollContent: { padding: 20, paddingBottom: 100 },
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 15 },
  subSectionTitle: { fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  smallBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  timerText: { textAlign: 'center', fontWeight: 'bold', marginVertical: 10 },
  roundsText: { textAlign: 'center', marginBottom: 15 },
  cycleContainer: { marginTop: 20, paddingTop: 15, borderTopWidth: 1 },
  exList: { flexDirection: 'row', marginBottom: 15 },
  exBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  setInput: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  deleteBtn: { padding: 8 },
  addSetBtn: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addSetText: { color: '#FFF', fontWeight: 'bold' },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
