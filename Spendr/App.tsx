import { NavigationContainer } from "@react-navigation/native";
import { ExpenseProvider } from "./src/context/ExpenseContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ExpenseProvider>
  );
}
