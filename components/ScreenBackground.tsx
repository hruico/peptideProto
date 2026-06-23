/**
 * ScreenBackground — wraps every screen with the full-bleed background image
 * and a gradient overlay so cards/content appear to float over it.
 *
 * Usage:
 *   import ScreenBackground from '../../components/ScreenBackground';
 *   ...
 *   return (
 *     <ScreenBackground>
 *       <StatusBar style="light" />
 *       ...your content...
 *     </ScreenBackground>
 *   );
 */
import React from 'react';
import { StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height: H } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
  /** Override gradient opacity at bottom — default works for most screens */
  bottomOpacity?: number;
}

export default function ScreenBackground({ children, bottomOpacity = 0.97 }: Props) {
  return (
    <View style={styles.root}>
      {/* Full-screen background image */}
      <ImageBackground
        source={require('../assets/images/mainpagebackground.jpg')}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        {/* Gradient: nearly transparent at top so the man/scene is visible,
            fades to near-opaque at bottom so scrolled content is readable */}
        <LinearGradient
          colors={[
            'rgba(18,19,42,0.05)',
            'rgba(18,19,42,0.20)',
            `rgba(18,19,42,${bottomOpacity})`,
          ]}
          locations={[0, 0.38, 0.70]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      {/* Content sits on top */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: H,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  content: { flex: 1 },
});
