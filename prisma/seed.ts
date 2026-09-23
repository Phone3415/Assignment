import { prisma } from "../src/Library/prisma";

async function main() {
  console.log("Cleaning up existing data...");
  // Delete all to avoid unique constraint violations
  await prisma.privateNote.deleteMany();
  await prisma.publicNote.deleteMany();
  await prisma.assignmentChecklist.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.login.deleteMany();
  await prisma.user.deleteMany();

  console.log("Adding users...");
  const admin = await prisma.user.create({
    data: {
      studentId: "admin_001",
      name: "Admin User",
      role: "Admin",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      studentId: "1001",
      name: "John Doe",
      role: "Student",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      studentId: "1002",
      name: "Jane Smith",
      role: "Student",
    },
  });

  console.log("Adding classes...");
  const classA = await prisma.class.create({
    data: {
      id: 1,
      name: "Safety Management 101",
    },
  });

  const classB = await prisma.class.create({
    data: {
      name: "Occupational Health Fundamentals",
    },
  });

  console.log("Adding assignments...");
  const assignment1 = await prisma.assignment.create({
    data: {
      id: 1,
      name: "Safety Audit Report",
      description: "Perform a safety audit on a local workplace and write a comprehensive report.",
      assignedDate: new Date(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: "Solo",
      groupSize: 1,
      classId: classA.id,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      name: "Hazard Analysis Presentation",
      description: "Group presentation on identifying and mitigating workplace hazards.",
      assignedDate: new Date(),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      type: "Group",
      groupSize: 4,
      classId: classA.id,
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      name: "Health Regulations Essay",
      description: "Write an essay detailing the evolution of occupational health regulations over the last decade.",
      assignedDate: new Date(),
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      type: "Major",
      groupSize: 1,
      classId: classB.id,
    },
  });

  console.log("Adding assignment checklists...");
  await prisma.assignmentChecklist.create({
    data: {
      assignmentId: assignment1.id,
      userId: student1.id,
      classId: classA.id,
    },
  });

  console.log("Dummy data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Optionally update caches if you have server running, 
    // but in a script it's standalone, so just exit.
    process.exit(0);
  });
