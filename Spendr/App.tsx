import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useState } from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ExpenseProvider } from "./src/context/ExpenseContext";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (isLoading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  if (!user) {
    return isRegistering
      ? <RegisterScreen onShowLogin={() => setIsRegistering(false)} />
      : <LoginScreen onShowRegister={() => setIsRegistering(true)} />;
  }

  return (
    <ExpenseProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ExpenseProvider>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", backgroundColor: "#F8FAFC", flex: 1, justifyContent: "center" },
});
