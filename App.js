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

const INITIAL_BASE_EXERCISES = [
  { group: 'Dos 🦇', exercises: [{ name: 'Traction pronation', muscle: 'Dos 🦇' }, { name: 'Traction supination', muscle: 'Dos 🦇' }, { name: 'Tirage vertical', muscle: 'Dos 🦇' }, { name: 'Tirage horizontal', muscle: 'Dos 🦇' }, { name: 'Chaise romaine', muscle: 'Dos 🦇' }, { name: 'Rowing haltère', muscle: 'Dos 🦇' }, { name: 'Rowing barre', muscle: 'Dos 🦇' }] },
  { group: 'Biceps 💪', exercises: [{ name: 'Curl haltère pronation', muscle: 'Biceps 💪' }, { name: 'Curl marteau', muscle: 'Biceps 💪' }, { name: 'Curl barre EZ', muscle: 'Biceps 💪' }, { name: 'Curl pupitre', muscle: 'Biceps 💪' }, { name: 'Curl incliné', muscle: 'Biceps 💪' }] },
  { group: 'Pectoraux 🦍', exercises: [{ name: 'Développé couché', muscle: 'Pectoraux 🦍' }, { name: 'Développé incliné', muscle: 'Pectoraux 🦍' }, { name: 'Développé décliné', muscle: 'Pectoraux 🦍' }, { name: 'Dips', muscle: 'Pectoraux 🦍' }, { name: 'Pompes', muscle: 'Pectoraux 🦍' }, { name: 'Écartés haltères', muscle: 'Pectoraux 🦍' }, { name: 'Pull-over', muscle: 'Pectoraux 🦍' }] },
  { group: 'Jambes 🦵', exercises: [{ name: 'Squat', muscle: 'Jambes 🦵' }, { name: 'Presse à cuisses', muscle: 'Jambes 🦵' }, { name: 'Fentes', muscle: 'Jambes 🦵' }, { name: 'Soulevé de terre', muscle: 'Jambes 🦵' }, { name: 'Leg extension', muscle: 'Jambes 🦵' }, { name: 'Leg curl', muscle: 'Jambes 🦵' }, { name: 'Mollets debout', muscle: 'Jambes 🦵' }] },
  { group: 'Épaules 🦾', exercises: [{ name: 'Développé militaire', muscle: 'Épaules 🦾' }, { name: 'Élévations latérales', muscle: 'Épaules 🦾' }, { name: 'Oiseau', muscle: 'Épaules 🦾' }, { name: 'Développé arnold', muscle: 'Épaules 🦾' }, { name: 'Tirage menton', muscle: 'Épaules 🦾' }] },
  { group: 'Triceps 🦾', exercises: [{ name: 'Barre front', muscle: 'Triceps 🦾' }, { name: 'Extension poulie haute', muscle: 'Triceps 🦾' }, { name: 'Dips banquette', muscle: 'Triceps 🦾' }, { name: 'Kickback', muscle: 'Triceps 🦾' }] },
];

const MUSCLE_CATEGORIES = ['Tous', 'Dos 🦇', 'Biceps 💪', 'Pectoraux 🦍', 'Jambes 🦵', 'Épaules 🦾', 'Triceps 🦾'];

