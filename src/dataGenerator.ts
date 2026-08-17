import { Transaction, TransactionCategory, TransactionStatus, DailyRevenue } from './types.ts';

const CATEGORIES: TransactionCategory[] = ['Electronics', 'Clothing', 'Food', 'Home', 'Other'];
const STATUSES: TransactionStatus[] = ['Completed', 'Pending', 'Cancelled'];

const PRODUCTS_BY_CATEGORY: Record<TransactionCategory, { name: string; basePrice: number; variance: number }[]> = {
  Electronics: [
    { name: 'Ultra Wireless Noise-Canceling Headphones', basePrice: 249, variance: 50 },
    { name: '4K Quantum HDR Pro Monitor 27"', basePrice: 489, variance: 120 },
    { name: 'Mechanical RGB Backlit Keyboard', basePrice: 139, variance: 30 },
    { name: 'Smart Fitness & Health Watch Series 5', basePrice: 299, variance: 60 },
    { name: 'Thunderbolt 4 Dual-Display Dock', basePrice: 199, variance: 40 },
    { name: 'True Wireless Sport Earbuds', basePrice: 99, variance: 25 },
    { name: '1080p Streamer Pro Webcam', basePrice: 79, variance: 15 },
  ],
  Clothing: [
    { name: 'Merino Wool Crewneck Sweater', basePrice: 88, variance: 20 },
    { name: 'Waterproof All-Weather Trail Jacket', basePrice: 165, variance: 35 },
    { name: 'Classic Slim Fit Stretch Denim', basePrice: 72, variance: 18 },
    { name: 'Breathable Running Shoes Performance', basePrice: 125, variance: 25 },
    { name: 'Thermal Fleece Zip-Up Hoodie', basePrice: 58, variance: 12 },
    { name: 'Silk Blend Patterned Scarf', basePrice: 42, variance: 10 },
  ],
  Food: [
    { name: 'Artisan Cold Brew Coffee 12-Pack', basePrice: 38, variance: 8 },
    { name: 'Single-Origin Ethiopian Coffee Beans 1kg', basePrice: 28, variance: 6 },
    { name: 'Gourmet Organic Olive Oil Gift Box', basePrice: 45, variance: 10 },
    { name: 'Ceremonial Grade Uji Matcha Tin', basePrice: 34, variance: 8 },
    { name: 'Raw Forest Honey Reserve 500g', basePrice: 22, variance: 4 },
    { name: 'Dark Chocolate Artisan Truffles 24ct', basePrice: 32, variance: 6 },
  ],
  Home: [
    { name: 'Ergonomic Mesh High-Back Desk Chair', basePrice: 320, variance: 70 },
    { name: 'Modern Minimalist Ceramic Table Lamp', basePrice: 75, variance: 15 },
    { name: 'Cooling Gel Memory Foam Pillow Set', basePrice: 68, variance: 14 },
    { name: 'Ultrasonic Essential Oil Aroma Diffuser', basePrice: 42, variance: 8 },
    { name: 'Premium Organic Bamboo Cutting Board Set', basePrice: 35, variance: 7 },
    { name: 'Stainless Steel Tri-Ply Cookware Set', basePrice: 240, variance: 50 },
  ],
  Other: [
    { name: 'Heavy-Duty Waterproof Gym Duffel', basePrice: 65, variance: 15 },
    { name: 'Insulated Stainless Steel Water Bottle 32oz', basePrice: 28, variance: 6 },
    { name: 'Windproof Compact Travel Umbrella', basePrice: 24, variance: 5 },
    { name: 'Handcrafted Full-Grain Leather Journal', basePrice: 36, variance: 8 },
    { name: 'High-Density Non-Slip Eco Yoga Mat', basePrice: 48, variance: 10 },
  ],
};

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Gregory', 'Christine', 'Frank', 'Debra',
  'Alexander', 'Rachel', 'Raymond', 'Catherine', 'Patrick', 'Carolyn', 'Jack', 'Janet',
  'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
];

// Pre-generate a pool of 3,500 distinct customers to simulate realistic recurring customer bases
function generateCustomerPool(size: number = 3500): string[] {
  const pool: string[] = [];
  const set = new Set<string>();
  
  let i = 0;
  while (pool.length < size) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 7 + 13) % LAST_NAMES.length];
    const suffix = Math.floor(i / (FIRST_NAMES.length * LAST_NAMES.length));
    const name = suffix > 0 ? `${fn} ${ln} ${suffix + 1}` : `${fn} ${ln}`;
    if (!set.has(name)) {
      set.add(name);
      pool.push(name);
    }
    i++;
  }
  return pool;
}

