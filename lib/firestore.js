import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export const saveUserProgress = async (userId, lawId, progressData) => {
  try {
    const userProgressRef = doc(db, 'userProgress', `${userId}_${lawId}`);
    await setDoc(userProgressRef, {
      userId,
      lawId,
      ...progressData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user progress:', error);
    return false;
  }
};

export const getUserProgress = async (userId, lawId) => {
  try {
    const userProgressRef = doc(db, 'userProgress', `${userId}_${lawId}`);
    const docSnap = await getDoc(userProgressRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

export const getAllUserProgress = async (userId) => {
  try {
    const q = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId),
      orderBy('lastUpdated', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const progressData = [];
    querySnapshot.forEach((doc) => {
      progressData.push(doc.data());
    });
    
    return progressData;
  } catch (error) {
    console.error('Error getting all user progress:', error);
    return [];
  }
};

export const saveSimulationResult = async (userId, simulationData) => {
  try {
    const simulationRef = doc(db, 'simulationResults', `${userId}_${Date.now()}`);
    await setDoc(simulationRef, {
      userId,
      ...simulationData,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving simulation result:', error);
    return false;
  }
};

export const getSimulationResults = async (userId, lawId = null) => {
  try {
    let q = query(
      collection(db, 'simulationResults'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    if (lawId) {
      q = query(
        collection(db, 'simulationResults'),
        where('userId', '==', userId),
        where('lawId', '==', lawId),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    
    return results;
  } catch (error) {
    console.error('Error getting simulation results:', error);
    return [];
  }
};

export const saveUserProfile = async (userId, profileData) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    await setDoc(userProfileRef, {
      userId,
      ...profileData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(userProfileRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserActivity = async (userId, activityData) => {
  try {
    await addDoc(collection(db, 'userActivities'), {
      userId,
      ...activityData,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving user activity:', error);
    return false;
  }
};

export const getUserStats = async (userId) => {
  try {
    const simulationsQuery = query(
      collection(db, 'simulationResults'),
      where('userId', '==', userId)
    );
    const simulationsSnapshot = await getDocs(simulationsQuery);
    
    const progressQuery = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId)
    );
    const progressSnapshot = await getDocs(progressQuery);
    
    const stats = {
      totalSimulations: simulationsSnapshot.size,
      lawsStudied: progressSnapshot.size,
      lastActivity: null
    };
    
    if (simulationsSnapshot.size > 0) {
      const lastSimulation = simulationsSnapshot.docs[simulationsSnapshot.docs.length - 1];
      stats.lastActivity = lastSimulation.data().timestamp;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalSimulations: 0,
      lawsStudied: 0,
      lastActivity: null
    };
  }
};
