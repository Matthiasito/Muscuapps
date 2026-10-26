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
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'profile', 'settings', 'amrap', 'cyclesList', 'workoutList', 'exerciseDetail'
  
  // Paramètres & Style
  const [isDarkMode, setIsDarkMode] = useState(true); // Par défaut en mode sombre, beaucoup plus stylé
  const [fontSize, setFontSize] = useState(16);

  // Profil & Historique Poids
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

  // Gestion des Cycles, Séances et Exercices
  const [cycles, setCycles] = useState([
    { id: '1', name: 'Cycle 1 - Force & Hypertrophie' },
    { id: '2', name: 'Cycle 2 - Prise de masse sèche' },
  ]);
  const [newCycleName, setNewCycleName] = useState('');
  const [selectedCycle, setSelectedCycle] = useState(null);

  const [workouts, setWorkouts] = useState([
    { id: '1', cycleId: '1', name: 'Haut du corps (Pectoraux / Dos)' },
    { id: '2', cycleId: '1', name: 'Bas du corps (Jambes)' },
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

  // Actions de création
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

  // Design tokens dynamiques (UI Moderne)
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

            {/* Bouton Circulaire AMRAP Stylé */}
            <TouchableOpacity style={styles.amrapGlowBtn} onPress={() => setCurrentScreen('amrap')}>
              <Text style={styles.amrapEmoji}>⏱️</Text>
              <Text style={styles.amrapText}>MODE AMRAP</Text>
            </TouchableOpacity>

            {/* Accès aux Cycles */}
            <TouchableOpacity style={styles.workoutHeroCard} onPress={() => setCurrentScreen('cyclesList')}>
              <View>
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
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#767577', true: '#3B82F6' }} />
            </View>
            <View style={[styles.settingRow, { marginTop: 20 }]}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Taille de police ({fontSize}px)</Text>
              <View style={styles.rowInline}>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.max(12, fontSize - 2))}><Text style={styles.btnText}>-</Text></TouchableOpacity>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.min(24, fontSize + 2))}><Text style={styles.btnText}>+</Text></TouchableOpacity>
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
            <Text style={[styles.timerDigits, { fontSize: fontSize + 28, color: textColor }]}>
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

            <div style={{ height: 1, backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', width: '100%', marginVertical: 20 }} />

            <TouchableOpacity style={styles.roundCounterBox} onPress={() => setAmrapRounds(amrapRounds + 1)}>
              <Text style={styles.roundBigNumber}>{amrapRounds}</Text>
              <Text style={{ color: '#3B82F6', fontWeight: '600', fontSize: fontSize }}>Tours / Séries validés (+1)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= 1. LISTE DES CYCLES ================= */}
      {currentScreen === 'cyclesList' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>Mes Cycles d'Entraînement</Text>

          {/* Créer un cycle */}
          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer un nouveau cycle</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Cycle Prise de Masse" placeholderTextColor="#9CA3AF" value={newCycleName} onChangeText={setNewCycleName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewCycle}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {cycles.map((c) => (
            <TouchableOpacity key={c.id} style={[styles.navCardItem, { backgroundColor: cardBg }]} onPress={() => { setSelectedCycle(c); setCurrentScreen('workoutList'); }}>
              <Text style={{ fontSize: fontSize + 2, fontWeight: 'bold', color: textColor }}>🏋️‍♂️ {c.name}</Text>
              <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Ouvrir →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= 2. LISTE DES SÉANCES DU CYCLE ================= */}
      {currentScreen === 'workoutList' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('cyclesList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux cycles</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>{selectedCycle ? selectedCycle.name : 'Séances'}</Text>

          {/* Créer une séance */}
          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer une nouvelle séance</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Séance Dos / Biceps" placeholderTextColor="#9CA3AF" value={newWorkoutName} onChangeText={setNewWorkoutName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewWorkout}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {workouts.filter(w => selectedCycle && w.cycleId === selectedCycle.id).map((w) => (
            <TouchableOpacity key={w.id} style={[styles.navCardItem, { backgroundColor: cardBg }]} onPress={() => { setSelectedWorkout(w); setCurrentScreen('exerciseDetail'); }}>
              <Text style={{ fontSize: fontSize + 2, fontWeight: 'bold', color: textColor }}>📋 {w.name}</Text>
              <Text style={{ color: '#10B981', fontWeight: '600' }}>Commencer →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ================= 3. EXERCICES DE LA SÉANCE & HISTORIQUE ================= */}
      {currentScreen === 'exerciseDetail' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('workoutList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux séances</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 6, color: textColor }]}>{selectedWorkout ? selectedWorkout.name : 'Séance'}</Text>

          {/* Ajouter un exercice */}
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
                  <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Poids (kg)" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.weight} onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)} />
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
  screenContainer: { padding: 20, paddingBottom: 60 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  pillButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  heroSection: { alignItems: 'center', marginTop: 10 },
  appTitle: { fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  appSubtitle: { textAlign: 'center', marginBottom: 30, marginTop: 4 },
  amrapGlowBtn: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  amrapEmoji: { fontSize: 32 },
  amrapText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, marginTop: 4, letterSpacing: 1 },
  workoutHeroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroCardBadge: { color: '#10B981', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  heroCardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  heroArrow: { color: '#9CA3AF', fontSize: 20, fontWeight: 'bold' },
  backLink: { marginBottom: 15 },
  screenTitle: { fontWeight: '800', marginBottom: 20 },
  modernCard: { padding: 18, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  inputLabel: { marginBottom: 6, fontWeight: '600' },
  rowInline: { flexDirection: 'row', alignItems: 'center' },
  modernInput: { borderWidth: 1, borderColor: '#4B5563', padding: 12, borderRadius: 10 },
  primaryBtn: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginLeft: 10, justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cardHeaderTitle: { fontWeight: 'bold', marginBottom: 12 },
  historyLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#374151' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fontBtn: { backgroundColor: '#3B82F6', width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  timerDigits: { fontWeight: '900', letterSpacing: 2, marginVertical: 10 },
  rowInlineSpace: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 10 },
  controlBtn: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  roundCounterBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 16, padding: 24, alignItems: 'center', width: '100%' },
  roundBigNumber: { fontSize: 48, fontWeight: '900', color: '#3B82F6' },
  navCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  exHeading: { fontWeight: 'bold', marginBottom: 12 },
  setRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  setInputModern: { flex: 1, borderWidth: 1, borderColor: '#4B5563', padding: 8, borderRadius: 8, marginHorizontal: 4, textAlign: 'center' },
  deleteSetIcon: { width: 30, alignItems: 'center', justifyContent: 'center' },
  addSetModernBtn: { marginTop: 6, padding: 12, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center' },
  historyContainer: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#374151' },
});