const CUSTOMER_POOL = generateCustomerPool(3500);

// Pseudorandom generator with seed for reproducible yet realistic data
class FastRNG {
  private seed: number;

  constructor(seed: number = 133742) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
}

export function generateTransactions(count: number = 50000): Transaction[] {
  const rng = new FastRNG(42);
  const transactions: Transaction[] = new Array(count);

  // Generate date reference: past 30 days up to 2026-08-16
  const baseDate = new Date('2026-08-16T18:00:00Z').getTime();
  const msInDay = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    // Determine category with weighted distribution
    const catRand = rng.next();
    let category: TransactionCategory;
    if (catRand < 0.30) category = 'Electronics';
    else if (catRand < 0.55) category = 'Clothing';
    else if (catRand < 0.75) category = 'Home';
    else if (catRand < 0.90) category = 'Food';
    else category = 'Other';

    // Pick product within category
    const productList = PRODUCTS_BY_CATEGORY[category];
    const productMeta = productList[rng.nextInt(0, productList.length - 1)];
    const priceVariance = rng.nextFloat(-productMeta.variance, productMeta.variance);
    const amount = Math.max(9.99, Math.round((productMeta.basePrice + priceVariance) * 100) / 100);

    // Pick status: 78% Completed, 14% Pending, 8% Cancelled
    const statusRand = rng.next();
    let status: TransactionStatus;
    if (statusRand < 0.78) {
      status = 'Completed';
    } else if (statusRand < 0.92) {
      status = 'Pending';
    } else {
      status = 'Cancelled';
    }

    // Customer
    const customer = CUSTOMER_POOL[rng.nextInt(0, CUSTOMER_POOL.length - 1)];

    // Timestamp: Weight recent days more heavily
    // 0 to 29 days ago
    const dayOffset = Math.pow(rng.next(), 1.5) * 29.99;
    const itemTimestamp = new Date(baseDate - dayOffset * msInDay);
    const dateStr = itemTimestamp.toISOString();

    const orderId = `ORD-${String(500000 + i).padStart(6, '0')}`;

    transactions[i] = {
      id: orderId,
      customer,
      product: productMeta.name,
      category,
      amount,
      date: dateStr,
      status,
    };
  }

  // Sort descending by date so index 0 is most recent
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return transactions;
}

export interface DashboardComputedStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  conversionRate: number;
  revenue7Days: DailyRevenue[];
  recentTransactions: Transaction[];
}

export function computeDashboardStats(transactions: Transaction[]): DashboardComputedStats {
  let totalRevenue = 0;
  let completedCount = 0;
  const userSet = new Set<string>();

  // Map for aggregating daily revenue over the last 7 distinct days in the dataset
  const dailyMap = new Map<string, { revenue: number; orders: number; dayName: string }>();

  // Days of week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Initialize last 7 days ending at 2026-08-16
  const anchorDate = new Date('2026-08-16T12:00:00Z');
  const dateKeys: string[] = [];
  for (let d = 6; d >= 0; d--) {
    const dayObj = new Date(anchorDate.getTime() - d * 24 * 60 * 60 * 1000);
    const key = dayObj.toISOString().slice(0, 10);
    dateKeys.push(key);
    dailyMap.set(key, {
      revenue: 0,
      orders: 0,
      dayName: dayNames[dayObj.getUTCDay()],
    });
  }

  const totalOrders = transactions.length;

  for (let i = 0; i < totalOrders; i++) {
    const tx = transactions[i];
    userSet.add(tx.customer);

    if (tx.status === 'Completed') {
      totalRevenue += tx.amount;
      completedCount++;

      const dateKey = tx.date.slice(0, 10);
      const dayData = dailyMap.get(dateKey);
      if (dayData) {
        dayData.revenue += tx.amount;
        dayData.orders += 1;
      }
    }
  }

  const revenue7Days: DailyRevenue[] = dateKeys.map((key) => {
    const entry = dailyMap.get(key) || { revenue: 0, orders: 0, dayName: 'Day' };
    return {
      date: key,
      dayName: entry.dayName,
      revenue: Math.round(entry.revenue * 100) / 100,
      orders: entry.orders,
    };
  });

  const conversionRate = totalOrders > 0 ? (completedCount / totalOrders) * 100 : 0;
  const recentTransactions = transactions.slice(0, 5);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    totalUsers: userSet.size,
    conversionRate: Math.round(conversionRate * 100) / 100,
    revenue7Days,
    recentTransactions,
  };
}
