const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rooms = await prisma.room.findMany();
  const deluxe  = rooms.find(r => r.name === 'Deluxe Room');
  const junior   = rooms.find(r => r.name === 'Junior Suite');
  const family   = rooms.find(r => r.name === 'Family Room');
  const premium  = rooms.find(r => r.name === 'Premium Suite');

  if (!deluxe || !junior || !family || !premium) {
    console.error('Missing rooms:', rooms.map(r => r.name));
    process.exit(1);
  }

  // Create guest checkout records
  const guestData = [
    { firstName: 'Kasun',   lastName: 'Rajapaksa',     email: 'kasun.rajapaksa@gmail.com',    phone: '+94771234501', country: 'LK' },
    { firstName: 'Chamari', lastName: 'Perera',         email: 'chamari.perera@gmail.com',      phone: '+94771234502', country: 'LK' },
    { firstName: 'Nuwan',   lastName: 'Senanayake',     email: 'nuwan.senanayake@gmail.com',    phone: '+94771234503', country: 'LK' },
    { firstName: 'Dilani',  lastName: 'Fernando',       email: 'dilani.fernando@yahoo.com',     phone: '+94771234504', country: 'LK' },
    { firstName: 'Asitha',  lastName: 'Wickramasinghe', email: 'asitha.wickrama@gmail.com',     phone: '+94771234505', country: 'LK' },
    { firstName: 'Malith',  lastName: 'Dissanayake',    email: 'malith.dissanayake@gmail.com',  phone: '+94771234506', country: 'LK' },
    { firstName: 'Sithara', lastName: 'Jayawardena',    email: 'sithara.jayawardena@gmail.com', phone: '+94771234507', country: 'LK' },
    { firstName: 'Ruwanga', lastName: 'Bandara',        email: 'ruwanga.bandara@hotmail.com',   phone: '+94771234508', country: 'LK' },
  ];

  const gcs = [];
  for (const g of guestData) {
    const ex = await prisma.guestCheckout.findFirst({ where: { email: g.email } });
    gcs.push(ex || await prisma.guestCheckout.create({ data: g }));
  }
  console.log('Guests ready');

  const bDefs = [
    { i: 0, room: family,  ci: '2026-06-05', co: '2026-06-08', n: 3, rate: 28000, status: 'CONFIRMED', ps: 'PAID',    method: 'card', num: 'WVB-2026-KR001' },
    { i: 1, room: deluxe,  ci: '2026-06-10', co: '2026-06-12', n: 2, rate: 15000, status: 'CONFIRMED', ps: 'PAID',    method: 'bank', num: 'WVB-2026-CP002' },
    { i: 2, room: premium, ci: '2026-06-15', co: '2026-06-18', n: 3, rate: 35000, status: 'PENDING',   ps: 'PENDING', method: 'bank', num: 'WVB-2026-NS003' },
    { i: 3, room: junior,  ci: '2026-06-20', co: '2026-06-22', n: 2, rate: 22000, status: 'CONFIRMED', ps: 'PAID',    method: 'card', num: 'WVB-2026-DF004' },
    { i: 4, room: family,  ci: '2026-06-25', co: '2026-06-27', n: 2, rate: 28000, status: 'PENDING',   ps: 'PENDING', method: 'bank', num: 'WVB-2026-AW005' },
    { i: 5, room: premium, ci: '2026-07-01', co: '2026-07-03', n: 2, rate: 35000, status: 'CONFIRMED', ps: 'PAID',    method: 'card', num: 'WVB-2026-MD006' },
    { i: 6, room: deluxe,  ci: '2026-07-05', co: '2026-07-07', n: 2, rate: 15000, status: 'CONFIRMED', ps: 'PAID',    method: 'card', num: 'WVB-2026-SJ007' },
    { i: 7, room: junior,  ci: '2026-07-10', co: '2026-07-13', n: 3, rate: 22000, status: 'PENDING',   ps: 'PENDING', method: 'bank', num: 'WVB-2026-RB008' },
  ];

  const created = [];
  for (const b of bDefs) {
    const ex = await prisma.booking.findFirst({ where: { bookingNumber: b.num } });
    if (ex) { created.push(ex); console.log('Skip', b.num); continue; }
    const total = Math.round(b.n * b.rate * 1.1);
    const bk = await prisma.booking.create({
      data: {
        bookingNumber:   b.num,
        guestCheckoutId: gcs[b.i].id,
        roomId:          b.room.id,
        checkIn:         new Date(b.ci),
        checkOut:        new Date(b.co),
        guests:          2,
        totalAmount:     total,
        status:          b.status,
        paymentStatus:   b.ps,
        paymentMethod:   b.method,
      }
    });
    created.push(bk);
    console.log('Created', b.num);
    if (b.ps === 'PAID') {
      await prisma.payment.upsert({
        where:  { bookingId: bk.id },
        create: { bookingId: bk.id, amount: total, status: 'PAID' },
        update: { status: 'PAID' },
      });
    }
  }

  // Submitted receipt for Nuwan (pending admin review — perfect for the video demo)
  const ns = created.find(b => b.bookingNumber === 'WVB-2026-NS003');
  if (ns) {
    await prisma.bankTransferReceipt.upsert({
      where:  { bookingId: ns.id },
      create: { bookingId: ns.id, transactionRef: 'COM20260615084521', transferDate: new Date('2026-06-15'), amountPaid: 115500, notes: 'Transferred via Commercial Bank online banking', status: 'PENDING' },
      update: { status: 'PENDING' },
    });
    console.log('Receipt for NS003 ready');
  }

  // Housekeeping and maintenance tasks
  const taskDefs = [
    { title: 'Full Room Cleaning',       description: 'Standard turnover cleaning after guest checkout',  priority: 'HIGH',   status: 'PENDING',     category: 'HOUSEKEEPING', roomId: deluxe.id,  dueAt: new Date('2026-06-12T10:00:00') },
    { title: 'Linen Replacement',        description: 'Replace all bed linen and bath towels',            priority: 'MEDIUM', status: 'IN_PROGRESS', category: 'HOUSEKEEPING', roomId: junior.id,  dueAt: new Date('2026-06-22T09:00:00') },
    { title: 'Deep Clean and Sanitise',  description: 'Full deep clean after extended stay',              priority: 'HIGH',   status: 'COMPLETED',   category: 'HOUSEKEEPING', roomId: family.id,  dueAt: new Date('2026-06-08T11:00:00') },
    { title: 'Mini Bar Restock',         description: 'Restock minibar beverages and welcome amenities',  priority: 'LOW',    status: 'PENDING',     category: 'HOUSEKEEPING', roomId: premium.id, dueAt: new Date('2026-07-01T14:00:00') },
    { title: 'AC Filter Service',        description: 'Clean and service air conditioning filters',       priority: 'MEDIUM', status: 'PENDING',     category: 'MAINTENANCE',  roomId: junior.id,  dueAt: new Date('2026-06-20T08:00:00') },
  ];

  for (const t of taskDefs) {
    const ex = await prisma.task.findFirst({ where: { title: t.title, roomId: t.roomId } });
    if (!ex) { await prisma.task.create({ data: t }); console.log('Task:', t.title); }
    else { console.log('Task exists:', t.title); }
  }

  console.log('\nAll seeding complete!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
