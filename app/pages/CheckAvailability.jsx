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
import { useRouter } from 'expo-router';

const router = useRouter();

const generateCurrentMonthDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based index for months

  const numberOfDays = new Date(year, month + 1, 0).getDate(); // get total days in the month
  const datesArray = [];

  for (let day = 1; day <= numberOfDays; day++) {
    const dateObj = new Date(year, month, day);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. Sun, Mon
    datesArray.push({
      day: dayName,
      date: day.toString().padStart(2, '0'), // '01', '02', ...
    });
  }

  return datesArray;
};

const fullMonthDates = generateCurrentMonthDates();

const timeSlotPages = [
  [ // Page 1
    ['00:00am - 00:30am', '00:30am - 01:00am'],
    ['01:00am - 01:30am', '01:30am - 02:00am'],
    ['02:00am - 02:30am', '02:30am - 03:00am'],
    ['03:00am - 03:30am', '03:30am - 04:00am'],
    ['04:00am - 04:30am', '04:30am - 05:00am'],
    ['05:00am - 05:30am', '05:30am - 06:00am'],
    ['06:00am - 06:30am', '06:30am - 07:00am'],
    ['07:00am - 07:30am', '07:30am - 08:00am'],
  ],
  [ // Page 2
    ['08:00am - 08:30am', '08:30am - 09:00am'],
    ['09:00am - 09:30am', '09:30am - 10:00am'],
    ['10:00am - 10:30am', '10:30am - 11:00am'],
    ['11:00am - 11:30am', '11:30am - 12:00pm'],
    ['12:00pm - 12:30pm', '12:30pm - 01:00pm'],
    ['01:00pm - 01:30pm', '01:30pm - 02:00pm'],
    ['02:00pm - 02:30pm', '02:30pm - 03:00pm'],
    ['03:00pm - 03:30pm', '03:30pm - 04:00pm'],
  ],
  [ // Page 3
    ['04:00pm - 04:30pm', '04:30pm - 05:00pm'],
    ['05:00pm - 05:30pm', '05:30pm - 06:00pm'],
    ['06:00pm - 06:30pm', '06:30pm - 07:00pm'],
    ['07:00pm - 07:30pm', '07:30pm - 08:00pm'],
    ['08:00pm - 08:30pm', '08:30pm - 09:00pm'],
    ['09:00pm - 09:30pm', '09:30pm - 10:00pm'],
    ['10:00pm - 10:30pm', '10:30pm - 11:00pm'],
    ['11:00pm - 11:30pm', '11:30pm - 12:00am'],
  ]
];

const SelectDateTimeScreen = () => {
  const navigation = useNavigation();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentTimeSlotPage, setCurrentTimeSlotPage] = useState(0);

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
        <TouchableOpacity onPress={() => router.replace('/StationProfile')}>
          <Ionicons name="chevron-back-outline" size={22} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <View style={{ width: 22 }} />
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
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / Dimensions.get('window').width
          );
          setCurrentTimeSlotPage(pageIndex);
        }}
        scrollEventThrottle={16}
      >
        {timeSlotPages.map((page, pageIndex) => (
          <View
            key={pageIndex}
            style={{
              width: Dimensions.get('window').width,
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 40,
            }}
          >
            {page.map((row, rowIndex) => (
              <View style={styles.slotRow} key={rowIndex}>
                {row.map((slot, colIndex) => {
                  const slotKey = `${pageIndex}-${rowIndex}-${colIndex}`;
                  const isSelected = selectedSlots.includes(slotKey);
                  return (
                    <TouchableOpacity
                      key={slotKey}
                      onPress={() => {
                        if (isSelected) {
                          setSelectedSlots(selectedSlots.filter((s) => s !== slotKey));
                        } else {
                          setSelectedSlots([...selectedSlots, slotKey]);
                        }
                      }}
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
          </View>
        ))}
      </ScrollView>

     {/* Bottom Section with Dots and Book Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.dots}>
          {timeSlotPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentTimeSlotPage && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <CustomButton
          title="Book Now"
          onPress={() => router.push('/pages/StartCharging')}
          type="primary"
          style={{ width: '100%' }} // Increased width to 100%
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
    borderColor: colors.stroke,
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
  selectedDayText: { color: colors.primary },
  selectedDateText: { color: colors.primary },
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
  selectedSlotText: { color: colors.background },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.stroke,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 30,
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
bottomContainer: {
  position: 'absolute',
  bottom: 16,
  left: 16,
  right: 16,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10, // space between dots and button
},


});

export default SelectDateTimeScreen;