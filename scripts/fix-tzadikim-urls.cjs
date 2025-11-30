/**
 * Script to check and fix tzadikim with wrong image URLs
 * Run with: node scripts/fix-tzadikim-urls.cjs
 */

const admin = require('firebase-admin');
const serviceAccount = require('../yank-99f79-firebase-adminsdk-fbsvc-eaa2a3f7de.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'yank-99f79',
});

const db = admin.firestore();

async function fixTzadikimUrls() {
  try {
    console.log('🔍 Checking tzadikim...\n');

    console.log('📋 Fetching all tzadikim...');
    const snapshot = await db.collection('tzadikim').get();
    
    const tzadikimWithBadUrls = [];
    const tzadikimWithGoodUrls = [];
    
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const imageUrl = data.imageUrl || '';
      
      // Check if URL is from old project
      if (imageUrl.includes('naorbaruch-a6cc5') || 
          imageUrl.includes('storage.googleapis.com/naorbaruch')) {
        tzadikimWithBadUrls.push({
          id: docSnapshot.id,
          name: data.name,
          imageUrl: imageUrl
        });
      } else if (imageUrl && imageUrl.includes('yank-99f79')) {
        tzadikimWithGoodUrls.push({
          id: docSnapshot.id,
          name: data.name,
          imageUrl: imageUrl
        });
      } else if (!imageUrl) {
        console.log(`⚠️  Tzadik "${data.name}" (${docSnapshot.id}) has no imageUrl`);
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Total tzadikim: ${snapshot.size}`);
    console.log(`   ✅ Good URLs: ${tzadikimWithGoodUrls.length}`);
    console.log(`   ❌ Bad URLs (old project): ${tzadikimWithBadUrls.length}`);
    console.log(`   ⚠️  No URL: ${snapshot.size - tzadikimWithGoodUrls.length - tzadikimWithBadUrls.length}`);

    if (tzadikimWithBadUrls.length > 0) {
      console.log(`\n❌ Tzadikim with bad URLs:`);
      tzadikimWithBadUrls.forEach(tzadik => {
        console.log(`   - ${tzadik.name} (${tzadik.id})`);
        console.log(`     URL: ${tzadik.imageUrl.substring(0, 80)}...`);
      });

      console.log(`\n💡 Options:`);
      console.log(`   1. Delete tzadikim with bad URLs`);
      console.log(`   2. Clear imageUrl field (keep tzadikim, just remove bad URL)`);
      console.log(`   3. Do nothing (manual fix)`);
      console.log(`\n   To delete: node scripts/fix-tzadikim-urls.cjs --delete`);
      console.log(`   To clear URLs: node scripts/fix-tzadikim-urls.cjs --clear`);
    } else {
      console.log(`\n✅ All tzadikim have valid URLs!`);
    }

    // Handle command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--delete')) {
      console.log(`\n🗑️  Deleting ${tzadikimWithBadUrls.length} tzadikim with bad URLs...`);
      for (const tzadik of tzadikimWithBadUrls) {
        await db.collection('tzadikim').doc(tzadik.id).delete();
        console.log(`   ✅ Deleted: ${tzadik.name}`);
      }
      console.log(`\n✅ Done! Deleted ${tzadikimWithBadUrls.length} tzadikim.`);
    } else if (args.includes('--clear')) {
      console.log(`\n🧹 Clearing imageUrl for ${tzadikimWithBadUrls.length} tzadikim...`);
      for (const tzadik of tzadikimWithBadUrls) {
        await db.collection('tzadikim').doc(tzadik.id).update({
          imageUrl: ''
        });
        console.log(`   ✅ Cleared URL for: ${tzadik.name}`);
      }
      console.log(`\n✅ Done! Cleared URLs for ${tzadikimWithBadUrls.length} tzadikim.`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTzadikimUrls().then(() => {
  console.log('\n✅ Script completed!');
  process.exit(0);
});

