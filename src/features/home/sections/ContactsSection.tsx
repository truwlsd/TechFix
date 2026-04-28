import { CONTACTS } from "../data";
import s from "./sections.module.css";

export function ContactsSection() {
  return (
    <section className={s.contactsSection}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.contactsHeader}>
          <div className="section-label" style={{ justifyContent: "center" }}>Контакты</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Свяжитесь с нами</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CONTACTS.map((contact) => (
            <div key={contact.label} className={`glass-card ${s.contactGlass}`}>
              <div className={s.iconWrapMuted}>
                <contact.icon className={`w-5 h-5 ${s.howIcon}`} />
              </div>
              <p className={s.contactLabelTxt}>{contact.label}</p>
              <p className={s.contactValueTxt}>{contact.value}</p>
              <p className={s.contactSubTxt}>{contact.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
