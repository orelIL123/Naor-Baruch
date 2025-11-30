# ספר תולדות אדם - מדריך למפתחים

## סקירה כללית

נוספה תכונת "ספר תולדות אדם" שמאפשרת הצגת אלפי צדיקים ורבנים עם תמונותיהם וכל המידע עליהם.

## מבנה הקבצים

### מסכים חדשים:
1. **TzadikimScreen.jsx** - מסך רשימת כל הצדיקים בתצוגת כרטיסיות
2. **TzadikDetailScreen.jsx** - מסך פרטי צדיק עם כל המידע

### שינויים בקובצים קיימים:
- `HomeScreen.jsx` - הוספת כרטיסייה חדשה
- `App.js` - הוספת ניווט למסכים החדשים
- `firestore.rules` - הוספת כללים לקולקציית tzadikim
- `firestore.indexes.json` - הוספת אינדקסים לחיפוש ומיון

## מבנה נתונים ב-Firestore

### קולקציה: `tzadikim`

כל מסמך ב-`tzadikim` צריך לכלול את השדות הבאים:

```javascript
{
  // שדות חובה
  name: "string",              // שם הצדיק/רב (חובה)
  createdAt: Timestamp,        // תאריך יצירה (יוסיף אוטומטית)
  
  // שדות אופציונליים
  title: "string",             // תואר (למשל: "הרב", "האדמו״ר", "הגאון")
  imageUrl: "string",          // URL של תמונה מ-Firebase Storage
  biography: "string",         // תולדות חייו (טקסט ארוך)
  location: "string",          // מיקום (עיר/מדינה)
  birthDate: Timestamp,        // תאריך לידה
  deathDate: Timestamp,        // תאריך פטירה
  period: "string",            // תקופה (למשל: "המאה ה-18")
  additionalInfo: "string",    // מידע נוסף
  books: ["string"],           // מערך של שמות ספרים
  sourceUrl: "string",         // קישור למקור מידע
  wikiUrl: "string",           // קישור לויקיפדיה
  gallery: ["string"],         // מערך של URLs לתמונות נוספות
  viewCount: number,           // מספר צפיות (מתעדכן אוטומטית)
  
  // שדות נוספים לפי הצורך
  category: "string",          // קטגוריה (למשל: "חסידות", "ליטאים")
  tags: ["string"],            // תגיות לחיפוש
}
```

### דוגמה למסמך:

```javascript
{
  name: "רבי נחמן מברסלב",
  title: "האדמו״ר",
  imageUrl: "https://firebasestorage.googleapis.com/...",
  biography: "רבי נחמן מברסלב היה מייסד חסידות ברסלב...",
  location: "ברסלב, אוקראינה",
  birthDate: Timestamp.fromDate(new Date("1772-04-04")),
  deathDate: Timestamp.fromDate(new Date("1810-10-16")),
  period: "המאה ה-18",
  books: ["ליקוטי מוהר״ן", "סיפורי מעשיות", "שיחות הר״ן"],
  sourceUrl: "https://example.com",
  wikiUrl: "https://he.wikipedia.org/wiki/נחמן_מברסלב",
  gallery: [
    "https://firebasestorage.googleapis.com/.../image1.jpg",
    "https://firebasestorage.googleapis.com/.../image2.jpg"
  ],
  category: "חסידות",
  tags: ["ברסלב", "תיקון הכללי", "ליקוטי מוהר״ן"],
  createdAt: serverTimestamp(),
  viewCount: 0
}
```

## אינדקסים ב-Firestore

נוספו האינדקסים הבאים:

1. **מיון לפי שם** - `name (ASCENDING)`
   - משמש לתצוגת הרשימה לפי שם בסדר אלפביתי

2. **מיון לפי תאריך יצירה** - `createdAt (DESCENDING)`
   - משמש לתצוגת צדיקים שנוספו לאחרונה

3. **חיפוש לפי מיקום ושם** - `location (ASCENDING) + name (ASCENDING)`
   - משמש לחיפוש וסינון לפי מיקום

## כללי אבטחה (Firestore Rules)

