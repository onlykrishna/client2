import { db } from './config';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, onSnapshot, query, where, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { generateTicketBatch } from '../utils/ticketGenerator';

// === SETTINGS (Admin adds UPI/Scanner/Whatsapp here) ===
export const getSettings = async () => {
  const snap = await getDoc(doc(db, 'settings', 'core'));
  if (snap.exists()) return snap.data();
  return { upiId: '8271073807@ptyes', adminPhone: '9748082266' };
};

export const updateSettings = async (data) => {
  await setDoc(doc(db, 'settings', 'core'), data, { merge: true });
};

export const getActiveDraws = async () => {
  // get today's date in YYYY-MM-DD
  const today = new Date().toLocaleDateString('en-CA');
  const d11 = `${today}-1100`;
  const d17 = `${today}-1700`;

  return Promise.all([
    getOrCreateDraw(d11, today, '11:00 AM'),
    getOrCreateDraw(d17, today, '05:00 PM')
  ]);
};

export const getOrCreateDraw = async (id, date, timeStr) => {
  const ref = doc(db, 'draws', id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id, ...snap.data() };

  // Create new draw with 200 random tickets
  const tickets = generateTicketBatch(200).map(num => ({
    number: num,
    status: 'available' // available, pending, sold
  }));

  const payload = {
    date,
    timeStr,
    status: 'upcoming', // upcoming, completed
    tickets,
    results: null
  };

  await setDoc(ref, payload);
  return { id, ...payload };
};

// === ORDERS (Ticket Buy) ===
export const createOrder = async (drawId, selectedTickets, userName, userPhone, totalPrice) => {
  // First, mark tickets as pending in the draw document
  const drawRef = doc(db, 'draws', drawId);
  const drawSnap = await getDoc(drawRef);
  let currentTickets = drawSnap.data().tickets;
  
  // validation
  for(let t of selectedTickets) {
     let dt = currentTickets.find(x => x.number === t);
     if(dt.status !== 'available') throw new Error(`Ticket ${t} is no longer available`);
     dt.status = 'pending';
  }

  await updateDoc(drawRef, { tickets: currentTickets });

  // Create Order
  const orderRef = await addDoc(collection(db, 'orders'), {
    drawId,
    userName,
    userPhone,
    tickets: selectedTickets,
    totalPrice,
    status: 'pending', // pending, approved
    createdAt: serverTimestamp()
  });

  return orderRef.id;
};

export const approveOrder = async (orderId) => {
  const orderSnap = await getDoc(doc(db, 'orders', orderId));
  const order = orderSnap.data();

  // update draw tickets status to 'sold'
  const drawRef = doc(db, 'draws', order.drawId);
  const drawSnap = await getDoc(drawRef);
  let currentTickets = drawSnap.data().tickets;
  order.tickets.forEach(t => {
     let dt = currentTickets.find(x => x.number === t);
     if(dt) dt.status = 'sold';
  });

  await updateDoc(drawRef, { tickets: currentTickets });
  await updateDoc(doc(db, 'orders', orderId), { status: 'approved' });
  return order;
};

// === LISTENERS ===
export const listenToDraw = (drawId, callback) => {
  return onSnapshot(doc(db, 'draws', drawId), (snap) => {
    if(snap.exists()) callback({ id: snap.id, ...snap.data() });
    else callback(null);
  });
};

export const listenToOrders = (callback) => {
  const q = query(collection(db, 'orders'));
  return onSnapshot(q, (snap) => {
    const orders = [];
    snap.forEach(d => orders.push({ id: d.id, ...d.data() }));
    callback(orders.sort((a,b) => (b.createdAt?.toMillis()||0) - (a.createdAt?.toMillis()||0)));
  });
};
