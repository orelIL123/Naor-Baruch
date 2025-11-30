const admin = require('firebase-admin');
const serviceAccount = require('../yank-99f79-firebase-adminsdk-fbsvc-eaa2a3f7de.json');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'yank-99f79',
  storageBucket: 'yank-99f79.firebasestorage.app'
});

const db = admin.firestore();

// Read data from data.json
const dataPath = path.join(__dirname, '../data.json');
let rawData = {};
try {
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  rawData = JSON.parse(fileContent);
  console.log('Loaded data.json successfully');
} catch (error) {
  console.error('Error reading data.json:', error);
  process.exit(1);
}

// Read music data
const musicDataPath = path.join(__dirname, '../music_data.json');
let musicData = [];
try {
  if (fs.existsSync(musicDataPath)) {
    const musicContent = fs.readFileSync(musicDataPath, 'utf8');
    musicData = JSON.parse(musicContent);
    console.log(`Loaded ${musicData.length} songs from music_data.json`);
  }
} catch (error) {
  console.error('Error reading music_data.json:', error);
}

// Helper to generate ID from string
function generateId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Helper to parse date
function parseDate(dateStr) {
  try {
    if (!dateStr) return new Date().toISOString();
    // Handle various formats if needed, for now assume standard or let Date parse it
    return new Date(dateStr).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}

async function populateFirestore() {
  console.log('Starting to populate Firestore...\n');

  try {
    // 1. Prayers
    if (rawData['תפילות']) {
      console.log('Processing Prayers...');
      const prayersBatch = db.batch();
      const prayersRef = db.collection('prayers');

      // Delete existing prayers first (optional, but good for clean state)
      const existingPrayers = await prayersRef.get();
      existingPrayers.docs.forEach(doc => prayersBatch.delete(doc.ref));

      rawData['תפילות'].forEach(item => {
        const id = item.ID ? `prayer-${item.ID}` : `prayer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const docRef = prayersRef.doc(id);

        prayersBatch.set(docRef, {
          id: id,
          title: item['כותרת'] || '',
          category: item['קטגוריה'] || 'כללי',
          pdfUrl: item['קישור PDF'] || '',
          imageUrl: item['קישור תמונה'] || '',
          pageUrl: item['עמוד'] || '',
          date: parseDate(item['תאריך']),
          description: item['כותרת'], // Use title as description if no description
          content: '', // No content text in excel
          createdAt: new Date().toISOString()
        });
      });

      await prayersBatch.commit();
      console.log(`✓ Added ${rawData['תפילות'].length} prayers`);
    }

    // 2. Music
    if (musicData.length > 0) {
      console.log('\nProcessing Music...');
      const musicBatch = db.batch();
      const musicRef = db.collection('music');

      // Delete existing music first
      const existingMusic = await musicRef.get();
      existingMusic.docs.forEach(doc => musicBatch.delete(doc.ref));
      await musicBatch.commit(); // Commit deletions before adding new items

      const addMusicBatch = db.batch(); // New batch for additions
      musicData.forEach((item, index) => {
        const docRef = musicRef.doc(); // Let Firestore generate ID
        addMusicBatch.set(docRef, {
          ...item,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await addMusicBatch.commit();
      console.log(`✓ Added ${musicData.length} songs`);
    }

    // 3. Books
    if (rawData['ספרים']) {
      console.log('\nProcessing Books...');
      const booksBatch = db.batch();
      const booksRef = db.collection('books');

      const existingBooks = await booksRef.get();
      existingBooks.docs.forEach(doc => booksBatch.delete(doc.ref));

      rawData['ספרים'].forEach((item, index) => {
        const id = `book-${index}`;
        const docRef = booksRef.doc(id);

        booksBatch.set(docRef, {
          id: id,
          title: item['שם הספר'] || '',
          price: item['מחיר'] || '',
          link: item['קישור'] || '',
          note: item['הערה'] || '',
          imageUrl: '', // Add placeholder or logic if image exists
          createdAt: new Date().toISOString()
        });
      });

      await booksBatch.commit();
      console.log(`✓ Added ${rawData['ספרים'].length} books`);
    }

    // 3. Lessons (Shiurim)
    if (rawData['שיעורים']) {
      console.log('\nProcessing Lessons...');
      const lessonsBatch = db.batch();
      const lessonsRef = db.collection('lessons');

      const existingLessons = await lessonsRef.get();
      existingLessons.docs.forEach(doc => lessonsBatch.delete(doc.ref));

      rawData['שיעורים'].forEach((item, index) => {
        const id = `lesson-${index}`;
        const docRef = lessonsRef.doc(id);

        lessonsBatch.set(docRef, {
          id: id,
          title: item['כותרת'] || '',
          date: parseDate(item['תאריך']),
          views: item['צפיות'] || '',
          youtubeId: item['YouTube ID'] || '',
          link: item['קישור'] || '',
          description: item['תיאור'] || '',
          createdAt: new Date().toISOString()
        });
      });

      await lessonsBatch.commit();
      console.log(`✓ Added ${rawData['שיעורים'].length} lessons`);
    }

    // 4. Contact Info
    if (rawData['פרטי קשר']) {
      console.log('\nProcessing Contact Info...');
      const contactBatch = db.batch();
      const contactRef = db.collection('contact');

      const existingContact = await contactRef.get();
      existingContact.docs.forEach(doc => contactBatch.delete(doc.ref));

      rawData['פרטי קשר'].forEach((item, index) => {
        const id = `contact-${index}`;
        const docRef = contactRef.doc(id);

        contactBatch.set(docRef, {
          id: id,
          type: item['סוג'] || '',
          value: item['ערך'] || '',
          createdAt: new Date().toISOString()
        });
      });

      await contactBatch.commit();
      console.log(`✓ Added ${rawData['פרטי קשר'].length} contact items`);
    }

    // 5. About Info
    if (rawData['אודות הינוקא']) {
      console.log('\nProcessing About Info...');
      const aboutBatch = db.batch();
      const aboutRef = db.collection('about');

      const existingAbout = await aboutRef.get();
      existingAbout.docs.forEach(doc => aboutBatch.delete(doc.ref));

      rawData['אודות הינוקא'].forEach((item, index) => {
        const id = `about-${index}`;
        const docRef = aboutRef.doc(id);

        aboutBatch.set(docRef, {
          id: id,
          field: item['שדה'] || '',
          value: item['ערך'] || '',
          createdAt: new Date().toISOString()
        });
      });

      await aboutBatch.commit();
      console.log(`✓ Added ${rawData['אודות הינוקא'].length} about items`);
    }

    // 6. Donations (Israel & USA)
    console.log('\nProcessing Donations...');
    const donationsBatch = db.batch();
    const donationsRef = db.collection('donations');

    const existingDonations = await donationsRef.get();
    existingDonations.docs.forEach(doc => donationsBatch.delete(doc.ref));

    if (rawData['תרומות ישראל']) {
      const docRef = donationsRef.doc('israel');
      donationsBatch.set(docRef, {
        region: 'israel',
        data: rawData['תרומות ישראל']
      });
    }

    if (rawData['תרומות ארהב']) {
      const docRef = donationsRef.doc('usa');
      donationsBatch.set(docRef, {
        region: 'usa',
        data: rawData['תרומות ארהב']
      });
    }

    await donationsBatch.commit();
    console.log('✓ Added donation info');

    console.log('\n✅ Successfully populated Firestore with all data!');
  } catch (error) {
    console.error('Error populating Firestore:', error);
  }
}

populateFirestore();
