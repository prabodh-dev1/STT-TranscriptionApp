import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './src/screens/MainScreen';
import ConversationHistoryScreen from './src/screens/ConversationHistoryScreen';
import { ConversationProvider } from './src/context/ConversationContext';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ title: 'Voice Transcription' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <ConversationProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
        <SafeAreaView style={styles.container}>
          <Drawer.Navigator
            screenOptions={{
              drawerStyle: {
                backgroundColor: '#f8fafc',
                width: 280,
              },
              drawerActiveTintColor: '#2563eb',
              drawerInactiveTintColor: '#64748b',
              headerShown: false,
            }}>
            <Drawer.Screen 
              name="Home" 
              component={MainStack}
              options={{
                drawerLabel: 'Voice Transcription',
              }}
            />
            <Drawer.Screen 
              name="History" 
              component={ConversationHistoryScreen}
              options={{
                drawerLabel: 'Conversation History',
              }}
            />
          </Drawer.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </ConversationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

export default App;

