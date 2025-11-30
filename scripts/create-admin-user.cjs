const admin = require('firebase-admin')
const serviceAccount = require('../yank-99f79-firebase-adminsdk-fbsvc-eaa2a3f7de.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'yank-99f79',
})

const auth = admin.auth()
const db = admin.firestore()

// Admin user details
const ADMIN_EMAIL = 'admin@hayanuka.com'
const ADMIN_PASSWORD = 'YanukaAdmin2024!' // Change this to a secure password
const ADMIN_DISPLAY_NAME = 'Admin'

async function createAdminUser() {
    try {
        console.log('Creating admin user...')

        // Check if user already exists
        let user
        try {
            user = await auth.getUserByEmail(ADMIN_EMAIL)
            console.log(`User with email ${ADMIN_EMAIL} already exists`)
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // Create the user
                user = await auth.createUser({
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    displayName: ADMIN_DISPLAY_NAME,
                    emailVerified: true,
                })
                console.log(`✓ Created Firebase Auth user: ${user.uid}`)
            } else {
                throw error
            }
        }

        // Create or update user document in Firestore with admin role
        await db.collection('users').doc(user.uid).set({
            email: ADMIN_EMAIL,
            displayName: ADMIN_DISPLAY_NAME,
            role: 'admin',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        console.log(`✓ Created/Updated Firestore user document with admin role`)
        console.log('\n=== Admin User Created ===')
        console.log(`Email: ${ADMIN_EMAIL}`)
        console.log(`Password: ${ADMIN_PASSWORD}`)
        console.log(`UID: ${user.uid}`)
        console.log('==========================\n')
        console.log('⚠️  IMPORTANT: Change the password after first login!')

        process.exit(0)
    } catch (error) {
        console.error('Error creating admin user:', error)
        process.exit(1)
    }
}

createAdminUser()
