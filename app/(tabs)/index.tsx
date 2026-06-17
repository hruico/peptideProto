// Redirect — the home tab is now "my-peptides"
import { Redirect } from 'expo-router';
export default function Index() {
  return <Redirect href={"/(tabs)/my-peptides" as any} />;
}