```javascript
match /tzadikim/{document=**} {
  allow read: if true;          // קריאה פתוחה לכל
  allow write: if isAdmin();    // כתיבה רק למנהלים
}
```

## הוספת צדיקים

### אפשרות 1: דרך Firebase Console

1. פתח את Firebase Console
2. עבור ל-Firestore Database
3. בחר בקולקציה `tzadikim`
4. לחץ על "Add document"
5. מלא את השדות לפי המבנה לעיל
6. העלה תמונות ל-Firebase Storage והעתק את ה-URL

### אפשרות 2: דרך פאנל האדמין (לעתיד)

ניתן להוסיף טאב "צדיקים" ב-AdminScreen.jsx עם טופס להוספת צדיקים.

### אפשרות 3: דרך Script

ניתן ליצור script ב-`scripts/` לייבוא המוני של צדיקים מקובץ JSON או Excel.

## תכונות המסך

### מסך רשימת הצדיקים (TzadikimScreen):
- ✅ תצוגת כרטיסיות בגריד (2 עמודות)
- ✅ חיפוש לפי שם, תואר, או מיקום
- ✅ טעינה הדרגתית (pagination) - 20 צדיקים בכל פעם
- ✅ תצוגה מקדימה של תמונה ושם

### מסך פרטי הצדיק (TzadikDetailScreen):
- ✅ תמונה ראשית גדולה
- ✅ שם ותואר
- ✅ כרטיסיות מידע (מיקום, תאריכים, תקופה)
- ✅ תולדות חייו
- ✅ רשימת ספרים/חיבורים
- ✅ קישורים למקורות
- ✅ גלריית תמונות נוספות
- ✅ שיתוף
- ✅ מעקב צפיות (viewCount)

## תמונות

התמונות נשמרות ב-Firebase Storage בנתיב:
```
tzadikim/{tzadikId}/{imageName}.jpg
```

מומלץ:
- גודל תמונה ראשית: 800x800px (ריבוע)
- פורמט: JPG או PNG
- גודל קובץ מקסימלי: 2MB
- תמונות גלריה: 600x600px

## ביצועים

- המסך תומך באלפי צדיקים בזכות טעינה הדרגתית
- חיפוש מתבצע client-side (מהיר)
- תמונות נטענות lazy loading
- אינדקסים מותאמים לחיפוש מהיר

## שיפורים עתידיים אפשריים

1. ✅ הוספת טאב צדיקים לפאנל האדמין
2. ✅ סינון לפי קטגוריות/תגיות
3. ✅ מיון (א-ב, תאריך, צפיות)
4. ✅ הוספת תגיות לחיפוש
5. ✅ מערכת הערות/משוב
6. ✅ קישורים בין צדיקים (מורים-תלמידים)
7. ✅ מפה גאוגרפית

## הערות חשובות

- שדה `name` הוא חובה ויש לו אינדקס
- כל התאריכים צריך להיות מסוג Timestamp
- מומלץ להוסיף תמונה לכל צדיק
- התמונות צריכות להיות בפורמט URL מלא מ-Firebase Storage
- שדה `viewCount` מתעדכן אוטומטית כאשר משתמש צופה בפרטי הצדיק

## בדיקות

1. בדוק שהכרטיסייה מופיעה בדף הבית
2. בדוק ניווט למסך רשימת הצדיקים
3. בדוק חיפוש וסינון
4. בדוק פתיחת מסך פרטי צדיק
5. בדוק שיתוף
6. בדוק טעינה הדרגתית (אם יש יותר מ-20 צדיקים)

## פתרון בעיות

### האינדקסים לא נוצרו:
- עבור ל-Firebase Console → Firestore → Indexes
- בדוק שהאינדקסים רשומים
- אם לא, הוסף אותם ידנית או הפעל `firebase deploy --only firestore:indexes`

### התמונות לא נטענות:
- בדוק שה-URL נכון
- בדוק שהכללים ב-Storage מאפשרים קריאה
- בדוק חיבור לאינטרנט

### החיפוש לא עובד:
- החיפוש הוא client-side, לא צריך אינדקסים מיוחדים
- ודא שהשדות name, title, location קיימים

