# מדריך לשיעורים קצרים (רילסים)

## סקירה כללית

מסך השיעורים הקצרים מאפשר למשתמשים לצפות בסרטוני YouTube קצרים (רילסים) מהרב. המסך כולל:
- ממשק דמוי רילס (TikTok/Instagram Reels) - גלילה אנכית
- נגן YouTube מובנה
- כפתור ערבוב (Shuffle)
- ניגון אוטומטי (Auto-play)
- תצוגת מידע על כל שיעור

## מבנה Firestore

### Collection: `shortLessons`

כל מסמך ב-`shortLessons` צריך לכלול את השדות הבאים:

```javascript
{
  title: string,              // כותרת השיעור (חובה)
  description: string,        // תיאור השיעור (אופציונלי)
  youtubeUrl: string,         // קישור YouTube מלא (חובה)
  category: string,           // קטגוריה (אופציונלי, למשל: "תורה", "חיזוק", "הלכה")
  isActive: boolean,          // האם השיעור פעיל (חובה, default: true)
  createdAt: timestamp,       // תאריך יצירה (חובה)
  order: number              // סדר תצוגה (אופציונלי, default: 0)
}
```

### דוגמה למסמך:

```javascript
{
  title: "חיזוק יומי - חשיבות התפילה",
  description: "שיעור קצר על חשיבות התפילה בחיי היום יום",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  category: "חיזוק",
  isActive: true,
  createdAt: Timestamp.now(),
  order: 0
}
```

## הוספת שיעורים דרך Firebase Console

1. פתח את Firebase Console
2. עבור ל-Firestore Database
3. בחר את ה-Collection `shortLessons`
4. לחץ על "Add document"
5. מלא את השדות:
   - `title`: כותרת השיעור
   - `description`: תיאור (אופציונלי)
   - `youtubeUrl`: קישור YouTube מלא (כל פורמט נתמך)
   - `category`: קטגוריה (אופציונלי)
   - `isActive`: true
   - `createdAt`: לחץ על "timestamp" ובחר "now()"
   - `order`: מספר לסידור (0 = ראשון)

## הוספת שיעורים דרך Admin Panel

אם יש לך גישה ל-Admin Panel, ניתן להוסיף שיעורים דרך הממשק.

## פורמטי קישורי YouTube נתמכים

המערכת תומכת בכל הפורמטים הבאים:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`

המערכת תדע לחלץ את ה-Video ID אוטומטית מכל אחד מהפורמטים.

## תכונות המסך

### 1. גלילה אנכית (Reels Style)
- גלילה אנכית בין השיעורים
- כל שיעור תופס את כל המסך
- מעבר אוטומטי לשיעור הבא בסיום השיעור הנוכחי (אם ניגון אוטומטי מופעל)

### 2. כפתור ערבוב (Shuffle)
- לחיצה על כפתור הערבוב מערבבת את סדר השיעורים
- לחיצה נוספת מחזירה לסדר המקורי
- הערבוב נשמר עד יציאה מהמסך

### 3. ניגון אוטומטי (Auto-play)
- כאשר מופעל, השיעור הבא יתחיל אוטומטית בסיום השיעור הנוכחי
- כאשר כבוי, המשתמש צריך לגלול ידנית לשיעור הבא

### 4. תצוגת מידע
- כותרת השיעור
- תיאור (אם קיים)
- תג קטגוריה (אם קיים)
- מונה שיעורים (X / Y)

## סדר תצוגה

השיעורים מוצגים לפי:
1. `order` (עולה) - אם קיים
2. `createdAt` (יורד) - אם אין `order`

רק שיעורים עם `isActive: true` מוצגים.

## דוגמת קוד להוספת שיעור (Node.js)

```javascript
const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const db = getFirestore();

async function addShortLesson() {
  await db.collection('shortLessons').add({
    title: "חיזוק יומי - חשיבות התפילה",
    description: "שיעור קצר על חשיבות התפילה בחיי היום יום",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "חיזוק",
    isActive: true,
    createdAt: Timestamp.now(),
    order: 0
  });
}
```

## פתרון בעיות

### השיעורים לא מופיעים
1. ודא ש-`isActive: true`
2. ודא שיש `youtubeUrl` תקין
3. ודא שהקישור YouTube תקין ופועל

### הנגן לא עובד
1. ודא שהקישור YouTube תקין
2. ודא שיש חיבור לאינטרנט
3. נסה לסגור ולפתוח את המסך מחדש

### הערבוב לא עובד
1. ודא שיש יותר משיעור אחד
2. נסה לסגור ולפתוח את המסך מחדש

## הערות חשובות

- השיעורים נטענים מ-Firestore בכל פתיחה של המסך
- השיעורים מסוננים לפי `isActive: true`
- רק שיעורים עם קישור YouTube תקין יוצגו
- המערכת מחלצת אוטומטית את ה-Video ID מכל פורמט של קישור YouTube

