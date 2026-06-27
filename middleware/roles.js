const Student = require("../models/student");
const Club = require("../models/Club");

const isAdmin = (req, res, next) => {
  if (req.session.role === "admin") return next();
  return res.status(403).send("Access denied. Admins only.");
};

const isClubLeader = (req, res, next) => {
  if (req.session.role === "club" && req.session.clubId) return next();
  return res.status(403).send("Access denied. Club leaders only.");
};

const isAdminOrClubLeader = (req, res, next) => {
  if (req.session.role === "admin") return next();
  if (req.session.role === "club" && req.session.clubId) return next();
  return res.status(403).send("Access denied.");
};

const canManageClub = (clubId) => {
  return (req, res, next) => {
    if (req.session.role === "admin") return next();
    if (
      req.session.role === "club" &&
      req.session.clubId &&
      req.session.clubId === clubId.toString()
    ) {
      return next();
    }
    return res.status(403).send("You can only manage your own club.");
  };
};

async function appointClubLeader(studentId, clubId) {
  const student = await Student.findById(studentId);
  const club = await Club.findById(clubId);
  if (!student || !club) throw new Error("Student or club not found");

  if (student.clubId && student.clubId.toString() !== clubId.toString()) {
    await Club.findByIdAndUpdate(student.clubId, { leaderId: null });
  }

  if (club.leaderId && club.leaderId.toString() !== studentId.toString()) {
    await Student.findByIdAndUpdate(club.leaderId, {
      role: "student",
      clubId: null,
    });
  }

  await Student.findByIdAndUpdate(studentId, { role: "club", clubId });
  await Club.findByIdAndUpdate(clubId, { leaderId: studentId });

  return { student, club };
}

module.exports = {
  isAdmin,
  isClubLeader,
  isAdminOrClubLeader,
  canManageClub,
  appointClubLeader,
};
