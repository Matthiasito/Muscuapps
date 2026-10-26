import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';

const INITIAL_BASE_EXERCISES = [
  { group: 'Dos 🦇', exercises: [] },
  { group: 'Biceps 💪', exercises: [] },
  { group: 'Pectoraux 🦍', exercises: [] },
  { group: 'Jambes 🦵', exercises: [] },
  { group: 'Épaules 🦾', exercises: [] },
  { group: 'Triceps 🦾', exercises: [] },
];

const MUSCLE_CATEGORIES = ['Tous', 'Dos 🦇', 'Biceps 💪', 'Pectoraux 🦍', 'Jambes 🦵', 'Épaules 🦾', 'Triceps 🦾'];

const HEIGHT_OPTIONS = [];
for (let cm = 140; cm <= 200; cm++) {
  const meters = Math.floor(cm / 100);
  const centimeters = cm % 100;
  HEIGHT_OPTIONS.push(`${meters}m${centimeters < 10 ? '0' : ''}${centimeters}`);
}

const POLYARTICULAR_EXERCISES = [
  'Développé couché',
  'Développé incliné',
  'Squat',
  'Soulevé de terre',
  'Traction pronation',
  'Développé militaire'
];

// Composant universel de bouton avec animation "Bounce" sur tous les clics
function BounceButton({ onPress, style, children, activeOpacity = 0.9 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.08,
      useNativeDriver: true,
      speed: 35,
      bounciness: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(13);

  const [currentWeight, setCurrentWeight] = useState('75.0');
  const [gender, setGender] = useState('Homme');
  const [height, setHeight] = useState('1m78');
  const [weightHistory, setWeightHistory] = useState([]);

  const [cycles, setCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);

  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [exercises, setExercises] = useState([]);
  
  const [baseExercisesList, setBaseExercisesList] = useState(INITIAL_BASE_EXERCISES);
  const [selectedExItems, setSelectedExItems] = useState([]);
  
  const [customExName, setCustomExName] = useState('');
  const [selectedMuscleCategory, setSelectedMuscleCategory] = useState('Pectoraux 🦍');
  const [activeLibraryFilter, setActiveLibraryFilter] = useState('Tous');

  const [globalHistory, setGlobalHistory] = useState([]);
  const [maxiRecords, setMaxiRecords] = useState({});
  const [maxiRecordsHistory, setMaxiRecordsHistory] = useState([]);

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
      const savedMaxiRecords = localStorage.getItem('fit_maxi_records');
      const savedMaxiHist = localStorage.getItem('fit_maxi_records_hist');
      const savedDarkMode = localStorage.getItem('fit_dark_mode');
      const savedProfileGender = localStorage.getItem('fit_gender');
      const savedProfileHeight = localStorage.getItem('fit_height');
      const savedCycles = localStorage.getItem('fit_cycles');
      
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedExercises) setExercises(JSON.parse(savedExercises));
      if (savedWeight) setWeightHistory(JSON.parse(savedWeight));
      if (savedGlobalHist) setGlobalHistory(JSON.parse(savedGlobalHist));
      if (savedBaseEx) setBaseExercisesList(JSON.parse(savedBaseEx));
      if (savedMaxiRecords) setMaxiRecords(JSON.parse(savedMaxiRecords));
      if (savedMaxiHist) setMaxiRecordsHistory(JSON.parse(savedMaxiHist));
      if (savedDarkMode !== null) setIsDarkMode(JSON.parse(savedDarkMode));
      if (savedProfileGender) setGender(savedProfileGender);
      if (savedProfileHeight) setHeight(savedProfileHeight);
      if (savedCycles) setCycles(JSON.parse(savedCycles));
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
      localStorage.setItem('fit_maxi_records', JSON.stringify(maxiRecords));
      localStorage.setItem('fit_maxi_records_hist', JSON.stringify(maxiRecordsHistory));
      localStorage.setItem('fit_dark_mode', JSON.stringify(isDarkMode));
      localStorage.setItem('fit_gender', gender);
      localStorage.setItem('fit_height', height);
      localStorage.setItem('fit_cycles', JSON.stringify(cycles));
    } catch (e) {
      console.log('Erreur sauvegarde stockage', e);
    }
  }, [workouts, exercises, weightHistory, globalHistory, baseExercisesList, maxiRecords, maxiRecordsHistory, isDarkMode, gender, height, cycles]);

  const addNewCyclePrompt = () => {
    const cycleName = prompt("Nom du nouveau cycle d'entraînement :");
    if (cycleName && cycleName.trim()) {
      setCycles([...cycles, { id: Date.now().toString(), name: cycleName.trim() }]);
    }
  };

  const addNewWorkoutPrompt = () => {
    if (!selectedCycle) return;
    const workoutName = prompt("Nom de la nouvelle séance :");
    if (workoutName && workoutName.trim()) {
      setWorkouts([
        ...workouts,
        { id: Date.now().toString(), cycleId: selectedCycle.id, name: workoutName.trim() }
      ]);
    }
  };

  const deleteCycle = (cycleId) => {
    setCycles(cycles.filter(c => c.id !== cycleId));
    const workoutsToRemove = workouts.filter(w => w.cycleId === cycleId);
    const workoutIds = workoutsToRemove.map(w => w.id);
    setWorkouts(workouts.filter(w => w.cycleId !== cycleId));
    setExercises(exercises.filter(e => !workoutIds.includes(e.workoutId)));
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
    setExercises(exercises.filter(e => e.workoutId !== workoutId));
  };

  const deleteExercise = (exId) => {
    setExercises(exercises.filter(e => e.id !== exId));
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

  const adjustSetValue = (exId, setId, field, amount) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              const currentVal = parseFloat(s[field]) || 0;
              const newVal = Math.max(0, currentVal + amount);
              return { ...s, [field]: field === 'weight' ? newVal.toFixed(1) : newVal.toString() };
            }
            return s;
          })
        };
      }
      return ex;
    }));
  };

  const updateMaxRecordPrompt = (exName) => {
    const val = prompt(`Entrez votre record (1 Rep) pour ${exName} (ex: 100 kg) :`);
    if (val && val.trim()) {
      const today = new Date().toLocaleDateString('fr-FR');
      setMaxiRecords({ ...maxiRecords, [exName]: val.trim() });
      setMaxiRecordsHistory([
        { id: Date.now().toString(), date: today, exerciseName: exName, record: val.trim() },
        ...maxiRecordsHistory
      ]);
    }
  };

  const finishWorkout = () => {
    if (!selectedWorkout) return;
    const today = new Date().toLocaleDateString('fr-FR');
    let summaryParts = [];

    const updatedExercises = exercises.map(ex => {
      if (ex.workoutId === selectedWorkout.id) {
        const firstSet = ex.sets[0] ? ex.sets[0] : { reps: '0', weight: '0' };
        const setDetails = `${firstSet.reps || '0'} reps × ${firstSet.weight || '0'} kg`;
        
        summaryParts.push(`${ex.name} (${ex.muscle}) : ${setDetails}`);

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
  const cardBorder = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ================= ACCUEIL ================= */}
      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topBar}>
            <BounceButton style={[styles.pillButton, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => setCurrentScreen('settings')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>⚙️ Réglages</Text>
            </BounceButton>
            <BounceButton style={[styles.pillButton, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => setCurrentScreen('globalHistory')}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '600' }}>📊 Historique</Text>
            </BounceButton>
          </View>

          <View style={styles.heroSection}>
            <BounceButton onPress={() => {}}>
              <Text style={[styles.appTitle, { fontSize: fontSize + 8, color: textColor }]}>FitTracker ⚡</Text>
            </BounceButton>
            <Text style={[styles.appSubtitle, { fontSize: fontSize - 2, color: subText }]}>Données sauvegardées automatiquement</Text>

            <BounceButton style={[styles.pillButtonLarge, { backgroundColor: cardBg, borderColor: cardBorder, marginBottom: 15 }]} onPress={() => setCurrentScreen('profile')}>
              <Text style={{ fontSize: fontSize + 1, color: textColor, fontWeight: '600' }}>👤 Mon Profil & Poids</Text>
            </BounceButton>

            {cycles.length > 0 && (
              <View style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder, marginBottom: 15 }]}>
                <Text style={[styles.cardHeaderTitle, { fontSize: fontSize + 1, color: textColor, marginBottom: 8 }]}>🔄 Mes Cycles d'Entraînement</Text>
                {cycles.map((c) => (
                  <View key={c.id} style={[styles.cycleItemRow, { borderTopColor: cardBorder }]}>
                    <BounceButton 
                      style={{ flex: 1, paddingVertical: 4 }} 
                      onPress={() => {
                        setSelectedCycle(c);
                        setCurrentScreen('workoutList');
                      }}
                    >
                      <Text style={{ color: textColor, fontSize: fontSize, fontWeight: 'bold' }}>👉 {c.name}</Text>
                    </BounceButton>
                    <BounceButton style={{ padding: 4 }} onPress={() => deleteCycle(c.id)}>
                      <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 14 }}>🗑️</Text>
                    </BounceButton>
                  </View>
                ))}
              </View>
            )}

            <BounceButton style={[styles.amrapGlowBtn, styles.glowEffectBlue]} onPress={() => setCurrentScreen('amrap')}>
              <Text style={styles.amrapEmoji}>⏱️</Text>
              <Text style={styles.amrapText}>MODE AMRAP</Text>
            </BounceButton>
          </View>

          <View style={styles.bottomFixedActionRow}>
            <BounceButton style={[styles.bottomCircleBtnLeft, styles.glowEffectBlue]} onPress={() => setCurrentScreen('maxiReps')}>
              <Text style={{ fontSize: 24 }}>🏆</Text>
            </BounceButton>
            <BounceButton style={[styles.bottomCircleBtnRight, styles.glowEffectGreen]} onPress={addNewCyclePrompt}>
              <Text style={{ fontSize: 28, color: '#FFF', fontWeight: 'bold' }}>+</Text>
            </BounceButton>
          </View>
        </ScrollView>
      )}

      {/* ================= AMRAP ================= */}
      {currentScreen === 'amrap' && (
        <ScrollView contentContainerStyle={[styles.scrollContainer, { alignItems: 'center' }]}>
          <BounceButton style={[styles.backLink, { alignSelf: 'flex-start' }]} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </BounceButton>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor, alignSelf: 'flex-start' }]}>Chrono AMRAP</Text>

          <BounceButton 
            style={[styles.amrapMegaCircle, { backgroundColor: cardBg, borderColor: '#3B82F6' }, styles.glowEffectBlue]} 
            onPress={() => {
              if (isAmrapActive) {
                setAmrapRounds(amrapRounds + 1);
              }
            }}
          >
            <Text style={[styles.amrapLabelSmall, { color: subText, fontSize: fontSize - 2 }]}>
              {isAmrapActive ? '👆 CLIQUE ICI POUR VALIDER UN TOUR' : '⏱️ CLIQUE SUR START POUR LANCER'}
            </Text>
            <Text style={[styles.timerDigitsCircle, { fontSize: fontSize + 16, color: textColor }]}>
              {Math.floor(amrapSeconds / 60)}:{amrapSeconds % 60 < 10 ? '0' : ''}{amrapSeconds % 60}
            </Text>
            <Text style={[styles.roundBigNumberCircle, { color: '#10B981', fontSize: fontSize + 24 }]}>
              {amrapRounds} <Text style={{ fontSize: fontSize, color: subText }}>tours</Text>
            </Text>
          </BounceButton>

          <View style={styles.rowInlineSpace}>
            <BounceButton 
              style={[styles.controlBtnCircleLarge, { backgroundColor: isAmrapActive ? '#EF4444' : '#10B981' }]} 
              onPress={() => setIsAmrapActive(!isAmrapActive)}
            >
              <Text style={styles.btnTextLarge}>{isAmrapActive ? 'Pause ⏸️' : 'Start 🚀'}</Text>
            </BounceButton>
            <BounceButton 
              style={[styles.controlBtnCircleLarge, { backgroundColor: '#6B7280' }]} 
              onPress={() => { setIsAmrapActive(false); setAmrapSeconds(0); setAmrapRounds(0); }}
            >
              <Text style={styles.btnTextLarge}>Reset 🔄</Text>
            </BounceButton>
          </View>

          <BounceButton style={[styles.finishAmrapBtn, { marginTop: 25 }]} onPress={() => { setIsAmrapActive(false); setCurrentScreen('home'); }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize + 1 }}>Terminer & Enregistrer 🏁</Text>
          </BounceButton>
        </ScrollView>
      )}

      {/* ================= MAXI REPS & HISTORIQUE DES MAXI ================= */}
      {currentScreen === 'maxiReps' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </BounceButton>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor, marginBottom: 0 }]}>🏆 Records (1 Rep)</Text>
            {Object.keys(maxiRecords).length > 0 && (
              <BounceButton onPress={() => setMaxiRecords({})} style={{ padding: 4 }}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: fontSize - 1 }}>🗑️ Tout effacer</Text>
              </BounceButton>
            )}
          </View>
          <Text style={{ color: subText, fontSize: fontSize - 1, marginBottom: 15 }}>Note et mets à jour tes records de force en 1 rep.</Text>

          {POLYARTICULAR_EXERCISES.map((exName, idx) => {
            const currentRecord = maxiRecords[exName] || 'Aucun record noté';

            return (
              <View key={idx} style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontWeight: 'bold', color: textColor, fontSize: fontSize + 1, marginBottom: 2 }}>{exName}</Text>
                    <Text style={{ color: '#3B82F6', fontSize: fontSize - 2, fontWeight: '600' }}>🔥 Record 1 Rep</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.recordBadge, { marginRight: 8 }]}>
                      <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: fontSize }}>{currentRecord}</Text>
                    </View>
                    <BounceButton style={styles.primaryBtn} onPress={() => updateMaxRecordPrompt(exName)}>
                      <Text style={styles.btnText}>Modifier</Text>
                    </BounceButton>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 12 }}>
            <Text style={[styles.screenTitle, { fontSize: fontSize + 2, color: textColor, marginBottom: 0 }]}>📜 Historique des Maxi</Text>
            {maxiRecordsHistory.length > 0 && (
              <BounceButton onPress={() => setMaxiRecordsHistory([])} style={{ padding: 4 }}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: fontSize - 1 }}>🗑️ Vider l'historique</Text>
              </BounceButton>
            )}
          </View>
          {maxiRecordsHistory.length === 0 ? (
            <Text style={{ color: subText, textAlign: 'center', marginTop: 10 }}>Aucun historique de maxi pour le moment.</Text>
          ) : (
            maxiRecordsHistory.map((item) => (
              <View key={item.id} style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder, padding: 10 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontWeight: 'bold', color: '#3B82F6', fontSize: fontSize }}>{item.exerciseName}</Text>
                  <Text style={{ color: subText, fontSize: fontSize - 1 }}>{item.date}</Text>
                </View>
                <Text style={{ color: textColor, fontSize: fontSize - 1 }}>Nouveau record : <Text style={{ fontWeight: 'bold', color: '#10B981' }}>{item.record}</Text></Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* ================= HISTORIQUE GLOBAL ================= */}
      {currentScreen === 'globalHistory' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </BounceButton>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor, marginBottom: 0 }]}>Historique Global</Text>
            {globalHistory.length > 0 && (
              <BounceButton onPress={() => setGlobalHistory([])} style={{ padding: 4 }}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: fontSize - 1 }}>🗑️ Tout supprimer</Text>
              </BounceButton>
            )}
          </View>

          {globalHistory.length === 0 ? (
            <Text style={{ color: subText, textAlign: 'center', marginTop: 20 }}>Aucun historique pour le moment.</Text>
          ) : (
            globalHistory.map((item) => (
              <View key={item.id} style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontWeight: 'bold', color: '#10B981', fontSize: fontSize }}>{item.workoutName}</Text>
                  <Text style={{ color: subText, fontSize: fontSize - 1 }}>{item.date}</Text>
                </View>
                <Text style={{ color: textColor, fontSize: fontSize - 1 }}>{item.summary}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* ================= PROFIL ================= */}
      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </BounceButton>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Mon Profil & Poids</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Poids actuel (kg)</Text>
            <View style={styles.rowInline}>
              <TextInput 
                style={[styles.modernInput, { backgroundColor: inputBg, borderColor: cardBorder, color: textColor, fontSize: fontSize, flex: 1 }]} 
                value={currentWeight} 
                onChangeText={setCurrentWeight} 
                keyboardType="numbers-and-punctuation" 
                placeholder="64.8"
                placeholderTextColor="#9CA3AF"
              />
              <BounceButton style={styles.primaryBtn} onPress={addWeightRecord}>
                <Text style={styles.btnText}>Sauvegarder</Text>
              </BounceButton>
            </View>

            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1, marginTop: 15 }]}>Sexe</Text>
            <View style={styles.rowInline}>
              {['Homme', 'Femme'].map((g) => (
                <BounceButton 
                  key={g} 
                  style={[styles.genderBtn, { borderColor: cardBorder }, gender === g && styles.genderBtnActive]} 
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderBtnText, gender === g && { color: '#FFF' }]}>
                    {g === 'Homme' ? '👨 Homme' : '👩 Femme'}
                  </Text>
                </BounceButton>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1, marginTop: 15 }]}>
              Taille (Sélection précise : <Text style={{ color: '#10B981', fontWeight: 'bold' }}>{height}</Text>)
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.heightScrollRow}>
              {HEIGHT_OPTIONS.map((h) => {
                const isSelected = height === h;
                return (
                  <BounceButton 
                    key={h} 
                    style={[styles.heightChipPrecise, { borderColor: cardBorder }, isSelected && styles.heightChipPreciseActive]} 
                    onPress={() => setHeight(h)}
                  >
                    <Text style={[styles.heightChipPreciseText, isSelected && { color: '#FFF', fontWeight: 'bold' }]}>
                      {h}
                    </Text>
                  </BounceButton>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.cardHeaderTitle, { fontSize: fontSize + 1, color: textColor, marginBottom: 0 }]}>📈 Historique du Poids</Text>
              {weightHistory.length > 0 && (
                <BounceButton onPress={() => setWeightHistory([])}>
                  <Text style={{ color: '#EF4444', fontSize: fontSize - 2, fontWeight: 'bold' }}>Effacer</Text>
                </BounceButton>
              )}
            </View>
            {weightHistory.map((item) => (
              <View key={item.id} style={[styles.historyLine, { borderBottomColor: cardBorder }]}>
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
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </BounceButton>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Réglages</Text>

          <View style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingRow}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Mode Sombre 🌙</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
            <View style={[styles.settingRow, { marginTop: 15 }]}>
              <Text style={{ fontSize: fontSize, color: textColor, fontWeight: '500' }}>Taille police ({fontSize}px)</Text>
              <View style={styles.rowInline}>
                <BounceButton style={styles.fontBtn} onPress={() => setFontSize(Math.max(10, fontSize - 2))}><Text style={styles.btnText}>-</Text></BounceButton>
                <BounceButton style={styles.fontBtn} onPress={() => setFontSize(Math.min(18, fontSize + 2))}><Text style={styles.btnText}>+</Text></BounceButton>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ================= SÉANCES (FILTRÉES PAR CYCLE) ================= */}
      {currentScreen === 'workoutList' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('home')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Accueil</Text>
          </BounceButton>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>
            {selectedCycle ? `Séances (${selectedCycle.name})` : 'Mes Séances'}
          </Text>

          {workouts.filter(w => selectedCycle && w.cycleId === selectedCycle.id).length === 0 ? (
            <Text style={{ color: subText, textAlign: 'center', marginVertical: 20 }}>Aucune séance pour ce cycle. Crée-en une avec le bouton + en bas !</Text>
          ) : (
            workouts
              .filter(w => selectedCycle && w.cycleId === selectedCycle.id)
              .map((w) => (
                <View key={w.id} style={[styles.navCardItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <BounceButton style={{ flex: 1 }} onPress={() => { setSelectedWorkout(w); setCurrentScreen('exerciseDetail'); }}>
                    <Text style={{ fontSize: fontSize + 1, fontWeight: 'bold', color: textColor }}>📋 {w.name}</Text>
                  </BounceButton>
                  <BounceButton onPress={() => deleteWorkout(w.id)} style={styles.deleteIconButton}>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>🗑️</Text>
                  </BounceButton>
                </View>
              ))
          )}

          <View style={styles.bottomFixedActionSingle}>
            <BounceButton style={[styles.bottomCircleBtnRight, styles.glowEffectGreen]} onPress={addNewWorkoutPrompt}>
              <Text style={{ fontSize: 28, color: '#FFF', fontWeight: 'bold' }}>+</Text>
            </BounceButton>
          </View>
        </ScrollView>
      )}

      {/* ================= EXERCICES DE LA SÉANCE ================= */}
      {currentScreen === 'exerciseDetail' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('workoutList')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour aux séances</Text>
          </BounceButton>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>{selectedWorkout ? selectedWorkout.name : 'Séance'}</Text>

          <BounceButton style={[styles.openLibraryBtn, styles.glowEffectBlue]} onPress={() => { setSelectedExItems([]); setActiveLibraryFilter('Tous'); setCurrentScreen('exerciseLibrary'); }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize }}>+ Sélectionner des exercices 🏋️‍♂️</Text>
          </BounceButton>

          {exercises.filter(ex => selectedWorkout && ex.workoutId === selectedWorkout.id).map((ex) => (
            <View key={ex.id} style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.exHeading, { fontSize: fontSize + 2, color: textColor, marginBottom: 2 }]}>{ex.name}</Text>
                  <Text style={{ fontSize: fontSize - 2, color: '#3B82F6', fontWeight: '600' }}>Muscle : {ex.muscle}</Text>
                </View>
                <BounceButton onPress={() => deleteExercise(ex.id)} style={{ padding: 4 }}>
                  <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 14 }}>🗑️ Supprimer</Text>
                </BounceButton>
              </View>

              {ex.sets.map((set, index) => (
                <View key={set.id} style={styles.setRowModern}>
                  <Text style={{ width: 22, color: subText, fontWeight: 'bold', fontSize: fontSize - 1 }}>#{index + 1}</Text>
                  
                  <View style={styles.inputGroupControl}>
                    <BounceButton style={[styles.miniAdjustBtn, { backgroundColor: inputBg }]} onPress={() => adjustSetValue(ex.id, set.id, 'reps', -1)}>
                      <Text style={[styles.miniBtnText, { color: textColor }]}>-</Text>
                    </BounceButton>
                    <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, borderColor: cardBorder, color: textColor, fontSize: fontSize }]} placeholder="Reps" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={set.reps} onChangeText={(val) => updateSet(ex.id, set.id, 'reps', val)} />
                    <BounceButton style={[styles.miniAdjustBtn, { backgroundColor: inputBg }]} onPress={() => adjustSetValue(ex.id, set.id, 'reps', 1)}>
                      <Text style={[styles.miniBtnText, { color: textColor }]}>+</Text>
                    </BounceButton>
                  </View>

                  <View style={styles.inputGroupControl}>
                    <BounceButton style={[styles.miniAdjustBtn, { backgroundColor: inputBg }]} onPress={() => adjustSetValue(ex.id, set.id, 'weight', -2.5)}>
                      <Text style={[styles.miniBtnText, { color: textColor }]}>-2.5</Text>
                    </BounceButton>
                    <TextInput style={[styles.setInputModern, { backgroundColor: inputBg, borderColor: cardBorder, color: textColor, fontSize: fontSize }]} placeholder="Poids" placeholderTextColor="#9CA3AF" keyboardType="numbers-and-punctuation" value={set.weight} onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)} />
                    <BounceButton style={[styles.miniAdjustBtn, { backgroundColor: inputBg }]} onPress={() => adjustSetValue(ex.id, set.id, 'weight', 2.5)}>
                      <Text style={[styles.miniBtnText, { color: textColor }]}>+2.5</Text>
                    </BounceButton>
                  </View>

                  <BounceButton style={styles.deleteSetIcon} onPress={() => removeSet(ex.id, set.id)}>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>✕</Text>
                  </BounceButton>
                </View>
              ))}

              <BounceButton style={styles.addSetModernBtn} onPress={() => addSet(ex.id)}>
                <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: fontSize - 1 }}>+ Ajouter une série</Text>
              </BounceButton>

              {ex.history && ex.history.length > 0 && (
                <View style={[styles.historyContainer, { borderTopColor: cardBorder }]}>
                  <Text style={{ fontSize: fontSize - 2, fontWeight: '600', color: subText, marginBottom: 2 }}>📜 Séance précédente :</Text>
                  <Text style={{ fontSize: fontSize - 2, color: subText }}>• {ex.history[0].date} : {ex.history[0].summary}</Text>
                </View>
              )}
            </View>
          ))}

          <BounceButton style={[styles.finishWorkoutBtn, styles.glowEffectGreen]} onPress={finishWorkout}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize + 1 }}>Terminer & Enregistrer la séance 🏁</Text>
          </BounceButton>
        </ScrollView>
      )}

      {/* ================= BIBLIOTHÈQUE ================= */}
      {currentScreen === 'exerciseLibrary' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BounceButton style={styles.backLink} onPress={() => setCurrentScreen('exerciseDetail')}>
            <Text style={{ fontSize: fontSize, color: '#3B82F6', fontWeight: '600' }}>← Retour à la séance</Text>
          </BounceButton>
          <Text style={[styles.screenTitle, { fontSize: fontSize + 5, color: textColor }]}>Sélectionner les Exercices 📋</Text>

          <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1, marginBottom: 8 }]}>Filtrer par groupe musculaire :</Text>
          <View style={styles.muscleGrid}>
            {MUSCLE_CATEGORIES.map((catName, idx) => {
              const isActive = activeLibraryFilter === catName;
              return (
                <BounceButton 
                  key={idx} 
                  style={[styles.muscleCardItem, { borderColor: cardBorder }, isActive && styles.muscleCardItemActive]} 
                  onPress={() => setActiveLibraryFilter(catName)}
                >
                  <Text style={{ fontSize: 20, marginBottom: 4 }}>{catName.includes('Dos') ? '🦇' : catName.includes('Biceps') ? '💪' : catName.includes('Pectoraux') ? '🦍' : catName.includes('Jambes') ? '🦵' : catName.includes('Épaules') || catName.includes('Triceps') ? '🦾' : '🔥'}</Text>
                  <Text style={{ color: isActive ? '#FFF' : textColor, fontWeight: 'bold', fontSize: fontSize - 1, textAlign: 'center' }}>
                    {catName}
                  </Text>
                </BounceButton>
              );
            })}
          </View>

          <View style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder, marginTop: 15 }]}>
            <Text style={[styles.inputLabel, { color: subText, fontSize: fontSize - 1 }]}>Créer un exercice sur-mesure</Text>
            <TextInput 
              style={[styles.modernInput, { backgroundColor: inputBg, borderColor: cardBorder, color: textColor, fontSize: fontSize, marginBottom: 8 }]} 
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
                  <BounceButton 
                    key={idx} 
                    style={[styles.muscleCardSmall, { borderColor: cardBorder }, isSelected && styles.muscleCardSmallActive]} 
                    onPress={() => setSelectedMuscleCategory(catName)}
                  >
                    <Text style={{ color: isSelected ? '#FFF' : textColor, fontWeight: 'bold', fontSize: fontSize - 2, textAlign: 'center' }}>
                      {catName}
                    </Text>
                  </BounceButton>
                );
              })}
            </View>

            <BounceButton style={[styles.primaryBtnFull, { marginTop: 10 }]} onPress={createCustomExercise}>
              <Text style={styles.btnText}>Créer et ajouter</Text>
            </BounceButton>
          </View>

          {baseExercisesList
            .filter(cat => activeLibraryFilter === 'Tous' || cat.group === activeLibraryFilter)
            .map((cat, idx) => (
              <View key={idx} style={[styles.modernCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <Text style={[styles.categoryTitle, { fontSize: fontSize + 2, color: '#3B82F6' }]}>{cat.group}</Text>
                {cat.exercises.length === 0 ? (
                  <Text style={{ color: subText, fontSize: fontSize - 1, fontStyle: 'italic', paddingVertical: 4 }}>Aucun exercice créé dans cette catégorie.</Text>
                ) : (
                  cat.exercises.map((exoObj, i) => {
                    const isSelected = selectedExItems.some(item => item.name === exoObj.name);
                    return (
                      <BounceButton key={i} style={[styles.libraryItemMulti, { borderBottomColor: cardBorder }, isSelected && { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: 8, paddingHorizontal: 6 }]} onPress={() => toggleSelectExercise(exoObj)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Text style={{ color: textColor, fontSize: fontSize, fontWeight: isSelected ? 'bold' : 'normal' }}>
                            {isSelected ? '✅ ' : '• '} {exoObj.name}
                          </Text>
                          <Text style={{ color: isSelected ? '#3B82F6' : subText, fontWeight: 'bold', fontSize: fontSize }}>
                            {isSelected ? 'Sélectionné' : 'Sélectionner'}
                          </Text>
                        </View>
                      </BounceButton>
                    );
                  })
                )}
              </View>
            ))}

          {selectedExItems.length > 0 && (
            <BounceButton style={[styles.validateSelectionBtn, styles.glowEffectBlue]} onPress={addSelectedExercisesToWorkout}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: fontSize + 1 }}>
                Valider et ajouter ({selectedExItems.length}) exercice(s) 🚀
              </Text>
            </BounceButton>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  scrollContainer: { padding: 14, paddingBottom: 150, width: '100%', boxSizing: 'border-box' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, width: '100%' },
  
  pillButton: { 
    paddingVertical: 9, 
    paddingHorizontal: 16, 
    borderRadius: 18, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  pillButtonLarge: { 
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, 
    width: '100%', 
    alignItems: 'center' 
  },
  heroSection: { alignItems: 'center', marginTop: 5, width: '100%' },
  appTitle: { fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  appSubtitle: { textAlign: 'center', marginBottom: 20, marginTop: 2 },
  
  glowEffectBlue: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  glowEffectGreen: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },

  amrapGlowBtn: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  amrapEmoji: { fontSize: 32 },
  amrapText: { color: '#FFF', fontWeight: 'bold', fontSize: 11, marginTop: 2, letterSpacing: 1 },

  amrapMegaCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    padding: 15,
  },
  controlBtnCircleLarge: { 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 12, 
    marginHorizontal: 6, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  btnTextLarge: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  
  bottomFixedActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
    width: '100%',
  },
  bottomFixedActionSingle: {
    alignItems: 'flex-end',
    marginTop: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  bottomCircleBtnLeft: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCircleBtnRight: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backLink: { marginBottom: 10 },
  screenTitle: { fontWeight: '800', marginBottom: 12, letterSpacing: 0.3 },
  modernCard: { 
    padding: 14, 
    borderRadius: 16, 
    marginBottom: 14, 
    width: '100%', 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  inputLabel: { marginBottom: 4, fontWeight: '600' },
  rowInline: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  rowInlineSpace: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10 },
  modernInput: { borderWidth: 1, padding: 10, borderRadius: 10, width: '100%' },
  primaryBtn: { backgroundColor: '#3B82F6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, justifyContent: 'center', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 2 },
  primaryBtnFull: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 10, alignItems: 'center', width: '100%', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 2 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  cardHeaderTitle: { fontWeight: 'bold', marginBottom: 8 },
  historyLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, width: '100%' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  fontBtn: { backgroundColor: '#3B82F6', width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },

  recordBadge: { backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#10B981' },

  genderBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, borderWidth: 1, alignItems: 'center', marginHorizontal: 4, backgroundColor: 'transparent' },
  genderBtnActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  genderBtnText: { color: '#9CA3AF', fontWeight: 'bold' },
  
  heightScrollRow: { flexDirection: 'row', marginTop: 6, marginBottom: 5 },
  heightChipPrecise: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, marginRight: 6, backgroundColor: 'transparent', minWidth: 55, alignItems: 'center' },
  heightChipPreciseActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  heightChipPreciseText: { color: '#9CA3AF', fontSize: 12, fontWeight: '600' },

  cycleItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1 },

  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 5 },
  muscleCardItem: { width: '31%', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 12, borderWidth: 1, marginBottom: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  muscleCardItemActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },

  muscleGridSmall: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 5 },
  muscleCardSmall: { width: '31%', paddingVertical: 8, paddingHorizontal: 2, borderRadius: 8, borderWidth: 1, marginBottom: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  muscleCardSmallActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },

  amrapLabelSmall: { fontWeight: '700', letterSpacing: 1, marginBottom: 4, textAlign: 'center' },
  timerDigitsCircle: { fontWeight: '900', letterSpacing: 1, marginVertical: 4, textAlign: 'center' },
  roundBigNumberCircle: { fontWeight: '900', marginVertical: 2, textAlign: 'center' },

  finishAmrapBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },

  navCardItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    width: '100%', 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteIconButton: { padding: 6, justifyContent: 'center', alignItems: 'center' },
  exHeading: { fontWeight: 'bold' },
  
  setRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' },
  inputGroupControl: { flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 2 },
  setInputModern: { flex: 1, borderWidth: 1, padding: 8, borderRadius: 8, textAlign: 'center', minWidth: 40 },
  miniAdjustBtn: { paddingHorizontal: 8, paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginHorizontal: 2 },
  miniBtnText: { fontWeight: 'bold', fontSize: 11 },

  deleteSetIcon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  addSetModernBtn: { marginTop: 4, padding: 10, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.12)', alignItems: 'center', width: '100%' },
  historyContainer: { marginTop: 10, paddingTop: 6, borderTopWidth: 1, width: '100%' },
  finishWorkoutBtn: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  openLibraryBtn: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryTitle: { fontWeight: 'bold', marginBottom: 10 },
  libraryItemMulti: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  validateSelectionBtn: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 20,
  },
});
