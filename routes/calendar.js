const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const EventRequest = require("../models/EventRequest");
const Club = require("../models/Club");
const Student = require("../models/student");

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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
    const startWeekday = firstDayOfMonth.getDay();

    const events = await Event.find({
      date: {
        $gte: firstDayOfMonth,
        $lt: new Date(year, month + 1, 1),
      },
    }).sort("date");

    const eventsByDay = {};
    events.forEach((ev) => {
      const day = ev.date.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    });

    let prevMonth = month - 1, prevYear = year;
    if (prevMonth < 0) { prevMonth = 11; prevYear -= 1; }

    let nextMonth = month + 1, nextYear = year;
    if (nextMonth > 11) { nextMonth = 0; nextYear += 1; }

    let leaderClub = null;
    if (req.session.role === "club" && req.session.clubId) {
      leaderClub = await Club.findById(req.session.clubId);
    }

    let myEventRequests = [];
    if (req.session.studentId) {
      myEventRequests = await EventRequest.find({
        requestedById: req.session.studentId,
      }).sort({ createdAt: -1 }).limit(10);
    }

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
      leaderClub,
      myEventRequests,
      requestSubmitted: req.query.requested === "1",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong loading the calendar.");
  }
});

router.post("/events", async (req, res) => {
  if (
    req.session.role !== "club" &&
    req.session.role !== "admin"
  ) {
    return res.status(403).send("Only club leaders and admins can create events.");
  }

  try {
    let { title, description, date, startTime, endTime, location, club } = req.body;

    if (req.session.role === "club") {
      const leader = await Student.findById(req.session.studentId);
      if (!leader || !leader.clubId) {
        return res.status(403).send("You are not assigned to lead any club.");
      }
      const leaderClub = await Club.findById(leader.clubId);
      if (!leaderClub) {
        return res.status(403).send("Your club could not be found.");
      }
      club = leaderClub.name;
    }

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

router.post("/event-requests", async (req, res) => {
  if (req.session.role !== "student") {
    return res.status(403).send("Only students can submit event requests.");
  }

  try {
    const { title, description, date, startTime, endTime, location, club } = req.body;

    if (!title || !date) {
      return res.status(400).send("Title and date are required.");
    }

    await EventRequest.create({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      location,
      club,
      requestedBy: req.session.studentName,
      requestedById: req.session.studentId,
    });

    res.redirect("/calendar?requested=1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong submitting your event request.");
  }
});

module.exports = router;
