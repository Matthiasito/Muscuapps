import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Switch,
} from 'react-native';

export default function App() {
  // Navigation et Modales
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'profile', 'settings', 'amrap', 'workout'
  
  // Paramètres
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Taille de police ajustable

  // Profil
  const [profile, setProfile] = useState({ weight: '75', gender: 'Homme', height: '1m78' });

  // Chrono AMRAP
  const [amrapSeconds, setAmrapSeconds] = useState(0);
  const [isAmrapActive, setIsAmrapActive] = useState(false);
  const [amrapRounds, setAmrapRounds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isAmrapActive) {
      interval = setInterval(() => {
        setAmrapSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAmrapActive]);

  // Séances et Exercices
  const [cycleName, setCycleName] = useState('Cycle 1 - Force & Hypertrophie');
  const [exercises, setExercises] = useState([
    {
      id: '1',
      name: 'Développé couché',
      sets: [
        { id: 1, weight: '80', reps: '10' },
        { id: 2, weight: '82.5', reps: '8' },
      ],
    },
  ]);
  const [newExName, setNewExName] = useState('');
  const [selectedExId, setSelectedExId] = useState('1');

  // Gestion des séries dans la séance
  const addSetToExercise = (exId) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet = {
            id: Date.now(),
            weight: lastSet ? lastSet.weight : '',
            reps: lastSet ? lastSet.reps : '',
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const removeSetFromExercise = (exId, setId) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exId) {
          return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
        }
        return ex;
      })
    );
  };

  const updateSetDetails = (exId, setId, field, value) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exId) {
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
          };
        }
        return ex;
      })
    );
  };

  const addNewExercise = () => {
    if (!newExName.trim()) return;
    const newEx = {
      id: Date.now().toString(),
      name: newExName,
      sets: [{ id: 1, weight: '', reps: '' }],
    };
    setExercises([...exercises, newEx]);
    setNewExName('');
  };

  // Couleurs dynamiques Thème
  const bg = isDarkMode ? '#121212' : '#F8F9FA';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#111111';
  const subText = isDarkMode ? '#AAAAAA' : '#666666';
  const inputBg = isDarkMode ? '#2A2A2A' : '#F1F3F5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ================= ÉCRAN ACCUEIL ================= */}
      {currentScreen === 'home' && (
        <View style={styles.screenContainer}>
          {/* Ligne du haut : Profil (gauche) & Paramètres (droite) */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: cardBg }]}
              onPress={() => setCurrentScreen('profile')}
            >
              <Text style={{ fontSize: fontSize, color: textColor }}>👤 Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: cardBg }]}
              onPress={() => setCurrentScreen('settings')}
            >
              <Text style={{ fontSize: fontSize, color: textColor }}>⚙️ Paramètres</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroContainer}>
            <Text style={[styles.welcomeTitle, { fontSize: fontSize + 6, color: textColor }]}>
              Prêt pour l'entraînement ? ⚡
            </Text>

            {/* Rectangle Vert : AMRAP */}
            <TouchableOpacity
              style={[styles.greenCard, styles.mainCard]}
              onPress={() => setCurrentScreen('amrap')}
            >
              <Text style={styles.cardMainText}>⏱️ Chrono AMRAP</Text>
              <Text style={styles.cardSubText}>Clique ici pour lancer le chrono & compter tes séries</Text>
            </TouchableOpacity>

            {/* Rectangle Rouge : Cycle / Séance */}
            <TouchableOpacity
              style={[styles.redCard, styles.mainCard]}
              onPress={() => setCurrentScreen('workout')}
            >
              <Text style={styles.cardMainText}>🔥 {cycleName}</Text>
              <Text style={styles.cardSubText}>Clique ici pour accéder à ta séance et tes exercices</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= ÉCRAN PROFIL ================= */}
      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Mon Profil</Text>

          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Poids (kg)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
              value={profile.weight}
              onChangeText={(val) => setProfile({ ...profile, weight: val })}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Sexe</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
              value={profile.gender}
              onChangeText={(val) => setProfile({ ...profile, gender: val })}
            />

            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Taille</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
              value={profile.height}
              onChangeText={(val) => setProfile({ ...profile, height: val })}
            />
          </View>
        </ScrollView>
      )}

      {/* ================= ÉCRAN PARAMÈTRES ================= */}
      {currentScreen === 'settings' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Paramètres</Text>

          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <Text style={{ fontSize: fontSize, color: textColor }}>Mode Sombre 🌙</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>

            <View style={[styles.settingRow, { marginTop: 20 }]}>
              <Text style={{ fontSize: fontSize, color: textColor }}>Taille de la police ({fontSize}px)</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity
                  style={styles.fontActionBtn}
                  onPress={() => setFontSize(Math.max(12, fontSize - 2))}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.fontActionBtn}
                  onPress={() => setFontSize(Math.min(24, fontSize + 2))}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ================= ÉCRAN AMRAP ================= */}
      {currentScreen === 'amrap' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Chrono AMRAP</Text>

          <View style={[styles.formCard, { backgroundColor: cardBg, alignItems: 'center' }]}>
            <Text style={[styles.timerDisplay, { fontSize: fontSize + 30, color: textColor }]}>
              {Math.floor(amrapSeconds / 60)}:{amrapSeconds % 60 < 10 ? '0' : ''}{amrapSeconds % 60}
            </Text>

            <View style={styles.rowButtonsSpace}>
              <TouchableOpacity
                style={[styles.btnAction, { backgroundColor: isAmrapActive ? '#FF3B30' : '#34C759' }]}
                onPress={() => setIsAmrapActive(!isAmrapActive)}
              >
                <Text style={styles.btnText}>{isAmrapActive ? 'Pause' : 'Démarrer'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnAction, { backgroundColor: '#8E8E93' }]}
                onPress={() => {
                  setIsAmrapActive(false);
                  setAmrapSeconds(0);
                  setAmrapRounds(0);
                }}
              >
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Compteur de séries / tours</Text>
            <TouchableOpacity
              style={styles.roundClickBox}
              onPress={() => setAmrapRounds(amrapRounds + 1)}
            >
              <Text style={styles.roundCountText}>{amrapRounds}</Text>
              <Text style={{ color: '#007AFF', fontSize: fontSize - 2, marginTop: 5 }}>Clique ici pour valider une série +1</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= ÉCRAN SÉANCE ================= */}
      {currentScreen === 'workout' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Séance & Exercices</Text>

          {/* Modifier le nom du cycle */}
          <TextInput
            style={[styles.cycleInput, { backgroundColor: cardBg, color: textColor, fontSize: fontSize + 2 }]}
            value={cycleName}
            onChangeText={setCycleName}
          />

          {/* Ajouter un nouvel exercice */}
          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Créer un nouvel exercice</Text>
            <View style={styles.rowAdd}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                placeholder="Nom (ex: Tractions)"
                placeholderTextColor="#999"
                value={newExName}
                onChangeText={setNewExName}
              />
              <TouchableOpacity style={styles.addBtnSmall} onPress={addNewExercise}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Liste des exercices de la séance */}
          {exercises.map((ex) => (
            <View key={ex.id} style={[styles.formCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.exTitle, { fontSize: fontSize + 4, color: textColor }]}>{ex.name}</Text>

              {/* En-têtes colonnes */}
              <View style={styles.setHeaderRow}>
                <Text style={{ width: 40, color: subText, fontSize: fontSize - 2 }}>Série</Text>
                <Text style={{ flex: 1, color: subText, fontSize: fontSize - 2, textAlign: 'center' }}>Poids (kg)</Text>
                <Text style={{ flex: 1, color: subText, fontSize: fontSize - 2, textAlign: 'center' }}>Reps</Text>
                <Text style={{ width: 30 }}></Text>
              </View>

              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowItem}>
                  <Text style={{ width: 40, color: textColor, fontSize: fontSize }}>#{index + 1}</Text>
                  <TextInput
                    style={[styles.setຄວInput, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                    keyboardType="numeric"
                    value={set.weight}
                    onChangeText={(val) => updateSetDetails(ex.id, set.id, 'weight', val)}
                  />
                  <TextInput
                    style={[styles.setຄວInput, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={(val) => updateSetDetails(ex.id, set.id, 'reps', val)}
                  />
                  <TouchableOpacity
                    style={styles.deleteSetBtn}
                    onPress={() => removeSetFromExercise(ex.id, set.id)}
                  >
                    <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => addSetToExercise(ex.id)}
              >
                <Text style={{ color: '#34C759', fontWeight: 'bold', fontSize: fontSize - 1 }}>+ Ajouter une série</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { padding: 20, paddingBottom: 50 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  iconButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  heroContainer: {
    alignItems: 'stretch',
    marginTop: 10,
  },
  welcomeTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  greenCard: { backgroundColor: '#E8F8F0', borderWidth: 2, borderColor: '#34C759' },
  redCard: { backgroundColor: '#FDF2F2', borderWidth: 2, borderColor: '#FF3B30' },
  cardMainText: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  cardSubText: { fontSize: 13, color: '#555', textAlign: 'center' },
  backBtn: { marginBottom: 15 },
  screenTitle: { fontWeight: 'bold', marginBottom: 20 },
  formCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: { marginBottom: 5, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowButtons: { flexDirection: 'row' },
  fontActionBtn: {
    backgroundColor: '#007AFF',
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  timerDisplay: { fontWeight: 'bold', marginVertical: 10 },
  rowButtonsSpace: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15 },
  btnAction: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 15 },
  roundClickBox: {
    backgroundColor: '#F0F4FF',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  roundCountText: { fontSize: 40, fontWeight: 'bold', color: '#007AFF' },
  cycleInput: {
    fontWeight: 'bold',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rowAdd: { flexDirection: 'row', alignItems: 'center' },
  addBtnSmall: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  exTitle: { fontWeight: 'bold', marginBottom: 10 },
  setHeaderRow: { flexDirection: 'row', marginBottom: 5, paddingHorizontal: 5 },
  setRowItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  setຄວInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  deleteSetBtn: { width: 30, alignItems: 'center', justifyContent: 'center' },
  addSetButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
  },
});
