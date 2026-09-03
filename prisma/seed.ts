import { PrismaClient, Role, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

const TITLES = [
  "Kitchen tap replacement",
  "Deep clean, two bedroom",
  "Dog walking, weekdays",
  "Math tutoring, grade 10",
  "Fence repair, back garden",
  "Move a sofa across town",
  "Assemble flat pack wardrobe",
  "Weekly lawn mowing",
];

async function main() {
  await prisma.bookingEvent.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();

  const customers = [];
  const providers = [];

  for (let i = 1; i <= 12; i++) {
    customers.push(
      await prisma.user.create({
        data: {
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
          phone: `+1403555${String(1000 + i)}`,
          role: Role.CUSTOMER,
          passwordHash: "not-a-real-hash",
        },
      })
    );
  }

  for (let i = 1; i <= 8; i++) {
    providers.push(
      await prisma.user.create({
        data: {
          name: `Provider ${i}`,
          email: `provider${i}@example.com`,
          phone: `+1403555${String(2000 + i)}`,
          role: Role.PROVIDER,
          passwordHash: "not-a-real-hash",
        },
      })
    );
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      phone: "+14035550000",
      role: Role.ADMIN,
      passwordHash: "not-a-real-hash",
    },
  });

  const statuses = [
    BookingStatus.PENDING,
    BookingStatus.ACCEPTED,
    BookingStatus.COMPLETED,
    BookingStatus.DECLINED,
  ];

  for (let i = 0; i < 400; i++) {
    const customer = customers[i % customers.length];
    const provider = providers[i % providers.length];
    await prisma.booking.create({
      data: {
        title: TITLES[i % TITLES.length],
        notes:
          i % 5 === 0
            ? "Gate code is 4417. Please call on arrival, the buzzer is broken."
            : null,
        price: 40 + (i % 12) * 15,
        status: statuses[i % statuses.length],
        customerId: customer.id,
        providerId: provider.id,
      },
    });
  }

  console.log("Seeded 21 users and 400 bookings.");
  console.log("Sign in as any user from the home page.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
