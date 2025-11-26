import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="menu"
      screenOptions={{
        headerShown: false, // 🔥 hides the top menu header globally
      }}
    />
  );
}
