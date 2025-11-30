# לימוד יומי - מדריך למפתחים

## סקירה כללית

נוסף מסך לימוד יומי משופר שמאפשר הצגת לימודים יומיים עם תמיכה בהקלטות, סרטונים, מלל ואפשרות עילוי נשמה.

## מבנה הקבצים

### מסך חדש:
- **DailyLearningScreen.jsx** - מסך לימוד יומי עם תמיכה בהקלטות/סרטונים/מלל

### שינויים בקובצים קיימים:
- `App.js` - הוספת ניווט למסך החדש
- `firestore.rules` - הוספת כללים לקולקציית dailyLearning
- `firestore.indexes.json` - הוספת אינדקס למיון לפי תאריך

## מבנה נתונים ב-Firestore

### קולקציה: `dailyLearning`

כל מסמך ב-`dailyLearning` צריך לכלול את השדות הבאים:

```javascript
{
  // שדות חובה
  title: "string",              // כותרת הלימוד (חובה)
  date: Timestamp,              // תאריך הלימוד (חובה)
  createdAt: Timestamp,         // תאריך יצירה (יוסיף אוטומטית)
  
  // שדות תוכן
  content: "string",            // תוכן הלימוד (מלל)
  category: "string",           // קטגוריה (למשל: "תפילה", "תורה", "חיזוק")
  author: "string",             // שם הכותב/השולח
  
  // מדיה
  audioUrl: "string",           // URL של הקלטה (Firebase Storage)
  videoUrl: "string",           // URL של סרטון
  youtubeId: "string",          // ID של סרטון YouTube
  imageUrl: "string",           // URL של תמונה
  
  // סטטיסטיקות (מתעדכנות אוטומטית)
  viewCount: number,            // מספר צפיות (default: 0)
  playCount: number,            // מספר האזנות (default: 0)
  soulElevations: number,       // מספר עילויי נשמה (default: 0)
  
  // שדות נוספים
  isActive: boolean,            // האם הלימוד פעיל (default: true)
  tags: ["string"],             // תגיות לחיפוש
}
```

### דוגמה למסמך:

```javascript
{
  title: "לימוד יומי - חשיבות התפילה",
  date: Timestamp.fromDate(new Date("2025-11-29")),
  content: "בס"ד\n\nאמרו חז\"ל: 'אין תפילה יורדת ריקם'...\n\nהתפילה היא ערוץ התקשורת שלנו עם הקב\"ה...",
  category: "תפילה",
  author: "הרב שלמה יהודה בארי",
  audioUrl: "https://firebasestorage.googleapis.com/.../learning-audio.mp3",
  youtubeId: "abc123xyz",
  imageUrl: "https://firebasestorage.googleapis.com/.../learning-image.jpg",
  viewCount: 0,
  playCount: 0,
  soulElevations: 0,
  isActive: true,
  tags: ["תפילה", "חיזוק", "יומי"],
  createdAt: serverTimestamp()
}
```

## אינדקסים ב-Firestore

נוסף האינדקס הבא:

1. **מיון לפי תאריך** - `date (DESCENDING)`
   - משמש לתצוגת הלימודים בסדר כרונולוגי (החדש ביותר ראשון)

## כללי אבטחה (Firestore Rules)

```javascript
match /dailyLearning/{document=**} {
  allow read: if true;          // קריאה פתוחה לכל
  allow write: if isAdmin();    // כתיבה רק למנהלים
  allow update: if true;        // עדכון פתוח (לעילוי נשמה, סטטיסטיקות)
}
```

**הערה חשובה:** הכלל `allow update: if true` מאפשר לכל אחד לעדכן את המסמך, מה שמשמש לעילוי נשמה וסטטיסטיקות. אם אתה רוצה להגביל זאת יותר, תוכל לשנות את הכלל.

## תכונות המסך

### מסך הלימוד היומי (DailyLearningScreen):
- ✅ תצוגת לימודים לפי תאריך
- ✅ בחירת לימוד לפי תאריך (tabs)
- ✅ תמיכה במלל
- ✅ נגן אודיו מובנה (הקלטות)
- ✅ נגן YouTube מובנה (סרטונים)
- ✅ תמונה ראשית
- ✅ כפתור עילוי נשמה
- ✅ מעקב צפיות והאזנות
- ✅ שיתוף
- ✅ Pull to refresh

### פונקציונליות עילוי נשמה:
- כפתור ייעודי לעילוי נשמה
- מונה של עילויי נשמה
- עדכון אוטומטי ב-Firestore

## הוספת לימודים יומיים

### דרך Firebase Console:

1. פתח את Firebase Console
2. עבור ל-Firestore Database
3. בחר בקולקציה `dailyLearning`
4. לחץ על "Add document"
5. מלא את השדות לפי המבנה לעיל
6. העלה תמונות/הקלטות ל-Firebase Storage והעתק את ה-URL

### דרך פאנל האדמין (לעתיד):

ניתן להוסיף טאב "לימוד יומי" ב-AdminScreen.jsx עם טופס להוספת לימודים.

## מדיה

### הקלטות:
- פורמט מומלץ: MP3
- גודל מקסימלי: 50MB
- איכות: 128-192 kbps

### סרטונים:
- YouTube: יש להזין את ה-YouTube ID בלבד
- קבצי וידאו: יש להעלות ל-Firebase Storage ולהזין URL

### תמונות:
- פורמט: JPG או PNG
- גודל מקסימלי: 5MB
- מימדים מומלצים: 1200x675px (16:9)

## ניווט

המסך נקרא `DailyLearning` וניתן לנווט אליו כך:

```javascript
navigation.navigate('DailyLearning')
```

**טיפ:** ניתן להוסיף כרטיסייה בדף הבית שמובילה למסך זה.

## ביצועים

- המסך תומך עד 30 לימודים (ניתן לשנות)
- טעינה הדרגתית לפי תאריך
- אופטימיזציה לטעינת מדיה

## שיפורים עתידיים אפשריים

1. ✅ הוספת טאב לימודים לפאנל האדמין
2. ✅ חיפוש לימודים
3. ✅ סינון לפי קטגוריה
4. ✅ הוספת תגיות לחיפוש
5. ✅ התראות push על לימודים חדשים
6. ✅ היסטוריית האזנה/צפייה
7. ✅ מערכת הערות/תגובות
8. ✅ הורדת הקלטות לאופליין

## הערות חשובות

- שדה `date` הוא חובה ויש לו אינדקס
- כל התאריכים צריך להיות מסוג Timestamp
- שדות `viewCount`, `playCount`, `soulElevations` מתעדכנות אוטומטית
- ההקלטות ננגנות ברקע גם כשהמסך לא פעיל
- הסרטונים של YouTube נטענים ישירות מה-YouTube

## בדיקות

1. בדוק שהמסך נטען
2. בדוק טעינת לימודים
3. בדוק נגן אודיו
4. בדוק נגן YouTube
5. בדוק עילוי נשמה
6. בדוק שיתוף
7. בדוק Pull to refresh

## פתרון בעיות

### האינדקס לא נוצר:
- עבור ל-Firebase Console → Firestore → Indexes
- בדוק שהאינדקס רשום
- אם לא, הוסף אותו ידנית או הפעל `firebase deploy --only firestore:indexes`

### ההקלטות לא נטענות:
- בדוק שה-URL נכון
- בדוק שהכללים ב-Storage מאפשרים קריאה
- בדוק חיבור לאינטרנט
- בדוק שפורמט הקובץ נתמך (MP3)

### עילוי נשמה לא עובד:
- בדוק את כללי Firestore
- בדוק שה-field `soulElevations` קיים במסמך

