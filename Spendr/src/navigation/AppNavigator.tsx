import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#F8FAFC" },
        headerTitleStyle: { color: "#0F172A", fontSize: 17, fontWeight: "800" },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: { borderTopColor: "#E2E8F0", height: 64, paddingBottom: 7, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Add":
              iconName = "add-circle";
              break;
            case "Statistics":
              iconName = "stats-chart";
              break;
            case "Profile":
              iconName = "person";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddExpenseScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
