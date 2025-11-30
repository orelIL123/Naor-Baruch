import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Share, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const PRIMARY_BLUE = '#1e3a8a'
const BG = '#FFFFFF'
const DEEP_BLUE = '#0b1b3a'

export default function PrayerDetailScreen({ route, navigation }) {
  const { prayer } = route.params || {}
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  // Get image source - ONLY from Firestore URL, no local fallbacks
  const getImageSource = () => {
    // Only use URL from Firestore
    if (prayer?.imageUrl) {
      if (typeof prayer.imageUrl === 'string' && prayer.imageUrl.trim() !== '') {
        if (prayer.imageUrl.startsWith('http')) {
          return { uri: prayer.imageUrl }
        }
      }
    }
    
    // No fallback - return null if no URL
    return null
  }
  
  const imageSource = getImageSource()
  
  // Debug logging
  React.useEffect(() => {
    if (prayer) {
      console.log('Prayer data:', {
        id: prayer.id,
        title: prayer.title,
        imageUrl: prayer.imageUrl,
        pdfUrl: prayer.pdfUrl,
        hasImageSource: !!imageSource
      })
    }
  }, [prayer, imageSource])

  const handleShare = async () => {
    try {
      const message = `${prayer.title}\n\n${prayer.description || ''}\n\n${prayer.content || ''}`
      await Share.share({
        message: message
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (!prayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={PRIMARY_BLUE} />
          </Pressable>
          <Text style={styles.headerTitle}>תפילה</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>לא נמצאה תפילה</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[BG, '#f5f5f5']} style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={PRIMARY_BLUE} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{prayer.title}</Text>
        <Pressable
          style={styles.shareBtn}
          onPress={handleShare}
          accessibilityRole="button"
        >
          <Ionicons name="share-social-outline" size={20} color={PRIMARY_BLUE} />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Prayer Image */}
        {imageSource ? (
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_BLUE} />
              </View>
            )}
            <Image
              source={imageSource}
              style={styles.prayerImage}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={(error) => {
                console.error('Image load error:', error.nativeEvent.error)
                setImageError(true)
                setImageLoading(false)
              }}
            />
            {imageError && (
              <View style={styles.imageErrorContainer}>
                <Ionicons name="image-outline" size={48} color={PRIMARY_BLUE} style={{ opacity: 0.3 }} />
                <Text style={styles.imageErrorText}>לא ניתן לטעון תמונה</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={64} color={PRIMARY_BLUE} style={{ opacity: 0.2 }} />
          </View>
        )}

        {/* Prayer Category */}
        {prayer.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{prayer.category}</Text>
          </View>
        )}

        {/* Prayer Title */}
        <Text style={styles.title}>{prayer.title}</Text>

        {/* Prayer Description */}
        {prayer.description && (
          <Text style={styles.description}>{prayer.description}</Text>
        )}

        {/* Prayer Content */}
        {prayer.content && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{prayer.content}</Text>
          </View>
        )}

        {/* PDF Download Button */}
        {prayer.pdfUrl && prayer.pdfUrl.trim() !== '' && prayer.pdfUrl.startsWith('http') ? (
          <Pressable
            style={styles.pdfButton}
            onPress={() => {
              console.log('Opening PDF:', prayer.pdfUrl)
              // Only use URL from Firestore - no local files
              navigation.navigate('PdfViewer', { 
                pdf: { uri: prayer.pdfUrl }, 
                title: prayer.title 
              })
            }}
            accessibilityRole="button"
          >
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.pdfButtonText}>פתיחת PDF</Text>
          </Pressable>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="heart" size={24} color={PRIMARY_BLUE} style={{ opacity: 0.5 }} />
          <Text style={styles.footerText}>תפילה זו נכתבה על ידי הגאון הינוקא שליט"א</Text>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11,27,58,0.1)',
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
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_BLUE,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,58,138,0.12)',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  prayerImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  imageErrorText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(30,58,138,0.14)',
    marginBottom: 16,
  },
  categoryText: {
    color: PRIMARY_BLUE,
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Heebo_700Bold',
    color: DEEP_BLUE,
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 24,
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,27,58,0.08)',
  },
  contentText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: DEEP_BLUE,
    textAlign: 'right',
    lineHeight: 32,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: PRIMARY_BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#6b7280',
  },
})

