import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const startStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);

    const formatNumber = (number) => (number < 10 ? `0${number}` : `${number}`);

    return `${formatNumber(minutes)}:${formatNumber(seconds)}.${formatNumber(ms)}`;
  };

  const handlePause = () => {
    saveTime();
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const saveTime = async () => {
    try {
      await AsyncStorage.setItem('@stopwatch_last_time', JSON.stringify(time));
    } catch (e) {
      console.error('Error saving time:', e);
    }
  };

  const loadTime = async () => {
    try {
      const savedTime = await AsyncStorage.getItem('@stopwatch_last_time');
      if (savedTime !== null) {
        setTime(parseInt(savedTime, 10));
      }
    } catch (e) {
      console.error('Error loading time:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback onPress={startStopwatch}>
          <View style={styles.button}>
            <Icon name={isRunning ? 'pause' : 'play-arrow'} size={40} color="#fff" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={resetStopwatch}>
          <View style={styles.button}>
            <Icon name="fiber-manual-record" size={40} color="#fff" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50', 
  },
  timer: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ecf0f1', 
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});;

export default App;
