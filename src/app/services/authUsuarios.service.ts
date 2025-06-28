
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../environments/environment';
import { Firestore, collection, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, where, query, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceUsuarios {
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


  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
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

  async createDocumentWithId(nombreColeccion: string, datos: any): Promise<void> {
    try {
      const coleccionRef = collection(this.firestore, nombreColeccion);
      await addDoc(coleccionRef, datos);
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
      const jobs = await this.getCollection('workers'); // Obtiene todos los trabajos

      return jobs; // Devolver los trabajos con la propiedad `isApplied`
    } catch (error) {
      console.error('Error al obtener los trabajos o las postulaciones', error);
      throw error;
    }
  }
  async getJobsWithApplications2(): Promise<any[]> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return []; // Si no hay usuario autenticado, devolver un array vacío
      }
  
      const workerId = user.uid;
  
      // Obtener la referencia a la colección de trabajos
      const jobsRef = collection(this.firestore, 'jobs');
      
      // Crear la consulta filtrando por `userId`
      const q = query(jobsRef, where('userId', '==', workerId));
      
      // Obtener los documentos que coinciden con la consulta
      const querySnapshot = await getDocs(q);
  
      // Mapeamos los resultados y devolvemos los datos de los trabajos
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // Se incluye el ID del trabajo y los datos
      }));
  
      // Devolver los trabajos encontrados
      return jobs;
  
    } catch (error) {
      console.error('Error al obtener los trabajos', error);
      throw error;
    }
  }

  getJobsByUserId(userId: string, callback: (jobs: any[]) => void): () => void {
    const jobsRef = collection(this.firestore, 'jobs'); // Referencia a la colección
    const q = query(jobsRef, where('userId', '==', userId)); // Consulta filtrando por userId
  
    // Listener de tiempo real: llama al callback cada vez que hay cambios
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(jobs); // Retorna los datos al componente
    });
  
    return unsubscribe; // Devuelve la función para cancelar el listener
  }
  

}
