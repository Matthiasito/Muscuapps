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
  const [fontSize, setFontSize] = useState(15); // Taille optimisée pour mobile

  const [currentWeight, setCurrentWeight] = useState('75');
  const [gender, setGender] = useState('Homme');
  const [height, setHeight] = useState('1m78');
  const [weightHistory, setWeightHistory] = useState([
    { id: '1', date: '01/10/2026', weight: '76.0' },
    { id: '2', date: '15/10/2026', weight: '75.5' },
  ]);

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

  const [cycles, setCycles] = useState([
    { id: '1', name: 'Cycle 1 - Force & Hypertrophie' },
  ]);
  const [newCycleName, setNewCycleName] = useState('');
  const [selectedCycle, setSelectedCycle] = useState(null);

  const [workouts, setWorkouts] = useState([
    { id: '1', cycleId: '1', name: 'Haut du corps (Pectoraux / Dos)' },
  ]);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

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
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity style={[styles.pillButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('profile')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>👤 Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pillButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('settings')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>⚙️ Réglages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Text style={[styles.appTitle, { fontSize: fontSize + 10, color: textColor }]}>FitTracker ⚡</Text>
            <Text style={[styles.appSubtitle, { fontSize: fontSize - 1, color: subText }]}>Repousse tes limites aujourd'hui</Text>

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
        <ScrollView contentContainerStyle={styles.screenContainer}>
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

            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1, marginTop: 12 }]}>Sexe & Taille</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize, marginRight: 8 }]} value={gender} onChangeText={setGender} />
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} value={height} onChangeText={setHeight} />
            </View>
          </View>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardHeaderTitle, { fontSize: fontSize + 2, color: textColor }]}>📈 Évolution du Poids</Text>
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
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Réglages</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Mode Sombre 🌙</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
            <View style={[styles.settingRow, { marginTop: 20 }]}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Taille police ({fontSize}px)</Text>
              <View style={styles.rowInline}>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.max(12, fontSize - 2))}><Text style={styles.btnText}>-</Text></TouchableOpacity>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.min(22, fontSize + 2))}><Text style={styles.btnText}>+</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ================= AMRAP ================= */}
      {currentScreen === 'amrap' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Chrono AMRAP</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg, alignItems: 'center', paddingVertical: 30 }]}>
            <Text style={[styles.timerDigits, { fontSize: fontSize + 24, color: textColor }]}>
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
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Mes Cycles d'Entraînement</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer un nouveau cycle</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Cycle Force" placeholderTextColor="#9CA3AF" value={newCycleName} onChangeText={setNewCycleName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewCycle}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {cycles.map((c) => (
            <TouchableOpacity key={c.id} style={[styles.navCardItem, { backgroundColor: cardBg }]} onPress={() => { setSelectedCycle(c); setCurrentScreen('workoutList'); }}>
              <Text style={{ fontSize: fontSize + 2, fontWeight: 'bold', color: textColor, flex: 1 }}>🏋️‍♂️ {c.name}</Text>
              <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Ouvrir →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= SÉANCES ================= */}
      {currentScreen === 'workoutList' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('cyclesList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux cycles</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>{selectedCycle ? selectedCycle.name : 'Séances'}</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer une nouvelle séance</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Séance Dos" placeholderTextColor="#9CA3AF" value={newWorkoutName} onChangeText={setNewWorkoutName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewWorkout}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {workouts.filter(w => selectedCycle && w.cycleId === selectedCycle.id).map((w) => (
            <TouchableOpacity key={w.id} style={[styles.navCardItem, { backgroundColor: cardBg }]} onPress={() => { setSelectedWorkout(w); setCurrentScreen('exerciseDetail'); }}>
              <Text style={{ fontSize: fontSize + 2, fontWeight: 'bold', color: textColor, flex: 1 }}>📋 {w.name}</Text>
              <Text style={{ color: '#10B981', fontWeight: '600' }}>Commencer →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= EXERCICES & PERFS (RESPONSIVE MOBILE) ================= */}
      {currentScreen === 'exerciseDetail' && (
        <ScrollView contentContainerStyle={[styles.screenContainer, { paddingBottom: 120 }]}>
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
              <Text style={[styles.exHeading, { fontSize: fontSize + 3, color: textColor }]}>{ex.name}</Text>

              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowModern}>
                  <Text style={{ width: 30, color: subText, fontWeight: 'bold', fontSize: fontSize }}>#{index + 1}</Text>
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
                  <Text style={{ fontSize: fontSize - 2, fontWeight: '600', color: subText, marginBottom: 4 }}>📜 Historique des perfs :</Text>
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
  screenContainer: { padding: 15, paddingBottom: 80, width: '100%', maxWidth: 500, alignSelf: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pillButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, elevation: 2 },
  heroSection: { alignItems: 'center', marginTop: 10 },
  appTitle: { fontWeight: '800', textAlign: 'center' },
  appSubtitle: { textAlign: 'center', marginBottom: 25, marginTop: 4 },
  amrapGlowBtn: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 6,
  },
  amrapEmoji: { fontSize: 30 },
  amrapText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginTop: 4 },
  workoutHeroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 18,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
    elevation: 3,
  },
  heroCardBadge: { color: '#10B981', fontSize: 10, fontWeight: '800', marginBottom: 2 },
  heroCardTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  heroArrow: { color: '#9CA3AF', fontSize: 18, fontWeight: 'bold' },
  backLink: { marginBottom: 12 },
  screenTitle: { fontWeight: '800', marginBottom: 15 },
  modernCard: { padding: 15, borderRadius: 14, marginBottom: 14, elevation: 2 },
  inputLabel: { marginBottom: 4, fontWeight: '600' },
  rowInline: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  modernInput: { borderWidth: 1, borderColor: '#4B5563', padding: 10, borderRadius: 8 },
  primaryBtn: { backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8, justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cardHeaderTitle: { fontWeight: 'bold', marginBottom: 10 },
  historyLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#374151' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fontBtn: { backgroundColor: '#3B82F6', width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  timerDigits: { fontWeight: '900', letterSpacing: 2, marginVertical: 10 },
  rowInlineSpace: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15 },
  controlBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10 },
  roundCounterBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 14, padding: 20, alignItems: 'center', width: '100%' },
  roundBigNumber: { fontSize: 42, fontWeight: '900', color: '#3B82F6' },
  navCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 10, elevation: 2 },
  exHeading: { fontWeight: 'bold', marginBottom: 10 },
  setRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, width: '100%' },
  setInputModern: { flex: 1, borderWidth: 1, borderColor: '#4B5563', padding: 8, borderRadius: 6, marginHorizontal: 4, textAlign: 'center' },
  deleteSetIcon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  addSetModernBtn: { marginTop: 4, padding: 10, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center' },
  historyContainer: { marginTop: 10, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#374151' },
});
