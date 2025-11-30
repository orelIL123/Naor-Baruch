const admin = require('firebase-admin')
const serviceAccount = require('../yank-99f79-firebase-adminsdk-fbsvc-eaa2a3f7de.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'yank-99f79',
})

const auth = admin.auth()
const db = admin.firestore()

// New Admin user details
const ADMIN_EMAIL = 'yanuka.admin@gmail.com'
const ADMIN_PASSWORD = 'Admin123456!' // Simple password for testing
const ADMIN_DISPLAY_NAME = 'Yanuka Admin'

async function createNewAdminUser() {
    try {
        console.log('🚀 Creating new admin user...\n')

        // Check if user already exists
        let user
        try {
            user = await auth.getUserByEmail(ADMIN_EMAIL)
            console.log(`⚠️  User with email ${ADMIN_EMAIL} already exists`)
            console.log(`   UID: ${user.uid}`)
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // Create the user
                user = await auth.createUser({
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    displayName: ADMIN_DISPLAY_NAME,
                    emailVerified: true,
                })
                console.log(`✅ Created Firebase Auth user: ${user.uid}`)
            } else {
                throw error
            }
        }

        // Create or update user document in Firestore with admin role
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: ADMIN_EMAIL,
            displayName: ADMIN_DISPLAY_NAME,
            role: 'admin', // ← CRITICAL: This makes them admin!
            tier: 'vip',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastLogin: admin.firestore.FieldValue.serverTimestamp(),
            notificationsEnabled: true,
            fcmTokens: [],
            streakDays: 0,
            completedCourses: [],
            metadata: {
                onboardingCompleted: true,
                preferredLanguage: 'he'
            }
        }, { merge: true })

        console.log(`✅ Created/Updated Firestore user document with admin role`)
        console.log('\n' + '='.repeat(50))
        console.log('🎉 NEW ADMIN USER CREATED!')
        console.log('='.repeat(50))
        console.log(`📧 Email: ${ADMIN_EMAIL}`)
        console.log(`🔑 Password: ${ADMIN_PASSWORD}`)
        console.log(`🆔 UID: ${user.uid}`)
        console.log(`👤 Role: admin`)
        console.log('='.repeat(50))
        console.log('\n✅ You can now log in with these credentials!')
        console.log('⚠️  IMPORTANT: Change the password after first login!\n')

        process.exit(0)
    } catch (error) {
        console.error('❌ Error creating admin user:', error)
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        process.exit(1)
    }
}

createNewAdminUser()

