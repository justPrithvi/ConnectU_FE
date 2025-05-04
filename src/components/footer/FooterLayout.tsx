import React from 'react';
import { View, StyleSheet } from 'react-native';
import Footer from './Footer';
import { useNavigation } from '@react-navigation/native';

const FooterLayout = ({ children }: any) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, marginBottom: 60 }, // leave space for footer
});

export default FooterLayout;
