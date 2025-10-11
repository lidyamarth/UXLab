import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export const saveUserProgress = async (userId, lawId, data) => {
  try {
    const progressRef = doc(db, "users", userId, "progress", lawId);
    await setDoc(progressRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user progress: ", error);
    return null;
  }
};

export const getUserProgress = async (userId, lawId) => {
  try {
    const progressRef = doc(db, "users", userId, "progress", lawId);
    const docSnap = await getDoc(progressRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting user progress: ", error);
    return null;
  }
};

export const saveSimulationResult = async (userId, data) => {
  try {
    const simulationsRef = collection(db, "users", userId, "simulations");
    const docRef = await addDoc(simulationsRef, data);
    return docRef.id;
  } catch (error) {
    console.error("Error saving simulation result: ", error);
    return null;
  }
};

export const getUserSimulationHistory = async (userId) => {
  try {
    const history = [];
    const simulationsRef = collection(db, "users", userId, "simulations");
    const q = query(simulationsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return history;
  } catch (error) {
    console.error("Error getting simulation history: ", error);
    return [];
  }
};

export const getUserStats = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting user stats: ", error);
    return null;
  }
};