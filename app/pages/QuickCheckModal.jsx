import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Checkbox from '../../components/Checkbox';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import PopupAppBar from '../../components/PopupAppBar';

const QuickCheckModal = ({ visible, onClose, onSubmit }) => {
  const navigation = useNavigation();

  const [firstStop, setFirstStop] = useState({
    'Fonseka Charging Station': true,
    'Genso Charging Station': false,
    Other: false,
  });
  const [secondStop, setSecondStop] = useState({
    'Electric Vehicle Charging Station': true,
    Other: false,
  });

  const toggleCheckbox = (group, setGroup, key) => {
    setGroup((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDone = () => {
    const selectedFirst = Object.keys(firstStop).filter((key) => firstStop[key]);
    const selectedSecond = Object.keys(secondStop).filter((key) => secondStop[key]);
    onSubmit({ firstStop: selectedFirst, secondStop: selectedSecond });
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
    navigation.goBack();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.fullOverlay}>
        <PopupAppBar />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Quick Check!</Text>
            </View>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Did you stop at any stations we suggested?</Text>

          <ScrollView>
            <Text style={styles.sectionTitle}>First Stop</Text>
            {Object.keys(firstStop).map((key) => (
              <View style={styles.row} key={key}>
                <View style={styles.labelContainer}>
                  <Text style={styles.stationName}>{key}</Text>
                  {key !== 'Other' && (
                    <Text style={styles.stationAddress}>
                      {key === 'Fonseka Charging Station' || key === 'Genso Charging Station'
                        ? 'Southern Highway, Welipenna, Matugama'
                        : ''}
                    </Text>
                  )}
                </View>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    selected={firstStop[key]}
                    onPress={() => toggleCheckbox(firstStop, setFirstStop, key)}
                  />
                </View>
              </View>
            ))}

            {/* Divider */}
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Second Stop</Text>
            {Object.keys(secondStop).map((key) => (
              <View style={styles.row} key={key}>
                <View style={styles.labelContainer}>
                  <Text style={styles.stationName}>{key}</Text>
                  {key !== 'Other' && (
                    <Text style={styles.stationAddress}>
                      {key === 'Electric Vehicle Charging Station'
                        ? 'No.100, Boralanda, Haputhale'
                        : ''}
                    </Text>
                  )}
                </View>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    selected={secondStop[key]}
                    onPress={() => toggleCheckbox(secondStop, setSecondStop, key)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default QuickCheckModal;

const styles = StyleSheet.create({
  fullOverlay: {
    flex: 1,
    backgroundColor: '#BDBDBD',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginTop: 60,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 20,
  },
  title: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 24,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  closeText: {
    fontSize: 22,
    color: colors.secondaryText,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.mainTextColor,
    marginTop: 10,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  labelContainer: {
    flex: 1,
    paddingRight: 10,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationName: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  stationAddress: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  doneBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: 'white',
  },
});
