// firebase.js
// Configuração e inicialização do Firebase para o projeto "sabor-e-brasa".
// Importe { db } deste arquivo em qualquer lugar que precisar falar com o Firestore.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzhBfmzg73yaqC_uEcygZOFlnSDatBQg4",
  authDomain: "sabor-e-brasa.firebaseapp.com",
  projectId: "sabor-e-brasa",
  storageBucket: "sabor-e-brasa.firebasestorage.app",
  messagingSenderId: "183896697902",
  appId: "1:183896697902:web:61cfe527b279c47ade43bf",
  measurementId: "G-9V4P30EMG6",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
