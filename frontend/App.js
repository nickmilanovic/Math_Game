//StAuth10244: I Nicholas Milanovic, 000292701 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

// PLEASE USE THE FOLLOWING COMMANDS TO RUN
// 1. Ensure backend terminal is listening on port 3001
// 2. Open another terminal
// 3. cd frontend
// 4. npm install
// 5. yarn add expo
// 6. npm start

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [num1, setNum1] = useState();
  const [num2, setNum2] = useState();
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/login', {
        username: username,
        password: password
      },
      {headers: {"Content-Type": "application/json"}});
      console.log(response.data);
      setMessage('Login successful');
      setIsAuthenticated(true);
      generateQuestion();
    } catch (error) {
      console.log(error);
      setMessage('Invalid username/password')
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/signup', {
        username: username,
        password: password
      },
      {headers: {"Content-Type": "application/json"}});
      console.log(response.data);
      setMessage(`Welcome ${username}! Please use your credentials to login`);
    } catch (error) {
      console.log(error);
      setMessage('Sorry, that username is taken!');
    }
  };

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    setNum1(num1);
    setNum2(num2);
    setAnswer('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sum = num1 + num2;
    const userAnswer = parseInt(answer);
    const result = userAnswer === sum ? 'correct' : 'incorrect';
  
    if (result === 'correct') {
      try {
        const response = await axios.post('http://localhost:3001/update', {
          username: username,
          result: result,
        });
        console.log(response.data);
        setUsername(username);
        setResult(result);
        setLeaderboard([...leaderboard, {username: username, result:result}]);
      } catch (error) {
        console.log(error);
      }
    } else {
      setResult(result);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMessage('');
    setUsername('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <View style={styles.innerContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.question}>
              {num1} + {num2} ={' '}
            </Text>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={(text) => setAnswer(text)}
              keyboardType="number-pad" />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Answer</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.resultContainer, { backgroundColor: result === 'correct' ? 'green' : 'red' }]}>
            <Text style={styles.resultText}>{result === 'correct' ? 'Correct!' : 'Incorrect!'}</Text>
          </View>
          <table style={{border: '1px solid black'}}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {(leaderboard && leaderboard.length > 0) && leaderboard.map((leader) => (
                <tr key={leader.username}>
                  <td>{leader.username}</td>
                  <td>{leader.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
            <TouchableOpacity style={styles.button} onPress={generateQuestion}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create User</Text>
          </TouchableOpacity>
          {message && (
            <Text style={[styles.message, message.includes('Welcome') || message.includes('successful') ? styles.success : styles.error]}>
              {message}
            </Text>
          )}
          </View>
        )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
      innerContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 20,
      alignItems: 'center',
    },
      input: {
      height: 40,
      width: 200,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
    },
      button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
      borderRadius: 5,
      margin: 5,
    },
      buttonText: {
      fontWeight: 'bold',
    },
      message: {
      marginTop: 10,
      textAlign: 'center',
      padding: 5,
      borderRadius: 5,
    },
      success: {
      backgroundColor: 'green',
      color: 'white',
    },
      error: {
      backgroundColor: 'red',
      color: 'white',
    },
});
export default App;