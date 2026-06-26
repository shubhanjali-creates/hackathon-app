const express = require("express");
const router = express.Router();
const Event = require("../models/event");

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// GET /calendar  -> show the calendar for a given month/year (defaults to current)
router.get("/", async (req, res) => {
  try {
    const today = new Date();

    let month = parseInt(req.query.month);
    let year = parseInt(req.query.year);
    if (isNaN(month) || month < 0 || month > 11) month = today.getMonth();
    if (isNaN(year)) year = today.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startWeekday = firstDayOfMonth.getDay(); // 0 = Sunday

    // Fetch all events that fall within this month
    const events = await Event.find({
      date: {
        $gte: firstDayOfMonth,
        $lt: new Date(year, month + 1, 1),
      },
    }).sort("date");

    // Group events by day-of-month for quick lookup in the view
    const eventsByDay = {};
    events.forEach((ev) => {
      const day = ev.date.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    });

    // Compute prev/next month + year for nav buttons
    let prevMonth = month - 1, prevYear = year;
    if (prevMonth < 0) { prevMonth = 11; prevYear -= 1; }

    let nextMonth = month + 1, nextYear = year;
    if (nextMonth > 11) { nextMonth = 0; nextYear += 1; }

    res.render("calendar", {
      month,
      year,
      monthNames: MONTH_NAMES,
      daysInMonth,
      startWeekday,
      eventsByDay,
      prevMonth,
      prevYear,
      nextMonth,
      nextYear,
      today,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong loading the calendar.");
  }
});

// POST /calendar/events -> add a new event, then redirect back to that event's month
router.post("/events", async (req, res) => {
  // Only Club and Admin can create events
if (
  req.session.role !== "club" &&
  req.session.role !== "admin"
) {
  return res.status(403).send("Only Clubs and Admins can create events.");
}
  try {
    const { title, description, date, startTime, endTime, location, club } = req.body;

    if (!title || !date) {
      return res.status(400).send("Title and date are required.");
    }

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      location,
      club,
    });

    await newEvent.save();

    const eventDate = new Date(date);
    res.redirect(`/calendar?month=${eventDate.getMonth()}&year=${eventDate.getFullYear()}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong adding the event.");
  }
});

module.exports = router;