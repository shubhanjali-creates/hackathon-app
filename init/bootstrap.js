const dotenv = require("dotenv");
dotenv.config();

const Student = require("../models/student");
const Club = require("../models/Club");
const clubData = require("./clubs.json");
const studentData = require("./students.js").data;
const { appointClubLeader } = require("../middleware/roles");

const ADMIN_ROLL_NUMBERS = ["BT2021005", "BT2024008", "BT2023011"];

const CLUB_LEADER_ASSIGNMENTS = [
  { rollNumber: "BT2021001", clubName: "Shaurya" },
  { rollNumber: "BT2022002", clubName: "Nrityam" },
  { rollNumber: "BT2023007", clubName: "Sanskriti" },
  { rollNumber: "BT2021013", clubName: "Technocracy" },
  { rollNumber: "BT2022018", clubName: "TCP" },
];

async function seedStudentsIfEmpty() {
  const count = await Student.countDocuments();
  if (count > 0) return;

  await Student.insertMany(
    studentData.map((s) => ({ ...s, role: "student", clubId: null }))
  );
  console.log(`Seeded ${studentData.length} students`);
}

async function seedClubsIfEmpty() {
  const count = await Club.countDocuments();
  if (count > 0) return;

  await Club.insertMany(clubData);
  console.log(`Seeded ${clubData.length} clubs`);
}

async function seedRolesIfMissing() {
  const adminCount = await Student.countDocuments({ role: "admin" });
  if (adminCount > 0) return;

  for (const rollNumber of ADMIN_ROLL_NUMBERS) {
    const updated = await Student.findOneAndUpdate(
      { rollNumber },
      { role: "admin", clubId: null },
      { returnDocument: "after" }
    );
    if (updated) {
      console.log(`Assigned admin: ${updated.name} (${rollNumber})`);
    }
  }

  for (const { rollNumber, clubName } of CLUB_LEADER_ASSIGNMENTS) {
    const student = await Student.findOne({ rollNumber });
    const club = await Club.findOne({ name: clubName });
    if (!student || !club) continue;

    await appointClubLeader(student._id, club._id);
    console.log(`Assigned club leader: ${student.name} -> ${clubName}`);
  }
}

async function ensureDatabaseSeeded() {
  try {
    await seedStudentsIfEmpty();
    await seedClubsIfEmpty();
    await seedRolesIfMissing();
  } catch (err) {
    console.error("Database bootstrap failed:", err.message);
  }
}

module.exports = { ensureDatabaseSeeded };
