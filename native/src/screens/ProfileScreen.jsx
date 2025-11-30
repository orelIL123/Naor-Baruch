import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

const PRIMARY_BLUE = '#1e3a8a'
const BG = '#FFFFFF'
const DEEP_BLUE = '#0b1b3a'

export default function ProfileScreen({ navigation, user, userRole }) {
  const isAdmin = userRole === 'admin'

  const handleLogout = () => {
    Alert.alert(
      'התנתקות',
      'האם אתה בטוח שברצונך להתנתק?',
      [
        {
          text: 'ביטול',
          style: 'cancel'
        },
        {
          text: 'התנתק',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth)
            } catch (error) {
              console.error('Logout error:', error)
              Alert.alert('שגיאה', 'אירעה שגיאה בהתנתקות')
            }
          }
        }
      ]
    )
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          style={styles.backButton}
          hitSlop={12}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-forward" size={28} color={DEEP_BLUE} />
        </Pressable>
        <Text style={styles.headerTitle}>פרופיל</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={60} color={PRIMARY_BLUE} />
          </View>
          {user ? (
            <>
              <Text style={styles.userName}>{user?.displayName || 'משתמש'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Ionicons name="shield-checkmark" size={16} color={PRIMARY_BLUE} />
                  <Text style={styles.adminBadgeText}>מנהל</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={styles.userName}>אורח</Text>
              <Text style={styles.userEmail}>אינך מחובר</Text>
              <Pressable
                style={styles.loginPromptButton}
                onPress={() => navigation?.navigate('Login')}
                accessibilityRole="button"
              >
                <Text style={styles.loginPromptText}>התחבר לחשבון</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הגדרות חשבון</Text>

          <Pressable style={styles.optionCard} accessibilityRole="button">
            <View style={styles.optionContent}>
              <View style={styles.optionRight}>
                <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>פרטים אישיים</Text>
                  <Text style={styles.optionDesc}>שם, אימייל ופרטי התקשרות</Text>
                </View>
              </View>
              <View style={styles.optionIcon}>
                <Ionicons name="person-outline" size={22} color={PRIMARY_BLUE} />
              </View>
            </View>
          </Pressable>

          {user && (
            <Pressable
              style={styles.optionCard}
              accessibilityRole="button"
              onPress={() => navigation?.navigate('ChangePassword')}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionRight}>
                  <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>אבטחה וסיסמה</Text>
                    <Text style={styles.optionDesc}>שינוי סיסמה והגדרות אבטחה</Text>
                  </View>
                </View>
                <View style={styles.optionIcon}>
                  <Ionicons name="lock-closed-outline" size={22} color={PRIMARY_BLUE} />
                </View>
              </View>
            </Pressable>
          )}

          <Pressable style={styles.optionCard} accessibilityRole="button">
            <View style={styles.optionContent}>
              <View style={styles.optionRight}>
                <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>התראות</Text>
                  <Text style={styles.optionDesc}>העדפות התראות ופוש</Text>
                </View>
              </View>
              <View style={styles.optionIcon}>
                <Ionicons name="notifications-outline" size={22} color={PRIMARY_BLUE} />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מנוי</Text>

          <View style={styles.subscriptionCard}>
            <LinearGradient
              colors={['#0b1b3a', '#162a56']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.subscriptionContent}>
              <Ionicons name="star" size={32} color={PRIMARY_BLUE} />
              <Text style={styles.subscriptionTitle}>חבר פרימיום</Text>
              <Text style={styles.subscriptionDesc}>
                גישה מלאה לכל התכנים, התראות והקהילה
              </Text>
              <Pressable style={styles.upgradeButton} accessibilityRole="button">
                <Text style={styles.upgradeButtonText}>שדרג מנוי</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Admin Section - Only visible to admins */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔐 ניהול</Text>

            <Pressable 
              style={styles.optionCard} 
              accessibilityRole="button"
              onPress={() => navigation?.navigate('Admin')}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionRight}>
                  <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>עריכת כרטיסיות</Text>
                    <Text style={styles.optionDesc}>ערוך כרטיסיות ראשיות, חדשות, קורסים והתראות</Text>
                  </View>
                </View>
                <View style={[styles.optionIcon, { backgroundColor: 'rgba(212,175,55,0.2)' }]}>
                  <Ionicons name="albums-outline" size={22} color={PRIMARY_BLUE} />
                </View>
              </View>
            </Pressable>

            <Pressable 
              style={styles.optionCard} 
              accessibilityRole="button"
              onPress={() => navigation?.navigate('Admin')}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionRight}>
                  <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>פאנל אדמין</Text>
                    <Text style={styles.optionDesc}>ניהול מלא של התוכן וההגדרות</Text>
                  </View>
                </View>
                <View style={[styles.optionIcon, { backgroundColor: 'rgba(212,175,55,0.2)' }]}>
                  <Ionicons name="construct-outline" size={22} color={PRIMARY_BLUE} />
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Additional Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>נוספים</Text>

          <Pressable style={styles.optionCard} accessibilityRole="button">
            <View style={styles.optionContent}>
              <View style={styles.optionRight}>
                <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>עזרה ותמיכה</Text>
                  <Text style={styles.optionDesc}>שאלות נפוצות וצור קשר</Text>
                </View>
              </View>
              <View style={styles.optionIcon}>
                <Ionicons name="help-circle-outline" size={22} color={PRIMARY_BLUE} />
              </View>
            </View>
          </Pressable>

          <Pressable style={styles.optionCard} accessibilityRole="button">
            <View style={styles.optionContent}>
              <View style={styles.optionRight}>
                <Ionicons name="chevron-back" size={20} color="#9ca3af" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>אודות</Text>
                  <Text style={styles.optionDesc}>גרסה ותנאי שימוש</Text>
                </View>
              </View>
              <View style={styles.optionIcon}>
                <Ionicons name="information-circle-outline" size={22} color={PRIMARY_BLUE} />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Logout/Login Button */}
        <View style={styles.section}>
          {user ? (
            <Pressable style={styles.logoutButton} accessibilityRole="button" onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#dc2626" />
              <Text style={styles.logoutText}>התנתק</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.loginButton}
              accessibilityRole="button"
              onPress={() => navigation?.navigate('Login')}
            >
              <Ionicons name="log-in-outline" size={22} color={PRIMARY_BLUE} />
              <Text style={styles.loginButtonText}>התחבר לחשבון</Text>
            </Pressable>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: Platform.select({ ios: 48, android: 34, default: 42 }),
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11,27,58,0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: DEEP_BLUE,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(30,58,138,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: DEEP_BLUE,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: DEEP_BLUE,
    marginBottom: 12,
    textAlign: 'right',
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,27,58,0.08)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    alignItems: 'flex-end',
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: DEEP_BLUE,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    textAlign: 'right',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,58,138,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionCard: {
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 180,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,27,58,0.08)',
  },
  subscriptionContent: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: PRIMARY_BLUE,
    marginTop: 12,
    marginBottom: 8,
  },
  subscriptionDesc: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#ffffff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(220,38,38,0.2)',
  },
  logoutText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#dc2626',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
  },
  adminBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_BLUE,
  },
  loginPromptButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  loginPromptText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#ffffff',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
  },
  loginButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_BLUE,
  },
})
