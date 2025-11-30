# 📿 מדריך התחייבות תפילה שבועית

## סקירה כללית

מערכת התחייבות תפילה שבועית מאפשרת למשתמשים לרשום את שמם ולקחת על עצמם להתפלל עבור מישהו אחר במשך שבוע, ובמקביל מישהו אחר יתפלל עבורם.

## תכונות

### ✨ תכונות עיקריות:
1. **רישום התחייבות** - משתמשים רשומים יכולים ליצור התחייבות חדשה
2. **התאמה אוטומטית** - המערכת מתאימה בין משתמשים עם אותו סוג תפילה
3. **מעקב יומי** - סמן כל יום שהתפללת
4. **הורדת תפילות** - משתמשים רשומים יכולים להוריד תפילות (PDF או טקסט)
5. **מעקב התקדמות** - בר התקדמות ויזואלי להצגת ההתקדמות השבועית

### 🎨 סוגי תפילות:
- **זיווג** - תפילה לזיווג הגון
- **רפואה** - תפילה לרפואה שלמה
- **ילודה** - תפילה לילודה קלה

## מבנה נתונים ב-Firestore

### Collection: `prayerCommitments`

```javascript
{
  id: "auto-generated",
  userId: "string (Firebase Auth UID)",
  userName: "string (אוראל בן סיגל)",
  prayerType: "marriage | health | childbirth",
  status: "active | completed | expired",
  startDate: "timestamp",
  endDate: "timestamp", // startDate + 7 days
  assignedToUserId: "string? (מי שמתפלל עבורו)",
  assignedToUserName: "string?",
  dailyProgress: {
    day1: { completed: boolean, date: timestamp },
    day2: { completed: boolean, date: timestamp },
    // ... עד day7
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Firestore Rules

```javascript
match /prayerCommitments/{commitmentId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
  allow update: if isAuthenticated() && 
    (request.auth.uid == resource.data.userId || 
     request.auth.uid == resource.data.assignedToUserId);
  allow delete: if isAdmin();
}
```

## ניווט

המסך נגיש דרך:
- **מסך התפילות** - כפתור "התחייבות תפילה שבועית"
- **ניווט ישיר** - `navigation.navigate('PrayerCommitment')`

## הורדת תפילות

משתמשים רשומים יכולים להוריד תפילות:
- **PDF** - אם קיים `pdfUrl` בתפילה
- **קובץ טקסט** - אם קיים `content` בתפילה

הקבצים נשמרים במכשיר וניתן לשתף אותם.

## דרישות

### חבילות נדרשות (כבר קיימות):
- `expo-file-system` - להורדת קבצים
- `expo-sharing` - לשיתוף קבצים
- `firebase/firestore` - לניהול נתונים
- `expo-linear-gradient` - לעיצוב

## שימוש

1. **יצירת התחייבות**:
   - לחץ על "התחייבות חדשה"
   - הזן שם מלא (לדוגמה: אוראל בן סיגל)
   - בחר סוג תפילה
   - לחץ על "אישור"

2. **מעקב יומי**:
   - כל יום לחץ על המספר המתאים (1-7)
   - המערכת תסמן את היום כהושלם

3. **הורדת תפילה**:
   - לחץ על "הורד תפילה" בכרטיס ההתחייבות
   - הקובץ יורד וייפתח בחלון שיתוף

## הערות טכניות

- המערכת מתאימה אוטומטית בין משתמשים עם אותו סוג תפילה
- אם אין התאמה, המשתמש ימתין עד שיימצא מישהו אחר
- התחייבות נמשכת 7 ימים מתאריך ההתחלה
- רק משתמשים רשומים יכולים ליצור התחייבויות ולהוריד תפילות

