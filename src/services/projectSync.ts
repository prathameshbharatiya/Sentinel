
/**
 * Project Sync System - Shared with PhysiCore
 * Identical encoding/decoding logic for cross-compatibility.
 */

export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const generateId = (email?: string): string => {
  const prefix = email ? simpleHash(email).substring(0, 4) : 'anon';
  const random = Math.random().toString(16).substring(2, 6);
  return `${prefix}-${random}`.toUpperCase();
};

export const encodeProjectCode = (data: any, origin: 'physicore' | 'sentinel'): string => {
  const payload = {
    v: "1.0",
    o: origin,
    ts: Date.now(),
    d: data
  };
  
  const json = JSON.stringify(payload);
  const checksum = simpleHash(json);
  const finalPayload = JSON.stringify({ p: payload, c: checksum });
  
  const base64 = btoa(encodeURIComponent(finalPayload));
  const prefix = origin === 'physicore' ? 'PC-' : 'SN-';
  return `${prefix}${base64}`;
};

export const decodeProjectCode = (code: string): { data: any; origin: string; error?: string } => {
  try {
    const cleanCode = code.replace(/^(PC-|SN-)/, '');
    const decoded = decodeURIComponent(atob(cleanCode));
    const parsed = JSON.parse(decoded);
    
    if (!parsed.p || !parsed.c) throw new Error("Invalid format");
    
    const calculatedChecksum = simpleHash(JSON.stringify(parsed.p));
    if (calculatedChecksum !== parsed.c) {
      return { data: null, origin: '', error: "Checksum mismatch. Code corrupted." };
    }
    
    return { data: parsed.p.d, origin: parsed.p.o };
  } catch (e) {
    return { data: null, origin: '', error: "Failed to decode project code." };
  }
};
