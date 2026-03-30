import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import Papa from 'papaparse';

// Types matching the CSV column structure
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  duration?: string;
  gallery?: string[];
  videoUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  duration: string;
  gallery?: string[];
  videoUrl?: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
}

interface SalonData {
  products: Product[];
  services: Service[];
  barbers: Barber[];
}

type SalonDataContextType = {
  data: SalonData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastRefresh: Date | null;
};

const SalonDataContext = createContext<SalonDataContextType | undefined>(undefined);

// Cache keys for localStorage
const CACHE_KEYS = {
  PRODUCTS: 'salon_products_cache',
  SERVICES: 'salon_services_cache', 
  BARBERS: 'salon_barbers_cache',
  TIMESTAMP: 'salon_cache_timestamp'
};

// Cache duration: 2 minutes (shorter for faster updates)
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds
// Background polling interval: 2 minutes as requested
const BACKGROUND_POLL_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

// Default fallback data (NO config - only products/services/barbers)
const defaultData: SalonData = {
  products: [],
  services: [],
  barbers: []
};

export function SalonDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SalonData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [dataHash, setDataHash] = useState<string>(''); // Track data changes
  const [lastChangeDetected, setLastChangeDetected] = useState<Date | null>(null); // Track when changes were detected

  const fetchData = async (forceRefresh = false, silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      // Check cache first
      const cacheTimestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
      const now = Date.now();
      const isCacheValid = cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION;
      
      console.log('🔄 Cache check:', {
        timestamp: cacheTimestamp,
        now: now,
        age: cacheTimestamp ? now - parseInt(cacheTimestamp) : 'no cache',
        isValid: isCacheValid
      });

      let products: Product[] = [];
      let services: Service[] = [];
      let barbers: Barber[] = [];

      if (isCacheValid && !forceRefresh) {
        // Load from cache
        console.log('⚡ Loading from cache...');
        const cachedProducts = localStorage.getItem(CACHE_KEYS.PRODUCTS);
        const cachedServices = localStorage.getItem(CACHE_KEYS.SERVICES);
        const cachedBarbers = localStorage.getItem(CACHE_KEYS.BARBERS);
        
        if (cachedProducts) products = JSON.parse(cachedProducts);
        if (cachedServices) services = JSON.parse(cachedServices);
        if (cachedBarbers) barbers = JSON.parse(cachedBarbers);
        
        console.log('⚡ Cache loaded:', {
          products: products.length,
          services: services.length,
          barbers: barbers.length
        });
        
        // Always fetch fresh data when forceRefresh is true or cache is old
        if (forceRefresh || !isCacheValid) {
          console.log('🔄 Force refreshing from Google Sheets...');
          // Continue to fetch fresh data below
        } else {
          // Set data from cache and return
          const finalData: SalonData = { products, services, barbers };
          setData(finalData);
          setLastRefresh(new Date(parseInt(cacheTimestamp!)));
          setLoading(false);
          return;
        }
      } else {
        console.log('🔄 Starting fresh fetch from Google Sheets...');
        
        // Fetch only products, services, and barbers - NO config fetching
        const timestamp = Date.now(); // Cache-busting timestamp
        const random = Math.random().toString(36).substring(7); // Random string
        const cacheBuster = `${timestamp}_${random}`; // Strong cache-busting
        
        const [
          productsResponse,
          servicesResponse,
          barbersResponse
        ] = await Promise.all([
          fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRnhhlSFyoFS7gSrkFsjUjM1I9u5LuxN4z1-PKKiaebVjRs5V_SgC9hHn38FGVUkGOGpdOAyhwTAUDj/pub?gid=156952424&single=true&output=csv&cb=${cacheBuster}`),
          fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRnhhlSFyoFS7gSrkFsjUjM1I9u5LuxN4z1-PKKiaebVjRs5V_SgC9hHn38FGVUkGOGpdOAyhwTAUDj/pub?gid=344220288&single=true&output=csv&cb=${cacheBuster}`),
          fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRnhhlSFyoFS7gSrkFsjUjM1I9u5LuxN4z1-PKKiaebVjRs5V_SgC9hHn38FGVUkGOGpdOAyhwTAUDj/pub?gid=1781711755&single=true&output=csv&cb=${cacheBuster}`)
          ]);

        console.log('✅ Fetch responses received:', {
            products: productsResponse.status,
            services: servicesResponse.status,
            barbers: barbersResponse.status
          });

        // Get all CSV data
        const [productsData, servicesData, barbersData] = await Promise.all([
          productsResponse.text(),
          servicesResponse.text(),
          barbersResponse.text()
        ]);

        console.log('📄 Raw CSV data received:', {
          products: productsData.substring(0, 100),
          services: servicesData.substring(0, 100),
          barbers: barbersData.substring(0, 100)
        });

        // Parse products
        const productLines = productsData.trim().split('\n');
        
        const firstLine = productLines[0];
        const hasHeader = firstLine.includes('product_id') || firstLine.includes('product_name');
        const startIndex = hasHeader ? 1 : 0;
        
        for (let i = startIndex; i < productLines.length; i++) {
          const line = productLines[i];
          const [id, name, price, image, description] = line.split(',').map(s => s.trim());
          
          const cleanPrice = price ? price.replace(/[^\d]/g, '') : '0';
          const numericPrice = parseInt(cleanPrice) || 0;
          
          if (id && name) {
            products.push({
              id,
              name,
              price: numericPrice,
              image: image || 'https://images.unsplash.com/photo-1620996566298-3421e2c4c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
              description: description || `${name} - sản phẩm chất lượng cao`
            });
          }
        }

        // Parse services
        const serviceLines = servicesData.trim().split('\n');
        
        const firstServiceLine = serviceLines[0];
        const hasServiceHeader = firstServiceLine.includes('service_id') || firstServiceLine.includes('service_name');
        const serviceStartIndex = hasServiceHeader ? 1 : 0;
        
        for (let i = serviceStartIndex; i < serviceLines.length; i++) {
          const line = serviceLines[i];
          const [id, name, price, image, description, duration] = line.split(',').map(s => s.trim());
          if (id && name) {
            services.push({
              id,
              name,
              price: parseInt(price) || 0,
              image: image || 'https://images.unsplash.com/photo-1620996566298-3421e2c4c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
              description: description || `${name} - dịch vụ chuyên nghiệp`,
              duration: duration || '30 min'
            });
          }
        }

        // Parse barbers
        const barberLines = barbersData.trim().split('\n');
        
        const firstBarberLine = barberLines[0];
        const hasBarberHeader = firstBarberLine.includes('barber_id') || firstBarberLine.includes('barber_name');
        const barberStartIndex = hasBarberHeader ? 1 : 0;
        
        for (let i = barberStartIndex; i < barberLines.length; i++) {
          const line = barberLines[i];
          const [id, name, avatar] = line.split(',').map(s => s.trim());
          if (id && name) {
            barbers.push({
              id,
              name,
              avatar: avatar || 'https://images.unsplash.com/photo-1620996566298-3421e2c4c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            });
          }
        }

        // Save to cache
        console.log('💾 Saving to cache...');
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(CACHE_KEYS.SERVICES, JSON.stringify(services));
        localStorage.setItem(CACHE_KEYS.BARBERS, JSON.stringify(barbers));
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, now.toString());
        
        console.log('✅ Data fetched and cached:', {
          products: products.length,
          services: services.length,
          barbers: barbers.length
        });
      }

      // Update state with products, services, and barbers only
      const finalData: SalonData = {
        products,
        services,
        barbers
      };
      
      // Create hash to detect changes
      const newDataHash = JSON.stringify({ products, services, barbers });
      const hasChanges = newDataHash !== dataHash;
      
      if (hasChanges || forceRefresh) {
        // Only update state if data changed or force refresh
        setData(finalData);
        setLastRefresh(new Date()); // Set last refresh time
        setDataHash(newDataHash); // Update hash
        
        if (hasChanges && !forceRefresh) {
          console.log('🔄 Changes detected in Google Sheets! UI updated.');
          console.log('📊 Products:', products.length, 'Services:', services.length, 'Barbers:', barbers.length);
          setLastChangeDetected(new Date()); // Track when changes were detected
        } else if (forceRefresh) {
          console.log('🔄 Force refresh completed! UI updated.');
        }
      } else {
        console.log('✅ No changes detected. UI remains unchanged.');
        setLastRefresh(new Date()); // Still update refresh time
      }
      
      console.log('✅ Products, Services, and Barbers checked successfully!');
      console.log('📦 Products count:', finalData.products.length);
      console.log('✂️ Services count:', finalData.services.length);
      console.log('💈 Barbers count:', finalData.barbers.length);
      console.log('🔄 Last check:', new Date().toLocaleTimeString('vi-VN'));
      
    } catch (err) {
      console.error('❌ Failed to fetch data:', err);
      setError('Failed to load salon data');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Silent background fetch function
  const silentFetchData = async () => {
    try {
      console.log('🔄 Silent background polling...');
      
      // Fetch only products, services, and barbers with cache-busting
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const cacheBuster = `${timestamp}_${random}`;
      
      const [
        productsResponse,
        servicesResponse,
        barbersResponse
      ] = await Promise.all([
        fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRnhhlSFyoFS7gSrkFsjUjM1I9u5LuxN4z1-PKKiaebVjRs5V_SgC9hHn38FGVUkGOGpdOAyhwTAUDj/pub?gid=156952424&single=true&output=csv&cb=${cacheBuster}`),
        fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRnhhlSFyoFS7gSrkFsjUjM1I9u5LuxN4z1-PKKiaebVjRs5V_SgC9hHn38FGVUkGOGpdOAyhwTAUDj/pub?gid=344220288&single=true&output=csv&cb=${cacheBuster}`),
        fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRnhhlSFyoFS7gSrkFsjUjM1I9u5LuxN4z1-PKKiaebVjRs5V_SgC9hHn38FGVUkGOGpdOAyhwTAUDj/pub?gid=1781711755&single=true&output=csv&cb=${cacheBuster}`)
      ]);

      if (!productsResponse.ok || !servicesResponse.ok || !barbersResponse.ok) {
        console.warn('⚠️ Silent fetch failed, will retry later');
        return;
      }

      const [productsData, servicesData, barbersData] = await Promise.all([
        productsResponse.text(),
        servicesResponse.text(),
        barbersResponse.text()
      ]);

      // Parse products (same logic as fetchData)
      let products: Product[] = [];
      const productLines = productsData.trim().split('\n');
      const firstLine = productLines[0];
      const hasHeader = firstLine.includes('product_id') || firstLine.includes('product_name');
      const startIndex = hasHeader ? 1 : 0;
      
      for (let i = startIndex; i < productLines.length; i++) {
        const line = productLines[i];
        const [id, name, price, image, description] = line.split(',').map(s => s.trim());
        
        const cleanPrice = price ? price.replace(/[^\d]/g, '') : '0';
        const numericPrice = parseInt(cleanPrice) || 0;
        
        if (id && name) {
          products.push({
            id,
            name,
            price: numericPrice,
            image: image || 'https://images.unsplash.com/photo-1620996566298-3421e2c4c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            description: description || `${name} - sản phẩm chất lượng cao`
          });
        }
      }

      // Parse services (same logic as fetchData)
      let services: Service[] = [];
      const serviceLines = servicesData.trim().split('\n');
      const firstServiceLine = serviceLines[0];
      const hasServiceHeader = firstServiceLine.includes('service_id') || firstServiceLine.includes('service_name');
      const serviceStartIndex = hasServiceHeader ? 1 : 0;
      
      for (let i = serviceStartIndex; i < serviceLines.length; i++) {
        const line = serviceLines[i];
        const [id, name, price, image, description, duration] = line.split(',').map(s => s.trim());
        if (id && name) {
          services.push({
            id,
            name,
            price: parseInt(price) || 0,
            image: image || 'https://images.unsplash.com/photo-1620996566298-3421e2c4c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
            description: description || `${name} - dịch vụ chuyên nghiệp`,
            duration: duration || '30 min'
          });
        }
      }

      // Parse barbers (same logic as fetchData)
      let barbers: Barber[] = [];
      const barberLines = barbersData.trim().split('\n');
      const firstBarberLine = barberLines[0];
      const hasBarberHeader = firstBarberLine.includes('barber_id') || firstBarberLine.includes('barber_name');
      const barberStartIndex = hasBarberHeader ? 1 : 0;
      
      for (let i = barberStartIndex; i < barberLines.length; i++) {
        const line = barberLines[i];
        const [id, name, avatar] = line.split(',').map(s => s.trim());
        if (id && name) {
          barbers.push({
            id,
            name,
            avatar: avatar || 'https://images.unsplash.com/photo-1620996566298-3421e2c4c5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
          });
        }
      }

      // Smart data comparison using JSON.stringify
      const newDataHash = JSON.stringify({ products, services, barbers });
      const currentDataHash = JSON.stringify(data);
      
      if (newDataHash !== currentDataHash) {
        console.log('🔄 Silent changes detected! Updating UI...');
        
        // Update state only if data has actually changed
        const finalData: SalonData = { products, services, barbers };
        setData(finalData);
        setDataHash(newDataHash);
        setLastRefresh(new Date());
        setLastChangeDetected(new Date());
        
        // Update cache
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(CACHE_KEYS.SERVICES, JSON.stringify(services));
        localStorage.setItem(CACHE_KEYS.BARBERS, JSON.stringify(barbers));
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
        
        console.log('✅ Background update completed:', {
          products: products.length,
          services: services.length,
          barbers: barbers.length
        });
      } else {
        console.log('✅ No changes detected in background poll');
      }
    } catch (err) {
      console.warn('⚠️ Silent background fetch failed:', err);
      // Don't set error state for silent failures
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    let pollingInterval: NodeJS.Timeout | null = null;
    let isTabVisible = !document.hidden;
    
    const startPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      
      // Only start polling if tab is visible
      if (!document.hidden) {
        console.log('🔄 Starting background polling (2-minute interval)...');
        pollingInterval = setInterval(() => {
          if (!document.hidden) {
            silentFetchData();
          }
        }, BACKGROUND_POLL_INTERVAL);
      }
    };
    
    const handleVisibilityChange = () => {
      const wasVisible = isTabVisible;
      isTabVisible = !document.hidden;
      
      if (isTabVisible && !wasVisible) {
        // User returned to tab - trigger immediate silent fetch
        console.log('👀 User returned to tab - triggering immediate silent fetch');
        silentFetchData();
      }
      
      if (isTabVisible) {
        startPolling();
      } else {
        // Pause polling when tab is hidden
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
          console.log('⏸️ Paused polling - tab is hidden');
        }
      }
    };
    
    // Set up visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start initial polling
    startPolling();
    
    // Cleanup
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SalonDataContext.Provider
      value={{
        data,
        loading,
        error,
        refetch: () => fetchData(true), // Force refresh function
        lastRefresh
      }}
    >
      {children}
    </SalonDataContext.Provider>
  );
}

export function useSalonData() {
  const context = useContext(SalonDataContext);
  if (!context) {
    throw new Error('useSalonData must be used within SalonDataProvider');
  }
  return context;
}
