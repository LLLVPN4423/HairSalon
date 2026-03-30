export type Product = { 
  id: string; 
  name: string; 
  price: number; 
  image: string;
  description: string;
};

export type Barber = {
  id: string;
  name: string;
  avatar: string;
};

export type Service = { 
  id: string; 
  name: string; 
  price: number; 
  image: string;
  description: string;
  duration: string;
};

export const barbersData: Barber[] = [
  { 
    id: 'b1', 
    name: 'Marcus', 
    avatar: 'https://images.unsplash.com/photo-1747830280502-f33d7305a714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiYXJiZXIlMjBwb3J0cmFpdCUyMG1hbGV8ZW58MXx8fHwxNzczMjg3MTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  { 
    id: 'b2', 
    name: 'Sophia', 
    avatar: 'https://images.unsplash.com/photo-1616723355486-eac8780bfcb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBoYWlyJTIwc3R5bGlzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzI4NzEyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  { 
    id: 'b3', 
    name: 'Alex', 
    avatar: 'https://images.unsplash.com/photo-1596513057998-040d410e4623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGJhcmJlciUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MzI4NzEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
];

export const productsData: Product[] = [
  { id: 'p1', name: 'Matte Clay Wax', price: 24, image: 'https://images.unsplash.com/photo-1689893265427-d7da200eff05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwd2F4JTIwdHViJTIwcHJvZHVjdCUyMHN0eWxpbmd8ZW58MXx8fHwxNzczMjg1ODA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Achieve a natural matte finish with strong hold. Perfect for creating textured styles that last all day.' },
  { id: 'p2', name: 'Clarifying Shampoo', price: 18, image: 'https://images.unsplash.com/photo-1766142167641-507c80e35eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwYm90dGxlJTIwaGFpciUyMHByb2R1Y3R8ZW58MXx8fHwxNzczMjg1ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Deep cleansing formula that removes build-up and impurities while keeping hair healthy and refreshed.' },
  { id: 'p3', name: 'Premium Hair Oil', price: 32, image: 'https://images.unsplash.com/photo-1772987714654-2df39af2c658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaGFpciUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NzMyODU4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Lightweight luxury oil blend that nourishes, adds shine, and tames frizz without weighing hair down.' },
  { id: 'p4', name: 'Sea Salt Spray', price: 22, image: 'https://images.unsplash.com/photo-1689893265427-d7da200eff05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwd2F4JTIwdHViJTIwcHJvZHVjdCUyMHN0eWxpbmd8ZW58MXx8fHwxNzczMjg1ODA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Create effortless beachy waves with natural volume and texture. Perfect for a relaxed, tousled look.' },
  { id: 'p5', name: 'Nourishing Conditioner', price: 20, image: 'https://images.unsplash.com/photo-1766142167641-507c80e35eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwYm90dGxlJTIwaGFpciUyMHByb2R1Y3R8ZW58MXx8fHwxNzczMjg1ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Rich conditioning formula that deeply moisturizes and strengthens hair for a soft, silky feel.' },
  { id: 'p6', name: 'Beard Balm', price: 19, image: 'https://images.unsplash.com/photo-1772987714654-2df39af2c658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaGFpciUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NzMyODU4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Tame and condition your beard with this nourishing balm. Provides light hold and a subtle shine.' },
];

export const servicesData: Service[] = [
  { id: 's1', name: 'Classic Fade & Cut', price: 45, image: 'https://images.unsplash.com/photo-1596513057998-040d410e4623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBjdXR0aW5nJTIwaGFpciUyMG1lbiUyMGZhZGV8ZW58MXx8fHwxNzczMjg1ODA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Our signature service featuring a precision fade and custom cut tailored to your style. Includes wash and finish.', duration: '45 min' },
  { id: 's2', name: 'Beard Trim & Shape', price: 25, image: 'https://images.unsplash.com/photo-1747352690432-7c90bf17ede1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFyZCUyMHRyaW0lMjBzdHlsaW5nJTIwdG9vbHN8ZW58MXx8fHwxNzczMjg1ODExfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Expert beard trimming and shaping to maintain your facial hair. Includes hot towel treatment and oil application.', duration: '30 min' },
  { id: 's3', name: 'Full Styling & Blowout', price: 65, image: 'https://images.unsplash.com/photo-1630489160151-2b52de7df6e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBoYWlyJTIwc3R5bGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzI4NTgwNHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Complete styling service with professional blowout. Perfect for special occasions or when you want to look your best.', duration: '60 min' },
  { id: 's4', name: 'Scissor Cut & Wash', price: 50, image: 'https://images.unsplash.com/photo-1596513057998-040d410e4623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBjdXR0aW5nJTIwaGFpciUyMG1lbiUyMGZhZGV8ZW58MXx8fHwxNzczMjg1ODA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Traditional scissor cut with attention to detail. Includes scalp massage, wash, and styling.', duration: '50 min' },
  { id: 's5', name: 'Hot Towel Shave', price: 35, image: 'https://images.unsplash.com/photo-1747352690432-7c90bf17ede1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFyZCUyMHRyaW0lMjBzdHlsaW5nJTIwdG9vbHN8ZW58MXx8fHwxNzczMjg1ODExfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Classic straight razor shave with hot towel preparation and premium shaving cream. A truly luxurious experience.', duration: '40 min' },
  { id: 's6', name: 'Quick Buzz', price: 20, image: 'https://images.unsplash.com/photo-1630489160151-2b52de7df6e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBoYWlyJTIwc3R5bGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzI4NTgwNHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Fast and efficient clipper cut for those short on time. No appointment needed for this service.', duration: '20 min' },
];