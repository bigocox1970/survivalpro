import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  NativeModules,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { useHaptics } from '../src/context/HapticsContext';

// Affiliate tags for different regions (add your tags for each region)
const AFFILIATE_TAGS: Record<string, string> = {
  'UK': 'diamondinte08-21',
  'US': 'diamondinte08-21', // Replace with your US tag when you have one
  'DE': 'diamondinte08-21', // Replace with your DE tag
  'FR': 'diamondinte08-21', // Replace with your FR tag
  'ES': 'diamondinte08-21', // Replace with your ES tag
  'IT': 'diamondinte08-21', // Replace with your IT tag
  'CA': 'diamondinte08-21', // Replace with your CA tag
  'AU': 'diamondinte08-21', // Replace with your AU tag
  'DEFAULT': 'diamondinte08-21',
};

// Amazon domains by region
const AMAZON_DOMAINS: Record<string, string> = {
  'UK': 'amazon.co.uk',
  'GB': 'amazon.co.uk',
  'US': 'amazon.com',
  'DE': 'amazon.de',
  'AT': 'amazon.de',
  'FR': 'amazon.fr',
  'ES': 'amazon.es',
  'IT': 'amazon.it',
  'CA': 'amazon.ca',
  'AU': 'amazon.com.au',
  'JP': 'amazon.co.jp',
  'NL': 'amazon.nl',
  'SE': 'amazon.se',
  'PL': 'amazon.pl',
  'DEFAULT': 'amazon.co.uk',
};

// Get user's country code from device locale
const getCountryCode = (): string => {
  try {
    let locale = 'en_GB';
    if (Platform.OS === 'ios') {
      locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
               NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
               'en_GB';
    } else {
      locale = NativeModules.I18nManager?.localeIdentifier || 'en_GB';
    }
    // Extract country code (e.g., "en_GB" -> "GB", "en_US" -> "US")
    const parts = locale.replace('-', '_').split('_');
    return parts.length > 1 ? parts[1].toUpperCase() : 'GB';
  } catch {
    return 'GB';
  }
};

const getAmazonUrl = (searchQuery: string): string => {
  const countryCode = getCountryCode();
  const domain = AMAZON_DOMAINS[countryCode] || AMAZON_DOMAINS['DEFAULT'];
  const tag = AFFILIATE_TAGS[countryCode] || AFFILIATE_TAGS['DEFAULT'];
  return `https://www.${domain}/s?k=${encodeURIComponent(searchQuery)}&tag=${tag}`;
};

interface Product {
  id: string;
  name: string;
  description: string;
  searchQuery: string;
  icon: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  products: Product[];
}

