# מדריך לסרטונים ארוכים

## סקירה כללית

מסך הסרטונים הארוכים מאפשר למשתמשים לצפות בסרטוני YouTube ארוכים (שיעורים מלאים) מהרב. המסך כולל:
- רשימת כל הסרטונים הארוכים
- נגן YouTube מובנה
- אפשרות הוספת סרטונים דרך המסך (לאדמין בלבד)

## מבנה Firestore

### Collection: `longLessons`

כל מסמך ב-`longLessons` צריך לכלול את השדות הבאים:

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
  title: "שיעור הכנה לימי חנוכה",
  description: "שיעור חובה על הכנה לימי חנוכה שנמסר בשטח יער-פארק בריטניה",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  category: "חנוכה",
  isActive: true,
  createdAt: Timestamp.now(),
  order: 0
}
```

## הוספת סרטונים דרך המסך (לאדמין בלבד)

1. פתח את מסך "סרטונים ארוכים"
2. לחץ על כפתור "הוסף שיעור" (מופיע רק לאדמין)
3. מלא את הטופס:
   - **כותרת** (חובה): כותרת השיעור
   - **תיאור** (אופציונלי): תיאור מפורט של השיעור
   - **קישור YouTube** (חובה): קישור מלא לסרטון YouTube
   - **קטגוריה** (אופציונלי): קטגוריה לסיווג השיעור
4. לחץ על "שמור"
5. השיעור יתווסף ויופיע ברשימה

## הוספת סרטונים דרך Firebase Console

1. פתח את Firebase Console
2. עבור ל-Firestore Database
3. בחר את ה-Collection `longLessons`
4. לחץ על "Add document"
5. מלא את השדות:
   - `title`: כותרת השיעור
   - `description`: תיאור (אופציונלי)
   - `youtubeUrl`: קישור YouTube מלא (כל פורמט נתמך)
   - `category`: קטגוריה (אופציונלי)
   - `isActive`: true
   - `createdAt`: לחץ על "timestamp" ובחר "now()"
   - `order`: מספר לסידור (0 = ראשון)

## פורמטי קישורי YouTube נתמכים

המערכת תומכת בכל הפורמטים הבאים:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`

המערכת תדע לחלץ את ה-Video ID אוטומטית מכל אחד מהפורמטים.

## תכונות המסך

### 1. רשימת סרטונים
- תצוגת כרטיסיות עם כל הסרטונים
- מידע על כל סרטון: כותרת, תיאור, קטגוריה
- לחיצה על סרטון פותחת את הנגן

### 2. נגן YouTube
- נגן מובנה בתוך האפליקציה
- פתיחה במסך מלא (Modal)
- אפשרות לסגירה ולחזרה לרשימה

### 3. הוספת סרטונים (אדמין בלבד)
- כפתור "הוסף שיעור" מופיע רק למשתמשים עם הרשאות אדמין
- טופס נוח להוספת סרטונים
- ולידציה אוטומטית של קישורי YouTube
- הוספה מיידית לרשימה

## סדר תצוגה

הסרטונים מוצגים לפי:
1. `createdAt` (יורד) - הסרטונים החדשים ביותר מופיעים ראשונים

רק סרטונים עם `isActive: true` מוצגים.

## דוגמת קוד להוספת סרטון (Node.js)

```javascript
const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const db = getFirestore();

async function addLongLesson() {
  await db.collection('longLessons').add({
    title: "שיעור הכנה לימי חנוכה",
    description: "שיעור חובה על הכנה לימי חנוכה שנמסר בשטח יער-פארק בריטניה",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "חנוכה",
    isActive: true,
    createdAt: Timestamp.now(),
    order: 0
  });
}
```

## פתרון בעיות

### הסרטונים לא מופיעים
1. ודא ש-`isActive: true`
2. ודא שיש `youtubeUrl` תקין
3. ודא שהקישור YouTube תקין ופועל

### הנגן לא עובד
1. ודא שהקישור YouTube תקין
2. ודא שיש חיבור לאינטרנט
3. נסה לסגור ולפתוח את המסך מחדש

### כפתור "הוסף שיעור" לא מופיע
1. ודא שיש לך הרשאות אדמין
2. ודא שהתחברת עם משתמש אדמין
3. נסה להתנתק ולהתחבר מחדש

## הערות חשובות

- הסרטונים נטענים מ-Firestore בכל פתיחה של המסך
- הסרטונים מסוננים לפי `isActive: true`
- רק סרטונים עם קישור YouTube תקין יוצגו
- המערכת מחלצת אוטומטית את ה-Video ID מכל פורמט של קישור YouTube
- הוספת סרטונים דרך המסך זמינה רק למשתמשים עם הרשאות אדמין

