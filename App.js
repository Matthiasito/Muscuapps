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
} from 'react-native';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = () => {
    if (!exercise || !weight || !reps) return;
    const newEntry = {
      id: Date.now().toString(),
      exercise,
      weight,
      reps,
      date: new Date().toLocaleDateString('fr-FR'),
    };
    setLogs([newEntry, ...logs]);
    setExercise('');
    setWeight('');
    setReps('');
  };

  const theme = isDarkMode ? styles.darkTheme : styles.lightTheme;
  const textTheme = isDarkMode ? styles.darkText : styles.lightText;
  const cardTheme = isDarkMode ? styles.darkCard : styles.lightCard;

  return (
    <SafeAreaView style={[styles.container, theme]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, textTheme]}>Carnet de Muscu 🏋️‍♂️</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, textTheme]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={(val) => setIsDarkMode(val)}
          />
        </View>
      </View>

      <View style={[styles.card, cardTheme]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Exercice (ex: Développé couché)"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          value={exercise}
          onChangeText={setExercise}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, isDarkMode && styles.darkInput]}
            placeholder="Poids (kg)"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput
            style={[styles.input, styles.halfInput, isDarkMode && styles.darkInput]}
            placeholder="Répétitions"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={addLog}>
          <Text style={styles.buttonText}>Enregistrer la série</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.logCard, cardTheme]}>
            <View>
              <Text style={[styles.logExercise, textTheme]}>{item.exercise}</Text>
              <Text style={styles.logSubText}>{item.date}</Text>
            </View>
            <Text style={[styles.logDetails, textTheme]}>
              {item.weight} kg × {item.reps} reps
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, textTheme]}>
            Aucune série enregistrée aujourd'hui.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  lightTheme: { backgroundColor: '#F5F5F7' },
  darkTheme: { backgroundColor: '#121212' },
  lightText: { color: '#000000' },
  darkText: { color: '#FFFFFF' },
  lightCard: { backgroundColor: '#FFFFFF' },
  darkCard: { backgroundColor: '#1E1E1E' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { fontSize: 18, marginRight: 8 },
  card: { padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: '#000',
  },
  darkInput: { borderColor: '#444', color: '#FFF', backgroundColor: '#2A2A2A' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  logCard: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logExercise: { fontSize: 16, fontWeight: '600' },
  logSubText: { color: '#888', fontSize: 12, marginTop: 2 },
  logDetails: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#888' },
});
