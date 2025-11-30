const admin = require('firebase-admin')
const serviceAccount = require('../yank-99f79-firebase-adminsdk-fbsvc-eaa2a3f7de.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'yank-99f79',
    storageBucket: 'yank-99f79.firebasestorage.app'
})

const db = admin.firestore()

// Sample newsletters data
const sampleNewsletters = [
    {
        title: 'פרשת בראשית',
        description: 'עלון שבועי לפרשת בראשית עם חידושי תורה',
        category: 'פרשת השבוע',
        fileType: 'pdf',
        fileUrl: 'https://example.com/sample.pdf', // Replace with actual URL
        thumbnailUrl: '',
        publishDate: new Date('2024-01-15'),
    },
    {
        title: 'פרשת נח',
        description: 'עלון שבועי לפרשת נח',
        category: 'פרשת השבוע',
        fileType: 'pdf',
        fileUrl: 'https://example.com/sample2.pdf',
        thumbnailUrl: '',
        publishDate: new Date('2024-01-22'),
    },
    {
        title: 'הלכות שבת',
        description: 'סיכום הלכות שבת',
        category: 'הלכה',
        fileType: 'pdf',
        fileUrl: 'https://example.com/sample3.pdf',
        thumbnailUrl: '',
        publishDate: new Date('2024-01-10'),
    },
]

async function addSampleNewsletters() {
    try {
        console.log('Adding sample newsletters...')

        const newslettersRef = db.collection('newsletters')

        for (const newsletter of sampleNewsletters) {
            await newslettersRef.add({
                ...newsletter,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            })
        }

        console.log(`✓ Added ${sampleNewsletters.length} sample newsletters`)
        console.log('Done!')
        process.exit(0)
    } catch (error) {
        console.error('Error adding newsletters:', error)
        process.exit(1)
    }
}

addSampleNewsletters()
