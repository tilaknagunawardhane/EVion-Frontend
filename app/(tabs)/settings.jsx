
// import { View, Text, StyleSheet } from 'react-native';
// import CustomButton from '../../components/CustomButton';
// import colors from '../../constants/color';
// import {router} from 'expo-router';


//   return (

//     <View style={styles.container}>
//       <Text>Tab [Settings]</Text>

//       <CustomButton
//         title="Add vehicle profile"
//         type="primary"
//         textStyle={{ color: colors.black }}
//         onPress={() => router.push('/pages/addedvprofile')}
//         />

//         <CustomButton
//         title="Station profile"
//         type="primary"
//         textStyle={{ color: colors.black }}
//         onPress={() => router.push('/pages/StationProfile')}
//         />

//         <CustomButton
//         title="Start Charging"
//         type="primary"
//         textStyle={{ color: colors.black }}
//         onPress={() => router.push('/pages/StartCharging')}
//         />

//         <CustomButton
//         title="Waiting Connection"
//         type="primary"
//         textStyle={{ color: colors.black }}
//         onPress={() => router.push('/pages/WaitingConnection')}
//         />
// <CustomButton
//         title="Waiting Connection"
//         type="primary"
//         textStyle={{ color: colors.black }}
//         onPress={() => router.push('/pages/FullCharged')}
//         />
        
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: colors.white },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerTitle: { fontSize: 20, fontFamily: fonts.PlusJakartaSansBold },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//     paddingTop: 55,
//     paddingRight: 20,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//   },
//   menuContainer: {
//     backgroundColor: 'white',
//     elevation: 5,
//     borderRadius: 8,
//     paddingVertical: 8,
//     width: 150,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.text,
//   },
//   stationBox: {
//     borderWidth: 1,
//     borderColor: colors.primary,
//     borderRadius: 10,
//     padding: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   stationImage: { width: 60, height: 60, borderRadius: 8 },
//   stationText: { flex: 1, marginLeft: 10 },
//   stationName: { fontSize: 16, fontFamily: fonts.PlusJakartaSansBold },
//   stationLocation: { color: colors.lightGray, fontSize: 12, fontFamily: fonts.PlusJakartaSans },
//   dateTimeBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: colors.background,
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 20,
//     gap: 8,
//   },
//   dateText: { fontSize: 14, fontFamily: fonts.PlusJakartaSansMedium },
//   timeTag: {
//     backgroundColor: colors.tagBackground,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 5,
//   },
//   timeTagText: {
//     color: colors.tagText,
//     fontFamily: fonts.PlusJakartaSansBold,
//   },
//   timeRange: {
//     fontSize: 14,
//     color: colors.secondaryText,
//     fontFamily: fonts.PlusJakartaSans,
//   },
//   chargerCard: {
//     backgroundColor: colors.cardBackground,
//     padding: 15,
//     borderRadius: 10,
//     borderColor: colors.lightestGray,
//     borderWidth: 1,
//     marginBottom: 20,
//   },
//   row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   chargerType: { fontFamily: fonts.PlusJakartaSansBold, marginLeft: 5 },
//   chargerId: {
//     marginLeft: 'auto',
//     fontSize: 12,
//     color: colors.secondaryText,
//     fontFamily: fonts.PlusJakartaSans,
//   },
//   label: {
//     color: colors.secondaryText,
//     marginTop: 5,
//     fontFamily: fonts.PlusJakartaSans,
//   },
//   value: {
//     marginBottom: 5,
//     fontFamily: fonts.PlusJakartaSansMedium,
//   },
//   infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
//   iconText: { flexDirection: 'row', alignItems: 'center', fontFamily: fonts.PlusJakartaSansBold },
//   estimations: { marginBottom: 20 },
//   estimateRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   estimateLabel: {
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//     fontSize: 14,
//   },
//   estimateValue: {
//     fontFamily: fonts.PlusJakartaSansMedium,
//     fontSize: 14,
//     color: colors.mainTextColor,
//   },
//   startButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   startText: {
//     color: colors.white,
//     fontFamily: fonts.PlusJakartaSansBold,
//   },
//   rescheduleButton: {
//     backgroundColor: colors.rescheduleBg,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   rescheduleText: {
//     color: colors.primary,
//     fontFamily: fonts.PlusJakartaSansMedium,
//   },
//   cancelText: {
//     textAlign: 'center',
//     color: colors.danger,
//     fontFamily: fonts.PlusJakartaSansBold,
//     marginBottom: 30,
//   },
//   // Info Modal Styles
//   infoOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//   },
//   infoModal: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '85%',
//   },
//   infoTitle: {
//     fontSize: 18,
//     fontFamily: fonts.PlusJakartaSansBold,
//     marginBottom: 10,
//   },
//   infoItem: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     marginBottom: 8,
//     color: colors.mainTextColor,
//   },
//   bold: { fontFamily: fonts.PlusJakartaSansBold },
//   cancelOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   cancelModal: {
//     width: '100%',
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 20,
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   cancelTitle: {
//     fontSize: 18,
//     fontFamily: fonts.PlusJakartaSansBold,
//     marginBottom: 10,
//     color: colors.black,
//   },
//   cancelMsg: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//     marginBottom: 10,
//   },
//   cancelActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 12,
//     marginTop: 20,
//   },
//   cancelCloseBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//   },
//   cancelCloseText: {
//     fontFamily: fonts.PlusJakartaSans,
//     fontSize: 14,
//     color: colors.text,
//   },
//   cancelConfirmBtn: {
//     backgroundColor: colors.primary,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//   },
//   cancelConfirmText: {
//     fontFamily: fonts.PlusJakartaSansBold,
//     fontSize: 14,
//     color: colors.white,
//   },
// });

// export default BookingDetailsScreen;
