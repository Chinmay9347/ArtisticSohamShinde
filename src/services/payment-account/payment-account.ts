import {addDoc,collection,deleteDoc,doc,getDoc,getDocs,orderBy,query,where,serverTimestamp,updateDoc,} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  PaymentAccount,
} from "@/types/payment-account";

import type {
  CreatePaymentAccount,
  UpdatePaymentAccount,
} from "./payment-account.types";

const COLLECTION = "paymentAccounts";

export class PaymentAccountService {

  static async getAll() {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        orderBy("displayOrder")
      )
    );

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    }) as PaymentAccount[];
  }
  // static async getAll() {

  //   const snapshot = await getDocs(
  //     query(
  //       collection(db, COLLECTION),
  //       orderBy("displayOrder")
  //     )
  //   );

  //   return snapshot.docs.map((docSnap) => ({
  //     id: docSnap.id,
  //     ...docSnap.data(),
  //   })) as PaymentAccount[];
  // }

  // static async getEnabled() {
  //   const snapshot = await getDocs(
  //     query(
  //       collection(db, COLLECTION),
  //       where("enabled", "==", true),
  //     ),
  //   );

  //   return snapshot.docs
  //     .map((docSnap) => {
  //       const data = docSnap.data();

  //       return {
  //         id: docSnap.id,
  //         ...data,
  //         createdAt: data.createdAt?.toDate().toISOString(),
  //         updatedAt: data.updatedAt?.toDate().toISOString(),
  //       };
  //     })
  //     .sort(
  //       (a, b) =>
  //         Number(a.displayOrder ?? 0) -
  //         Number(b.displayOrder ?? 0),
  //     ) as PaymentAccount[];
  // }

  static async getEnabled() {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        where("enabled", "==", true),
      ),
    );

    const accounts: PaymentAccount[] =
      snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          ...data,

          displayOrder: Number(
            data.displayOrder ?? 0,
          ),

          createdAt:
            data.createdAt?.toDate().toISOString(),

          updatedAt:
            data.updatedAt?.toDate().toISOString(),
        } as PaymentAccount;
      });

    return accounts.sort(
      (a, b) =>
        a.displayOrder - b.displayOrder,
    );
  }

  static async get(id: string) {
    const snapshot = await getDoc(
      doc(db, COLLECTION, id)
    );

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
    } as PaymentAccount;
  }
  // static async get(id: string) {

  //   const snapshot =
  //     await getDoc(
  //       doc(db, COLLECTION, id)
  //     );

  //   if (!snapshot.exists()) {
  //     return null;
  //   }

  //   return {
  //     id: snapshot.id,
  //     ...snapshot.data(),
  //   } as PaymentAccount;
  // }

  static async create(
    data: CreatePaymentAccount
  ) {

    return addDoc(
      collection(db, COLLECTION),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
  }

  static async update(
    id: string,
    data: UpdatePaymentAccount
  ) {

    return updateDoc(
      doc(db, COLLECTION, id),
      {
        ...data,
        updatedAt: serverTimestamp(),
      }
    );
  }

  static async delete(id: string) {
    return deleteDoc(
      doc(db, COLLECTION, id)
    );
  }
}