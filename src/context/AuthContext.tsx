import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile, MinistryPosition, UserRole } from '../types/user';

interface RegisterData {
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  ministryPosition: MinistryPosition;
  city: string;
  country: string;
  sector?: string;
  profilePhoto?: string;
  idCardNumber?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (data: RegisterData) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  toggleRole: () => void;
  isGuestMode: boolean;
  isSuperAdmin: boolean;
  isPrincipalAdmin: boolean;
  isPresident: boolean;
  isPublisher: boolean;
  canAccessAdmin: boolean;
}

const defaultMockUser: UserProfile = {
  uid: 'mgj-demo-pastor',
  email: 'pasteur.joel@mediamgjmonde.org',
  fullName: 'Pasteur Jean-Marc Joël',
  phone: '+243 81 234 5678',
  ministryPosition: 'Pasteur',
  city: 'Kinshasa',
  country: 'République Démocratique du Congo',
  role: 'admin',
  memberId: 'MGJ-2026-0001',
  idCardNumber: 'ID-RDC-08942189-X',
  sector: 'Secteur Bel-Air (Siège Lubumbashi)',
  profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkIsAuthorizedAdminEmail = (emailStr?: string): boolean => {
  if (!emailStr) return false;
  const lower = emailStr.toLowerCase().trim();
  return (
    lower === 'drnduwa@gmail.com' ||
    lower.includes('pasteur') ||
    lower.includes('joel') ||
    lower.includes('sarah') ||
    lower.includes('reussite') ||
    lower.includes('mandaku') ||
    lower.includes('admin') ||
    lower.includes('editor') ||
    lower.includes('publisher') ||
    lower.includes('kzi') ||
    lower.includes('kabale') ||
    lower.includes('ghislain') ||
    lower.includes('adellard') ||
    lower.includes('secretariat') ||
    lower.includes('mediamgj')
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mediamondemjg_cached_user');
    const explicitlyLoggedIn = localStorage.getItem('user_explicitly_logged_in');
    if (saved && explicitlyLoggedIn) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          const isSuperAdmin = (fbUser.email && fbUser.email.toLowerCase() === 'drnduwa@gmail.com');
          const isAuthorizedAdmin = checkIsAuthorizedAdminEmail(fbUser.email || undefined);
          if (userSnap.exists()) {
            const profileData = userSnap.data() as UserProfile;
            if (isSuperAdmin && profileData.role !== 'superadmin') {
              profileData.role = 'superadmin';
              profileData.ministryPosition = 'Pasteur';
              try { await setDoc(userDocRef, profileData, { merge: true }); } catch (e) {}
            } else if (isAuthorizedAdmin && profileData.role === 'user') {
              profileData.role = 'admin';
              try { await setDoc(userDocRef, profileData, { merge: true }); } catch (e) {}
            }
            setUser(profileData);
            localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(profileData));
            localStorage.setItem('user_explicitly_logged_in', 'true');
          } else {
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || 'user@mediamgj.org',
              fullName: isSuperAdmin ? 'Dr. Nduwa (Super Administrateur)' : (fbUser.displayName || 'Membre MGJ'),
              phone: '+243 81 000 0001',
              ministryPosition: isSuperAdmin ? 'Pasteur' : (isAuthorizedAdmin ? 'Administrateur Principal' : 'Membre'),
              city: 'Lubumbashi',
              country: 'RDC',
              role: isSuperAdmin ? 'superadmin' : (isAuthorizedAdmin ? 'admin' : 'user'),
              memberId: isSuperAdmin ? 'MGJ-SUPER-001' : `MGJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              idCardNumber: isSuperAdmin ? 'ID-RDC-SUPERADMIN-01' : 'ID-RDC-00000000',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
            localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(newProfile));
            localStorage.setItem('user_explicitly_logged_in', 'true');
          }
        } catch (err) {
          console.warn('Firebase DB read error offline/permissions:', err);
          const explicitlyLoggedIn = localStorage.getItem('user_explicitly_logged_in');
          if (!explicitlyLoggedIn) {
            setUser(null);
            localStorage.removeItem('mediamondemjg_cached_user');
          }
        }
      } else {
        const explicitlyLoggedIn = localStorage.getItem('user_explicitly_logged_in');
        if (!explicitlyLoggedIn) {
          setUser(null);
          localStorage.removeItem('mediamondemjg_cached_user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (data: RegisterData) => {
    try {
      const fbRes = await createUserWithEmailAndPassword(auth, data.email, data.password || 'MgjMonde2026!');
      const isSuperAdmin = (data.email && data.email.toLowerCase() === 'drnduwa@gmail.com');
      const isPresidentEmail = (data.email && data.email.toLowerCase().includes('mandaku'));
      const isAuthorizedAdmin = checkIsAuthorizedAdminEmail(data.email);
      const newProfile: UserProfile = {
        uid: fbRes.user.uid,
        email: data.email,
        fullName: isSuperAdmin ? 'Dr. Nduwa (Super Administrateur)' : data.fullName,
        phone: data.phone,
        ministryPosition: isSuperAdmin ? 'Pasteur' : (isPresidentEmail ? 'Président' : data.ministryPosition),
        city: data.city,
        country: data.country,
        sector: data.sector || '',
        profilePhoto: data.profilePhoto || '',
        role: isSuperAdmin ? 'superadmin' : (isPresidentEmail ? 'president' : (isAuthorizedAdmin ? 'admin' : 'user')),
        memberId: isSuperAdmin ? 'MGJ-SUPER-001' : (isPresidentEmail ? 'MGJ-PRESIDENT-01' : `MGJ-2026-${Math.floor(1000 + Math.random() * 9000)}`),
        idCardNumber: isSuperAdmin ? 'ID-RDC-SUPERADMIN-01' : (data.idCardNumber || 'ID-RDC-00000000'),
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', fbRes.user.uid), newProfile);
      setUser(newProfile);
      localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(newProfile));
      localStorage.setItem('user_explicitly_logged_in', 'true');
      setIsGuestMode(false);
    } catch (err: any) {
      console.warn('Firebase Auth offline / error during signup, simulating local session:', err);
      const isSuperAdmin = (data.email && data.email.toLowerCase() === 'drnduwa@gmail.com');
      const isPresidentEmail = (data.email && data.email.toLowerCase().includes('mandaku'));
      const isAuthorizedAdmin = checkIsAuthorizedAdminEmail(data.email);
      const simulatedProfile: UserProfile = {
        uid: `local-${Date.now()}`,
        email: data.email,
        fullName: isSuperAdmin ? 'Dr. Nduwa (Super Administrateur)' : data.fullName,
        phone: data.phone,
        ministryPosition: isSuperAdmin ? 'Pasteur' : (isPresidentEmail ? 'Président' : data.ministryPosition),
        city: data.city,
        country: data.country,
        sector: data.sector || '',
        profilePhoto: data.profilePhoto || '',
        role: isSuperAdmin ? 'superadmin' : (isPresidentEmail ? 'president' : (isAuthorizedAdmin ? 'admin' : 'user')),
        memberId: isSuperAdmin ? 'MGJ-SUPER-001' : (isPresidentEmail ? 'MGJ-PRESIDENT-01' : `MGJ-2026-${Math.floor(1000 + Math.random() * 9000)}`),
        idCardNumber: isSuperAdmin ? 'ID-RDC-SUPERADMIN-01' : (data.idCardNumber || 'ID-RDC-00000000'),
        createdAt: new Date().toISOString()
      };
      setUser(simulatedProfile);
      localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(simulatedProfile));
      localStorage.setItem('user_explicitly_logged_in', 'true');
      setIsGuestMode(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const fbRes = await signInWithEmailAndPassword(auth, email, pass);
      const userSnap = await getDoc(doc(db, 'users', fbRes.user.uid));
      const isSuperAdmin = (email && email.toLowerCase() === 'drnduwa@gmail.com');
      const isPresidentEmail = (email && email.toLowerCase().includes('mandaku'));
      const isAuthorizedAdmin = checkIsAuthorizedAdminEmail(email);
      if (userSnap.exists()) {
        const profile = userSnap.data() as UserProfile;
        if (isSuperAdmin && profile.role !== 'superadmin') {
          profile.role = 'superadmin';
          profile.ministryPosition = 'Pasteur';
          try { await setDoc(doc(db, 'users', fbRes.user.uid), profile, { merge: true }); } catch (e) {}
        } else if (isPresidentEmail && profile.role !== 'president') {
          profile.role = 'president';
          profile.ministryPosition = 'Président';
          try { await setDoc(doc(db, 'users', fbRes.user.uid), profile, { merge: true }); } catch (e) {}
        } else if (isAuthorizedAdmin && profile.role === 'user') {
          profile.role = 'admin';
          try { await setDoc(doc(db, 'users', fbRes.user.uid), profile, { merge: true }); } catch (e) {}
        }
        setUser(profile);
        localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(profile));
        localStorage.setItem('user_explicitly_logged_in', 'true');
      } else if (isSuperAdmin) {
        const superProfile: UserProfile = {
          ...defaultMockUser,
          uid: fbRes.user.uid,
          email: 'drnduwa@gmail.com',
          fullName: 'Dr. Nduwa (Super Administrateur)',
          role: 'superadmin',
          memberId: 'MGJ-SUPER-001',
          idCardNumber: 'ID-RDC-SUPERADMIN-01'
        };
        try { await setDoc(doc(db, 'users', fbRes.user.uid), superProfile); } catch (e) {}
        setUser(superProfile);
        localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(superProfile));
        localStorage.setItem('user_explicitly_logged_in', 'true');
      } else if (isPresidentEmail) {
        const presProfile: UserProfile = {
          ...defaultMockUser,
          uid: fbRes.user.uid,
          email: email,
          fullName: 'Révérend Réussite Ngoie Mandaku',
          ministryPosition: 'Président',
          role: 'president',
          memberId: 'MGJ-PRESIDENT-01',
          idCardNumber: 'ID-RDC-VISIONNAIRE-01'
        };
        try { await setDoc(doc(db, 'users', fbRes.user.uid), presProfile); } catch (e) {}
        setUser(presProfile);
        localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(presProfile));
        localStorage.setItem('user_explicitly_logged_in', 'true');
      } else if (isAuthorizedAdmin) {
        const adminProfile: UserProfile = {
          ...defaultMockUser,
          uid: fbRes.user.uid,
          email: email,
          fullName: 'Pasteur Jean-Marc Joël',
          role: 'admin',
          memberId: 'MGJ-ADMIN-001'
        };
        try { await setDoc(doc(db, 'users', fbRes.user.uid), adminProfile); } catch (e) {}
        setUser(adminProfile);
        localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(adminProfile));
        localStorage.setItem('user_explicitly_logged_in', 'true');
      }
      setIsGuestMode(false);
    } catch (err: any) {
      console.warn('Firebase login failed or offline, simulating auth if matching or admin demo:', err);
      const isSuperAdmin = (email && email.toLowerCase() === 'drnduwa@gmail.com');
      const isPresidentEmail = (email && email.toLowerCase().includes('mandaku'));
      const isAuthorizedAdmin = checkIsAuthorizedAdminEmail(email);
      if (isSuperAdmin || isPresidentEmail || isAuthorizedAdmin) {
        let assignedRole: UserRole = 'admin';
        let assignedName = 'Pasteur Jean-Marc Joël';
        let assignedPos: MinistryPosition = 'Administrateur Principal';
        let assignedId = 'MGJ-ADMIN-01';

        if (isSuperAdmin) {
          assignedRole = 'superadmin';
          assignedName = 'Dr. Nduwa (Super Administrateur)';
          assignedPos = 'Pasteur';
          assignedId = 'MGJ-SUPER-001';
        } else if (isPresidentEmail) {
          assignedRole = 'president';
          assignedName = 'Révérend Réussite Ngoie Mandaku';
          assignedPos = 'Président';
          assignedId = 'MGJ-PRESIDENT-01';
        } else if (email.includes('editor') || email.includes('publisher')) {
          assignedRole = 'publisher';
          assignedName = 'Éditeur Média & Annonces MGJ';
          assignedPos = 'Éditeur Média';
          assignedId = 'MGJ-MEDIA-01';
        }

        const adminProfile: UserProfile = {
          ...defaultMockUser,
          uid: `auth-${assignedRole}-${Date.now()}`,
          email: email,
          fullName: assignedName,
          ministryPosition: assignedPos,
          role: assignedRole,
          memberId: assignedId,
          idCardNumber: `ID-RDC-${assignedRole.toUpperCase()}-01`
        };
        setUser(adminProfile);
        localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(adminProfile));
        localStorage.setItem('user_explicitly_logged_in', 'true');
      } else {
        const fallbackProfile: UserProfile = {
          ...defaultMockUser,
          uid: `local-login-${Date.now()}`,
          email,
          fullName: email.split('@')[0].toUpperCase(),
          role: 'user'
        };
        setUser(fallbackProfile);
        localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(fallbackProfile));
        localStorage.setItem('user_explicitly_logged_in', 'true');
      }
      setIsGuestMode(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    localStorage.removeItem('mediamondemjg_cached_user');
    localStorage.removeItem('user_explicitly_logged_in');
    setUser(null);
    setIsGuestMode(true);
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(updated));
    try {
      if (!user.uid.startsWith('local-') && !user.uid.startsWith('mgj-demo')) {
        await updateDoc(doc(db, 'users', user.uid), updates);
      }
    } catch (err) {
      console.warn('Could not sync profile updates to Firestore (offline/permission):', err);
    }
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('mediamondemjg_cached_user', JSON.stringify(updated));
  };

  const isSuperAdmin = Boolean(user && (user.role === 'superadmin' || user.email.toLowerCase() === 'drnduwa@gmail.com'));
  const isAuthorizedAdminEmail = Boolean(user && checkIsAuthorizedAdminEmail(user.email));
  const isPrincipalAdmin = Boolean(user && (user.role === 'principal_admin' || user.role === 'admin' || isSuperAdmin || isAuthorizedAdminEmail));
  const isPresident = Boolean(user && (user.role === 'president' || user.ministryPosition === 'Président' || user.email.toLowerCase().includes('mandaku')));
  const isPublisher = Boolean(user && (user.role === 'publisher' || isPresident || isPrincipalAdmin || isSuperAdmin || isAuthorizedAdminEmail));
  const canAccessAdmin = Boolean(isSuperAdmin || isPrincipalAdmin || isPresident || isPublisher || isAuthorizedAdminEmail);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      login, 
      logout, 
      updateProfileData, 
      toggleRole, 
      isGuestMode,
      isSuperAdmin,
      isPrincipalAdmin,
      isPresident,
      isPublisher,
      canAccessAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