const POLYARTICULAR_LIST = [
  'Développé couché',
  'Développé incliné',
  'Squat',
  'Soulevé de terre',
  'Traction pronation',
  'Développé militaire'
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(13);

  const [currentWeight, setCurrentWeight] = useState('75');
  const [gender, setGender] = useState('Homme');
  const [height, setHeight] = useState('1m78');
  const [weightHistory, setWeightHistory] = useState([
    { id: '1', date: '01/10/2026', weight: '76.0' },
  ]);

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
      muscle: 'Pectoraux 🦍',
      sets: [{ id: 1, reps: '10', weight: '80' }],
      history: [{ date: '17/10/2026', summary: '10 reps × 82 kg' }],
    },
  ]);
  
  const [baseExercisesList, setBaseExercisesList] = useState(INITIAL_BASE_EXERCISES);
  const [selectedExItems, setSelectedExItems] = useState([]);
  
  const [customExName, setCustomExName] = useState('');
  const [selectedMuscleCategory, setSelectedMuscleCategory] = useState('Pectoraux 🦍');
  const [activeLibraryFilter, setActiveLibraryFilter] = useState('Tous');

  const [globalHistory, setGlobalHistory] = useState([
    { id: '1', date: '17/10/2026', workoutName: 'Haut du corps (Pectoraux / Dos)', summary: 'Développé couché (Pectoraux 🦍) : 10 reps × 82 kg' }
  ]);

  const [maxiRepsHistory, setMaxiRepsHistory] = useState([
    { id: '1', date: '17/10/2026', exerciseName: 'Développé couché', record: '82 kg × 10 reps' }
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
      const savedBaseEx = localStorage.getItem('fit_base_ex_list');
      const savedMaxiHist = localStorage.getItem('fit_maxi_reps_hist');
      const savedDarkMode = localStorage.getItem('fit_dark_mode');
      
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedExercises) setExercises(JSON.parse(savedExercises));
      if (savedWeight) setWeightHistory(JSON.parse(savedWeight));
      if (savedGlobalHist) setGlobalHistory(JSON.parse(savedGlobalHist));
      if (savedBaseEx) setBaseExercisesList(JSON.parse(savedBaseEx));
      if (savedMaxiHist) setMaxiRepsHistory(JSON.parse(savedMaxiHist));
      if (savedDarkMode !== null) setIsDarkMode(JSON.parse(savedDarkMode));
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
      localStorage.setItem('fit_base_ex_list', JSON.stringify(baseExercisesList));
      localStorage.setItem('fit_maxi_reps_hist', JSON.stringify(maxiRepsHistory));
      localStorage.setItem('fit_dark_mode', JSON.stringify(isDarkMode));
    } catch (e) {
      console.log('Erreur sauvegarde stockage', e);
    }
  }, [workouts, exercises, weightHistory, globalHistory, baseExercisesList, maxiRepsHistory, isDarkMode]);

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

  const createCustomExercise = () => {
    if (!customExName.trim()) return;
    const newExObj = { name: customExName.trim(), muscle: selectedMuscleCategory };

    const updatedBase = baseExercisesList.map(cat => {
      if (cat.group === selectedMuscleCategory) {
        return { ...cat, exercises: [...cat.exercises, newExObj] };
      }
      return cat;
    });
    setBaseExercisesList(updatedBase);

    if (!selectedExItems.some(item => item.name === newExObj.name)) {
      setSelectedExItems([...selectedExItems, newExObj]);
    }
    setCustomExName('');
  };

  const toggleSelectExercise = (exoObj) => {
    if (selectedExItems.some(item => item.name === exoObj.name)) {
      setSelectedExItems(selectedExItems.filter(item => item.name !== exoObj.name));
    } else {
      setSelectedExItems([...selectedExItems, exoObj]);
    }
  };

  const addSelectedExercisesToWorkout = () => {
    if (!selectedWorkout) return;
    let newExercisesList = [...exercises];

    selectedExItems.forEach((exoObj, index) => {
      newExercisesList.push({
        id: (Date.now() + index).toString(),
        workoutId: selectedWorkout.id,
        name: exoObj.name,
        muscle: exoObj.muscle,
        sets: [{ id: Date.now() + index, reps: '', weight: '' }],
        history: []
      });
    });

    setExercises(newExercisesList);
    setSelectedExItems([]);
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

  // Incrémentation rapide (+ / -) pour une ergonomie maximale à la salle
  const adjustSetValue = (exId, setId, field, amount) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              const currentVal = parseFloat(s[field]) || 0;
              const newVal = Math.max(0, currentVal + amount);
              return { ...s, [field]: newVal.toString() };
            }
            return s;
          })
        };
      }
      return ex;
    }));
  };

  const finishWorkout = () => {
    if (!selectedWorkout) return;
    const today = new Date().toLocaleDateString('fr-FR');
    let summaryParts = [];
    let newMaxiEntries = [];

    const updatedExercises = exercises.map(ex => {
      if (ex.workoutId === selectedWorkout.id) {
        const firstSet = ex.sets[0] ? ex.sets[0] : { reps: '0', weight: '0' };
        const setDetails = `${firstSet.reps || '0'} reps × ${firstSet.weight || '0'} kg`;
        
        summaryParts.push(`${ex.name} (${ex.muscle}) : ${setDetails}`);

        if (POLYARTICULAR_LIST.includes(ex.name)) {
          newMaxiEntries.push({
            id: Date.now().toString() + Math.random(),
            date: today,
            exerciseName: ex.name,
            record: `${firstSet.weight || '0'} kg × ${firstSet.reps || '0'} reps`
          });
        }

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

    if (newMaxiEntries.length > 0) {
      setMaxiRepsHistory([...newMaxiEntries, ...maxiRepsHistory]);
    }

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

            <TouchableOpacity style={[styles.pillButtonLarge, { backgroundColor: cardBg, marginBottom: 15 }]} onPress={() => setCurrentScreen('profile')}>
              <Text style={{ fontSize: fontSize + 1, color: textColor, fontWeight: '600' }}>👤 Mon Profil & Poids</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.workoutHeroCard, { backgroundColor: '#3B82F6', marginBottom: 15 }]} onPress={() => setCurrentScreen('maxiReps')}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#E0E7FF', fontSize: 9, fontWeight: '800', marginBottom: 2 }}>PERFORMANCES</Text>
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>🏆 Maxi Reps (Polyarticulaires)</Text>
              </View>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.amrapGlowBtn} onPress={() => setCurrentScreen('amrap')}>
              <Text style={styles.amrapEmoji}>⏱️</Text>
              <Text style={styles.amrapText}>MODE AMRAP</Text>
            </TouchableOpacity>

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

      {/* ================= MAXI REPS / POLYARTICULAIRES ================= */}
      {currentScreen === 'maxiReps' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor, marginBottom: 0 }]}>🏆 Maxi Reps</Text>
            {maxiRepsHistory.length > 0 && (
              <TouchableOpacity onPress={() => setMaxiRepsHistory([])} style={{ padding: 4 }}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: fontSize - 1 }}>🗑️ Tout supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ color: subText, fontSize: fontSize - 1, marginBottom: 15 }}>Suivi de tes mouvements de base et records de force.</Text>

          {POLYARTICULAR_LIST.map((polyName, idx) => {
            const matchedRecords = maxiRepsHistory.filter(h => h.exerciseName === polyName);
            const latestRecord = matchedRecords.length > 0 ? matchedRecords[0].record : 'Aucun record enregistré';

            return (
              <View key={idx} style={[styles.modernCard, { backgroundColor: cardBg }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: textColor, fontSize: fontSize + 1, marginBottom: 2 }}>{polyName}</Text>
                    <Text style={{ color: '#3B82F6', fontSize: fontSize - 2, fontWeight: '600' }}>🔥 Record optimal</Text>
                  </View>
                  <View style={styles.recordBadge}>
                    <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: fontSize }}>{latestRecord}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <Text style={[styles.screenTitle, { fontSize: fontSize + 2, color: textColor, marginTop: 15 }]}>📜 Historique des Maxi Reps</Text>
          {maxiRepsHistory.map((item) => (
            <View key={item.id} style={[styles.modernCard, { backgroundColor: cardBg, padding: 10 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3B82F6', fontSize: fontSize }}>{item.exerciseName}</Text>
                <Text style={{ color: subText, fontSize: fontSize - 1 }}>{item.date}</Text>
              </View>
              <Text style={{ color: textColor, fontSize: fontSize - 1 }}>Record validé : <Text style={{ fontWeight: 'bold', color: '#10B981' }}>{item.record}</Text></Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ================= HISTORIQUE GLOBAL ================= */}
      {currentScreen === 'globalHistory' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor, marginBottom: 0 }]}>Historique Global</Text>
            {globalHistory.length > 0 && (
              <TouchableOpacity onPress={() => setGlobalHistory([])} style={{ padding: 4 }}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: fontSize - 1 }}>🗑️ Tout supprimer</Text>
              </TouchableOpacity>
            )}
          </View>

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.cardHeaderTitle, { fontSize: fontSize + 1, color: textColor, marginBottom: 0 }]}>📈 Historique du Poids</Text>
              {weightHistory.length > 0 && (
                <TouchableOpacity onPress={() => setWeightHistory([])}>
                  <Text style={{ color: '#EF4444', fontSize: fontSize - 2, fontWeight: 'bold' }}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
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
        <ScrollView contentContainerStyle={[styles.scrollContainer, { alignItems: 'center' }]}>
          <TouchableOpacity style={[styles.backLink, { alignSelf: 'flex-start' }]} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor, alignSelf: 'flex-start' }]}>Chrono AMRAP</Text>

          <View style={[styles.amrapCircleCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.amrapLabelSmall, { color: subText, fontSize: fontSize - 2 }]}>TEMPS ÉCOULÉ</Text>
            <Text style={[styles.timerDigitsCircle, { fontSize: fontSize + 16, color: textColor }]}>
              {Math.floor(amrapSeconds / 60)}:{amrapSeconds % 60 < 10 ? '0' : ''}{amrapSeconds % 60}
            </Text>

            <View style={styles.rowInlineSpace}>
              <TouchableOpacity style={[styles.controlBtnCircle, { backgroundColor: isAmrapActive ? '#EF4444' : '#10B981' }]} onPress={() => setIsAmrapActive(!isAmrapActive)}>
                <Text style={styles.btnText}>{isAmrapActive ? 'Pause' : 'Start'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtnCircle, { backgroundColor: '#6B7280' }]} onPress={() => { setIsAmrapActive(false); setAmrapSeconds(0); setAmrapRounds(0); }}>
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.roundCircleCard, { backgroundColor: cardBg }]} onPress={() => setAmrapRounds(amrapRounds + 1)}>
            <Text style={[styles.amrapLabelSmall, { color: subText, fontSize: fontSize - 2 }]}>CLIQUE POUR VALIDER UNE SÉRIE</Text>
            <Text style={[styles.roundBigNumberCircle, { color: '#10B981' }]}>{amrapRounds}</Text>
            <Text style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: fontSize }}>+1 Tour / Série</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.finishAmrapBtn} onPress={() => { setIsAmrapActive(false); setCurrentScreen('home'); }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize + 1 }}>Terminer (Finish) 🏁</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ================= SÉANCES ================= */}
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

          <TouchableOpacity style={styles.openLibraryBtn} onPress={() => { setSelectedExItems([]); setActiveLibraryFilter('Tous'); setCurrentScreen('exerciseLibrary'); }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize }}>+ Sélectionner des exercices 🏋️‍♂️</Text>
          </TouchableOpacity>

          {exercises.filter(ex => selectedWorkout && ex.workoutId === selectedWorkout.id).map((ex) => (
            <View key={ex.id} style={[styles.modernCard, { backgroundColor: cardBg }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.exHeading, { fontSize: fontSize + 2, color: textColor, marginBottom: 2 }]}>{ex.name}</Text>
                  <Text style={{ fontSize: fontSize - 2, color: '#3B82F6', fontWeight: '600' }}>Muscle : {ex.muscle}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteExercise(ex.id)} style={{ padding: 4 }}>
                  <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 14 }}>🗑️ Supprimer</Text>
                </TouchableOpacity>
              </View>

              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowModern}>
                  <Text style={{ width: 22, color: subText, fontWeight: 'bold', fontSize: fontSize - 1 }}>#{index + 1}</Text>
                  
                  {/* REPS CONTROL AVEC BOUTONS +/- */}
                  <View style={styles.inputGroupControl}>
                    <TouchableOpacity style={styles.miniAdjustBtn} onPress={() => adjustSetValue(ex.id, set.id, 'reps', -1)}><Text style={styles.miniBtnText}>-</Text></TouchableOpacity>
                    <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Reps" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.reps} onChangeText={(val) => updateSet(ex.id, set.id, 'reps', val)} />
                    <TouchableOpacity style={styles.miniAdjustBtn} onPress={() => adjustSetValue(ex.id, set.id, 'reps', 1)}><Text style={styles.miniBtnText}>+</Text></TouchableOpacity>
                  </View>

                  {/* WEIGHT CONTROL AVEC BOUTONS +/- 2.5 */}
                  <View style={styles.inputGroupControl}>
                    <TouchableOpacity style={styles.miniAdjustBtn} onPress={() => adjustSetValue(ex.id, set.id, 'weight', -2.5)}><Text style={styles.miniBtnText}>-2.5</Text></TouchableOpacity>
                    <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, color: textColor, fontSize: fontSize }]} placeholder="Poids" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.weight} onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)} />
                    <TouchableOpacity style={styles.miniAdjustBtn} onPress={() => adjustSetValue(ex.id, set.id, 'weight', 2.5)}><Text style={styles.miniBtnText}>+2.5</Text></TouchableOpacity>
                  </View>

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

      {/* ================= BIBLIOTHÈQUE ================= */}
      {currentScreen === 'exerciseLibrary' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backLink} onPress={() => setCurrentScreen('exerciseDetail')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour à la séance</Text>
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Sélectionner les Exercices 📋</Text>

          <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1, marginBottom: 8 }]}>Filtrer par groupe musculaire :</Text>
          <View style={styles.muscleGrid}>
            {MUSCLE_CATEGORIES.map((catName, idx) => {
              const isActive = activeLibraryFilter === catName;
              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.muscleCardItem, isActive && styles.muscleCardItemActive]} 
                  onPress={() => setActiveLibraryFilter(catName)}
                >
                  <Text style={{ fontSize: 20, marginBottom: 4 }}>{catName.includes('Dos') ? '🦇' : catName.includes('Biceps') ? '💪' : catName.includes('Pectoraux') ? '🦍' : catName.includes('Jambes') ? '🦵' : catName.includes('Épaules') || catName.includes('Triceps') ? '🦾' : '🔥'}</Text>
                  <Text style={{ color: isActive ? '#FFF' : textColor, fontWeight: 'bold', fontSize: fontSize - 1, textAlign: 'center' }}>
                    {catName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.modernCard, { backgroundColor: cardBg, marginTop: 15 }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer un exercice sur-mesure</Text>
            <TextInput 
              style={[styles.modernInput, { backgroundColor: inputBg, color: textColor, fontSize: fontSize, marginBottom: 8 }]} 
              placeholder="Nom de l'exercice" 
              placeholderTextColor="#9CA3AF" 
              value={customExName} 
              onChangeText={setCustomExName} 
            />
            
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 2, marginBottom: 4 }]}>Choisir le groupe cible :</Text>
            <View style={styles.muscleGridSmall}>
              {MUSCLE_CATEGORIES.filter(c => c !== 'Tous').map((catName, idx) => {
                const isSelected = selectedMuscleCategory === catName;
                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={[styles.muscleCardSmall, isSelected && styles.muscleCardSmallActive]} 
                    onPress={() => setSelectedMuscleCategory(catName)}
                  >
                    <Text style={{ color: isSelected ? '#FFF' : textColor, fontWeight: 'bold', fontSize: fontSize - 2, textAlign: 'center' }}>
                      {catName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={[styles.primaryBtnFull, { marginTop: 10 }]} onPress={createCustomExercise}>
              <Text style={styles.btnText}>Créer et ajouter</Text>
            </TouchableOpacity>
          </View>

          {baseExercisesList
            .filter(cat => activeLibraryFilter === 'Tous' || cat.group === activeLibraryFilter)
            .map((cat, idx) => (
              <View key={idx} style={[styles.modernCard, { backgroundColor: cardBg }]}>
                <Text style={[styles.categoryTitle, { fontSize: fontSize + 2, color: '#3B82F6' }]}>{cat.group}</Text>
                {cat.exercises.map((exoObj, i) => {
                  const isSelected = selectedExItems.some(item => item.name === exoObj.name);
                  return (
                    <TouchableOpacity key={i} style={[styles.libraryItemMulti, isSelected && { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 8, paddingHorizontal: 6 }]} onPress={() => toggleSelectExercise(exoObj)}>
                      <Text style={{ color: textColor, fontSize: fontSize, fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {isSelected ? '✅ ' : '• '} {exoObj.name}
                      </Text>
                      <Text style={{ color: isSelected ? '#3B82F6' : subText, fontWeight: 'bold', fontSize: fontSize }}>
                        {isSelected ? 'Sélectionné' : 'Sélectionner'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

          {selectedExItems.length > 0 && (
            <TouchableOpacity style={styles.validateSelectionBtn} onPress={addSelectedExercisesToWorkout}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize + 1 }}>
                Valider et ajouter ({selectedExItems.length}) exercice(s) 🚀
              </Text>
            </TouchableOpacity>
          )}
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
    marginBottom: 15,
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
  primaryBtnFull: { backgroundColor: '#3B82F6', padding: 10, borderRadius: 8, alignItems: 'center', width: '100%' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  cardHeaderTitle: { fontWeight: 'bold', marginBottom: 8 },
  historyLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#374151', width: '100%' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  fontBtn: { backgroundColor: '#3B82F6', width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },

  recordBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#10B981' },

  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 5 },
  muscleCardItem: { width: '31%', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 10, borderWidth: 1, borderColor: '#4B5563', marginBottom: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  muscleCardItemActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },

  muscleGridSmall: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 5 },
  muscleCardSmall: { width: '31%', paddingVertical: 8, paddingHorizontal: 2, borderRadius: 8, borderWidth: 1, borderColor: '#4B5563', marginBottom: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  muscleCardSmallActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },

  amrapCircleCard: {
    width: 210,
    height: 210,
    borderRadius: 105,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#3B82F6',
    elevation: 6,
    padding: 10,
  },
  amrapLabelSmall: { fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  timerDigitsCircle: { fontWeight: '900', letterSpacing: 1, marginVertical: 4 },
  controlBtnCircle: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginHorizontal: 4 },
  
  roundCircleCard: {
    width: 210,
    height: 210,
    borderRadius: 105,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#10B981',
    elevation: 6,
    padding: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    marginBottom: 20,
  },
  roundBigNumberCircle: { fontSize: 46, fontWeight: '900', color: '#10B981', marginVertical: 2 },

  finishAmrapBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
  },

  navCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 14, marginBottom: 10, width: '100%', elevation: 2 },
  deleteIconButton: { padding: 6, justifyContent: 'center', alignItems: 'center' },
  exHeading: { fontWeight: 'bold' },
  
  // Style des lignes de séries avec boutons rapides +/-
  setRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, width: '100%' },
  inputGroupControl: { flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 2 },
  setInputModern: { flex: 1, borderWidth: 1, borderColor: '#4B5563', padding: 6, borderRadius: 4, textAlign: 'center', minWidth: 35 },
  miniAdjustBtn: { backgroundColor: '#374151', paddingHorizontal: 6, paddingVertical: 8, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginHorizontal: 1 },
  miniBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },

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
  libraryItemMulti: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  validateSelectionBtn: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 5,
  },
});
