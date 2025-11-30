import React from 'react'
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image, Linking, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

const PRIMARY_BLUE = '#1e3a8a'
const BG = '#FFFFFF'

export default function PdfViewerScreen({ route, navigation }) {
  const { pdf, title } = route.params || {}
  const [pdfUri, setPdfUri] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const loadPdf = async () => {
      try {
        console.log('Loading PDF:', pdf)
        if (pdf) {
          let uri = null
          
          // Check if pdf is a URL string
          if (typeof pdf === 'string') {
            if (pdf.startsWith('http')) {
              uri = pdf
            }
          } 
          // If it's an object with uri property (from Firestore)
          else if (pdf.uri) {
            if (pdf.uri.startsWith('http')) {
              uri = pdf.uri
            }
          }
          
          if (uri) {
            setPdfUri(uri)
            setLoading(false)
          } else {
            console.error('PDF is not a valid URL:', pdf)
            setError(true)
            setLoading(false)
          }
        } else {
          setError(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading PDF:', error)
        setError(true)
        setLoading(false)
      }
    }
    loadPdf()
  }, [pdf])

  const handleOpenInBrowser = async () => {
    if (pdfUri && pdfUri.startsWith('http')) {
      try {
        const canOpen = await Linking.canOpenURL(pdfUri)
        if (canOpen) {
          await Linking.openURL(pdfUri)
        } else {
          Alert.alert('שגיאה', 'לא ניתן לפתוח את הקישור')
        }
      } catch (error) {
        console.error('Error opening URL:', error)
        Alert.alert('שגיאה', 'לא ניתן לפתוח את הקישור')
      }
    }
  }

  if (loading) {
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
          <Text style={styles.headerTitle}>{title || 'תפילה'}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
          <Text style={styles.loadingText}>טוען PDF...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !pdfUri) {
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
          <Text style={styles.headerTitle}>{title || 'תפילה'}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={64} color={PRIMARY_BLUE} style={{ opacity: 0.3 }} />
          <Text style={styles.errorText}>לא ניתן לטעון את הקובץ</Text>
          {pdfUri && pdfUri.startsWith('http') && (
            <Pressable
              style={styles.openBrowserButton}
              onPress={handleOpenInBrowser}
            >
              <Ionicons name="open-outline" size={20} color="#fff" />
              <Text style={styles.openBrowserButtonText}>פתח בדפדפן</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    )
  }

  // If it's a URL, open in browser instead of WebView (more reliable)
  if (pdfUri.startsWith('http')) {
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
          <Text style={styles.headerTitle}>{title || 'תפילה'}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.browserContainer}>
          <Ionicons name="document-text-outline" size={80} color={PRIMARY_BLUE} style={{ opacity: 0.3 }} />
          <Text style={styles.browserTitle}>קובץ PDF זמין</Text>
          <Text style={styles.browserDesc}>
            הקובץ יפתח בדפדפן או באפליקציית PDF
          </Text>
          <Pressable
            style={styles.openBrowserButton}
            onPress={handleOpenInBrowser}
          >
            <Ionicons name="open-outline" size={24} color="#fff" />
            <Text style={styles.openBrowserButtonText}>פתח PDF</Text>
          </Pressable>
          <Pressable
            style={styles.shareButton}
            onPress={async () => {
              try {
                await Linking.openURL(pdfUri)
              } catch (error) {
                console.error('Share error:', error)
                Alert.alert('שגיאה', 'לא ניתן לפתוח את הקובץ')
              }
            }}
          >
            <Ionicons name="share-outline" size={20} color={PRIMARY_BLUE} />
            <Text style={styles.shareButtonText}>שתף קישור</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  // This should not be reached if we only use URLs, but keep as fallback
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
        <Text style={styles.headerTitle}>{title || 'תפילה'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.errorContainer}>
        <Ionicons name="document-outline" size={64} color={PRIMARY_BLUE} style={{ opacity: 0.3 }} />
        <Text style={styles.errorText}>לא ניתן לטעון את הקובץ</Text>
      </View>
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
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_BLUE,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  shareButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
  },
  shareButtonText: {
    color: PRIMARY_BLUE,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#6b7280',
    textAlign: 'center',
  },
  browserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  browserTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: PRIMARY_BLUE,
    textAlign: 'center',
  },
  browserDesc: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  openBrowserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: PRIMARY_BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    minWidth: 200,
  },
  openBrowserButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
})
