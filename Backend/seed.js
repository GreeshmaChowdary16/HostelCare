import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Announcement from "./models/Announcement.js";
import Complaint from "./models/Complaint.js";
import GatePass from "./models/GatePass.js";
import MessReview from "./models/MessReview.js";

dotenv.config();

const seedDB = async () => {
  try {
    console.log("Connecting to database at:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");

    // Clean current database data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    await Complaint.deleteMany({});
    await GatePass.deleteMany({});
    await MessReview.deleteMany({});
    console.log("Cleared existing data from all collections");

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("password", salt);
    const rectorPassword = await bcrypt.hash("password1", salt);
    const studentPassword = await bcrypt.hash("password2", salt);

    // 1. CREATE ADMIN USERS
    const admin1 = await User.create({
      name: "Administrator",
      email: "admin@hostelcare.com",
      password: adminPassword,
      role: "admin",
      phone: "+91 99887 76655",
      office: "Main Administrative Block",
      bio: "Chief Hostel System Administrator",
    });

    const admin2 = await User.create({
      name: "Assistant Admin Amit",
      email: "admin2@hostelcare.com",
      password: adminPassword,
      role: "admin",
      phone: "+91 99887 76656",
      office: "Admin Office Block B",
      bio: "Assistant Hostel System Administrator",
    });

    // 2. CREATE RECTOR USERS
    const rector1 = await User.create({
      name: "Mrs. Priya Kumar",
      email: "rector@hostelcare.com",
      password: rectorPassword,
      role: "rector",
      phone: "+91 98765 43210",
      office: "Girls Hostel A - Room 101",
      bio: "Rector of Girls Hostel A with 5 years experience.",
    });

    const rector2 = await User.create({
      name: "Mr. Rajesh Singh",
      email: "rector2@hostelcare.com",
      password: rectorPassword,
      role: "rector",
      phone: "+91 98765 43211",
      office: "Boys Hostel B - Room 102",
      bio: "Rector of Boys Hostel B. Contact for lockouts/leave.",
    });

    const rector3 = await User.create({
      name: "Mrs. Sunita Sharma",
      email: "rector3@hostelcare.com",
      password: rectorPassword,
      role: "rector",
      phone: "+91 98765 43212",
      office: "Girls Hostel C - Room 103",
      bio: "Rector of Girls Hostel C. Focuses on welfare.",
    });

    // 3. CREATE STUDENT USERS
    const student1 = await User.create({
      name: "Anjali Sharma",
      email: "student@hostelcare.com",
      password: studentPassword,
      role: "student",
      phone: "+91 70001 23456",
      parentPhone: "+91 94444 55555",
      rollNo: "2022CS1045",
      branch: "Computer Science & Engineering",
      year: "3rd Year",
      roomInfo: "Girls Hostel A - Room 302",
      bio: "CSE undergrad interested in cloud systems.",
    });

    const student2 = await User.create({
      name: "Amit Verma",
      email: "student2@hostelcare.com",
      password: studentPassword,
      role: "student",
      phone: "+91 70001 23457",
      parentPhone: "+91 94444 55556",
      rollNo: "2023EC2091",
      branch: "Electronics & Communication",
      year: "2nd Year",
      roomInfo: "Boys Hostel B - Room 105",
      bio: "Embedded systems enthusiast.",
    });

    const student3 = await User.create({
      name: "Greeshma Chowdary",
      email: "student3@hostelcare.com",
      password: studentPassword,
      role: "student",
      phone: "+91 70001 23458",
      parentPhone: "+91 94444 55557",
      rollNo: "2021EE3022",
      branch: "Electrical Engineering",
      year: "4th Year",
      roomInfo: "Girls Hostel A - Room 204",
      bio: "Power systems major.",
    });

    const student4 = await User.create({
      name: "Rohan Gupta",
      email: "student4@hostelcare.com",
      password: studentPassword,
      role: "student",
      phone: "+91 70001 23459",
      parentPhone: "+91 94444 55558",
      rollNo: "2022ME1011",
      branch: "Mechanical Engineering",
      year: "3rd Year",
      roomInfo: "Boys Hostel B - Room 310",
      bio: "Robotics club member.",
    });

    const student5 = await User.create({
      name: "Neha Patil",
      email: "student5@hostelcare.com",
      password: studentPassword,
      role: "student",
      phone: "+91 70001 23460",
      parentPhone: "+91 94444 55559",
      rollNo: "2024CS1102",
      branch: "Computer Science & Engineering",
      year: "1st Year",
      roomInfo: "Girls Hostel C - Room 112",
      bio: "Freshman learning web dev.",
    });

    console.log("Seeded Users correctly.");

    // 4. CREATE ANNOUNCEMENTS
    const announcements = [
      {
        title: "Annual Hostel Night 2026",
        content: "Registrations are now open for cultural performances. Contact your floor representative.",
        category: "Event",
        color: "#4e73df",
        author: rector1._id,
      },
      {
        title: "Water Supply Interruption Today",
        content: "Water supply interruption today from 2:00 PM to 5:00 PM due to tank maintenance.",
        category: "Maintenance",
        color: "#e74a3b",
        author: rector1._id,
      },
      {
        title: "End Semester Exams Schedule",
        content: "Exams start on May 10th. Silence hours are strictly enforced between 10:00 PM and 6:00 AM.",
        category: "Academic",
        color: "#1cc88a",
        author: admin1._id,
      },
      {
        title: "Mess Dues Clearance Deadline",
        content: "Please clear your outstanding mess dues for Q1 by April 30th to avoid registration blocks.",
        category: "Account",
        color: "#f6c23e",
        author: admin1._id,
      },
      {
        title: "Lost Key Recovery",
        content: "A set of keys has been found in the lobby. Claim it at the Rector's office.",
        category: "Other",
        color: "#858796",
        author: rector2._id,
      },
    ];

    await Announcement.create(announcements);
    console.log("Seeded Announcements.");

    // 5. CREATE COMPLAINTS
    const complaints = [
      {
        student: student1._id,
        category: "Electrician",
        subCategory: "room",
        problem: "Fan speed regulator broken in room 302.",
        status: "In Progress",
        assignedWorker: { name: "John Miller (Grade A)", phone: "+91 98765 43210", role: "Electrician" }
      },
      {
        student: student1._id,
        category: "Plumber",
        subCategory: "washroom",
        problem: "Taps leaking in room 302 washroom.",
        status: "Resolved",
        assignedWorker: { name: "Robert Wilson", phone: "+91 98765 43211", role: "Plumber" }
      },
      {
        student: student2._id,
        category: "Electrician",
        subCategory: "room",
        problem: "Main switch sparking in room 105.",
        status: "Pending"
      },
      {
        student: student3._id,
        category: "Plumber",
        subCategory: "washroom",
        problem: "Washbasin blockage in room 204.",
        status: "Pending"
      },
      {
        student: student4._id,
        category: "Carpenter",
        subCategory: "room",
        problem: "Cupboard door hinge broken in room 310.",
        status: "Pending"
      },
      {
        student: student5._id,
        category: "Cleaning",
        subCategory: "lobby",
        problem: "Room floor cleaning required / corridor unhygienic.",
        status: "Pending"
      },
      {
        student: student2._id,
        category: "Carpenter",
        subCategory: "room",
        problem: "Chair leg cracked and unstable in room 105.",
        status: "Resolved",
        assignedWorker: { name: "Harvey Specter", phone: "+91 98765 43220", role: "Carpenter" }
      },
      {
        student: student3._id,
        category: "Cleaning",
        subCategory: "washroom",
        problem: "Common washroom needs sanitization immediately.",
        status: "In Progress",
        assignedWorker: { name: "Cleaning Crew B", phone: "+91 98765 43230", role: "Cleaning" }
      }
    ];

    await Complaint.create(complaints);
    console.log("Seeded Complaints.");

    // 6. CREATE GATE PASSES
    const gatepasses = [
      {
        student: student1._id,
        reason: "Home Visit for Diwali Festival",
        fromDate: new Date("2026-10-12"),
        toDate: new Date("2026-10-15"),
        noOfDays: 3,
        destination: "Lucknow",
        contactNo: student1.phone,
        parentContactNo: student1.parentPhone,
        timeFrom: "09:00 AM",
        timeTo: "06:00 PM",
        status: "Approved",
      },
      {
        student: student1._id,
        reason: "Outing for purchasing textbooks and groceries.",
        fromDate: new Date("2026-07-04"),
        toDate: new Date("2026-07-04"),
        noOfDays: 1,
        destination: "Local Market",
        contactNo: student1.phone,
        parentContactNo: student1.parentPhone,
        timeFrom: "04:00 PM",
        timeTo: "08:00 PM",
        status: "Pending",
      },
      {
        student: student2._id,
        reason: "Family function / wedding attendance.",
        fromDate: new Date("2026-07-15"),
        toDate: new Date("2026-07-20"),
        noOfDays: 5,
        destination: "Delhi",
        contactNo: student2.phone,
        parentContactNo: student2.parentPhone,
        timeFrom: "07:00 AM",
        timeTo: "10:00 PM",
        status: "Approved",
      },
      {
        student: student3._id,
        reason: "Health checkup at city hospital.",
        fromDate: new Date("2026-07-05"),
        toDate: new Date("2026-07-05"),
        noOfDays: 1,
        destination: "City Hospital",
        contactNo: student3.phone,
        parentContactNo: student3.parentPhone,
        timeFrom: "10:00 AM",
        timeTo: "04:00 PM",
        status: "Pending",
      },
      {
        student: student4._id,
        reason: "Delayed return due to train status.",
        fromDate: new Date("2026-07-01"),
        toDate: new Date("2026-07-03"),
        noOfDays: 2,
        destination: "Jaipur",
        contactNo: student4.phone,
        parentContactNo: student4.parentPhone,
        timeFrom: "09:00 AM",
        timeTo: "09:00 AM",
        status: "Pending",
        isExtension: true,
      }
    ];

    await GatePass.create(gatepasses);
    console.log("Seeded Gate Passes.");

    // 7. CREATE MESS REVIEWS
    const reviews = [
      {
        student: student1._id,
        day: "Monday",
        meal: "Breakfast",
        rating: 4,
        comment: "Idlis were soft, sambhar was good but could be spicier.",
        status: "Completed"
      },
      {
        student: student1._id,
        day: "Monday",
        meal: "Lunch",
        rating: 3,
        comment: "Dal Tadka was basic. Rice was a bit undercooked.",
        status: "Completed"
      },
      {
        student: student2._id,
        day: "Tuesday",
        meal: "Lunch",
        rating: 5,
        comment: "Chole Bhature was amazing! Very tasty.",
        status: "Completed"
      },
      {
        student: student3._id,
        day: "Friday",
        meal: "Breakfast",
        rating: 2,
        comment: "Aloo Parathas were too oily and had very little stuffing.",
        status: "Completed"
      },
      {
        student: student4._id,
        day: "Thursday",
        meal: "Lunch",
        rating: 4,
        comment: "Veg Biryani was delicious, good flavor profile.",
        status: "Completed"
      }
    ];

    await MessReview.create(reviews);
    console.log("Seeded Mess Reviews.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
