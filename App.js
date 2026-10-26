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

const BASE_EXERCISES = [
  { group: 'Dos 🦇', exercises: ['Traction pronation', 'Traction supination', 'Tirage vertical', 'Tirage horizontal', 'Chaise romaine', 'Rowing haltère', 'Rowing barre'] },
  { group: 'Biceps 💪', exercises: ['Curl haltère pronation', 'Curl marteau', 'Curl barre EZ', 'Curl pupitre', 'Curl incliné'] },
  { group: 'Pectoraux 🦍', exercises: ['Développé couché', 'Développé incliné', 'Développé décliné', 'Dips', 'Pompes', 'Écartés haltères', 'Pull-over'] },
  { group: 'Jambes 🦵', exercises: ['Squat', 'Presse à cuisses', 'Fentes', 'Soulevé de terre', 'Leg extension', 'Leg curl', 'Mollets debout'] },
  { group: 'Épaules 🦾', exercises: ['Développé militaire', 'Élévations latérales', 'Oiseau', 'Développé arnold', 'Tirage menton'] },
  { group: 'Triceps 🦾', exercises: ['Barre front', 'Extension poulie haute', 'Dips banquette', 'Kickback'] },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'profile', 'settings', 'amrap', 'workoutList', 'exerciseDetail', 'globalHistory', 'exerciseLibrary'
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(13);

  // --- PERSISTANCE DES DONNÉES ---
  const [currentWeight, setCurrentWeight] = useState('75');
  const [gender, setGender] = useState('Homme');
  const [height, setHeight] = useState('1m78');
  const [weightHistory, setWeightHistory] = useState([
    { id: '1', date: '01/10/2026', weight: '76.0' },
  ]);

  // Un seul cycle par défaut ou géré directement
  const [workouts, setWorkouts] = useState([
    { id: '1', name: 'Haut du corps (Pectoraux / Dos)' },
    { id: '2', name: 'Bas du corps (Jambes)' },
  ]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  const [exercises, setExercises] = useState([
    {
      id: '1',
      workoutId: '1',
      name: 'Développé couché',
      sets: [{ id: 1, reps: '10', weight: '80' }],
      history: [{ date: '17/10/2026', summary: '10 reps × 82 kg' }],
    },
  ]);
  const [customExInput, setCustomExInput] = useState('');

  const [globalHistory, setGlobalHistory] = useState([
    { id: '1', date: '17/10/2026', workoutName: 'Haut du corps (Pectoraux / Dos)', summary: 'Développé couché : 10 reps × 82 kg' }
  ]);

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

  useEffect(() => {
    try {
      const savedWorkouts = localStorage.getItem('fit_workouts');
      const savedExercises = localStorage.getItem('fit_exercises');
      const savedWeight = localStorage.getItem('fit_weight_hist');
      const savedGlobalHist = localStorage.getItem('fit_global_hist');
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedExercises) setExercises(JSON.parse(savedExercises));
      if (savedWeight) setWeightHistory(JSON.parse(savedWeight));
      if (savedGlobalHist) setGlobalHistory(JSON.parse(savedGlobalHist));
    } catch (e) {
      console.log('Erreur chargement stockage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('fit_workouts', JSON.stringify(workouts));
      localStorage.setItem('fit_exercises', JSON.stringify(exercises));
      localStorage.setItem('fit_weight_hist', JSON.stringify(weightHistory));
      localStorage.setItem('fit_global_hist', JSON.stringify(globalHistory));
    } catch (e) {
      console.log('Erreur sauvegarde stockage', e);
    }
  }, [workouts, exercises, weightHistory, globalHistory]);

  const deleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
    setExercises(exercises.filter(e => e.workoutId !== workoutId));
  };

  const deleteExercise = (exId) => {
    setExercises(exercises.filter(e => e.id !== exId));
  };

  const addNewWorkout = () => {
    if (!newWorkoutName.trim()) return;
    setWorkouts([...workouts, { id: Date.now().toString(), name: newWorkoutName }]);
    setNewWorkoutName('');
  };

  const addCustomExercise = (exName) => {
    if (!selectedWorkout || !exName.trim()) return;
    setExercises([
      ...exercises,
      { id: Date.now().toString(), workoutId: selectedWorkout.id, name: exName.trim(), sets: [{ id: 1, reps: '', weight: '' }], history: [] },
    ]);
    setCustomExInput('');
    setCurrentScreen('exerciseDetail');
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
        return { ...ex, sets: [...ex.sets, { id: Date.now(), reps: last ? last.reps : '', weight: last ? last.weight : '' }] };
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
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s),
        };
      }
      return ex;
    }));
  };

  const finishWorkout = () => {
    if (!selectedWorkout) return;
    const today = new Date().toLocaleDateString('fr-FR');
    let summaryParts = [];

    const updatedExercises = exercises.map(ex => {
      if (ex.workoutId === selectedWorkout.id) {
        const firstSet = ex.sets[0] ? ex.sets[0] : { reps: '0', weight: '0' };
        const setDetails = `${firstSet.reps || '0'} reps × ${firstSet.weight || '0'} kg`;
        
        summaryParts.push(`${ex.name} : ${setDetails}`);

        const newHistoryEntry = { date: today, summary: setDetails };
        return {
          ...ex,
          history: [newHistoryEntry, ...(ex.history || [])],
          sets: [{ id: Date.now(), reps: firstSet.reps, weight: firstSet.weight }]
        };
      }
      return ex;
    });

    setExercises(updatedExercises);

    const newGlobalEntry = {
      id: Date.now().toString(),
      date: today,
      workoutName: selectedWorkout.name,
      summary: summaryParts.join(' | ')
    };
    setGlobalHistory([newGlobalEntry, ...globalHistory]);

    alert('Séance terminée ! Première série enregistrée avec succès 🎉');
    setCurrentScreen('home');
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
            <TouchableOpacity style={[styles.pillButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('globalHistory')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>📊 Historique</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pillButton, { backgroundColor: cardBg }]} onPress={() => setCurrentScreen('settings')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>⚙️ Réglages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Text style={[styles.appTitle, { fontSize: fontSize + 8, color: textColor }]}>FitTracker ⚡</Text>
            <Text style={[styles.appSubtitle, { fontSize: fontSize - 2, color: subText }]}>Données sauvegardées automatiquement</Text>

            <TouchableOpacity style={[styles.pillButtonLarge, { backgroundColor: cardBg, marginBottom: 20 }]} onPress={() => setCurrentScreen('profile')}>
              <Text style={{ fontSize: fontSize + 1, color: textColor, fontWeight: '600' }}>👤 Mon Profil & Poids</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.amrapGlowBtn} onPress={() => setCurrentScreen('amrap')}>
              <Text style={styles.amrapEmoji}>⏱️</Text>
              <Text style={styles.amrapText}>MODE AMRAP</Text>
            </TouchableOpacity>

            {/* Accès direct aux Séances depuis l'accueil (Cycle unique simplifié) */}
            <TouchableOpacity style={styles.workoutHeroCard} onPress={() => setCurrentScreen('workoutList')}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroCardBadge}>PROGRAMME</Text>
                <Text style={styles.heroCardTitle}>Mes Séances d'Entraînement</Text>
              </View>
              <Text style={styles.heroArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= HISTORIQUE GLOBAL ================= */}
      {currentScreen === 'globalHistory' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Historique Global des Séances</Text>

          {globalHistory.map((item) => (
            <View key={item.id} style={[styles.modernCard, { backgroundColor: cardBg }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontWeight: 'bold', color: '#10B981', fontSize: fontSize }}>{item.workoutName}</Text>
                <Text style={{ color: subText, fontSize: fontSize - 1 }}>{item.date}</Text>
              </View>
              <Text style={{ color: textColor, fontSize: fontSize - 1 }}>{item.summary}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ================= PROFIL ================= */}
      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Mon Profil & Poids</Text>

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
            <Text style={[styles.cardHeaderTitle, { fontSize: fontSize + 1, color: textColor }]}>📈 Historique du Poids</Text>
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
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Réglages</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Mode Sombre 🌙</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
            <View style={[styles.settingRow, { marginTop: 15 }]}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Taille police ({fontSize}px)</Text>
              <View style={styles.rowInline}>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.max(10, fontSize - 2))}><Text style={styles.btnText}>-</Text></TouchableOpacity>
                <TouchableOpacity style={styles.fontBtn} onPress={() => setFontSize(Math.min(18, fontSize + 2))}><Text style={styles.btnText}>+</Text></TouchableOpacity>
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
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Chrono AMRAP</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg, alignItems: 'center', paddingVertical: 20 }]}>
            <Text style={[styles.timerDigits, { fontSize: fontSize + 20, color: textColor }]}>
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

      {/* ================= SÉANCES (ACCUEIL -> SÉANCE) ================= */}
      {currentScreen === 'workoutList' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Mes Séances</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer une séance</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Séance Jambes" placeholderTextColor="#9CA3AF" value={newWorkoutName} onChangeText={setNewWorkoutName} />
              <TouchableOpacity style={styles.primaryBtn} onPress={addNewWorkout}><Text style={styles.btnText}>Ajouter</Text></TouchableOpacity>
            </View>
          </View>

          {workouts.map((w) => (
            <View key={w.id} style={[styles.navCardItem, { backgroundColor: cardBg }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { setSelectedWorkout(w); setCurrentScreen('exerciseDetail'); }}>
                <Text style={{ fontSize: fontSize + 1, fontWeight: 'bold', color: textColor }}>📋 {w.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteWorkout(w.id)} style={styles.deleteIconButton}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ================= EXERCICES DE LA SÉANCE ================= */}
      {currentScreen === 'exerciseDetail' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('workoutList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux séances</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>{selectedWorkout ? selectedWorkout.name : 'Séance'}</Text>

          <TouchableOpacity style={styles.openLibraryBtn} onPress={() => setCurrentScreen('exerciseLibrary')}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize }}>+ Choisir / Créer un exercice 🏋️‍♂️</Text>
          </TouchableOpacity>

          {exercises.filter(ex => selectedWorkout && ex.workoutId === selectedWorkout.id).map((ex) => (
            <View key={ex.id} style={[styles.modernCard, { backgroundColor: cardBg }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[styles.exHeading, { fontSize: fontSize + 2, color: textColor, flex: 1, marginBottom: 0 }]}>{ex.name}</Text>
                <TouchableOpacity onPress={() => deleteExercise(ex.id)} style={{ padding: 4 }}>
                  <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 14 }}>🗑️ Supprimer</Text>
                </TouchableOpacity>
              </View>

              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowModern}>
                  <Text style={{ width: 25, color: subText, fontWeight: 'bold', fontSize: fontSize - 1 }}>#{index + 1}</Text>
                  <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Reps" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.reps} onChangeText={(val) => updateSet(ex.id, set.id, 'reps', val)} />
                  <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Poids" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.weight} onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)} />
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
                  <Text style={{ fontSize: fontSize - 2, fontWeight: '600', color: subText, marginBottom: 2 }}>📜 Séance précédente :</Text>
                  <Text style={{ fontSize: fontSize - 2, color: subText }}>• {ex.history[0].date} : {ex.history[0].summary}</Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.finishWorkoutBtn} onPress={finishWorkout}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize + 1 }}>Terminer & Enregistrer la séance 🏁</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ================= BIBLIOTHÈQUE & CRÉATION D'EXERCICE ================= */}
      {currentScreen === 'exerciseLibrary' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('exerciseDetail')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour à la séance</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Ajouter un Exercice 📋</Text>

          {/* Créer un exercice personnalisé */}
          <View style={[styles.modernCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer un exercice sur-mesure</Text>
            <View style={styles.rowInline}>
              <TextInput style={[styles.modernInput, { flex: 1, backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="ex: Extension nuque" placeholderTextColor="#9CA3AF" value={customExInput} onChangeText={setCustomExInput} />
              <TouchableOpacity style={styles.primaryBtn} onPress={() => addCustomExercise(customExInput)}>
                <Text style={styles.btnText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Liste de la bibliothèque triée par groupe musculaire */}
          {BASE_EXERCISES.map((cat, idx) => (
            <View key={idx} style={[styles.modernCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.categoryTitle, { fontSize: fontSize + 2, color: '#3B82F6' }]}>{cat.group}</Text>
              {cat.exercises.map((exoName, i) => (
                <TouchableOpacity key={i} style={styles.libraryItem} onPress={() => addCustomExercise(exoName)}>
                  <Text style={{ color: textColor, fontSize: fontSize }}>• {exoName}</Text>
                  <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: fontSize }}>Ajouter +</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  scrollContainer: { padding: 12, paddingBottom: 200, width: '100%', boxSizing: 'border-box' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, width: '100%' },
  pillButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, elevation: 2 },
  pillButtonLarge: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, elevation: 2, width: '100%', alignItems: 'center' },
  heroSection: { alignItems: 'center', marginTop: 5, width: '100%' },
  appTitle: { fontWeight: '800', textAlign: 'center' },
  appSubtitle: { textAlign: 'center', marginBottom: 20, marginTop: 2 },
  amrapGlowBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  amrapEmoji: { fontSize: 28 },
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
  modernCard: { padding: 12, borderRadius: 14, marginBottom: 14, width: '100%', elevation: 2 },
  inputLabel: { marginBottom: 3, fontWeight: '600' },
  rowInline: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  modernInput: { borderWidth: 1, borderColor: '#4B5563', padding: 8, borderRadius: 8, width: '100%' },
  primaryBtn: { backgroundColor: '#3B82F6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 6, justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cardHeaderTitle: { fontWeight: 'bold', marginBottom: 8 },
  historyLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#374151', width: '100%' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  fontBtn: { backgroundColor: '#3B82F6', width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  timerDigits: { fontWeight: '900', letterSpacing: 2, marginVertical: 6 },
  rowInlineSpace: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 10 },
  controlBtn: { paddingVertical: 10, paddingHorizontal: 22, borderRadius: 8 },
  roundCounterBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 14, padding: 18, alignItems: 'center', width: '100%' },
  roundBigNumber: { fontSize: 38, fontWeight: '900', color: '#3B82F6' },
  navCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 14, marginBottom: 10, width: '100%', elevation: 2 },
  deleteIconButton: { padding: 6, justifyContent: 'center', alignItems: 'center' },
  exHeading: { fontWeight: 'bold', marginBottom: 8 },
  setRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, width: '100%' },
  setInputModern: { flex: 1, borderWidth: 1, borderColor: '#4B5563', padding: 6, borderRadius: 6, marginHorizontal: 2, textAlign: 'center' },
  deleteSetIcon: { width: 26, alignItems: 'center', justifyContent: 'center' },
  addSetModernBtn: { marginTop: 4, padding: 10, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', width: '100%' },
  historyContainer: { marginTop: 8, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#374151', width: '100%' },
  finishWorkoutBtn: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    elevation: 4,
  },
  openLibraryBtn: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
  },
  categoryTitle: { fontWeight: 'bold', marginBottom: 10 },
  libraryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
});
