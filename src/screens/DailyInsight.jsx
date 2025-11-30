import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5'

const ACCENT = '#4A90E2'

const todayInsight = {
  id: 1,
  date: new Date().toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  title: 'תורה יומית: ניצוץ התפילה',
  content: `״אין תפילה יורדת ריקם״ אמר רב הינוקא, "אלא כל בקשה ממשיכה אור חדש".

היום אנו לומדים על ברכת "שומע תפילה". כאשר האדם לוחש את בקשתו, הוא מזכיר לעצמו שהקב״ה קרוב לכל קוראיו באמת.

התבונן רגע לפני שאתה מבקש: מהו החסד שאתה מבקש להאיר בעולם? איך תוכל לזכות שהאור הזה יאיר גם לאחרים?

קבל על עצמך מעשה טוב אחד שילווה את תפילתך היום.

נשימה עמוקה, הלב פתוח – והתפילה מגלה שער חדש.`,
  readTime: '3 דקות לימוד',
  author: 'רב הינוקא',
  category: 'לימוד יומי',
}

export default function DailyInsight() {
  const navigate = useNavigate()

  return (
    <div className="daily-insight-screen">
      {/* Header with back button */}
      <header className="di-header">
        <button
          className="di-back-btn"
          onClick={() => navigate('/')}
          aria-label="חזרה לדף הבית"
        >
          <IoArrowBack size={24} color={ACCENT} />
        </button>
        <h1 className="di-header-title">לימוד יומי</h1>
        <div style={{ width: 24 }} />
      </header>

      {/* Main content */}
      <main className="di-main">
        <article className="di-card">
          <div className="di-category">{todayInsight.category}</div>

          <h2 className="di-title">{todayInsight.title}</h2>

          <div className="di-meta">
            <div className="di-meta-item">
              <IoCalendarOutline size={16} color={ACCENT} />
              <span>{todayInsight.date}</span>
            </div>
            <div className="di-meta-item">
              <IoTimeOutline size={16} color={ACCENT} />
              <span>{todayInsight.readTime}</span>
            </div>
          </div>

          <div className="di-content">
            {todayInsight.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="di-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="di-author">
            <div className="di-author-avatar">ה׳</div>
            <div className="di-author-info">
              <div className="di-author-name">{todayInsight.author}</div>
              <div className="di-author-title">תפילה • ניגון • תורה</div>
            </div>
          </div>
        </article>

        <div className="di-footer-note">
          <p>✨ מחר נלמד קטע חדש מתוך תורת הינוקא</p>
          <p className="di-footer-small">המשך ברצף יומי מגלה אור מתמיד</p>
        </div>
      </main>
    </div>
  )
}