const gearCategories: Category[] = [
  {
    id: 'fire',
    title: 'Fire Starting',
    icon: 'flame-outline',
    description: 'Essential fire-starting gear for any situation',
    products: [
      {
        id: 'ferro-rod',
        name: 'Ferrocerium Rod Fire Starter',
        description: 'Waterproof, works in any weather. 12,000+ strikes.',
        searchQuery: 'ferro rod fire starter',
        icon: 'flash-outline',
      },
      {
        id: 'fire-steel',
        name: 'Magnesium Fire Steel',
        description: 'Military-grade magnesium bar with striker.',
        searchQuery: 'magnesium fire starter',
        icon: 'flash-outline',
      },
      {
        id: 'tinder',
        name: 'Waterproof Tinder',
        description: 'Pre-made tinder that lights even when wet.',
        searchQuery: 'waterproof fire tinder',
        icon: 'bonfire-outline',
      },
      {
        id: 'stormproof-matches',
        name: 'Stormproof Matches',
        description: 'Wind and waterproof matches. Burns 15+ seconds.',
        searchQuery: 'stormproof matches',
        icon: 'bonfire-outline',
      },
    ],
  },
  {
    id: 'water',
    title: 'Water Filtration',
    icon: 'water-outline',
    description: 'Clean water is survival priority #1',
    products: [
      {
        id: 'lifestraw',
        name: 'LifeStraw Personal Filter',
        description: 'Filters 99.99% of bacteria. 1,000 gallon capacity.',
        searchQuery: 'lifestraw',
        icon: 'water-outline',
      },
      {
        id: 'sawyer-filter',
        name: 'Sawyer Squeeze Filter',
        description: '0.1 micron filter. Backflushable, lasts a lifetime.',
        searchQuery: 'sawyer squeeze water filter',
        icon: 'water-outline',
      },
      {
        id: 'purification-tablets',
        name: 'Water Purification Tablets',
        description: 'Portable chemical purification. Treats up to 25L.',
        searchQuery: 'water purification tablets',
        icon: 'flask-outline',
      },
      {
        id: 'gravity-filter',
        name: 'Gravity Water Filter System',
        description: 'Hands-free filtration for base camp. High volume.',
        searchQuery: 'gravity water filter camping',
        icon: 'water-outline',
      },
    ],
  },
  {
    id: 'shelter',
    title: 'Shelter & Warmth',
    icon: 'home-outline',
    description: 'Protection from the elements',
    products: [
      {
        id: 'emergency-blanket',
        name: 'Emergency Mylar Blankets',
        description: 'Retains 90% body heat. Compact and lightweight.',
        searchQuery: 'emergency mylar blanket',
        icon: 'bed-outline',
      },
      {
        id: 'tarp',
        name: 'Survival Tarp',
        description: 'Waterproof, multi-use shelter. Grommets included.',
        searchQuery: 'survival tarp shelter',
        icon: 'home-outline',
      },
      {
        id: 'bivy',
        name: 'Emergency Bivy Sack',
        description: 'Waterproof sleeping bag cover. Reflects body heat.',
        searchQuery: 'emergency bivy sack',
        icon: 'bed-outline',
      },
      {
        id: 'paracord',
        name: '550 Paracord (100ft)',
        description: '550lb tensile strength. 7 inner strands for multiple uses.',
        searchQuery: '550 paracord 100ft',
        icon: 'link-outline',
      },
    ],
  },
  {
    id: 'power',
    title: 'Power & Light',
    icon: 'sunny-outline',
    description: 'Stay powered off-grid',
    products: [
      {
        id: 'solar-panel',
        name: 'Portable Solar Panel',
        description: 'Foldable 20W+ panel. USB charging for devices.',
        searchQuery: 'portable solar panel camping',
        icon: 'sunny-outline',
      },
      {
        id: 'power-bank',
        name: 'Solar Power Bank',
        description: '20,000mAh+ with built-in solar charging.',
        searchQuery: 'solar power bank 20000mah',
        icon: 'battery-charging-outline',
      },
      {
        id: 'headlamp',
        name: 'Rechargeable Headlamp',
        description: '1000+ lumens. Red light mode preserves night vision.',
        searchQuery: 'rechargeable headlamp 1000 lumens',
        icon: 'flashlight-outline',
      },
      {
        id: 'hand-crank-radio',
        name: 'Emergency Crank Radio',
        description: 'Weather alerts. Solar/crank powered. USB out.',
        searchQuery: 'emergency crank radio',
        icon: 'radio-outline',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Knives',
    icon: 'construct-outline',
    description: 'Essential survival tools',
    products: [
      {
        id: 'multitool',
        name: 'Survival Multi-Tool',
        description: 'Pliers, knife, saw, and 15+ tools in one.',
        searchQuery: 'leatherman multitool',
        icon: 'construct-outline',
      },
      {
        id: 'fixed-blade',
        name: 'Fixed Blade Survival Knife',
        description: 'Full tang construction. 4-5" blade. Fire steel compatible.',
        searchQuery: 'fixed blade survival knife',
        icon: 'cut-outline',
      },
      {
        id: 'folding-saw',
        name: 'Folding Camp Saw',
        description: 'Compact folding saw for shelter building.',
        searchQuery: 'folding camp saw',
        icon: 'cut-outline',
      },
      {
        id: 'shovel',
        name: 'Tactical Folding Shovel',
        description: 'Multi-function: shovel, pick, saw edge.',
        searchQuery: 'tactical folding shovel',
        icon: 'construct-outline',
      },
    ],
  },
  {
    id: 'firstaid',
    title: 'First Aid',
    icon: 'medkit-outline',
    description: 'Medical supplies for emergencies',
    products: [
      {
        id: 'first-aid-kit',
        name: 'Comprehensive First Aid Kit',
        description: '200+ pieces. Trauma supplies included.',
        searchQuery: 'survival first aid kit',
        icon: 'medkit-outline',
      },
      {
        id: 'tourniquet',
        name: 'CAT Tourniquet',
        description: 'Combat Application Tourniquet. One-handed use.',
        searchQuery: 'cat tourniquet',
        icon: 'bandage-outline',
      },
      {
        id: 'israeli-bandage',
        name: 'Israeli Compression Bandage',
        description: 'Emergency trauma bandage with pressure bar.',
        searchQuery: 'israeli bandage',
        icon: 'bandage-outline',
      },
      {
        id: 'quick-clot',
        name: 'QuikClot Gauze',
        description: 'Hemostatic gauze for severe bleeding.',
        searchQuery: 'quikclot gauze',
        icon: 'bandage-outline',
      },
    ],
  },
  {
    id: 'food',
    title: 'Food & Cooking',
    icon: 'nutrition-outline',
    description: 'Long-term food and cooking gear',
    products: [
      {
        id: 'emergency-food',
        name: 'Emergency Food Supply',
        description: '72-hour to 30-day emergency food buckets.',
        searchQuery: 'emergency food supply bucket',
        icon: 'nutrition-outline',
      },
      {
        id: 'camp-stove',
        name: 'Portable Camp Stove',
        description: 'Compact backpacking stove. Uses fuel canisters.',
        searchQuery: 'backpacking camp stove',
        icon: 'flame-outline',
      },
      {
        id: 'mess-kit',
        name: 'Camping Mess Kit',
        description: 'Pots, pans, utensils. Nests for compact storage.',
        searchQuery: 'camping mess kit',
        icon: 'restaurant-outline',
      },
      {
        id: 'fishing-kit',
        name: 'Survival Fishing Kit',
        description: 'Compact kit with hooks, line, and lures.',
        searchQuery: 'survival fishing kit',
        icon: 'fish-outline',
      },
    ],
  },
  {
    id: 'kits',
    title: 'Complete Kits',
    icon: 'briefcase-outline',
    description: 'Ready-made survival kits and go-bags',
    products: [
      {
        id: 'bug-out-bag',
        name: '72-Hour Bug Out Bag',
        description: 'Complete survival kit for 72 hours. Pre-packed.',
        searchQuery: '72 hour bug out bag',
        icon: 'briefcase-outline',
      },
      {
        id: 'car-kit',
        name: 'Car Emergency Kit',
        description: 'Roadside survival kit with tools and supplies.',
        searchQuery: 'car emergency survival kit',
        icon: 'car-outline',
      },
      {
        id: 'home-kit',
        name: 'Home Emergency Kit',
        description: 'Family emergency supplies for sheltering in place.',
        searchQuery: 'home emergency kit family',
        icon: 'home-outline',
      },
      {
        id: 'edc-kit',
        name: 'EDC Survival Kit',
        description: 'Pocket-sized everyday carry survival essentials.',
        searchQuery: 'edc survival kit',
        icon: 'body-outline',
      },
    ],
  },
];

export default function PrepareScreen() {
  const { isDark } = useTheme();
  const { lightTap, mediumTap } = useHaptics();
  const styles = createStyles(isDark);

  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    lightTap();
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const openProduct = (searchQuery: string) => {
    mediumTap();
    const url = getAmazonUrl(searchQuery);
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={32} color="#e94560" />
        <Text style={styles.headerTitle}>Prepare</Text>
        <Text style={styles.headerSubtitle}>
          Essential survival gear recommendations
        </Text>
      </View>

      {gearCategories.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(category.id)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryTitleRow}>
              <Ionicons
                name={category.icon as any}
                size={24}
                color="#e94560"
              />
              <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedCategory === category.id ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isDark ? '#8a8aaa' : '#666'}
            />
          </TouchableOpacity>

          {expandedCategory === category.id && (
            <View style={styles.productsList}>
              {category.products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productItem}
                  onPress={() => openProduct(product.searchQuery)}
                  activeOpacity={0.7}
                >
                  <View style={styles.productInfo}>
                    <Ionicons
                      name={product.icon as any}
                      size={20}
                      color={isDark ? '#8a8aaa' : '#666'}
                      style={styles.productIcon}
                    />
                    <View style={styles.productText}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productDescription}>{product.description}</Text>
                    </View>
                  </View>
                  <View style={styles.shopButton}>
                    <Text style={styles.shopButtonText}>Shop</Text>
                    <Ionicons name="open-outline" size={14} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Being prepared could save your life.
        </Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            lightTap();
            Alert.alert(
              'Affiliate Disclosure',
              'Links open Amazon. We may earn a commission on purchases. However, this is at no extra cost to you.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Ionicons name="information-circle-outline" size={20} color={isDark ? '#6a6a8a' : '#999'} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a2e' : '#f5f5f5',
    },
    contentContainer: {
      paddingBottom: 100,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginTop: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: isDark ? '#8a8aaa' : '#666',
      marginTop: 4,
    },
    categoryContainer: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    categoryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryTitleContainer: {
      marginLeft: 12,
      flex: 1,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#eaeaea' : '#1a1a2e',
    },
    categoryDescription: {
      fontSize: 12,
      color: isDark ? '#8a8aaa' : '#666',
      marginTop: 2,
    },
    productsList: {
      borderTopWidth: 1,
      borderTopColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    productItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0',
    },
    productInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    productIcon: {
      marginRight: 12,
    },
    productText: {
      flex: 1,
      marginRight: 12,
    },
    productName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#eaeaea' : '#1a1a2e',
    },
    productDescription: {
      fontSize: 12,
      color: isDark ? '#8a8aaa' : '#666',
      marginTop: 2,
    },
    shopButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e94560',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    shopButtonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '600',
      marginRight: 4,
    },
    footer: {
      padding: 24,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    footerText: {
      fontSize: 12,
      color: isDark ? '#6a6a8a' : '#999',
    },
    infoButton: {
      marginLeft: 8,
      padding: 4,
    },
  });
