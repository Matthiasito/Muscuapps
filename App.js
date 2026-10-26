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
  Switch,
} from 'react-native';

export default function App() {
  // Navigation: 'home', 'profile', 'settings', 'amrap', 'workoutList', 'exerciseDetail'
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Paramètres
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Profil & Historique du Poids
  const [currentWeight, setCurrentWeight] = useState('75');
  const [gender, setGender] = useState('Homme');
  const [height, setHeight] = useState('1m78');
  const [weightHistory, setWeightHistory] = useState([
    { id: '1', date: '01/10/2026', weight: '76.0' },
    { id: '2', date: '15/10/2026', weight: '75.5' },
  ]);

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

  // Cycle, Séances et Exercices avec Historique
  const [cycleName, setCycleName] = useState('Cycle 1 - Force & Hypertrophie');
  
  // Liste des séances disponibles
  const [workouts, setWorkouts] = useState([
    { id: '1', name: 'Séance Haut du corps (Pectoraux / Dos)' },
    { id: '2', name: 'Séance Bas du corps (Jambes)' },
  ]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Exercices de la séance sélectionnée avec historique des perfs
  const [exercises, setExercises] = useState([
    {
      id: '1',
      name: 'Développé couché',
      sets: [
        { id: 1, weight: '80', reps: '10' },
      ],
      history: [
        { date: '10/10/2026', summary: '80 kg × 10 reps, 78 kg × 10 reps' },
        { date: '17/10/2026', summary: '82 kg × 8 reps, 80 kg × 9 reps' },
      ]
    },
    {
      id: '2',
      name: 'Tractions',
      sets: [
        { id: 1, weight: 'Poids du corps', reps: '12' },
      ],
      history: [
        { date: '10/10/2026', summary: 'PDC × 10 reps, PDC × 10 reps' },
      ]
    }
  ]);
  const [newExName, setNewExName] = useState('');

  // Enregistrement d'un nouveau poids dans l'historique
  const addWeightRecord = () => {
    if (!currentWeight) return;
    const today = new Date().toLocaleDateString('fr-FR');
    setWeightHistory([{ id: Date.now().toString(), date: today, weight: currentWeight }, ...weightHistory]);
  };

  // Gestion des séries
  const addSet = (exId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const last = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { id: Date.now(), weight: last ? last.weight : '', reps: last ? last.reps : '' }]
        };
      }
      return ex;
    }));
  };

  const removeSet = (exId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  const updateSet = (exId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const addNewExercise = () => {
    if (!newExName.trim()) return;
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: newExName, sets: [{ id: 1, weight: '', reps: '' }], history: [] }
    ]);
    setNewExName('');
  };

  // Couleurs dynamiques
  const bg = isDarkMode ? '#121212' : '#F8F9FA';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#111111';
  const subText = isDarkMode ? '#AAAAAA' : '#666666';
  const inputBg = isDarkMode ? '#2A2A2A' : '#F1F3F5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ================= ACCUEIL MOBILE ================= */}
      {currentScreen === 'home' && (
        <View style={styles.screenContainer}>
          {/* Haut : Profil (gauche) & Paramètres (droite) */}
          <View style={styles.topBar}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('profile')}>
              <Text style={{ fontSize: fontSize, color: textColor }}>👤 Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('settings')}>
              <Text style={{ fontSize: fontSize, color: textColor }}>⚙️ Paramètres</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroCenter}>
            <Text style={[styles.welcomeTitle, { fontSize: fontSize + 6, color: textColor }]}>
              Prêt pour l'effort ? 💪
            </Text>

            {/* Bouton Circulaire AMRAP */}
            <TouchableOpacity style={styles.circularAmrapBtn} onPress={() => setCurrentScreen('amrap')}>
              <Text style={styles.amrapCircleIcon}>⏱️</Text>
              <Text style={styles.amrapCircleText}>AMRAP</Text>
            </TouchableOpacity>

            {/* Rectangle Cycle / Séance */}
            <TouchableOpacity style={[styles.redCard, styles.mainCard]} onPress={() => setCurrentScreen('workoutList')}>
              <Text style={styles.cardMainText}>🔥 {cycleName}</Text>
              <Text style={styles.cardSubText}>Clique ici pour choisir ta séance et tes exercices</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= PROFIL & HISTORIQUE POIDS ================= */}
      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Mon Profil & Poids</Text>

          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Poids actuel (kg)</Text>
            <View style={styles.rowAdd}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                value={currentWeight}
                onChangeText={setCurrentWeight}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.smallActionBtn} onPress={addWeightRecord}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { fontSize: fontSize, color: subText, marginTop: 15 }]}>Sexe</Text>
            <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} value={gender} onChangeText={setGender} />

            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Taille</Text>
            <TextInput style={[styles.input, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} value={height} onChangeText={setHeight} />
          </View>

          {/* Historique du Poids */}
          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.exTitle, { fontSize: fontSize + 2, color: textColor }]}>📈 Historique de l'évolution du poids</Text>
            {weightHistory.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <Text style={{ color: textColor, fontSize: fontSize }}>{item.date}</Text>
                <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: fontSize }}>{item.weight} kg</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ================= PARAMÈTRES ================= */}
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
              <Text style={{ fontSize: fontSize, color: textColor }}>Taille police ({fontSize}px)</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.fontActionBtn} onPress={() => setFontSize(Math.max(12, fontSize - 2))}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fontActionBtn} onPress={() => setFontSize(Math.min(24, fontSize + 2))}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ================= CHRONO AMRAP ================= */}
      {currentScreen === 'amrap' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Chrono AMRAP</Text>

          <View style={[styles.formCard, { backgroundColor: cardBg, alignItems: 'center' }]}>
            <Text style={[styles.timerDisplay, { fontSize: fontSize + 26, color: textColor }]}>
              {Math.floor(amrapSeconds / 60)}:{amrapSeconds % 60 < 10 ? '0' : ''}{amrapSeconds % 60}
            </Text>

            <View style={styles.rowButtonsSpace}>
              <TouchableOpacity style={[styles.btnAction, { backgroundColor: isAmrapActive ? '#FF3B30' : '#34C759' }]} onPress={() => setIsAmrapActive(!isAmrapActive)}>
                <Text style={styles.btnText}>{isAmrapActive ? 'Pause' : 'Démarrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#8E8E93' }]} onPress={() => { setIsAmrapActive(false); setAmrapSeconds(0); setAmrapRounds(0); }}>
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <div style={{ height: 1, backgroundColor: '#eee', width: '100%', marginVertical: 15 }} />

            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Validation des séries / tours</Text>
            <TouchableOpacity style={styles.roundClickBox} onPress={() => setAmrapRounds(amrapRounds + 1)}>
              <Text style={styles.roundCountText}>{amrapRounds}</Text>
              <Text style={{ color: '#007AFF', fontSize: fontSize - 2, marginTop: 5 }}>Clique pour valider une série (+1)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= ONGLET 1 : LISTE DES SÉANCES ================= */}
      {currentScreen === 'workoutList' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>Choisis ta Séance</Text>

          {workouts.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={[styles.formCard, { backgroundColor: cardBg, padding: 20 }]}
              onPress={() => {
                setSelectedWorkout(w);
                setCurrentScreen('exerciseDetail');
              }}
            >
              <Text style={{ fontSize: fontSize + 2, fontWeight: 'bold', color: textColor }}>{w.name} ➡️</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= ONGLET 2 : EXERCICES DE LA SÉANCE & HISTORIQUE ================= */}
      {currentScreen === 'exerciseDetail' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('workoutList')}>
            <Text style={{ fontSize: fontSize, color: '#007AFF' }}>← Retour aux séances</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 8, color: textColor }]}>
            {selectedWorkout ? selectedWorkout.name : 'Séance'}
          </Text>

          {/* Ajouter un exercice */}
          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.label, { fontSize: fontSize, color: subText }]}>Ajouter un nouvel exercice</Text>
            <View style={styles.rowAdd}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                placeholder="Nom (ex: Squat)"
                placeholderTextColor="#999"
                value={newExName}
                onChangeText={setNewExName}
              />
              <TouchableOpacity style={styles.smallActionBtn} onPress={addNewExercise}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Liste des exercices avec Séries & Historique */}
          {exercises.map((ex) => (
            <View key={ex.id} style={[styles.formCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.exTitle, { fontSize: fontSize + 4, color: textColor }]}>{ex.name}</Text>

              {/* Séries en cours */}
              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowItem}>
                  <Text style={{ width: 35, color: textColor, fontSize: fontSize }}>#{index + 1}</Text>
                  <TextInput
                    style={[styles.setInput, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                    placeholder="Poids"
                    keyboardType="numeric"
                    value={set.weight}
                    onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)}
                  />
                  <TextInput
                    style={[styles.setInput, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={(val) => updateSet(ex.id, set.id, 'reps', val)}
                  />
                  <TouchableOpacity style={styles.deleteSetBtn} onPress={() => removeSet(ex.id, set.id)}>
                    <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(ex.id)}>
                <Text style={{ color: '#34C759', fontWeight: 'bold', fontSize: fontSize - 1 }}>+ Ajouter une série</Text>
              </TouchableOpacity>

              {/* Historique des perfs pour cet exercice */}
              {ex.history && ex.history.length > 0 && (
                <View style={styles.historyBox}>
                  <Text style={{ fontSize: fontSize - 1, fontWeight: '600', color: subText, marginBottom: 4 }}>📜 Historique des séances précédentes :</Text>
                  {ex.history.map((h, i) => (
                    <Text key={i} style={{ fontSize: fontSize - 2, color: subText }}>• {h.date} : {h.summary}</Text>
                  ))}
                </View>
              )}
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  iconButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12, elevation: 2 },
  heroCenter: { alignItems: 'center', marginTop: 20 },
  welcomeTitle: { fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  circularAmrapBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  amrapCircleIcon: { fontSize: 28 },
  amrapCircleText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginTop: 2 },
  mainCard: { padding: 18, borderRadius: 16, width: '100%', alignItems: 'center', elevation: 3 },
  redCard: { backgroundColor: '#FDF2F2', borderWidth: 2, borderColor: '#FF3B30' },
  cardMainText: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  cardSubText: { fontSize: 12, color: '#555', textAlign: 'center' },
  backBtn: { marginBottom: 15 },
  screenTitle: { fontWeight: 'bold', marginBottom: 20 },
  formCard: { padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  label: { marginBottom: 5, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15 },
  rowAdd: { flexDirection: 'row', alignItems: 'center' },
  smallActionBtn: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10, justifyContent: 'center' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowButtons: { flexDirection: 'row' },
  fontActionBtn: { backgroundColor: '#007AFF', width: 35, height: 35, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  timerDisplay: { fontWeight: 'bold', marginVertical: 10 },
  rowButtonsSpace: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15 },
  btnAction: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  roundClickBox: { backgroundColor: '#F0F4FF', borderWidth: 2, borderColor: '#007AFF', borderRadius: 12, padding: 20, alignItems: 'center', width: '100%' },
  roundCountText: { fontSize: 40, fontWeight: 'bold', color: '#007AFF' },
  exTitle: { fontWeight: 'bold', marginBottom: 10 },
  setRowItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  setInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginHorizontal: 5, textAlign: 'center' },
  deleteSetBtn: { width: 30, alignItems: 'center', justifyContent: 'center' },
  addSetButton: { marginTop: 10, padding: 10, borderRadius: 6, backgroundColor: '#F0F9F0', alignItems: 'center' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee' },
  historyBox: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' },
});
