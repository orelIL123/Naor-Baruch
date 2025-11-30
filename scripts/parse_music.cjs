const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../music_page.html');
const outputPath = path.join(__dirname, '../music_data.json');

try {
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Regex to find video items
    // Looking for data-video-id="..." and data-video-title="..."
    // The HTML structure seems to have these attributes on the .sby_item div

    const regex = /data-video-id="([^"]+)"[^>]*data-video-title="([^"]+)"/g;
    let match;
    const musicData = [];
    const seenIds = new Set();

    while ((match = regex.exec(html)) !== null) {
        const videoId = match[1];
        let title = match[2];

        // Clean up title (remove HTML entities, quotes, etc.)
        title = title.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;br \/&gt;/g, '');

        // Remove the English translation part if present (often separated by | or -)
        // But maybe keep it for now.

        if (!seenIds.has(videoId)) {
            musicData.push({
                title: title,
                youtubeId: videoId,
                imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                createdAt: new Date().toISOString(), // Use current time as placeholder
                category: 'ניגונים'
            });
            seenIds.add(videoId);
        }
    }

    console.log(`Found ${musicData.length} songs.`);
    fs.writeFileSync(outputPath, JSON.stringify(musicData, null, 2));
    console.log(`Saved to ${outputPath}`);

} catch (error) {
    console.error('Error parsing music HTML:', error);
}
