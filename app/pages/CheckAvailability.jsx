import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import AppBar from '../../components/AppBar';

// Dates for June 2025 (1st–30th) with day names
const fullMonthDates = [
  { day: 'Sun', date: '01' }, { day: 'Mon', date: '02' }, { day: 'Tue', date: '03' },
  { day: 'Wed', date: '04' }, { day: 'Thu', date: '05' }, { day: 'Fri', date: '06' },
  { day: 'Sat', date: '07' }, { day: 'Sun', date: '08' }, { day: 'Mon', date: '09' },
  { day: 'Tue', date: '10' }, { day: 'Wed', date: '11' }, { day: 'Thu', date: '12' },
  { day: 'Fri', date: '13' }, { day: 'Sat', date: '14' }, { day: 'Sun', date: '15' },
  { day: 'Mon', date: '16' }, { day: 'Tue', date: '17' }, { day: 'Wed', date: '18' },
  { day: 'Thu', date: '19' }, { day: 'Fri', date: '20' }, { day: 'Sat', date: '21' },
  { day: 'Sun', date: '22' }, { day: 'Mon', date: '23' }, { day: 'Tue', date: '24' },
  { day: 'Wed', date: '25' }, { day: 'Thu', date: '26' }, { day: 'Fri', date: '27' },
  { day: 'Sat', date: '28' }, { day: 'Sun', date: '29' }, { day: 'Mon', date: '30' }
];

const timeSlots = [
  ['00:00am - 00:30am', '00:30am - 01:00am'],
  ['01:00am - 01:30am', '01:30am - 02:00am'],
  ['02:00am - 02:30am', '02:30am - 03:00am'],
  ['03:00am - 03:30am', '03:30am - 04:00am'],
  ['04:00am - 04:30am', '04:30am - 05:00am'],
  ['05:00am - 05:30am', '05:30am - 06:00am'],
  ['06:00am - 06:30am', '06:30am - 07:00am'],
  ['07:00am - 07:30am', '07:30am - 08:00am'],
];

const SelectDateTimeScreen = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const visibleDates = fullMonthDates.slice(startIndex, startIndex + 7);

  const handleLeft = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleRight = () => {
    if (startIndex + 7 < fullMonthDates.length)
      setStartIndex(startIndex + 1);
  };

return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Ionicons name="chevron-back" size={22} color={colors.maintext} />
            <Text style={styles.headerTitle}>Select Date & Time</Text>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.maintext} />
        </View>

        {/* Date Selector */}
        <View style={[styles.dateSelector, { marginTop: 48 }]}>
            <TouchableOpacity onPress={handleLeft}>
                <Ionicons name="chevron-back-outline" size={22} color={colors.secondaryText} />
                </TouchableOpacity>
                <FlatList
                horizontal
                data={visibleDates}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const globalIndex = startIndex + index;
                    const isSelected = globalIndex === selectedDateIndex;
                    return (
                        <TouchableOpacity
                            onPress={() => setSelectedDateIndex(globalIndex)}
                            style={[
                                styles.dateItem,
                                isSelected && styles.selectedDateItem,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    isSelected && styles.selectedDayText,
                                ]}
                            >
                                {item.day}
                            </Text>
                            <Text
                                style={[
                                    styles.dateText,
                                    isSelected && styles.selectedDateText,
                                ]}
                            >
                                {item.date}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateList}
            />
            <TouchableOpacity onPress={handleRight}>
                <Ionicons name="chevron-forward-outline" size={22} color={colors.secondaryText} />
            </TouchableOpacity>
        </View>

        {/* Time Slots */}
        <ScrollView contentContainerStyle={styles.slotContainer}>
            {timeSlots.map((row, rowIndex) => (
                <View style={styles.slotRow} key={rowIndex}>
                    {row.map((slot, colIndex) => {
                        const slotKey = `${rowIndex}-${colIndex}`;
                        const isSelected = selectedSlot === slotKey;
                        return (
                            <TouchableOpacity
                                key={slotKey}
                                onPress={() => setSelectedSlot(slotKey)}
                                style={[
                                    styles.slotItem,
                                    isSelected && styles.selectedSlotItem,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.slotText,
                                        isSelected && styles.selectedSlotText,
                                    ]}
                                >
                                    {slot}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}

            {/* Dots */}
            <View style={styles.dots}>
                <View style={styles.activeDot} />
                <View style={styles.dot} />
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>

        {/* Book Button */}
        <View style={[styles.bookButtonContainer, { bottom: 16 }]}>
            <CustomButton
                title="Book Now"
                onPress={() => console.log('Booked')}
                type="primary"
            />
        </View>
    </View>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:colors.background },
  header: {
    marginTop: 45,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  dateSelector: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dateList: { paddingHorizontal: 6 },
  dateItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    width: 55,
  },
  selectedDateItem: {
    backgroundColor: '#DFF7F3',
    borderColor: '#00C897',
  },
  dayText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  dateText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  selectedDayText: { color: '#00C897' },
  selectedDateText: { color: '#00C897' },
  slotContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slotItem: {
    backgroundColor: colors.border,
    borderRadius: 12,
    width: '48%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedSlotItem: { backgroundColor: colors.primary },
  slotText: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  selectedSlotText: { color: colors.background},
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.stroke,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  bookButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
});

export default SelectDateTimeScreen;
