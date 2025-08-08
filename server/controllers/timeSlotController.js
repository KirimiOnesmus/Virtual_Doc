const db = require("../config/db");
const dayjs = require("dayjs");

const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

const getDoctorTimeSlots = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const now = dayjs();
    const oneWeekLater = now.add(7, "day");

    const [slots] = await db.execute(
      `SELECT ts.id, ts.start_time, ts.end_time
       FROM timeslots ts
       LEFT JOIN appointments a ON ts.id = a.time_slot_id
       WHERE ts.doctor_id = ?
         AND ts.is_available = 1
         AND a.id IS NULL
         AND ts.start_time BETWEEN ? AND ?
       ORDER BY ts.start_time ASC`,
      [
        doctorId,
        now.format("YYYY-MM-DD HH:mm:ss"),
        oneWeekLater.format("YYYY-MM-DD HH:mm:ss"),
      ]
    );

    res.json(slots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const saveWeeklySchedule = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get doctorId from userId
    const [doctorRows] = await db.execute(
      "SELECT id FROM doctors WHERE user_id = ?",
      [userId]
    );
    if (doctorRows.length === 0) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }
    const doctorId = doctorRows[0].id;

    const schedule = req.body.schedule;

    // 2. Delete existing weekly_timeslots
    await db.execute("DELETE FROM weekly_timeslots WHERE doctor_id = ?", [
      doctorId,
    ]);

    // 3. Delete existing timeslots in next 7 days
    const now = dayjs();
    const oneWeekLater = now.add(7, "day");
    await db.execute(
      "DELETE FROM timeslots WHERE doctor_id = ? AND start_time BETWEEN ? AND ?",
      [
        doctorId,
        now.format("YYYY-MM-DD HH:mm:ss"),
        oneWeekLater.format("YYYY-MM-DD HH:mm:ss"),
      ]
    );

    // 4. Insert new weekly schedule
    const insertSchedule = schedule.map((day) =>
      db.execute(
        `INSERT INTO weekly_timeslots (doctor_id, day_of_week, start_time, end_time)
         VALUES (?, ?, ?, ?)`,
        [
          doctorId,
          day.day_of_week,
          day.start_time ?? null,
          day.end_time ?? null,
        ]
      )
    );
    await Promise.all(insertSchedule);

    // 5. Regenerate timeslots immediately after inserting new schedule
    const [newWeekly] = await db.execute(
      "SELECT * FROM weekly_timeslots WHERE doctor_id = ?",
      [doctorId]
    );

    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const numberToDay = Object.entries(dayMap).reduce((acc, [key, val]) => {
      acc[val] = key;
      return acc;
    }, {});

    const slotInserts = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = now.add(i, "day");
      const weekdayNumber = currentDate.day();
      const weekdayName = numberToDay[weekdayNumber];

      const matchedDay = newWeekly.find((d) => d.day_of_week === weekdayName);
      if (!matchedDay || !matchedDay.start_time || !matchedDay.end_time)
        continue;

      const start = dayjs(
        `${currentDate.format("YYYY-MM-DD")} ${matchedDay.start_time}`
      );
      const end = dayjs(
        `${currentDate.format("YYYY-MM-DD")} ${matchedDay.end_time}`
      );

      let slotTime = start;
      while (slotTime.add(1, "hour").isSameOrBefore(end)) {
        const slotStart = slotTime.format("YYYY-MM-DD HH:mm:ss");
        const slotEnd = slotTime.add(1, "hour").format("YYYY-MM-DD HH:mm:ss");

        slotInserts.push([doctorId, slotStart, slotEnd, 1, weekdayNumber]);
        slotTime = slotTime.add(1, "hour");
      }
    }

    if (slotInserts.length > 0) {
      await db.query(
        "INSERT INTO timeslots (doctor_id, start_time, end_time, is_available, day_of_week) VALUES ?",
        [slotInserts]
      );
    }

    res.status(200).json({
      message: `Schedule saved and ${slotInserts.length} time slots generated.`,
    });
  } catch (error) {
    console.error("Error saving schedule and generating slots:", error);
    res.status(500).json({ error: "Failed to save schedule." });
  }
};

//getting weekly schedule

const generateTimeSlots = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Find the doctor ID
    const [doctorRows] = await db.execute(
      "SELECT id FROM doctors WHERE user_id = ?",
      [userId]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    const doctorId = doctorRows[0].id;

    // 2. Fetch weekly schedule
    const [weekly] = await db.execute(
      "SELECT * FROM weekly_timeslots WHERE doctor_id = ?",
      [doctorId]
    );

    if (!weekly.length) {
      return res.status(400).json({ error: "Weekly schedule not found." });
    }

    // 3. Delete existing time slots within next 7 days
    const now = dayjs();
    const oneWeekLater = now.add(7, "day");

    await db.execute(
      "DELETE FROM timeslots WHERE doctor_id = ? AND start_time BETWEEN ? AND ?",
      [
        doctorId,
        now.format("YYYY-MM-DD HH:mm:ss"),
        oneWeekLater.format("YYYY-MM-DD HH:mm:ss"),
      ]
    );

    // 4. Map day names to numbers
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const numberToDay = Object.entries(dayMap).reduce((acc, [key, val]) => {
      acc[val] = key;
      return acc;
    }, {});

    const slotInserts = [];

    // 5. Generate time slots for next 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = now.add(i, "day");
      const weekdayNumber = currentDate.day();
      const weekdayName = numberToDay[weekdayNumber];

      const matchedDay = weekly.find((d) => d.day_of_week === weekdayName);

      if (matchedDay) {
        const start = dayjs(
          `${currentDate.format("YYYY-MM-DD")} ${matchedDay.start_time}`
        );
        const end = dayjs(
          `${currentDate.format("YYYY-MM-DD")} ${matchedDay.end_time}`
        );

        if (end.isBefore(start)) continue; // skip invalid time ranges

        let slotTime = start;
        while (slotTime.isBefore(end)) {
          const slotStart = slotTime;
          const slotEnd = slotTime.add(1, "hour");

          if (slotEnd.isAfter(end)) break;

          slotInserts.push([
            doctorId,
            slotStart.format("YYYY-MM-DD HH:mm:ss"),
            slotEnd.format("YYYY-MM-DD HH:mm:ss"),
            1, // is_available
            weekdayNumber,
          ]);

          slotTime = slotEnd;
        }
      }
    }

    // 6. Insert into DB
    if (slotInserts.length > 0) {
      await db.query(
        "INSERT INTO timeslots (doctor_id, start_time, end_time, is_available, day_of_week) VALUES ?",
        [slotInserts]
      );
    }

    res.status(200).json({
      message: `${slotInserts.length} time slots generated.`,
    });
  } catch (error) {
    console.error("Error generating slots:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWeeklySchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const [doctorRows] = await db.execute(
      "SELECT id FROM doctors WHERE user_id = ?",
      [userId]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    const doctorId = doctorRows[0].id;

    const [schedule] = await db.execute(
      "SELECT day_of_week, start_time, end_time FROM weekly_timeslots WHERE doctor_id = ?",
      [doctorId]
    );

    res.json(schedule);
  } catch (error) {
    console.error("Error fetching weekly schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//Global API to fetch doctors Weeklyschedule
const getWeeklyScheduleByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const [schedule] = await db.execute(
      "SELECT day_of_week, start_time, end_time FROM weekly_timeslots WHERE doctor_id = ?",
      [doctorId]
    );
    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule by doctorId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  saveWeeklySchedule,
  generateTimeSlots,
  getDoctorTimeSlots,
  getWeeklySchedule,
  getWeeklyScheduleByDoctorId,
};
