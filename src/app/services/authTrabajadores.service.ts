import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
//import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../environments/environment';
import { Firestore, collection, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, where, query, onSnapshot, Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceTrabajadores {

  
  private auth: Auth;

  public isUserAuthenticatedSubject = new BehaviorSubject<boolean>(false);


  user: User | null = null; // Almacenar el usuario



  constructor(private firestore: Firestore) {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

  }

  isAuthenticatedPromise(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          console.log(user)
          this.isUserAuthenticatedSubject.next(true);
          resolve(true); // Usuario autenticado
        } else {
          this.isUserAuthenticatedSubject.next(false);
          resolve(false); // Usuario no autenticado
        }
      });
    });
  }


  async signIn1(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }


  async signIn(email: string, password: string) {
    try {

      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user

    } catch (error) {
      console.error('Error signing in:', error);
      throw error;

    }
  }

  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }
  // Método para guardar datos en una colección específica
  async createDocument(nombreColeccion: string, id: string, datos: any): Promise<void> {
    try {
      const coleccionRef = collection(this.firestore, nombreColeccion);
      const docRef = doc(coleccionRef, id);
      await setDoc(docRef, datos);
      console.log('Documento guardado con ID:', docRef.id);
    } catch (error) {
      console.error('Error al guardar el documento:', error);
    }
  }

  // Método para actualizar un documento
  async updateDocument(nombreColeccion: string, id: string, datos: any): Promise<void> {
    try {
      const coleccionRef = collection(this.firestore, nombreColeccion);
      const docRef = doc(coleccionRef, id);
      await updateDoc(docRef, datos);
      console.log('Documento actualizado con ID:', docRef.id);
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
    }
  }

  //Obtenemos un documento por ID

  async getDocument(nombreColeccion: string, id: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, nombreColeccion, id); // Referencia al documento
      const docSnap = await getDoc(docRef); // Obtener el documento

      if (docSnap.exists()) {
        return docSnap.data(); //Retornar los datos del documento
      } else {
        return null; // Retornar null si no se encuentra el documento
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      throw error; // Re-lanzar el error para manejarlo más arriba si es necesario
    }
  }

  async getCollection(nombreColeccion: string): Promise<any[]> {
    try {
      const colRef = collection(this.firestore, nombreColeccion); // Referencia a la colección
      const querySnapshot = await getDocs(colRef); // Obtener los documentos de la colección
      const documentos = querySnapshot.docs.map(doc => ({
        id: doc.id, // Agregar el ID del documento
        ...doc.data(), // Agregar los datos del documento
      }));
      return documentos; // Retornar los documentos en un array
    } catch (error) {
      console.error('Error al obtener la colección:', error);
      throw error; // Re-lanzar el error para manejarlo más arriba si es necesario
    }
  }

  async addSubCollectionDocument(collectionName: string, documentId: string, subCollectionName: string, data: any): Promise<void> {
    try {
      // Referencia al documento principal (padre)
      const docRef = doc(this.firestore, collectionName, documentId);

      // Referencia a la subcolección dentro de ese documento
      const subCollectionRef = collection(docRef, subCollectionName);

      // Crear el nuevo documento en la subcolección
      await addDoc(subCollectionRef, data);
      console.log('Documento creado en la subcolección.');
    } catch (error) {
      console.error('Error al agregar documento en la subcolección:', error);
    }
  }



  // Devuelve true si hay un usuario autenticado
  isAuthenticated() {
    return this.isUserAuthenticatedSubject.asObservable();
  }

  // Método para obtener el usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser; // Retorna el usuario actual o null
  }

  getUserData(): any {
    return this.auth.currentUser
  }


  async closeSession() {
    return await this.auth.signOut()
  }



  async getJobsWithApplications(): Promise<any[]> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return []; // Si no hay usuario autenticado, devolver vacío
      }

      const workerId = user.uid;
      const jobs = await this.getCollection('jobs'); // Obtiene todos los trabajos
      for (const job of jobs) {
        // Obtener las aplicaciones del trabajador para cada trabajo
        const applicationsQuery = query(
          collection(this.firestore, `jobs/${job.id}/applicants`),
          where('workerId', '==', workerId)
        );



        const applicationsSnapshot = await getDocs(applicationsQuery);

        console.log(applicationsSnapshot.size)

        // Agregar la propiedad `isApplied` a cada trabajo
        job.isApplied = !applicationsSnapshot.empty; // Si tiene alguna aplicación, es true
      }

      return jobs; // Devolver los trabajos con la propiedad `isApplied`
    } catch (error) {
      console.error('Error al obtener los trabajos o las postulaciones', error);
      throw error;
    }
  }

  async getJobsWithApplicationss(): Promise<any[]> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return []; // Si no hay usuario autenticado, devolver vacío
      }

      const workerId = user.uid;
      const jobs = await this.getCollection('jobs'); // Obtiene todos los trabajos
      for (const job of jobs) {
        // Obtener las aplicaciones del trabajador para cada trabajo
        const applicationsQuery = query(
          collection(this.firestore, `jobs/${job.id}/applicants`),
          where('workerId', '==', workerId)
        );

        const applicationsSnapshot = await getDocs(applicationsQuery);
        job.isApplied = !applicationsSnapshot.empty; // Si tiene alguna aplicación, es true

        // Obtener los datos del usuario que publicó la oferta (usando `userId` del trabajo)
        const userDocRef = doc(this.firestore, 'users', job.userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          job.publisher = userDoc.data(); // Agregar los datos del usuario como propiedad del trabajo

          console.log(job.publisher)
        } else {
          console.log(`No se encontró el usuario con ID: ${job.userId}`);
        }
      }

      return jobs; // Devolver los trabajos con la propiedad `isApplied` y los datos del usuario
    } catch (error) {
      console.error('Error al obtener los trabajos o las postulaciones', error);
      throw error;
    }
  }
  async getJobsByUserId(userId: string): Promise<any[]> {
    try {
      const jobsRef = collection(this.firestore, 'jobs'); // Referencia a la colección 'jobs'
      const q = query(jobsRef, where('userId', '==', userId)); // Consulta filtrando por userId
      const querySnapshot = await getDocs(q); // Obtener los documentos que cumplen la condición

      // Transformar los documentos en un arreglo de objetos
      const jobs = querySnapshot.docs.map(doc => {
        const data: any = doc.data();

        return {
          id: doc.id,
          ...data,
          createAd: data.createAd instanceof Timestamp ? data.createAd.toDate().toISOString().split('T')[0] : null // Convertir createAd a Date
        };
      });

      return jobs; // Retornar los trabajos encontrados
    } catch (error) {
      console.error('Error al obtener los trabajos por userId:', error);
      throw error; // Manejar errores según tu lógica
    }
  }

}
