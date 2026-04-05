import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey || 'YOUR_API_KEY',
    authDomain: config.public.firebaseAuthDomain || 'YOUR_AUTH_DOMAIN',
    projectId: config.public.firebaseProjectId || 'YOUR_PROJECT_ID',
    storageBucket: config.public.firebaseStorageBucket || 'YOUR_STORAGE_BUCKET',
    messagingSenderId:
      config.public.firebaseMessagingSenderId || 'YOUR_MESSAGING_SENDER_ID',
    appId: config.public.firebaseAppId || 'YOUR_APP_ID',
    measurementId: config.public.firebaseMeasurementId || 'YOUR_MEASUREMENT_ID',
  };
  console.log(config, firebaseConfig);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let analytics = null;
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  // const auth = getAuth(app);
  const db = getFirestore(app);

  return {
    provide: {
      firebaseApp: app,
      analytics: analytics,
      // firebaseAuth: auth,
      firestore: new FirestoreService(db),
    },
  };
});

class FirestoreService {
  db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }

  collection = (name: string) => collection(this.db, name);

  add = async (collectionName: string, data: any): Promise<any> => {
    try {
      const db = collection(this.db, collectionName);

      const docRef = await addDoc(db, data);

      this.update(collectionName, docRef.id, { id: docRef.id });

      return Promise.resolve({ ...data, id: docRef.id });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  update = async (
    collectionName: string,
    docName: string,
    data: any,
  ): Promise<any> => {
    try {
      const docRef = doc(this.db, collectionName, docName);
      return await updateDoc(docRef, data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addWithId = async (
    collectionName: string,
    id: string,
    data: any,
  ): Promise<any> => {
    try {
      const docRef = await setDoc(doc(this.db, collectionName, id), data);
      this.update(collectionName, id, { id });

      return Promise.resolve(docRef);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  get = async <T = any>(collectionName: string): Promise<T[]> => {
    const coll = collection(this.db, collectionName);
    const docs = await getDocs(coll);
    const res = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return res as T[];
  };

  getByDoc = async <T = any>(
    collectionName: string,
    id: string,
  ): Promise<T> => {
    const coll = doc(this.db, collectionName, id);
    console.log(coll);

    const docs = await getDoc(coll);
    const res = docs.data();
    return res as T;
  };

  delete = async (collectionName: string, id: string): Promise<any> => {
    try {
      await deleteDoc(doc(this.db, collectionName, id));
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Get all documents from a sub-collection
   */
  getSubDocs = async <T = any>(
    collectionName: string,
    id: string,
    subCollectionName: string,
  ): Promise<T[]> => {
    const coll = collection(this.db, collectionName, id, subCollectionName);
    const docs = await getDocs(coll);
    const res = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return res as T[];
  };

  /**
   * Add a document to a sub-collection
   */
  addSubDoc = async (
    collectionName: string,
    id: string,
    subCollectionName: string,
    data: any,
  ): Promise<any> => {
    try {
      const coll = collection(this.db, collectionName, id, subCollectionName);
      const docRef = await addDoc(coll, data);
      const subDocRef = doc(this.db, collectionName, id, subCollectionName, docRef.id);
      await updateDoc(subDocRef, { id: docRef.id });
      return Promise.resolve({ ...data, id: docRef.id });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Delete a document from a sub-collection
   */
  deleteSubDoc = async (
    collectionName: string,
    id: string,
    subCollectionName: string,
    subDocId: string,
  ): Promise<any> => {
    try {
      const docRef = doc(this.db, collectionName, id, subCollectionName, subDocId);
      await deleteDoc(docRef);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
