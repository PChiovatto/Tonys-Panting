import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/lead";

interface Props {
  leads: Lead[];
}

interface Appointment {
  id: string;
  title: string;
  notes: string | null;
  scheduled_at: string;
  lead_id: string | null;
  leads?: { name: string | null; phone: string | null; service_type: string | null } | null;
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Offset em horas do fuso America/New_York para uma data (EST -5, EDT -4). */
const nyOffsetHours = (date: Date): number => {
  const tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((tzDate.getTime() - utcDate.getTime()) / 3600000);
};

const fmtTimeET = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

const CalendarTab = ({ leads }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayForModal, setSelectedDayForModal] = useState<Date | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formTime, setFormTime] = useState("09:00");
  const [formNotes, setFormNotes] = useState("");
  const [formLeadId, setFormLeadId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = () => {
      supabase
        .from("appointments")
        .select("*, leads(name, phone, service_type)")
        .order("scheduled_at", { ascending: true })
        .then(({ data }) => {
          if (!mounted) return;
          setAppointments((data as unknown as Appointment[]) || []);
        });
    };

    load();

    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells: Date[] = [];
  for (let i = 0; i < totalCells; i++) {
    cells.push(new Date(year, month, i - startOffset + 1));
  }

  const appointmentsFor = (date: Date) =>
    appointments.filter((a) => isSameDay(new Date(a.scheduled_at), date));

  const dayAppointments = appointmentsFor(selectedDate);

  const upcoming = appointments
    .filter((a) => new Date(a.scheduled_at) > new Date())
    .slice(0, 5);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  const openModalFor = (date: Date) => {
    setSelectedDayForModal(date);
    setShowModal(true);
  };

  const deleteAppointment = async (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("appointments").delete().eq("id", id);
  };

  const saveAppointment = async () => {
    if (!formTitle.trim() || !selectedDayForModal || saving) return;
    setSaving(true);
    try {
      const y = selectedDayForModal.getFullYear();
      const m = String(selectedDayForModal.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDayForModal.getDate()).padStart(2, "0");
      const [hh, mm] = formTime.split(":").map(Number);

      // Base UTC com a hora "local de NY", depois corrigida pelo offset real do dia
      const base = new Date(Date.UTC(y, Number(m) - 1, Number(d), hh || 0, mm || 0));
      const offset = nyOffsetHours(base);
      const utcTime = new Date(base.getTime() - offset * 60 * 60 * 1000);

      await supabase.from("appointments").insert({
        title: formTitle.trim(),
        notes: formNotes,
        lead_id: formLeadId || null,
        scheduled_at: utcTime.toISOString(),
      });

      setShowModal(false);
      setFormTitle("");
      setFormTime("09:00");
      setFormNotes("");
      setFormLeadId("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="calendar-container" style={{ padding: 24 }}>
      <style>{`
        .calendar-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1024px) {
          .calendar-layout { grid-template-columns: 1fr 320px; }
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .calendar-cell {
          height: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #1A1A1A;
          border: none;
          background: transparent;
          position: relative;
        }
        .calendar-cell:hover { background: #F5F1EB; }
        .day-add-btn { display: none; }
        .calendar-cell:hover .day-add-btn { display: flex !important; }
        @media (max-width: 767px) {
          .calendar-container { padding: 16px !important; }
          .calendar-cell { height: 40px !important; font-size: 13px !important; }
          .calendar-day-label { font-size: 10px !important; padding: 4px 0 !important; }
          .calendar-month-label { font-size: 16px !important; }
          .calendar-nav-btn { padding: 8px !important; }
          .calendar-today-btn { font-size: 12px !important; padding: 4px 10px !important; }
          .upcoming-item { padding: 10px 0 !important; }
          .appt-modal { border-radius: 16px 16px 0 0 !important; align-self: flex-end; }
        }
      `}</style>

      <div className="calendar-layout">
        <div
          style={{
            background: "#FFFFFF",
            border: "0.5px solid #E8E2D8",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <button
              className="calendar-nav-btn"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#1A1A1A",
                padding: 4,
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2
                className="calendar-month-label"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: 18,
                  margin: 0,
                  color: "#1A1A1A",
                }}
              >
                {monthLabel}
              </h2>
              {!isCurrentMonth && (
                <button
                  className="calendar-today-btn"
                  onClick={() => {
                    setCurrentMonth(new Date());
                    setSelectedDate(new Date());
                  }}
                  style={{
                    padding: "4px 10px",
                    background: "#1A1A1A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 6,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  Today
                </button>
              )}
            </div>
            <button
              className="calendar-nav-btn"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#1A1A1A",
                padding: 4,
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="calendar-grid" style={{ marginBottom: 4 }}>
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="calendar-day-label"
                style={{
                  textAlign: "center",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  fontSize: 12,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  padding: "6px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {cells.map((date, i) => {
              const inMonth = date.getMonth() === month;
              const isToday = isSameDay(date, today);
              const isSelected = isSameDay(date, selectedDate);
              const dayAppts = appointmentsFor(date);

              let bg = "transparent";
              let color = "#1A1A1A";
              if (isSelected) {
                bg = "#1A1A1A";
                color = "#FFFFFF";
              } else if (isToday) {
                bg = "#C4291C";
                color = "#FFFFFF";
              }

              return (
                <div
                  key={i}
                  className="calendar-cell"
                  onClick={() => setSelectedDate(date)}
                  style={{
                    background: bg,
                    color,
                    opacity: inMonth ? 1 : 0.3,
                    borderRadius: isToday || isSelected ? "50%" : 8,
                  }}
                >
                  <span>{date.getDate()}</span>
                  {dayAppts.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      {dayAppts.slice(0, 3).map((_, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background:
                              isToday || isSelected ? "#FFFFFF" : "#C4291C",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    className="day-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModalFor(date);
                    }}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#C4291C",
                      color: "white",
                      border: "none",
                      fontSize: 12,
                      cursor: "pointer",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E8E2D8",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => openModalFor(selectedDate)}
                style={{
                  background: "#C4291C",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Add
              </button>
            </div>

            {dayAppointments.map((appt) => (
              <div
                key={appt.id}
                style={{
                  padding: 14,
                  background: "white",
                  borderRadius: 10,
                  border: "1px solid #E8E2D8",
                  borderLeft: "4px solid #C4291C",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#1A1A1A",
                        margin: "0 0 4px",
                      }}
                    >
                      {appt.title}
                    </p>
                    {appt.leads && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 12,
                          color: "#6B6560",
                          margin: "0 0 4px",
                        }}
                      >
                        {appt.leads.name}
                        {appt.leads.service_type
                          ? ` • ${appt.leads.service_type}`
                          : ""}
                      </p>
                    )}
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12,
                        color: "#C4291C",
                        fontWeight: 500,
                        margin: 0,
                      }}
                    >
                      {fmtTimeET(appt.scheduled_at)} ET
                    </p>
                    {appt.notes && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 12,
                          color: "#6B6560",
                          margin: "6px 0 0",
                        }}
                      >
                        {appt.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteAppointment(appt.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      fontSize: 16,
                      padding: "0 0 0 8px",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {dayAppointments.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "#9CA3AF",
                    margin: "0 0 12px",
                  }}
                >
                  No appointments for this day.
                </p>
                <button
                  onClick={() => openModalFor(selectedDate)}
                  style={{
                    background: "#C4291C",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add Appointment
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E8E2D8",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#1A1A1A",
                margin: "0 0 12px",
              }}
            >
              Upcoming
            </h3>
            {upcoming.length === 0 ? (
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  color: "#9CA3AF",
                }}
              >
                No upcoming appointments.
              </div>
            ) : (
              upcoming.map((appt, idx) => {
                const t = new Date(appt.scheduled_at);
                return (
                  <div
                    key={appt.id}
                    className="upcoming-item"
                    style={{
                      padding: "8px 0",
                      borderTop: idx === 0 ? "none" : "1px solid #F1EFE8",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {t.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "America/New_York",
                      })}{" "}
                      · {fmtTimeET(appt.scheduled_at)} ET
                    </div>
                    <div
                      style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}
                    >
                      {appt.title}
                    </div>
                    {appt.leads?.name && (
                      <div style={{ fontSize: 12, color: "#6B6560" }}>
                        {appt.leads.name}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="appt-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 20,
                color: "#1A1A1A",
                marginBottom: 8,
              }}
            >
              New Appointment
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#6B6560",
                marginBottom: 20,
              }}
            >
              {selectedDayForModal?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 6,
              }}
            >
              Title *
            </label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ex: Estimate visit, Follow-up call..."
              style={{
                width: "100%",
                height: 42,
                border: "1.5px solid #E8E2D8",
                borderRadius: 8,
                padding: "0 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                marginBottom: 16,
                outline: "none",
              }}
            />

            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 6,
              }}
            >
              Time (New York ET)
            </label>
            <input
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              style={{
                width: "100%",
                height: 42,
                border: "1.5px solid #E8E2D8",
                borderRadius: 8,
                padding: "0 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                marginBottom: 16,
                outline: "none",
              }}
            />

            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 6,
              }}
            >
              Link to Lead (optional)
            </label>
            <select
              value={formLeadId}
              onChange={(e) => setFormLeadId(e.target.value)}
              style={{
                width: "100%",
                height: 42,
                border: "1.5px solid #E8E2D8",
                borderRadius: 8,
                padding: "0 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                marginBottom: 16,
                outline: "none",
                background: "white",
              }}
            >
              <option value="">No lead selected</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} — {lead.service_type || "No service"}
                </option>
              ))}
            </select>

            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 6,
              }}
            >
              Notes (optional)
            </label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={3}
              placeholder="Any details about this appointment..."
              style={{
                width: "100%",
                border: "1.5px solid #E8E2D8",
                borderRadius: 8,
                padding: "10px 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                resize: "none",
                outline: "none",
                marginBottom: 20,
              }}
            />

            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid #E8E2D8",
                  background: "transparent",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#6B6560",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveAppointment}
                disabled={saving || !formTitle.trim()}
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "#C4291C",
                  color: "white",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving || !formTitle.trim() ? "not-allowed" : "pointer",
                  opacity: saving || !formTitle.trim() ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;
