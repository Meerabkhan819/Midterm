// frontend/app/menu.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

export default function MenuScreen() {
  const insets = useSafeAreaInsets();

  const [menuData, setMenuData] = useState<any[]>([]);
  const [randomItem, setRandomItem] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale1 = useRef(new Animated.Value(1)).current;
  const buttonScale2 = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
    pulseButton(buttonScale1);
    pulseButton(buttonScale2);
  }, []);

  const animateAppearance = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pulseButton = (scaleAnimRef: Animated.Value) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimRef, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimRef, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleButtonPressIn = (scaleAnimRef: Animated.Value) => {
    Animated.timing(scaleAnimRef, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = (scaleAnimRef: Animated.Value) => {
    Animated.spring(scaleAnimRef, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const fetchWithTimeout = async (url: string, timeout = 15000) => {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after ' + timeout + 'ms')), timeout)
      )
    ]) as Promise<Response>;
  };

  const fetchFullMenu = async () => {
    setLoading(true);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    try {
      setRandomItem(null);
      setError('');
      const response = await fetchWithTimeout('https://coffee-shop-kappa-six.vercel.app/menu');
      if (!response.ok) throw new Error('Failed to fetch menu: Status ' + response.status);
      const data = await response.json();
      setMenuData(data);
      animateAppearance();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error fetching menu: ${err.message}`);
      } else {
        setError(`Error fetching menu: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomItem = async () => {
    setLoading(true);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    try {
      setMenuData([]);
      setError('');
      const response = await fetchWithTimeout('http://192.168.1.36:3000/menu/random');
      if (!response.ok) throw new Error('Failed to fetch random item: Status ' + response.status);
      const data = await response.json();
      setRandomItem(data);
      animateAppearance();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error fetching surprise item: ${err.message}`);
      } else {
        setError(`Error fetching surprise item: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }: { item: any }) => (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F5F5F5', '#EBDCCB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/300' }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
          <Text style={styles.itemStock}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F5F5F5', '#D2B48C', '#A67B5B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.background}
    >
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 20, // Dynamic top padding (status bar + extra)
              paddingBottom: insets.bottom + 40, // Extra bottom padding
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.headerContainer, { opacity: headerFade }]}>
            <Text style={styles.headerTitle}>Welcome to Cappuccino Haven</Text>
            <Text style={styles.headerSubtitle}>Indulge in our finest brews and treats</Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={fetchFullMenu}
              onPressIn={() => handleButtonPressIn(buttonScale1)}
              onPressOut={() => handleButtonPressOut(buttonScale1)}
              activeOpacity={1}
            >
              <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
                <LinearGradient
                  colors={['#D2B48C', '#A67B5B', '#8B5A2B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0, 0.5, 1]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Full Menu</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={fetchRandomItem}
              onPressIn={() => handleButtonPressIn(buttonScale2)}
              onPressOut={() => handleButtonPressOut(buttonScale2)}
              activeOpacity={1}
            >
              <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
                <LinearGradient
                  colors={['#D2B48C', '#A67B5B', '#8B5A2B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0, 0.5, 1]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Surprise Me!</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>

          <Text style={styles.introText}>
            Explore our handcrafted coffees, fresh pastries, and more. Choose an option above to get started!
          </Text>

          {error && <Text style={styles.error}>{error}</Text>}

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#A67B5B" />
            </View>
          ) : (
            <>
              {menuData.length > 0 && (
                <FlatList
                  data={menuData}
                  renderItem={renderMenuItem}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContainer}
                />
              )}

              {randomItem && (
                <View style={styles.randomContainer}>
                  <Text style={styles.randomTitle}>Your Surprise Pick:</Text>
                  {renderMenuItem({ item: randomItem })}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6F4E37',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B5A2B',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#6F4E37',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  listContainer: { alignItems: 'center' },
  card: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: { borderRadius: 24, overflow: 'hidden' },
  itemImage: {
    width: '100%',
    height: cardWidth * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  itemDetails: { padding: 20 },
  itemName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  itemCategory: { fontSize: 15, color: '#777', marginTop: 6 },
  itemPrice: { fontSize: 17, fontWeight: '600', color: '#8B5A2B', marginTop: 6 },
  itemStock: { fontSize: 15, color: '#4caf50', marginTop: 6 },
  error: { color: '#A67B5B', textAlign: 'center', marginBottom: 16, fontSize: 16 },
  randomContainer: { alignItems: 'center', marginTop: 20 },
  randomTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#6F4E37' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 },
});