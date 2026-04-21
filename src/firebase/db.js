import { db } from './config';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, onSnapshot, query, where, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { generateTicketBatch } from '../utils/ticketGenerator';

// === SETTINGS (Admin adds UPI/Scanner/Whatsapp here) ===
export const getSettings = async () => {
  const snap = await getDoc(doc(db, 'settings', 'core'));
  if (snap.exists()) return snap.data();
  return { 
    upiId: '8271073807@ptyes', 
    whatsappPhone: '9748082266', 
    gpayPhone: '8271073807',
    drawTime: '11:00 AM' 
  };
};

export const updateSettings = async (data) => {
  await setDoc(doc(db, 'settings', 'core'), data, { merge: true });
};

export const getActiveDraws = async () => {
  const settings = await getSettings();
  const timeStr = settings.drawTime || '11:00 AM';
  
  // Parse draw time
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(n => parseInt(n, 10));
  if (hours === 12) hours = 0;
  if (modifier === 'PM') hours += 12;
  const timeId = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;

  const now = new Date();
  const drawToday = new Date();
  drawToday.setHours(hours, minutes, 0, 0);

  let targetDate;
  if (now > drawToday) {
    // If today's draw time has passed, show tomorrow's draw
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    targetDate = tomorrow.toLocaleDateString('en-CA');
  } else {
    targetDate = now.toLocaleDateString('en-CA');
  }

  const dId = `${targetDate}-${timeId}`;
  return [await getOrCreateDraw(dId, targetDate, timeStr)];
};

export const getOrCreateDraw = async (id, date, timeStr) => {
  const ref = doc(db, 'draws', id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id, ...snap.data() };

  // Create new draw with 500 random tickets
  const tickets = generateTicketBatch(500).map(num => ({
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
    status: 'pending', // pending, approved, declined
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

export const declineOrder = async (orderId) => {
  const orderSnap = await getDoc(doc(db, 'orders', orderId));
  const order = orderSnap.data();

  // release tickets back to available
  const drawRef = doc(db, 'draws', order.drawId);
  const drawSnap = await getDoc(drawRef);
  let currentTickets = drawSnap.data().tickets;
  order.tickets.forEach(t => {
     let dt = currentTickets.find(x => x.number === t);
     if(dt && dt.status === 'pending') dt.status = 'available';
  });

  await updateDoc(drawRef, { tickets: currentTickets });
  await updateDoc(doc(db, 'orders', orderId), { status: 'declined' });
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

export const listenToSoldOrders = (callback) => {
  const q = query(collection(db, 'orders'), where('status', '==', 'approved'));
  return onSnapshot(q, (snap) => {
    const orders = [];
    snap.forEach(d => orders.push({ id: d.id, ...d.data() }));
    callback(orders.sort((a,b) => (b.createdAt?.toMillis()||0) - (a.createdAt?.toMillis()||0)));
  });
};
