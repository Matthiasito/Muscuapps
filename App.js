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
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14); // Police optimisée pour tout voir

  // --- PERSISTANCE DES DONNÉES (Sauvegarde automatique locale) ---
  const [currentWeight, setCurrentWeight] = useState('75');
  const [gender, setGender] = useState('Homme');
  const [height, setHeight] = useState('1m78');
  const [weightHistory, setWeightHistory] = useState([
    { id: '1', date: '01/10/2026', weight: '76.0' },
  ]);

  const [cycles, setCycles] = useState([
    { id: '1', name: 'Cycle 1 - Force & Hypertrophie' },
  ]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [newCycleName, setNewCycleName] = useState('');

  const [workouts, setWorkouts] = useState([
    { id: '1', cycleId: '1', name: 'Haut du corps (Pectoraux / Dos)' },
  ]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  const [exercises, setExercises] = useState([
    {
      id: '1',
      workoutId: '1',
      name: 'Développé couché',
      sets: [{ id: 1, weight: '80', reps: '10' }],
      history: [{ date: '17/10/2026', summary: '82 kg × 8 reps' }],
    },
  ]);
  const [newExName, setNewExName] = useState('');

  // Chrono AMRAP
  const [amrapSeconds, setAmrapSeconds] = useState(0);
  const [isAmrapActive, setIsAmrapActive] = useState(false);
  const [amrapRounds, setAmrapRounds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isAmrapActive) {
      interval = setInterval(() => setAmrapSeconds((sec) => sec + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAmrapActive]);

  // Chargement initial depuis la mémoire du navigateur
  useEffect(() => {
    try {
      const savedCycles = localStorage.getItem('fit_cycles');
      const savedWorkouts = localStorage.getItem('fit_workouts');
      const savedExercises = localStorage.getItem('fit_exercises');
      const savedWeight = localStorage.getItem('fit_weight_hist');
      if (savedCycles) setCycles(JSON.parse(savedCycles));
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedExercises) setExercises(JSON.parse(savedExercises));
      if (savedWeight) setWeightHistory(JSON.parse(savedWeight));
    } catch (e) {
      console.log('Erreur chargement stockage', e);
    }
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem('fit_cycles', JSON.stringify(cycles));
      localStorage.setItem('fit_workouts', JSON.stringify(workouts));
      localStorage.setItem('fit_exercises', JSON.stringify(exercises));
      localStorage.setItem('fit_weight_hist', JSON.stringify(weightHistory));
    } catch (e) {
      console.log('Erreur sauvegarde stockage', e);
    }
  }, [cycles, workouts, exercises, weightHistory]);

  // Actions d'ajout
  const addNewCycle = () => {
    if (!newCycleName.trim()) return;
    setCycles([...cycles, { id: Date.now().toString(), name: newCycleName }]);
    setNewCycleName('');
  };

  const addNewWorkout = () => {
    if (!newWorkoutName.trim() || !selectedCycle) return;
    setWorkouts([...workouts, { id: Date.now().toString(), cycleId: selectedCycle.id, name: newWorkoutName }]);
    setNewWorkoutName('');
  };

  const addNewExercise = () => {
    if (!newExName.trim() || !selectedWorkout) return;
    setExercises([
      ...exercises,
      { id: Date.now().toString(), workoutId: selectedWorkout.id, name: newExName, sets: [{ id: 1, weight: '', reps: '' }], history: [] },
    ]);
    setNewExName('');
  };

  const addWeightRecord = () => {
    if (!currentWeight) return;
    const today = new Date().toLocaleDateString('fr-FR');
    setWeightHistory([{ id: Date.now().toString(), date: today, weight: currentWeight }, ...weightHistory]);
  };

  const addSet = (exId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const last = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { id: Date.now(), weight: last ? last.weight : '', reps: last ? last.reps : '' }] };
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
        return { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) };
      }
      return ex;
    }));
  };

  const bg = isDarkMode ? '#0B0F19' : '#F3F4F6';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const textColor = isDarkMode ? '#F9FAFB' : '#111827';
  const subText = isDarkMode ? '#9CA3AF' : '#6B7280';
  const inputBg = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ================= ACCUEIL ================= */}
      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity style={[styles.pillButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('profile')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>👤 Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pillButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('settings')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>⚙️ Réglages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Text style={[styles.appTitle, { fontSize: fontSize + 8, color: textColor }]}>FitTracker ⚡</Text>
            <Text style={[styles.appSubtitle, { fontSize: fontSize - 2, color: subText }]}>Tes données sont enregistrées automatiquement</Text>

            <TouchableOpacity style={styles.amrapGlowBtn} onPress={() => setCurrentScreen('amrap')}>
              <Text style={styles.amrapEmoji}>⏱️</Text>
              <Text style={styles.amrapText}>MODE AMRAP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.workoutHeroCard} onPress={() => setCurrentScreen('cyclesList')}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroCardBadge}>PROGRAMME</Text>
                <Text style={styles.heroCardTitle}>Gérer mes Cycles & Séances</Text>
              </View>
              <Text style={styles.heroArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= PROFIL ================= */}
      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Mon Profil & Poids</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Poids actuel (kg)</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} value={currentWeight} onChangeText={setCurrentWeight} keyboardType="numeric" />
              <TouchableOpacity style={styles.primaryBtn} onPress={addWeightRecord}>
                <Text style={styles.btnText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1, marginTop: 10 }]}>Sexe & Taille</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize, marginRight: 6 }]} value={gender} onChangeText={setGender} />
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} value={height} onChangeText={setHeight} />
            </View>
          </View>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardHeaderTitle, { fontSize: fontSize + 2, color: textColor }]}>📈 Historique du Poids</Text>
            {weightHistory.map((item) => (
              <View key={item.id} style={styles.historyLine}>
                <Text style={{ color: subText, fontSize: fontSize }}>{item.date}</Text>
                <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: fontSize }}>{item.weight} kg</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ================= PARAMÈTRES ================= */}
      {currentScreen === 'settings' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Réglages</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Mode Sombre 🌙</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
            <View style={[styles.settingRow, { marginTop: 15 }]}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Taille police ({fontSize}px)</Text>
              <View style={styles.rowInline}>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.max(12, fontSize - 2))}><Text style={styles.btnText}>-</Text></TouchableOpacity>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.min(20, fontSize + 2))}><Text style={styles.btnText}>+</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ================= AMRAP ================= */}
      {currentScreen === 'amrap' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Chrono AMRAP</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg, alignItems: 'center', paddingVertical: 20 }]}>
            <Text style={[styles.timerDigits, { fontSize: fontSize + 22, color: textColor }]}>
              {Math.floor(amrapSeconds / 60)}:{amrapSeconds % 60 < 10 ? '0' : ''}{amrapSeconds % 60}
            </Text>

            <View style={styles.rowInlineSpace}>
              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: isAmrapActive ? '#EF4444' : '#10B981' }]} onPress={() => setIsAmrapActive(!isAmrapActive)}>
                <Text style={styles.btnText}>{isAmrapActive ? 'Pause' : 'Démarrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#6B7280' }]} onPress={() => { setIsAmrapActive(false); setAmrapSeconds(0); setAmrapRounds(0); }}>
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.roundCounterBox} onPress={() => setAmrapRounds(amrapRounds + 1)}>
              <Text style={styles.roundBigNumber}>{amrapRounds}</Text>
              <Text style={{ color: '#3B82F6', fontWeight: '600', fontSize: fontSize }}>Tours / Séries validés (+1)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= CYCLES ================= */}
      {currentScreen === 'cyclesList' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Mes Cycles</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer un cycle</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Cycle Force" placeholderTextColor="#9CA3AF" value={newCycleName} onChangeText={setNewCycleName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewCycle}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {cycles.map((c) => (
            <TouchableOpacity key={c.id} style={[styles.navCardItem, { backgroundColor: cardBg }]} onPress={() => { setSelectedCycle(c); setCurrentScreen('workoutList'); }}>
              <Text style={{ fontSize: fontSize + 1, fontWeight: 'bold', color: textColor, flex: 1 }}>🏋️‍♂️ {c.name}</Text>
              <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Ouvrir →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= SÉANCES ================= */}
      {currentScreen === 'workoutList' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('cyclesList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux cycles</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>{selectedCycle ? selectedCycle.name : 'Séances'}</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer une séance</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Séance Dos" placeholderTextColor="#9CA3AF" value={newWorkoutName} onChangeText={setNewWorkoutName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewWorkout}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {workouts.filter(w => selectedCycle && w.cycleId === selectedCycle.id).map((w) => (
            <TouchableOpacity key={w.id} style={[styles.navCardItem, { backgroundColor: cardBg }]} onPress={() => { setSelectedWorkout(w); setCurrentScreen('exerciseDetail'); }}>
              <Text style={{ fontSize: fontSize + 1, fontWeight: 'bold', color: textColor, flex: 1 }}>📋 {w.name}</Text>
              <Text style={{ color: '#10B981', fontWeight: '600' }}>Commencer →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= EXERCICES & PERFS (ESPACE SÉCURISÉ EN BAS) ================= */}
      {currentScreen === 'exerciseDetail' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('workoutList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux séances</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>{selectedWorkout ? selectedWorkout.name : 'Séance'}</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Ajouter un exercice</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Développé couché" placeholderTextColor="#9CA3AF" value={newExName} onChangeText={setNewExName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewExercise}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {exercises.filter(ex => selectedWorkout && ex.workoutId === selectedWorkout.id).map((ex) => (
            <View key={ex.id} style={[styles.modernCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.exHeading, { fontSize: fontSize + 2, color: textColor }]}>{ex.name}</Text>

              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowModern}>
                  <Text style={{ width: 25, color: subText, fontWeight: 'bold', fontSize: fontSize - 1 }}>#{index + 1}</Text>
                  <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Poids" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.weight} onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)} />
                  <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Reps" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.reps} onChangeText={(val) => updateSet(ex.id, set.id, 'reps', val)} />
                  <TouchableOpacity style={styles.deleteSetIcon} onPress={() => removeSet(ex.id, set.id)}>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addSetModernBtn} onPress={() => addSet(ex.id)}>
                <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: fontSize - 1 }}>+ Ajouter une série</Text>
              </TouchableOpacity>

              {ex.history && ex.history.length > 0 && (
                <View style={styles.historyContainer}>
                  <Text style={{ fontSize: fontSize - 2, fontWeight: '600', color: subText, marginBottom: 2 }}>📜 Historique :</Text>
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
  // Marge inférieure massive de 180px pour que rien ne soit jamais caché par le navigateur mobile
  scrollContainer: { padding: 12, paddingBottom: 180, width: '100%', maxWidth: 480, alignSelf: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  pillButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, elevation: 2 },
  heroSection: { alignItems: 'center', marginTop: 5 },
  appTitle: { fontWeight: '800', textAlign: 'center' },
  appSubtitle: { textAlign: 'center', marginBottom: 20, marginTop: 2 },
  amrapGlowBtn: {
    width: 115,
    height: 115,
    borderRadius: 57.5,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  amrapEmoji: { fontSize: 26 },
  amrapText: { color: '#FFF', fontWeight: 'bold', fontSize: 11, marginTop: 2 },
  workoutHeroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 15,
    borderRadius: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
    elevation: 3,
  },
  heroCardBadge: { color: '#10B981', fontSize: 9, fontWeight: '800', marginBottom: 2 },
  heroCardTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  heroArrow: { color: '#9CA3AF', fontSize: 16, fontWeight: 'bold' },
  backLink: { marginBottom: 10 },
  screenTitle: { fontWeight: '800', marginBottom: 12 },
  modernCard: { padding: 12, borderRadius: 12, marginBottom: 12, elevation: 2 },
  inputLabel: { marginBottom: 3, fontWeight: '600' },
  rowInline: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  modernInput: { borderWidth: 1, borderColor: '#4B5563', padding: 8, borderRadius: 6 },
  primaryBtn: { backgroundColor: '#3B82F6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginLeft: 6, justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cardHeaderTitle: { fontWeight: 'bold', marginBottom: 8 },
  historyLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#374151' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fontBtn: { backgroundColor: '#3B82F6', width: 32, height: 32, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  timerDigits: { fontWeight: '900', letterSpacing: 2, marginVertical: 6 },
  rowInlineSpace: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 10 },
  controlBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  roundCounterBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 12, padding: 15, alignItems: 'center', width: '100%' },
  roundBigNumber: { fontSize: 36, fontWeight: '900', color: '#3B82F6' },
  navCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8, elevation: 2 },
  exHeading: { fontWeight: 'bold', marginBottom: 8 },
  setRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, width: '100%' },
  setInputModern: { flex: 1, borderWidth: 1, borderColor: '#4B5563', padding: 6, borderRadius: 6, marginHorizontal: 3, textAlign: 'center' },
  deleteSetIcon: { width: 24, alignItems: 'center', justifyContent: 'center' },
  addSetModernBtn: { marginTop: 4, padding: 8, borderRadius: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center' },
  historyContainer: { marginTop: 8, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#374151' },
});
