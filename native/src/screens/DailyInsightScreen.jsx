import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, Share, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'

const PRIMARY_BLUE = '#1e3a8a'
const BG = '#FFFFFF'
const DEEP_BLUE = '#0b1b3a'

export default function DailyInsightScreen({ navigation }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState(null)

  const loadInsights = async () => {
    try {
      const q = query(
        collection(db, 'dailyInsights'),
        orderBy('date', 'desc'),
        limit(10)
      )
      const querySnapshot = await getDocs(q)
      const insightsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setInsights(insightsData)
      if (insightsData.length > 0 && !selectedInsight) {
        setSelectedInsight(insightsData[0])
      }
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadInsights()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadInsights()
  }

  const handleShare = React.useCallback(() => {
    if (selectedInsight) {
      Share.share({
        message: `${selectedInsight.title}\n\n${selectedInsight.content}\n\nמאת: ${selectedInsight.author}`
      }).catch(() => {})
    }
  }, [selectedInsight])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={[BG, '#f5f5f5']} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
          <Text style={styles.loadingText}>טוען תובנות...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const todayInsight = selectedInsight || {
    title: 'אין תובנות זמינות',
    content: 'התובנות יתווספו בקרוב',
    author: 'הרב שלמה יהודה בארי',
    category: 'כללי',
    date: new Date().toISOString()
  }

  const formattedDate = new Date(todayInsight.date).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[BG, '#f5f5f5']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="חזרה"
        >
          <Ionicons name="arrow-back" size={24} color={PRIMARY_BLUE} />
        </Pressable>
        <Text style={styles.headerTitle}>חידושים</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {insights.length > 1 && (
          <View style={styles.insightsNav}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {insights.map((insight, index) => (
                <Pressable
                  key={insight.id}
                  style={[
                    styles.insightTab,
                    selectedInsight?.id === insight.id && styles.insightTabActive
                  ]}
                  onPress={() => setSelectedInsight(insight)}
                >
                  <Text style={[
                    styles.insightTabText,
                    selectedInsight?.id === insight.id && styles.insightTabTextActive
                  ]}>
                    {new Date(insight.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{todayInsight.category}</Text>
          </View>

          <Text style={styles.title}>{todayInsight.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={PRIMARY_BLUE} style={styles.metaIcon} />
              <Text style={styles.metaText}>{formattedDate}</Text>
            </View>
            {todayInsight.likes && (
              <View style={styles.metaItem}>
                <Ionicons name="heart-outline" size={16} color={PRIMARY_BLUE} style={styles.metaIcon} />
                <Text style={styles.metaText}>{todayInsight.likes} אהבו</Text>
              </View>
            )}
          </View>

          <View style={styles.body}>
            {todayInsight.content.split('\n\n').map((para, idx) => (
              <Text key={idx} style={styles.paragraph}>{para}</Text>
            ))}
          </View>

          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>י״ב</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{todayInsight.author}</Text>
            </View>
            <Pressable style={styles.shareBtn} onPress={handleShare} accessibilityRole="button">
              <Ionicons name="share-social-outline" size={16} color="#fff" />
              <Text style={styles.shareText}>שיתוף</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.nextReminder}>
          <Text style={styles.reminderText}>💫 התובנה הבאה תגיע מחר בשעה 08:00</Text>
          <Text style={styles.reminderSub}>הפעל התראות כדי לקבל אותה בזמן אמת</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,58,138,0.12)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_BLUE,
  },
  content: {
    padding: 20,
    paddingBottom: 64,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  categoryChip: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(30,58,138,0.14)',
  },
  categoryText: {
    color: PRIMARY_BLUE,
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.6,
  },
  title: {
    marginTop: 18,
    textAlign: 'right',
    color: DEEP_BLUE,
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 18,
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11,27,58,0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    marginTop: 1,
  },
  metaText: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
  body: {
    marginTop: 20,
    gap: 16,
  },
  paragraph: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'right',
    fontFamily: 'Poppins_400Regular',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  authorInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  authorName: {
    color: DEEP_BLUE,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  authorTitle: {
    marginTop: 2,
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  shareText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  nextReminder: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(30,58,138,0.08)',
    alignItems: 'center',
    gap: 6,
  },
  reminderText: {
    color: DEEP_BLUE,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  reminderSub: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontFamily: 'Poppins_500Medium',
  },
  insightsNav: {
    marginBottom: 16,
  },
  insightTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(30,58,138,0.1)',
  },
  insightTabActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  insightTabText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: PRIMARY_BLUE,
  },
  insightTabTextActive: {
    color: '#fff',
  },
})
