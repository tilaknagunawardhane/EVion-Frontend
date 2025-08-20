import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import { useRouter, useLocalSearchParams } from 'expo-router';

import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';

const SLOT_MINUTES = 30;
const DAY_COUNT = 30;

export default function SelectDateTime() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState(null);

  useEffect(() => {
    if(params.selectedStation){
    const station = JSON.parse(params.selectedStation);
    setSelectedStation(station);
  }
  if(params.selectedVehicle){
    const vehicle = JSON.parse(params.selectedVehicle);
    setSelectedVehicle(vehicle);
  }
  if(params.selectedConnector){
    const Connector = JSON.parse(params.selectedConnector);
    setSelectedConnector(Connector);
  }
  }, []);

  const dates = useMemo(
    () => Array.from({ length: DAY_COUNT }).map((_, i) => dayjs().add(i, 'day')),
    [],
  );
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);

  const allSlots = useMemo(() => {
    const list = [];
    const startOfDay = dayjs().startOf('day');
    for (let i = 0; i < 24 * 60; i += SLOT_MINUTES) {
      const start = startOfDay.add(i, 'minute');
      const end = start.add(SLOT_MINUTES, 'minute');
      list.push({
        label: `${start.format('HH:mm')} – ${end.format('HH:mm')}`,
        available: !(i < 240 || i === 180 || i === 210),
      });
    }
    return list.slice(0, 48); // Only first 48 slots
  }, []);

  const [selectedSlots, setSelectedSlots] = useState([]); // array of indices
  const [page, setPage] = useState(0);

  const paginatedSlots = useMemo(() => {
    if (page === 0) return allSlots.slice(0, 14);
    if (page === 1) return allSlots.slice(14, 28);
    return allSlots.slice(28, 48);
  }, [page, allSlots]);

  const handleSlotPress = (index) => {
    if (selectedSlots.length === 0) {
      setSelectedSlots([index]);
    } else {
      const min = Math.min(...selectedSlots);
      const max = Math.max(...selectedSlots);

      if (
        (index === max + 1 || index === min - 1) &&
        selectedSlots.length < 4
      ) {
        // extend selection if consecutive and < 4
        setSelectedSlots([...selectedSlots, index].sort((a, b) => a - b));
      } else {
        // reset selection
        setSelectedSlots([index]);
      }
    }
  };


  const buildNavigationParams = (selectedDateTime) => ({
    ...(selectedVehicle && { selectedVehicle: JSON.stringify(selectedVehicle) }),
    ...(selectedConnector && { selectedConnector: JSON.stringify(selectedConnector) }),
    ...(selectedStation && { selectedStation: JSON.stringify(selectedStation)}),
    ...(selectedDateTime && { selectedDateTime: JSON.stringify(selectedDateTime)}),
    });


  const handleContinue = () => {
    if (selectedSlots.length === 0) return;

    const date = dates[selectedDateIdx].format('YYYY:MM:DD');
    const first = allSlots[selectedSlots[0]].label.split('–')[0].trim();
    const last = allSlots[selectedSlots[selectedSlots.length - 1]].label
      .split('–')[1]
      .trim();

    const timeRange = `${first} to ${last}`;
    const selectedDateTime = (`${date}  ${timeRange}`);
 
    console.log('selectedSlots: ', selectedSlots);
    console.log('Time range: ', timeRange);

    router.replace({
      pathname: '/pages/bookings/AddBooking',
      params: buildNavigationParams(selectedDateTime),
    });
  };


  return (
    <View style={s.container}>
      {/* header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.backArrow}>‹</Text>
        </Pressable>
        <Text style={s.headerTitle}>Select Date & Time</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* date strip */}
      <FlatList
        data={dates}
        keyExtractor={(d) => d.format('DDMM')}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.dateStrip}
        renderItem={({ item, index }) => {
          const isToday = index === 0;
          const isChosen = index === selectedDateIdx;
          return (
            <Pressable
              onPress={() => {
                setSelectedDateIdx(index);
                setSelectedSlots([]);
              }}
              style={[
                s.dateBox,
                isChosen && s.dateBoxChosen,
                !isChosen && isToday && s.dateBoxToday,
              ]}>
              <Text
                style={[
                  s.dateTextDay,
                  (isChosen || isToday) && { color: colors.white },
                ]}>
                {item.format('ddd')}
              </Text>
              <Text
                style={[
                  s.dateTextNum,
                  (isChosen || isToday) && { color: colors.white },
                ]}>
                {item.format('DD')}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* divider */}
      <View style={s.divider} />

      {/* time grid */}
      <FlatList
        data={paginatedSlots}
        numColumns={2}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={s.slotGrid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const actualIndex = page === 0 ? index : page === 1 ? index + 14 : index + 28;
          const chosen = selectedSlots.includes(actualIndex);
          const dis = !item.available;
          return (
            <Pressable
              disabled={dis}
              onPress={() => handleSlotPress(actualIndex)}
              style={[
                s.slotBox,
                dis && s.slotDisabled,
                chosen && s.slotChosen,
              ]}>
              <Text
                style={[
                  s.slotLabel,
                  dis && { color: colors.secondaryText },
                  chosen && { color: colors.white },
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* dots */}
      <View style={s.dotsWrap}>
        {[0, 1, 2].map((i) => (
          <Pressable
            key={i}
            onPress={() => setPage(i)}
            style={[s.dot, page === i && { backgroundColor: colors.primary }]}
          />
        ))}
      </View>

      {/* continue */}
      <TouchableOpacity
        style={[
          s.cta,
          selectedSlots.length === 0 && { backgroundColor: colors.lightestGray },
        ]}
        disabled={selectedSlots.length === 0}
        onPress={handleContinue}>
        <Text
          style={[
            s.ctaTxt,
            selectedSlots.length === 0 && { color: colors.secondaryText },
          ]}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- styles ---------- */
const RADIUS = 8;
const BOX_H = 54;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  backArrow: { fontSize: 24 },
  headerTitle: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 18,
    color: colors.mainTextColor,
  },

  /* date strip */
  dateStrip: { paddingHorizontal: 16, paddingBottom: 62 },
  dateBox: {
    width: 64,
    height: 81,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.background,
  },
  dateBoxToday: {
    backgroundColor: colors.bgGreen,
    borderColor: colors.bgGreen,
  },
  dateBoxChosen: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateTextDay: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  dateTextNum: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },

  /* divider */
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },

  /* slots */
  slotGrid: { paddingHorizontal: 16 },
  slotBox: {
    height: BOX_H,
    flex: 1,
    margin: 6,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotLabel: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  slotDisabled: {
    backgroundColor: colors.lightestGray,
    borderColor: colors.lightestGray,
  },
  slotChosen: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* dots */
  dotsWrap: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  dot: {
    width: 20,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    backgroundColor: colors.lightGray,
  },

  /* continue */
  cta: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    borderRadius: RADIUS,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 14,
  },
  ctaTxt: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 15,
    color: colors.white,
  },
});
