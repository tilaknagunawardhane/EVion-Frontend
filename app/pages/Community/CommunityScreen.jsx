import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import AppBar from '../../../components/AppBar';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import TabSwitcher from '../../../components/TabSwitcher';

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('Pins');

  const discussions = [
    {
      id: 1,
      tags: ['#EVrange', '#realworldperformance'],
      title: 'Realistic Range vs. Manufacturer Claimed Range – What Are You Getting?',
      author: 'John Doe',
      time: '3 hrs ago',
      message:
        'Hi everyone, I recently bought an EV and noticed that the real-world range I’m getting on a full charge is significantly lower than the manufacturer’s advertised range.',
      replies: 18,
      avatar: require('../../../assets/user.png'),
    },
    {
      id: 2,
      tags: ['#chargingissues', '#plugs', '#slowcharging'],
      title: 'BYD Atto 3 vs Nissan Leaf – Which Is Better for Long Trips?',
      author: 'John Doe',
      time: '7 hrs ago',
      message:
        'Trying to decide between BYD Atto 3 and Nissan Leaf. I need something that handles long-distance travel better. Anyone done trips in both?',
      replies: 25,
      pinned: true,
      avatar: require('../../../assets/user.png'),
    },
  ];

  const renderPost = (post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.tagsRow}>
        {post.tags.map((tag, index) => (
          <Text key={index} style={styles.tagText}>{tag}</Text>
        ))}
      </View>

      <Text style={styles.titleText}>{post.title}</Text>

      <View style={styles.userRow}>
        <Image source={post.avatar} style={styles.avatar} />
        <Text style={styles.metaText}>{post.author} · {post.time}</Text>
        {post.pinned && (
          <View style={styles.pinnedBadge}>
            <Ionicons name="pin" size={18} color="#10B981" />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
      </View>

      <Text style={styles.messagePreview} numberOfLines={2}>
        {post.message} <Text style={styles.readMore}>Read More</Text>
      </Text>

      <TouchableOpacity>
        <Text style={styles.replyText}>💬 {post.replies} Reply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by Keywords"
          placeholderTextColor={colors.secondaryText}
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color={colors.secondaryText} />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>✏️ Start a Discussion</Text>
      </TouchableOpacity>

      <TabSwitcher
        tabs={['Pins', 'My Discussions']}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {discussions.map(renderPost)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
  },
  button: {
    marginHorizontal: 16,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 15,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#F59E0B',
    fontFamily: fonts.PlusJakartaSans,
    marginRight: 8,
  },
  titleText: {
    fontSize: 16,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 8,
  },
  metaText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    flex: 1,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  pinnedText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 4,
    fontFamily: fonts.PlusJakartaSans,
  },
  messagePreview: {
    fontSize: 14,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 10,
  },
  readMore: {
    color: colors.primary,
  },
  replyText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
});

export default CommunityScreen;
